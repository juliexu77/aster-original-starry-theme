import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      feedCount, 
      napCount, 
      totalNapMinutes, 
      hadSolidFood,
      solidFoodNote,
      longestWakeWindow,
      specialMoments,
      babyName 
    } = await req.json();

    console.log('📖 Generating story headline:', { 
      feedCount, 
      napCount, 
      totalNapMinutes, 
      hadSolidFood,
      solidFoodNote,
      longestWakeWindow,
      specialMomentsCount: specialMoments?.length || 0,
      babyName 
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context for AI
    const totalNapHours = Math.floor(totalNapMinutes / 60);
    const totalNapMins = Math.round(totalNapMinutes % 60);
    
    let context = `Today, ${babyName || 'baby'} had:\n`;
    context += `- ${feedCount} feeds\n`;
    context += `- ${napCount} naps totaling ${totalNapHours}h ${totalNapMins}m\n`;
    
    if (hadSolidFood && solidFoodNote) {
      context += `- First taste of solid food: ${solidFoodNote}\n`;
    } else if (hadSolidFood) {
      context += `- Had solid food today\n`;
    }
    
    if (longestWakeWindow) {
      context += `- Longest wake window: ${longestWakeWindow}\n`;
    }
    
    if (specialMoments && specialMoments.length > 0) {
      context += `- Special moments: ${specialMoments.join(', ')}\n`;
    }

    const systemPrompt = `You are a poetic storyteller for parents. Create a single, beautiful headline (max 15 words) that captures the essence of a baby's day.

Style guidelines:
- Poetic, gentle, and emotionally resonant
- Use soft, lyrical language
- Focus on rhythm, balance, and growth
- Avoid clichés and overly sentimental phrases
- Use present tense or timeless observations
- Examples of good tone: "Steady breath. Gentle rhythm. Today flowed." or "First taste of peas. Curious eyes. Growing strong."

Return ONLY the headline text, nothing else.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a poetic headline for this day:\n\n${context}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(JSON.stringify({ error: "Rate limits exceeded, using fallback headline" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(JSON.stringify({ error: "Payment required, using fallback headline" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const headline = data.choices?.[0]?.message?.content?.trim() || "";

    console.log('✅ Generated headline:', headline);

    return new Response(JSON.stringify({ headline }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in generate-story-headline:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
