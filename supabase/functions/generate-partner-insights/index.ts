import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Person {
  name: string;
  sunSign: string;
  moonSign: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { person1, person2 } = await req.json() as { person1: Person; person2: Person };
    
    if (!person1 || !person2) {
      return new Response(
        JSON.stringify({ error: "Both partners' data required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const person1Desc = `${person1.name} (${person1.sunSign} Sun${person1.moonSign ? `, ${person1.moonSign} Moon` : ''})`;
    const person2Desc = `${person2.name} (${person2.sunSign} Sun${person2.moonSign ? `, ${person2.moonSign} Moon` : ''})`;

    console.log("Generating partner insights for:", person1Desc, "and", person2Desc);

    const prompt = `You are an expert in relationship astrology focused on adult partnerships and co-parenting dynamics. Generate compatibility insights for:

Partner 1: ${person1Desc}
Partner 2: ${person2Desc}

Generate insights in this EXACT JSON structure. Each insight should be 2-3 punchy sentences max. Be SPECIFIC to their exact signs. Use their names. The tone should feel like consulting a wise relationship guide who understands both cosmic dynamics and practical partnership.

{
  "currentStrength": "What's working well between these two signs as partners. Focus on their natural compatibility and what draws them together. Example: 'Your Cancer intuition meets her Sagittarius optimism—you ground her adventures while she expands your world. Together you create both safety and excitement.'",
  
  "currentFriction": "Where they naturally clash as a couple. Be honest but constructive. Example: 'Her Aries directness can feel harsh to your Pisces sensitivity. You withdraw when she advances. Learning each other's conflict styles is key.'",
  
  "actionableInsight": "One specific thing to try this week as partners. Example: 'Schedule 20 minutes of device-free connection tonight. Your signs both need presence—hers through action, yours through feeling.'",
  
  "communicationStyle": "How their signs communicate and how to bridge differences. Example: 'She speaks in headlines; you speak in paragraphs. Meet in the middle: she gives more context, you lead with the point.'",
  
  "emotionalDynamic": "How they process emotions together. Example: 'Two water signs means deep emotional currents run between you. The risk is drowning together. Name feelings out loud to stay afloat.'",
  
  "parentingTeamwork": "How their signs complement or challenge each other as co-parents. Example: 'Your Virgo attention to detail pairs with his Leo warmth. You handle logistics; he brings the fun. Together: structured joy.'",
  
  "stressResponse": "How they each respond to stress and how to support each other. Example: 'Under pressure, you organize and she escapes. Neither is wrong. Give her space to process, ask her to appreciate your planning.'",
  
  "intimacyInsight": "How their signs connect emotionally and romantically. Example: 'His Taurus sensuality needs time; your Gemini mind needs variety. Slow down for him, he'll surprise you for you.'",
  
  "longTermEvolution": "How this partnership will evolve over years. Example: 'Fire and earth: you'll temper each other. Early friction becomes foundation. The patience you build now compounds into deep trust.'"
}

Be specific, warm, and practical. Never generic. Reference actual sign qualities. Both partners should feel seen and understood.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a relationship astrology expert who understands adult partnerships, communication styles, and co-parenting dynamics. You combine cosmic wisdom with practical relationship insights. Respond only with valid JSON. Be warm, specific, and mature." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("API credits exhausted");
        return new Response(
          JSON.stringify({ error: "API credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON from AI");
    }

    console.log("Successfully generated partner insights");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-partner-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
