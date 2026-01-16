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

    const prompt = `You are an expert in personality-based child development, writing for a PARENT about their children's sibling relationship. Analyze the sibling dynamics between these children:

${childDescriptions}

IMPORTANT: 
- Address the PARENT directly using "your children", "your kids", etc.
- Do NOT mention zodiac signs, sun signs, moon signs, or any astrological terminology.
- Focus on personality traits, behaviors, and practical insights for the parent.
- Write as if you're describing their natural temperaments to their parent.

WRITING STYLE (MANDATORY):
- Never use em dashes (—). Use commas, periods, or rewrite the sentence.
- Never use semicolons. Use separate sentences instead.
- Avoid starting sentences with "This" or "It" when possible.
- No colons in body text.
- Write short sentences. Mix in longer ones sparingly.
- Avoid words like "delve", "tapestry", "landscape", "beacon", "realm", "embark", "navigate", "embrace", "journey".
- Avoid phrases like "it's important to", "remember that", "don't hesitate to".
- Sound like a real person talking, not a press release.

Provide insights in this JSON structure:
{
  "currentDynamic": "2-3 sentences about how your children interact right now given their ages. Address the parent directly. Example: 'Right now, your kids are learning to share space. The older one's natural leadership helps guide the younger. The younger one's curiosity keeps things interesting for both.'",
  "whatEachBrings": [
    {"child": "child's name", "gifts": ["trait1", "trait2", "trait3"]}
  ],
  "compatibilityLabel": "High Harmony" or "Complementary Energy" or "Dynamic Tension" etc,
  "compatibilityNote": "One punchy sentence about their overall connection as siblings, addressed to the parent. Example: 'These two balance each other beautifully. Expect them to become each other's biggest supporters.'",
  "earlyChildhood": "2-3 sentences about their dynamics in ages 0-5, written to the parent. Example: 'In these early years, you'll see your children develop their own private world of games and inside jokes.'",
  "schoolYears": "2-3 sentences about ages 6-12 dynamics, addressed to the parent. Example: 'As your kids enter school, expect some friendly competition. Channel it into teamwork activities.'",
  "teenYears": "2-3 sentences about teen dynamics for the parent. Example: 'The teen years may bring distance, but your children's foundation will hold. They'll rediscover each other as young adults.'"
}

Keep the tone warm, insightful, and practical. Always address the parent as "you" and refer to the children as "your children" or "your kids" or by name. Be specific to their personalities, not generic.`;

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
