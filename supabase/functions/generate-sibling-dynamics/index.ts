import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Child {
  name: string;
  sunSign: string;
  moonSign: string | null;
  ageMonths: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { children } = await req.json() as { children: Child[] };
    
    if (!children || children.length < 2) {
      return new Response(
        JSON.stringify({ error: "At least 2 children required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build child descriptions
    const childDescriptions = children.map(c => {
      const ageLabel = c.ageMonths < 12 
        ? `${c.ageMonths} months` 
        : `${Math.floor(c.ageMonths / 12)} years${c.ageMonths % 12 > 0 ? ` ${c.ageMonths % 12} months` : ''}`;
      return `${c.name} (${ageLabel}, ${c.sunSign} Sun${c.moonSign ? `, ${c.moonSign} Moon` : ''})`;
    }).join(" and ");

    const prompt = `You are an expert in astrology and child development. Analyze the sibling dynamics between these children:

${childDescriptions}

Provide insights in this JSON structure:
{
  "currentDynamic": "2-3 sentences about how they interact right now given their ages",
  "whatEachBrings": [
    {"child": "name", "gifts": ["trait1", "trait2", "trait3"]}
  ],
  "compatibilityLabel": "High Harmony" or "Complementary Energy" or "Dynamic Tension" etc,
  "compatibilityNote": "One punchy sentence about their overall connection",
  "earlyChildhood": "2-3 sentences about ages 0-5 dynamics",
  "schoolYears": "2-3 sentences about ages 6-12 dynamics",
  "teenYears": "2-3 sentences about teen dynamics"
}

Keep the tone warm, insightful, and practical. Focus on how their zodiac signs influence their sibling relationship. Be specific to their signs, not generic.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an astrology expert specializing in family dynamics and child development. Respond only with valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
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

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-sibling-dynamics error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
