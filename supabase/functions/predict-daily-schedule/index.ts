import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recentActivities, todayActivities, babyBirthday } = await req.json();

    if (!recentActivities || !Array.isArray(recentActivities)) {
      return new Response(
        JSON.stringify({ error: 'recentActivities is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate baby age
    const babyAgeMonths = babyBirthday 
      ? Math.floor((Date.now() - new Date(babyBirthday).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
      : null;

    // Analyze recent patterns
    const last14Days = recentActivities.filter((a: Activity) => {
      const activityDate = new Date(a.logged_at);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      return activityDate >= fourteenDaysAgo;
    });

    // Group by day to see nap patterns
    const dailyPatterns: { [key: string]: { naps: number; feeds: number; bedtime?: string } } = {};
    last14Days.forEach((activity: Activity) => {
      const date = new Date(activity.logged_at).toDateString();
      if (!dailyPatterns[date]) {
        dailyPatterns[date] = { naps: 0, feeds: 0 };
      }
      if (activity.type === 'nap') dailyPatterns[date].naps++;
      if (activity.type === 'feed') dailyPatterns[date].feeds++;
      if (activity.type === 'night_sleep' && activity.details?.end_time) {
        dailyPatterns[date].bedtime = new Date(activity.details.end_time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      }
    });

    const patternSummary = Object.entries(dailyPatterns)
      .slice(-7)
      .map(([date, data]) => `${date}: ${data.naps} naps, ${data.feeds} feeds${data.bedtime ? `, bed at ${data.bedtime}` : ''}`)
      .join('\n');

    // Today's activities summary
    const todayNaps = (todayActivities || []).filter((a: Activity) => a.type === 'nap').length;
    const todayFeeds = (todayActivities || []).filter((a: Activity) => a.type === 'feed').length;
    const lastNap = (todayActivities || [])
      .filter((a: Activity) => a.type === 'nap')
      .sort((a: Activity, b: Activity) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())[0];
    
    const lastNapDuration = lastNap?.details?.duration_minutes || 0;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const prompt = `You are analyzing baby sleep and feeding patterns to predict today's schedule.

Baby age: ${babyAgeMonths ? `${babyAgeMonths} months` : 'Unknown'}

Recent 7-day pattern:
${patternSummary}

Today so far (current time: ${currentTime}):
- ${todayNaps} nap${todayNaps !== 1 ? 's' : ''} logged
- ${todayFeeds} feed${todayFeeds !== 1 ? 's' : ''} logged
${lastNap ? `- Last nap duration: ${lastNapDuration} minutes` : ''}

Analyze:
1. Is baby transitioning nap counts? (e.g., some days 3 naps, some days 2)
2. Based on today's activities so far, how many MORE naps are expected?
3. What's the total expected nap count for today?
4. How many total feeds expected today?
5. Predicted bedtime?
6. Confidence level (high/medium/low) and why?

Provide a prediction for the REST OF TODAY based on what's already logged.`;

    console.log('Calling Lovable AI for schedule prediction...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a baby sleep and feeding pattern expert. Analyze patterns and make predictions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'predict_schedule',
              description: 'Predict remaining schedule for today',
              parameters: {
                type: 'object',
                properties: {
                  total_naps_today: {
                    type: 'number',
                    description: 'Total expected naps for the full day (including already logged)'
                  },
                  remaining_naps: {
                    type: 'number',
                    description: 'How many more naps expected after current time'
                  },
                  total_feeds_today: {
                    type: 'number',
                    description: 'Total expected feeds for the full day (including already logged)'
                  },
                  predicted_bedtime: {
                    type: 'string',
                    description: 'Predicted bedtime in format like "7:30 PM"'
                  },
                  confidence: {
                    type: 'string',
                    enum: ['high', 'medium', 'low'],
                    description: 'Confidence level in this prediction'
                  },
                  reasoning: {
                    type: 'string',
                    description: 'Brief explanation of the prediction (max 2 sentences)'
                  },
                  is_transitioning: {
                    type: 'boolean',
                    description: 'Is baby transitioning between nap counts?'
                  },
                  transition_note: {
                    type: 'string',
                    description: 'If transitioning, explain the pattern (e.g., "Moving from 3 to 2 naps")'
                  }
                },
                required: [
                  'total_naps_today',
                  'remaining_naps',
                  'total_feeds_today',
                  'predicted_bedtime',
                  'confidence',
                  'reasoning',
                  'is_transitioning'
                ],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'predict_schedule' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI prediction failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData, null, 2));

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in AI response');
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prediction = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in predict-daily-schedule:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
