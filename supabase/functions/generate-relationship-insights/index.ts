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
      developmentalContext = "newborn phase (0-3 months): focused on bonding, feeding rhythms, sleep patterns, sensory development";
    } else if (child.ageMonths < 6) {
      developmentalContext = "early infancy (3-6 months): emerging personality, social smiles, beginning to explore, sleep consolidation";
    } else if (child.ageMonths < 9) {
      developmentalContext = "mid-infancy (6-9 months): sitting, beginning solids, separation awareness, babbling";
    } else if (child.ageMonths < 12) {
      developmentalContext = "late infancy (9-12 months): pre-walking, first words emerging, strong preferences, object permanence";
    } else if (child.ageMonths < 18) {
      developmentalContext = "early toddlerhood (12-18 months): walking, vocabulary explosion, independence emerging, parallel play";
    } else if (child.ageMonths < 24) {
      developmentalContext = "toddlerhood (18-24 months): running, two-word phrases, testing boundaries, big emotions";
    } else if (child.ageMonths < 36) {
      developmentalContext = "late toddlerhood (2-3 years): sentences, imaginative play, potty training, asserting self";
    } else if (child.ageMonths < 48) {
      developmentalContext = "preschool age (3-4 years): complex play, friendships beginning, questions about everything, emotional regulation developing";
    } else if (child.ageMonths < 60) {
      developmentalContext = "pre-kindergarten (4-5 years): school readiness, cooperative play, empathy developing, identity forming";
    } else {
      developmentalContext = "school age (5+ years): independence growing, peer relationships important, academic skills, complex reasoning";
    }

    const parentDesc = `${parent.name} (${parent.sunSign} Sun${parent.moonSign ? `, ${parent.moonSign} Moon` : ''})`;
    const childDesc = `${child.name} (${ageLabel} old, ${child.sunSign} Sun${child.moonSign ? `, ${child.moonSign} Moon` : ''})`;

    const prompt = `You are an expert in astrology AND child development. Generate relationship insights for:

Parent: ${parentDesc}
Child: ${childDesc}
Current developmental stage: ${developmentalContext}

WRITING STYLE (MANDATORY):
- Never use em dashes (—). Use commas, periods, or rewrite the sentence.
- Never use semicolons. Use separate sentences instead.
- Avoid starting sentences with "This" or "It" when possible.
- No colons in body text.
- Write short sentences. Mix in longer ones sparingly.
- Avoid words like "delve", "tapestry", "landscape", "beacon", "realm", "embark", "navigate", "embrace", "journey".
- Avoid phrases like "it's important to", "remember that", "don't hesitate to".
- Sound like a real person talking, not a press release.

Generate insights in this EXACT JSON structure. Each insight should be 2-3 punchy sentences max. Be SPECIFIC to their exact signs AND the child's current age/developmental stage. Use ${child.name}'s name and they/them pronouns. The tone should feel like consulting a wise guide who knows both astrology and child development.

{
  "currentStrength": "What's working RIGHT NOW between these two signs at this specific age. Example: 'At 8 months, your Sag adaptability helps you roll with their Aries sleep regressions. Your fire meets their fire. You get each other's restlessness.'",
  
  "currentFriction": "Where they clash RIGHT NOW given the child's developmental stage. Example: 'Their Aries do-it-myself attitude is emerging now. Your Sag tendency to swoop in and help may spark frustration. They need to fail safely.'",
  
  "actionableInsight": "One specific thing to try this week. Example: 'Let them lead during tummy time. They need to feel powerful. Your job is to witness, not direct.'",
  
  "sleepDynamic": "How their signs interact around sleep AT THIS AGE. Example: 'Their Scorpio intensity means they process the day through dreams. Your calm Taurus presence at bedtime helps them release.'",
  
  "feedingDynamic": "How their signs interact around feeding/meals AT THIS AGE. Example: 'Aries babies want control. Let them grab the spoon. Your Virgo nature may want order. Embrace the mess.'",
  
  "communicationStyle": "How they communicate AT THIS STAGE. Example: 'They're pre-verbal but their Gemini moon makes them expressive. Mirror their sounds back. Your Pisces intuition catches what they can't say.'",
  
  "whatThisPhaseTeaches": "What THIS SPECIFIC PHASE is teaching the parent. Example: 'Your lesson right now is patience. Their Capricorn rising means milestones come on their schedule, not yours.'",
  
  "whatsComingNext": "Predictive insight about the next 1-2 months. Example: 'Around 9 months, their Aries independence will surge. Prepare for more boundary testing. Your Sag humor will be your best tool.'",
  
  "longTermEvolution": "How this relationship will evolve over years. Example: 'Two fire signs means lifelong adventure together. The intensity that challenges you now becomes your greatest bond as they grow.'"
}

Be specific, warm, and practical. Never generic. Reference actual sign qualities. The parent should feel seen and guided.`;

    console.log("Generating relationship insights for:", parentDesc, "and", childDesc);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: "You are an astrology expert who also deeply understands child development stages. You combine cosmic wisdom with practical parenting insights. Respond only with valid JSON. Be warm, specific, and age-appropriate." 
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
