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
    const { activities, babyName, babyAge, babyBirthday, aiPrediction } = await req.json();
    
    if (!activities || !babyName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: activities, babyName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    // Build nap count info - prioritize AI prediction over historical average
    const currentNapInfo = aiPrediction 
      ? `${aiPrediction.total_naps_today} naps (predicted for today)`
      : `${napsPerDayThisWeek} naps per day (this week's average)`;
    
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
${aiPrediction ? `CURRENT NAP PATTERN: ${aiPrediction.total_naps_today} naps today (use THIS number in your insight)` : `Recent pattern: ${napsPerDayThisWeek} naps/day this week, ${napsPerDayLastWeek} naps/day last week`}
Last 7 days nap range: ${minNapCount}–${maxNapCount} naps per day
Bedtime: ${aiPrediction?.predicted_bedtime || 'consistency varies'} ${bedtimeVariation < 15 ? '(very consistent)' : bedtimeVariation < 30 ? '(fairly consistent)' : ''}
${transitionInfo || ''}

CRITICAL INSTRUCTIONS:
${aiPrediction ? `- You MUST reference ${aiPrediction.total_naps_today} naps, NOT any other nap count` : ''}
${transitionInfo ? '- You MUST acknowledge the pattern/transition stated above' : ''}
- Do NOT contradict the nap count or pattern information above
- Do NOT mention nap counts that weren't observed (e.g., don't say "4 naps" if max is 3)

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

    // CALL 2: Generate "Why This Matters"
    const whyPrompt = `You are a helpful parenting expert. Based on the data below, explain what this sleep stage means for the parent's daily life.

Baby: ${babyName}, ${ageInMonths ? `${ageInMonths} months old` : 'age unknown'}
${aiPrediction ? `CURRENT NAP PATTERN: ${aiPrediction.total_naps_today}-nap schedule (use THIS number in your explanation)` : `Current pattern: ${napsPerDayThisWeek} naps/day (${napsPerDayLastWeek !== napsPerDayThisWeek ? `shifted from ${napsPerDayLastWeek}` : 'stable'})`}
Last 7 days nap range: ${minNapCount}–${maxNapCount} naps per day
Bedtime: ${bedtimeVariation < 15 ? 'very consistent' : bedtimeVariation < 30 ? 'fairly consistent' : 'still establishing'}
${transitionInfo || ''}

CRITICAL INSTRUCTIONS:
${aiPrediction ? `- You MUST reference the ${aiPrediction.total_naps_today}-nap pattern, NOT any other nap count` : ''}
${transitionInfo ? '- Explain what the stated pattern/transition means practically' : '- Explain the stable pattern benefits'}
- Your explanation must match the nap count and pattern stated above exactly
- Do NOT mention nap counts that weren't observed in the last 7 days (range: ${minNapCount}–${maxNapCount})

RULES:
- Write 2-3 sentences (under 50 words total)
- Explain practical implications for daily planning
- Make it actionable
- Sound helpful and specific
- Do NOT use markdown formatting

Examples for 2-nap pattern:
"${babyName}'s 2-nap rhythm means longer wake windows—perfect for morning activities and afternoon errands between naps."
"With 2 naps, you have predictable blocks of awake time to plan outings and activities with confidence."

Examples for 3-nap pattern:
"${babyName}'s 3-nap schedule means shorter wake windows. Plan activities in bite-sized chunks between naps."

Examples for transitions:
"During this 3-to-2 nap transition, some days will feel unpredictable. Follow ${babyName}'s sleepy cues and stay flexible."`;

    const whyResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful parenting expert who explains sleep patterns in practical, actionable terms.' },
          { role: 'user', content: whyPrompt }
        ],
      }),
    });

    if (!whyResponse.ok) {
      const errorText = await whyResponse.text();
      console.error('Why this matters error:', whyResponse.status, errorText);
      throw new Error('Failed to generate why this matters');
    }

    const whyData = await whyResponse.json();
    const whyThisMatters = whyData.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({
        heroInsight,
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
