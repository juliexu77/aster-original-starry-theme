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
    const whatToDoPrompt = `You are giving specific advice based on ${babyName}'s ACTUAL OBSERVED patterns.

OBSERVED DATA:
- ${babyName} currently: ${napsPerDayThisWeek} naps/day (was ${napsPerDayLastWeek}/day last week)
- Today so far: ${actualNapsToday} naps logged
- Bedtime: ${bedtimeVariation < 15 ? `very stable at ${aiPrediction?.predicted_bedtime || 'same time daily'}` : bedtimeVariation < 30 ? `fairly consistent around ${aiPrediction?.predicted_bedtime || '7-8pm'}` : 'still variable'}
- Nap range this week: ${minNapCount}-${maxNapCount} naps per day
${transitionInfo ? `- ${transitionInfo}` : ''}${dstContext}

TASK: Give 2-3 tips that DIRECTLY respond to these patterns. Make it feel like advice tailored to ${babyName}, not generic baby tips.

RULES:
- Always use "${babyName}" by name
- Reference specific patterns (e.g., "Keep ${babyName}'s ${napsPerDayThisWeek}-nap rhythm consistent")
- Make tips actionable for TODAY
- Each tip is ONE sentence (under 20 words)
- NO bullets, numbers, dashes, or markdown
- One tip per line, no blank lines

BAD (too generic): "Watch for sleepy cues"
GOOD: "Aim for ${babyName}'s naps at the times that worked yesterday—consistency builds on success"
GOOD: "Protect that ${aiPrediction?.predicted_bedtime || '7-8pm'} bedtime since it's working so well"
GOOD: "If ${babyName} seems extra sleepy today, offer an earlier nap—transitions take energy"`;

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
    const whatsNextPrompt = `Based on ${babyName}'s CURRENT trajectory, predict what's coming next specifically for them.

OBSERVED TRAJECTORY:
- Age: ${ageInMonths ? `${ageInMonths} months old` : 'unknown'}
- Pattern: ${napsPerDayLastWeek} naps/day → ${napsPerDayThisWeek} naps/day (this week)
- Consistency: ${bedtimeVariation < 15 ? 'very stable routine' : bedtimeVariation < 30 ? 'moderate stability' : 'still finding rhythm'}
${transitionInfo ? `- Current phase: ${transitionInfo}` : ''}${dstContext}

TASK: Based on ${babyName}'s SPECIFIC trajectory (not generic milestones), predict what's coming next for THEM.

RULES:
- Always use "${babyName}" by name
- Reference their specific pattern (e.g., "Since ${babyName} recently moved to ${napsPerDayThisWeek} naps...")
- Predict based on THEIR trajectory, not generic age ranges
- 2-3 sentences, 50-60 words
- NO markdown, plain language

BAD (too generic): "Around 15 months, babies drop to 1 nap"
GOOD: "Since ${babyName} just settled into ${napsPerDayThisWeek} naps, expect this pattern to hold for ${ageInMonths && ageInMonths < 12 ? '3-4 months' : ageInMonths && ageInMonths < 15 ? '2-3 months' : 'several weeks'}. Watch for ${napsPerDayThisWeek === 2 ? 'fighting the morning nap or needing later wake times' : 'shorter naps or bedtime resistance'} as signs of the next shift."
GOOD: "With that ${bedtimeVariation < 15 ? 'rock-solid' : 'improving'} bedtime, ${babyName} is ready for any upcoming transitions. ${transitionInfo ? 'The current adjustment should settle within a week' : 'Enjoy this stable phase—it makes future changes easier'}."`;

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
    const prepTipPrompt = `Based on where ${babyName} is headed next, give ONE concrete prep action.

CURRENT STATE:
- ${babyName}: ${napsPerDayThisWeek} naps/day, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
- Recent change: ${napsPerDayLastWeek} → ${napsPerDayThisWeek} naps/day
${transitionInfo ? `- ${transitionInfo}` : ''}${dstContext}

TASK: Give ONE prep tip for what's coming next based on ${babyName}'s specific trajectory (not generic advice).

RULES:
- Always use "${babyName}" by name
- Make it specific to THEIR next stage (e.g., if they just went 3→2 naps, prep for 2→1)
- ONE sentence, 20-25 words
- Actionable and concrete
- NO markdown, plain language

BAD (too generic): "Start pushing naps later"
GOOD: "Track ${babyName}'s wake windows for 3 days to spot the ideal timing before making any schedule changes"
GOOD: "When ${babyName} resists the morning nap consistently, shift it 30 minutes later rather than dropping it cold"
GOOD: "Keep ${babyName}'s room dark until 6:30am to preserve that solid bedtime as wake windows lengthen"`;

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
    
    // Calculate specific pattern details for more concrete explanations
    const recentWakeTimes = last7Days
      .filter((a: Activity) => a.type === 'nap' && a.details?.isNightSleep)
      .map((a: Activity) => {
        const date = new Date(a.logged_at);
        const wakeTime = a.details?.wakeTime ? new Date(a.details.wakeTime) : null;
        return wakeTime ? `${wakeTime.getHours()}:${wakeTime.getMinutes().toString().padStart(2, '0')}` : null;
      })
      .filter(Boolean);
    
    const avgNapDurations = last7Days
      .filter((a: Activity) => a.type === 'nap' && !a.details?.isNightSleep)
      .map((a: Activity) => {
        if (a.details?.duration) {
          const [hours, mins] = a.details.duration.split(':').map(Number);
          return (hours || 0) * 60 + (mins || 0);
        }
        return null;
      })
      .filter((d): d is number => d !== null);
    
    const avgNapMinutes = avgNapDurations.length > 0 
      ? Math.round(avgNapDurations.reduce((a, b) => a + b, 0) / avgNapDurations.length)
      : null;
    
    const whyThisMattersPrompt = `You are explaining why the SPECIFIC patterns you're observing matter for ${babyName}'s development.

OBSERVED DATA:
- ${babyName} is currently doing ${napsPerDayThisWeek} naps per day (changed from ${napsPerDayLastWeek} last week)
- Bedtime consistency: ${bedtimeVariation < 15 ? `very stable (±${Math.round(bedtimeVariation)} min)` : bedtimeVariation < 30 ? `fairly consistent (±${Math.round(bedtimeVariation)} min)` : `still variable (±${Math.round(bedtimeVariation)} min)`}
- Average nap length: ${avgNapMinutes ? `${Math.round(avgNapMinutes)} minutes` : 'varying'}
${transitionInfo ? `- ${transitionInfo}` : ''}
${actualNapsToday ? `- Today specifically: ${actualNapsToday} naps logged so far` : ''}${dstContext}

TASK: Explain why THIS SPECIFIC PATTERN matters for ${babyName} right now. Connect the dots between what you're seeing and what it means.

RULES:
- Always use "${babyName}" by name
- Reference the SPECIFIC patterns above (e.g., "the shift from ${napsPerDayLastWeek} to ${napsPerDayThisWeek} naps", "those ${avgNapMinutes}-minute naps")
- Explain what these patterns reveal about ${babyName}'s development
- Make it feel personal to THEIR journey, not generic advice
- 2-3 sentences, 50-60 words
- NO markdown, plain language

BAD (too generic): "Understanding your baby's rhythm helps with sleep. Patterns support development."
GOOD: "${babyName}'s shift to ${napsPerDayThisWeek} naps shows their wake windows are lengthening—a sign of maturing circadian rhythms. That ${bedtimeVariation < 15 ? 'rock-solid' : 'improving'} bedtime consistency means their internal clock is strengthening, making future transitions smoother."`;

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
