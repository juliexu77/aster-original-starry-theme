import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Parent {
  name: string;
  sunSign: string;
  moonSign: string | null;
}

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
    const { parent, child } = await req.json() as { parent: Parent; child: Child };
    
    if (!parent || !child) {
      return new Response(
        JSON.stringify({ error: "Parent and child data required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build age description
    const ageLabel = child.ageMonths < 12 
      ? `${child.ageMonths} months` 
      : `${Math.floor(child.ageMonths / 12)} years${child.ageMonths % 12 > 0 ? ` and ${child.ageMonths % 12} months` : ''}`;

    // Developmental stage context
    let developmentalContext = "";
    if (child.ageMonths < 3) {
      developmentalContext = "newborn phase: bonding, feeding rhythms, sleep patterns";
    } else if (child.ageMonths < 6) {
      developmentalContext = "early infancy: emerging personality, social smiles, exploring";
    } else if (child.ageMonths < 9) {
      developmentalContext = "mid-infancy: sitting, beginning solids, separation awareness";
    } else if (child.ageMonths < 12) {
      developmentalContext = "late infancy: pre-walking, first words emerging, strong preferences";
    } else if (child.ageMonths < 18) {
      developmentalContext = "early toddlerhood: walking, vocabulary explosion, independence emerging";
    } else if (child.ageMonths < 24) {
      developmentalContext = "toddlerhood: running, two-word phrases, testing boundaries";
    } else if (child.ageMonths < 36) {
      developmentalContext = "late toddlerhood: sentences, imaginative play, asserting self";
    } else if (child.ageMonths < 48) {
      developmentalContext = "preschool age: complex play, friendships beginning, many questions";
    } else if (child.ageMonths < 60) {
      developmentalContext = "pre-kindergarten: school readiness, cooperative play, empathy developing";
    } else {
      developmentalContext = "school age: independence growing, peer relationships important";
    }

    const prompt = `Generate relationship insights for a parent named ${parent.name} and their child ${child.name} who is ${ageLabel} old.

Context for generating insights (DO NOT mention these signs directly in your output):
- Parent's astrological profile: ${parent.sunSign} Sun${parent.moonSign ? `, ${parent.moonSign} Moon` : ''}
- Child's astrological profile: ${child.sunSign} Sun${child.moonSign ? `, ${child.moonSign} Moon` : ''}
- Current developmental stage: ${developmentalContext}

CRITICAL RULES:
1. NEVER use phrases like "Your Sagittarius nature", "His Aries energy", "Cancer Sun", etc.
2. NEVER name zodiac signs in the output - describe the BEHAVIOR, not the astrological cause
3. Use the child's name (${child.name}) naturally
4. Focus on observable behaviors and practical advice
5. Keep each insight to 2-3 punchy sentences max
6. Be specific to THIS age/developmental stage

Generate insights in this JSON structure:

{
  "currentStrength": "What's working RIGHT NOW between you two. Focus on behavior, not astrology. Example: 'You roll with the unpredictable. When sleep falls apart, you adapt instead of panic. He needs that flexibility right now.'",
  
  "currentFriction": "Where you clash RIGHT NOW. Focus on behavior. Example: 'You want to help. He wants to struggle. His "do it myself" phase is real—stepping back feels wrong but builds his confidence.'",
  
  "actionableInsight": "One specific thing to try this week. Example: 'Let him lead during play. Watch instead of direct. He needs to feel powerful.'",
  
  "sleepDynamic": "How you two navigate sleep AT THIS AGE. Example: 'He processes the day through dreams. Your calm presence at bedtime helps him release the intensity.'",
  
  "feedingDynamic": "How you two navigate feeding/meals AT THIS AGE. Example: 'He wants control of the spoon. Embrace the mess—it's how he learns.'",
  
  "communicationStyle": "How you two communicate AT THIS STAGE. Example: 'He can't say it yet but his body shows everything. You catch what he can't articulate.'",
  
  "whatThisPhaseTeaches": "What THIS phase is teaching you. Example: 'This is your lesson in patience. Milestones come on his schedule, not yours.'",
  
  "whatsComingNext": "What to expect in the next 1-2 months. Example: 'His independence will surge soon. Prepare for more boundary testing. Your humor will be your best tool.'",
  
  "longTermEvolution": "How this relationship will evolve. Example: 'The intensity that challenges you now becomes your greatest bond as he grows. You're building a partnership.'"
}

Be warm, practical, and specific. Never generic. The parent should feel seen and guided without needing to understand astrology.`;

    console.log("Generating relationship insights for:", parent.name, "and", child.name);

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
            content: "You are a parenting insight expert. You understand child development deeply. You NEVER mention zodiac signs in your output—you describe behaviors and dynamics only. Respond with valid JSON only." 
          },
          { role: "user", content: prompt }
        ],
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

    console.log("Successfully generated relationship insights");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-relationship-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
