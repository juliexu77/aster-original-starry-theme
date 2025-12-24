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

    const parentDesc = `${parent.name} (${parent.sunSign} Sun${parent.moonSign ? `, ${parent.moonSign} Moon` : ''})`;
    const childDesc = `${child.name} (${ageLabel} old, ${child.sunSign} Sun${child.moonSign ? `, ${child.moonSign} Moon` : ''})`;

    const prompt = `You are an expert in astrology and child development. Analyze the parent-child relationship between:

Parent: ${parentDesc}
Child: ${childDesc}

Provide deeply personalized insights in this JSON structure. Use ${child.name}'s name throughout. Be warm, affirming, and specific to their exact sign combinations:

{
  "hook": "A powerful 1-2 sentence opening that affirms why this parent is perfect for this child. Make it feel like a revelation.",
  "parentQualities": ["List 5-7 specific qualities this parent's sun/moon combination gives them for parenting this particular child"],
  "youreTheParentWho": ["List 4-5 phrases completing 'You're the parent who...' that describe what this parent uniquely provides"],
  "whatChildNeeds": ["List 5-6 specific things this child needs based on their chart, written as 'attunement', 'gentle boundaries', etc."],
  "whatYouAlreadyGive": "2-3 sentences affirming that the parent already provides what the child needs most",
  "currentPhaseInsight": "2-3 sentences about how this child's signs manifest at their current age (${ageLabel}), with specific developmental observations",
  "friction": ["List 3-4 potential friction points between these two charts and how to navigate them"],
  "deepConnection": "2-3 sentences about the profound cosmic connection between this parent-child pair",
  "cultivationTips": ["List 5-6 specific, actionable parenting tips for cultivating this child's unique gifts based on their chart. Each tip should be practical and tied to their zodiac qualities. Examples: 'Give them solo exploration time - Aquarius needs independence to develop their unique perspective', 'Create sensory-rich experiences - their Taurus moon craves texture, taste, and touch'"],
  "dailyRituals": ["List 3-4 simple daily rituals or practices that honor this child's astrological nature. Examples: 'Morning movement time - let their fire energy burn before expecting focus', 'Bedtime stories with imaginative elements for their Pisces dreaminess'"],
  "signStrengthsToNurture": ["List 4-5 innate strengths from their chart that you can actively nurture, with brief how-to. Examples: 'Natural leadership (Leo Sun) - give them age-appropriate responsibilities', 'Emotional intuition (Cancer Moon) - validate their feelings without fixing'"]
}

Be specific to their signs, not generic. Reference the actual astrological qualities. The tone should be warm, insightful, and reassuring—helping the parent understand why they're exactly right for this child and giving them practical guidance.`;

    console.log("Generating parent-child dynamics for:", parentDesc, "and", childDesc);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an astrology expert specializing in parent-child dynamics and child development. Respond only with valid JSON. Be warm, specific, and affirming." },
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

    console.log("Successfully generated parent-child dynamics");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-parent-child-dynamics error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
