import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Activity {
  id: string;
  type: string;
  logged_at: string;
  details: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { activities, babyName, babyAge, babyBirthday, aiPrediction, timezone } = await req.json();
    
    if (!activities || !babyName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: activities, babyName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userTimezone = timezone || 'America/Los_Angeles';

    // ===== DST DETECTION =====
    const checkDSTTransition = (tz: string) => {
      // Check if timezone observes DST
      const doesObserveDST = () => {
        const january = new Date(new Date().getFullYear(), 0, 1);
        const july = new Date(new Date().getFullYear(), 6, 1);
        const janOffset = new Date(january.toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
        const julyOffset = new Date(july.toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
        return janOffset !== julyOffset;
      };

      if (!doesObserveDST()) {
        return { isDSTTransitionPeriod: false, transitionType: null, daysUntilNext: null };
      }

      // Get DST transition dates for current year
      const getDSTDates = (year: number) => {
        let springTransition: string | null = null;
        let fallTransition: string | null = null;
        let previousOffset: number | null = null;

        for (let month = 0; month < 12; month++) {
          for (let day = 1; day <= 31; day++) {
            try {
              const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
              if (date.getUTCMonth() !== month) break;

              const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                hour12: false
              });

              const parts = formatter.formatToParts(date);
              const localHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
              const offset = 12 - localHour;

              if (previousOffset !== null && offset !== previousOffset) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (offset < previousOffset) {
                  springTransition = dateStr;
                } else {
                  fallTransition = dateStr;
                }
              }
              previousOffset = offset;
            } catch (e) {
              continue;
            }
          }
        }
        return { spring: springTransition, fall: fallTransition };
      };

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      const { spring, fall } = getDSTDates(now.getFullYear());

      // Check if today or yesterday was DST transition
      const isSpringToday = spring === todayStr;
      const isFallToday = fall === todayStr;
      const wasSpringYesterday = spring === yesterdayStr;
      const wasFallYesterday = fall === yesterdayStr;
      
      const isDSTTransitionPeriod = isSpringToday || isFallToday || wasSpringYesterday || wasFallYesterday;
      let transitionType: 'spring-forward' | 'fall-back' | null = null;

      if (isSpringToday || wasSpringYesterday) {
        transitionType = 'spring-forward';
      } else if (isFallToday || wasFallYesterday) {
        transitionType = 'fall-back';
      }

      // Check for upcoming DST in next 14 days
      let daysUntilNext: { days: number; type: 'spring-forward' | 'fall-back' } | null = null;
      if (spring || fall) {
        const checkDaysUntil = (transDate: string, type: 'spring-forward' | 'fall-back') => {
          const transitionDate = new Date(transDate);
          const diffTime = transitionDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 14) {
            return { days: diffDays, type };
          }
          return null;
        };

        if (spring) {
          const springCheck = checkDaysUntil(spring, 'spring-forward');
          if (springCheck) daysUntilNext = springCheck;
        }
        if (fall && !daysUntilNext) {
          const fallCheck = checkDaysUntil(fall, 'fall-back');
          if (fallCheck) daysUntilNext = fallCheck;
        }
      }

      return { isDSTTransitionPeriod, transitionType, daysUntilNext };
    };

    const dstInfo = checkDSTTransition(userTimezone);
    console.log('🕐 DST Info:', dstInfo);

    // Build DST context for AI
    let dstContext = '';
    if (dstInfo.isDSTTransitionPeriod) {
      if (dstInfo.transitionType === 'spring-forward') {
        dstContext = '\n\nDST CONTEXT: Spring forward happened today/yesterday (clocks moved ahead 1 hour). Baby may wake earlier, be cranky, or resist bedtime. Adjust expectations and be flexible for 3-5 days.';
      } else if (dstInfo.transitionType === 'fall-back') {
        dstContext = '\n\nDST CONTEXT: Fall back happened today/yesterday (gained 1 hour). Baby may wake earlier than usual or struggle to fall asleep at bedtime. This typically resolves in 3-5 days.';
      }
    } else if (dstInfo.daysUntilNext) {
      const { days, type } = dstInfo.daysUntilNext;
      if (type === 'spring-forward') {
        dstContext = `\n\nUPCOMING DST: Spring forward in ${days} days (clocks move ahead 1 hour). To prepare: Shift baby's schedule 15 minutes earlier every 2-3 days starting now.`;
      } else {
        dstContext = `\n\nUPCOMING DST: Fall back in ${days} days (gain 1 hour). To prepare: Shift baby's bedtime 15 minutes later every 2-3 days starting now.`;
      }
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze recent data
    const last7Days = activities.filter((a: Activity) => {
      const activityDate = new Date(a.logged_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return activityDate >= sevenDaysAgo;
    });

    const last14Days = activities.filter((a: Activity) => {
      const activityDate = new Date(a.logged_at);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      return activityDate >= fourteenDaysAgo;
    });

    const napsThisWeek = last7Days.filter((a: Activity) => a.type === 'nap').length;
    const napsLastWeek = last14Days.filter((a: Activity) => {
      const activityDate = new Date(a.logged_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      return activityDate >= fourteenDaysAgo && activityDate < sevenDaysAgo && a.type === 'nap';
    }).length;

    // Calculate average naps per day
    const napsPerDayThisWeek = Math.round(napsThisWeek / 7);
    const napsPerDayLastWeek = Math.round(napsLastWeek / 7);

    // Calculate actual daily nap counts for last 7 days to validate transitions
    const dailyNapCounts: { [key: string]: number } = {};
    last7Days.forEach((a: Activity) => {
      if (a.type === 'nap') {
        const date = new Date(a.logged_at).toDateString();
        dailyNapCounts[date] = (dailyNapCounts[date] || 0) + 1;
      }
    });
    const napCountsArray = Object.values(dailyNapCounts);
    const maxNapCount = napCountsArray.length ? Math.max(...napCountsArray) : 0;
    const minNapCount = napCountsArray.length ? Math.min(...napCountsArray) : 0;

    // Calculate bedtime consistency (standard deviation)
    const bedtimes = last14Days
      .filter((a: Activity) => a.type === 'nap' && a.details?.isNightSleep)
      .map((a: Activity) => {
        const date = new Date(a.logged_at);
        return date.getHours() * 60 + date.getMinutes();
      });

    let bedtimeVariation = 0;
    if (bedtimes.length > 1) {
      const avg = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
      const variance = bedtimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / bedtimes.length;
      bedtimeVariation = Math.sqrt(variance);
    }

    // Calculate confidence score
    const dataPoints = last14Days.length;
    let confidenceScore = 'High confidence';
    if (bedtimeVariation < 15 && dataPoints >= 300) {
      confidenceScore = '95% confidence';
    } else if (bedtimeVariation < 25 && dataPoints >= 200) {
      confidenceScore = '90% confidence';
    }

    // Baby age in months
    const ageInMonths = babyBirthday 
      ? Math.floor((Date.now() - new Date(babyBirthday).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
      : null;

    // Get ACTUAL nap count for TODAY (not prediction)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actualNapsToday = activities.filter((a: Activity) => {
      const activityDate = new Date(a.logged_at);
      activityDate.setHours(0, 0, 0, 0);
      return a.type === 'nap' && activityDate.getTime() === today.getTime();
    }).length;

    console.log(`📊 Today's ACTUAL naps: ${actualNapsToday}, AI predicted: ${aiPrediction?.total_naps_today || 'none'}`);
    
    // VALIDATE transition claim against actual data
    // Only allow transition claims that match the observed nap counts
    let validatedTransitionInfo: string | null = null;
    if (aiPrediction?.is_transitioning && aiPrediction.transition_note) {
      const transitionNote = aiPrediction.transition_note.toLowerCase();
      
      // Check if transition mentions "4 to 3" but last 7 days never had 4+ naps
      if (transitionNote.includes('4 to 3') || transitionNote.includes('4-to-3')) {
        const hadFourNapDay = napCountsArray.some(count => count >= 4);
        if (!hadFourNapDay) {
          console.log(`⚠️ Rejecting invalid "4→3" transition claim. Last 7 days nap range: ${minNapCount}–${maxNapCount}`);
          // Override with accurate description
          validatedTransitionInfo = maxNapCount > minNapCount 
            ? `PATTERN: Stabilizing between ${minNapCount}–${maxNapCount} naps per day`
            : null;
        } else {
          validatedTransitionInfo = `TRANSITION: ${aiPrediction.transition_note}`;
        }
      } else {
        // Other transitions are fine
        validatedTransitionInfo = `TRANSITION: ${aiPrediction.transition_note}`;
      }
    }
    
    const transitionInfo = validatedTransitionInfo;

    // CALL 1: Generate Hero Insight
    const heroPrompt = `You are a warm, encouraging baby sleep expert. Based on the data below, write ONE warm, encouraging observation about this baby's sleep progress.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
TODAY'S ACTUAL NAPS: ${actualNapsToday} naps (this is reality, use THIS exact number)
${aiPrediction ? `Predicted naps: ${aiPrediction.total_naps_today} (was the forecast, but actual is ${actualNapsToday})` : ''}
Recent pattern: ${napsPerDayThisWeek} naps/day this week, ${napsPerDayLastWeek} naps/day last week
Last 7 days nap range: ${minNapCount}–${maxNapCount} naps per day
Bedtime: ${aiPrediction?.predicted_bedtime || 'consistency varies'} ${bedtimeVariation < 15 ? '(very consistent)' : bedtimeVariation < 30 ? '(fairly consistent)' : ''}
${transitionInfo || ''}

CRITICAL INSTRUCTIONS:
- You MUST reference ${actualNapsToday} naps as today's reality, NOT the prediction
${transitionInfo ? '- You MUST acknowledge the pattern/transition stated above' : ''}
- Do NOT contradict the nap count information above
- Do NOT mention nap counts that weren't observed (e.g., don't say "2 naps" when actual is ${actualNapsToday})

RULES:
- Start with a relevant emoji (🎉, 💪, 🌟, ✨, 🌙, 🌿, etc.)
- Write 1-2 short sentences (under 40 words total)
- Be specific to the data provided
- Sound warm and supportive
- Do NOT use markdown formatting

Examples:
"🌿 ${babyName}'s settling into a 2-nap rhythm—those longer wake windows show great progress!"
"🎉 What a star! ${babyName}'s consistent bedtime is building healthy sleep habits!"
"💪 ${babyName} is transitioning beautifully—longer wake windows are right on track!"`;

    const heroResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a warm, encouraging baby sleep expert who writes short, supportive observations.' },
          { role: 'user', content: heroPrompt }
        ],
      }),
    });

    if (!heroResponse.ok) {
      const errorText = await heroResponse.text();
      console.error('Hero insight error:', heroResponse.status, errorText);
      throw new Error('Failed to generate hero insight');
    }

    const heroData = await heroResponse.json();
    const heroInsight = heroData.choices[0].message.content.trim();

    // CALL 2: Generate "What To Do"
    const whatToDoPrompt = `You are a practical parenting coach. Based on ${babyName}'s sleep data, provide 2-3 specific, actionable tips.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
TODAY'S ACTUAL NAPS: ${actualNapsToday} naps
Current pattern: ${napsPerDayThisWeek} naps/day
Bedtime consistency: ${bedtimeVariation < 15 ? 'very consistent' : bedtimeVariation < 30 ? 'fairly consistent' : 'still establishing'}${dstContext}

CRITICAL FORMAT RULES:
- Always use "${babyName}" instead of generic terms like "the baby" or "your baby"
- Return EXACTLY 2-3 tips, one per line
- Each tip is a single sentence (under 20 words)
- Start each line directly with the tip text (NO bullets, NO dashes, NO numbers)
- Do NOT use any markdown, asterisks, or special formatting
- Do NOT add extra blank lines between tips
- Focus on what the parent can do TODAY

Example output format (copy this style exactly):
Watch for sleepy cues 2-3 hours after waking
Keep bedtime between 7-8pm for best night sleep
Protect the first morning nap—it's usually the strongest`;

    const whatToDoResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a practical parenting coach who gives specific, actionable advice.' },
          { role: 'user', content: whatToDoPrompt }
        ],
      }),
    });

    if (!whatToDoResponse.ok) {
      const errorText = await whatToDoResponse.text();
      console.error('What to do error:', whatToDoResponse.status, errorText);
      throw new Error('Failed to generate what to do');
    }

    const whatToDoData = await whatToDoResponse.json();
    const whatToDoText = whatToDoData.choices[0].message.content.trim();
    // Parse lines, remove empty lines, and clean up any accidental bullets/numbers
    const whatToDo = whatToDoText
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => {
        // Remove common prefixes: bullets (•, -, *), numbers (1., 2.), quotes
        return line.replace(/^[\-\*\•]\s*/, '')
                   .replace(/^\d+\.\s*/, '')
                   .replace(/^["']|["']$/g, '')
                   .trim();
      });

    // CALL 3: Generate "What's Next"
    const whatsNextPrompt = `You are a developmental expert. Based on ${babyName}'s current sleep stage, explain what's coming next.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
Current pattern: ${napsPerDayThisWeek} naps/day${dstContext}

CRITICAL FORMAT RULES:
- Always use "${babyName}" instead of generic terms like "the baby" or "your baby"
- Write 2-3 sentences (50-60 words total)
- Explain the next developmental sleep milestone
- Be specific about timing if relevant
- Sound encouraging and informative
- Do NOT use markdown formatting (no bold, no italics, no asterisks)
- Write in plain, natural language

Example output:
Around 15-18 months, most babies consolidate to a single afternoon nap. Watch for signs like fighting the morning nap or taking forever to fall asleep. This transition usually happens gradually over 2-3 weeks.`;

    const whatsNextResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a developmental expert who explains sleep milestones clearly.' },
          { role: 'user', content: whatsNextPrompt }
        ],
      }),
    });

    if (!whatsNextResponse.ok) {
      const errorText = await whatsNextResponse.text();
      console.error('Whats next error:', whatsNextResponse.status, errorText);
      throw new Error('Failed to generate whats next');
    }

    const whatsNextData = await whatsNextResponse.json();
    const whatsNext = whatsNextData.choices[0].message.content.trim()
      .replace(/\*\*/g, '') // Remove any bold markdown
      .replace(/\*/g, '');  // Remove any italic markdown

    // CALL 4: Generate "Prep Tip"
    const prepTipPrompt = `You are a forward-thinking parenting coach. Give ONE specific prep tip for ${babyName}'s upcoming sleep stage.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
Current pattern: ${napsPerDayThisWeek} naps/day${dstContext}

CRITICAL FORMAT RULES:
- Always use "${babyName}" instead of generic terms like "the baby" or "your baby"
- Write ONE sentence only (20-25 words max)
- Make it actionable and specific
- Focus on preparing for the next stage
- Sound helpful and practical
- Do NOT use markdown formatting (no bold, no italics, no asterisks)
- Write in plain, natural language

Example output:
Start pushing the morning nap later by 15 minutes each week to ease into the 1-nap transition.`;

    const prepTipResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a forward-thinking parenting coach who gives specific prep tips.' },
          { role: 'user', content: prepTipPrompt }
        ],
      }),
    });

    if (!prepTipResponse.ok) {
      const errorText = await prepTipResponse.text();
      console.error('Prep tip error:', prepTipResponse.status, errorText);
      throw new Error('Failed to generate prep tip');
    }

    const prepTipData = await prepTipResponse.json();
    const prepTip = prepTipData.choices[0].message.content.trim()
      .replace(/\*\*/g, '') // Remove any bold markdown
      .replace(/\*/g, '')   // Remove any italic markdown
      .replace(/^["']|["']$/g, ''); // Remove quotes if present

    console.log('✅ Prep tip generated successfully');

    // CALL 4: Generate "Why This Matters"
    console.log('🔍 Generating why this matters explanation...');
    const whyThisMattersPrompt = `You are a developmental expert. Based on ${babyName}'s current sleep patterns and developmental stage, explain in 2-3 sentences why understanding their rhythm matters right now.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
Current pattern: ${napsPerDayThisWeek} naps/day
${transitionInfo || ''}${dstContext}

CRITICAL FORMAT RULES:
- Always use "${babyName}" instead of generic terms like "the baby" or "your baby"
- Write 2-3 sentences (50-60 words total)
- Focus on developmental benefits and how rhythm supports growth
- Be warm and encouraging
- Do NOT use markdown formatting (no bold, no italics, no asterisks)
- Write in plain, natural language

Example output:
Understanding ${babyName}'s rhythm helps you respond to emerging needs before they become overwhelming. At this age, predictable patterns support brain development and emotional regulation. Recognizing these patterns early makes transitions smoother for everyone.`;

    const whyThisMattersResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a developmental expert who explains why understanding sleep patterns is important.' },
          { role: 'user', content: whyThisMattersPrompt }
        ],
      }),
    });

    if (!whyThisMattersResponse.ok) {
      const errorText = await whyThisMattersResponse.text();
      console.error('Why this matters error:', whyThisMattersResponse.status, errorText);
      throw new Error('Failed to generate why this matters');
    }

    const whyThisMattersData = await whyThisMattersResponse.json();
    const whyThisMatters = whyThisMattersData.choices[0].message.content.trim()
      .replace(/\*\*/g, '') // Remove any bold markdown
      .replace(/\*/g, '')   // Remove any italic markdown
      .replace(/^["']|["']$/g, ''); // Remove quotes if present

    console.log('✅ Why this matters generated successfully');

    return new Response(
      JSON.stringify({
        heroInsight,
        whatToDo,
        whatsNext,
        prepTip,
        whyThisMatters,
        confidenceScore,
        dataQuality: {
          dataPoints,
          bedtimeVariation: Math.round(bedtimeVariation),
          napsPerDayThisWeek,
          napsPerDayLastWeek,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-rhythm-insights:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
