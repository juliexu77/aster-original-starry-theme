import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, activities, babyName, babyAge } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context from activities
    const recentActivities = activities?.slice(-20) || [];
    const activitySummary = recentActivities.length > 0 
      ? `Recent activities for ${babyName || "baby"} (${babyAge || "unknown"} months old):\n${recentActivities.map((a: any) => {
          const time = new Date(a.logged_at).toLocaleTimeString();
          if (a.type === "feed") return `- ${time}: Fed ${a.details?.quantity || ""}${a.details?.unit || ""}`;
          if (a.type === "nap") return `- ${time}: Nap from ${a.details?.startTime || ""} to ${a.details?.endTime || ""}`;
          if (a.type === "diaper") return `- ${time}: Diaper change (${a.details?.diaperType || ""})`;
          return `- ${time}: ${a.type}`;
        }).join("\n")}`
      : "No recent activity data available.";

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
            content: `You are a warm, knowledgeable parenting assistant with expertise in infant care, sleep training, feeding, and child development. You have access to real-time data about the baby's activities.

${activitySummary}

Use this activity data to provide personalized, contextual advice. Reference specific patterns you notice (e.g., "I see the baby had 3 naps today..."). Keep responses concise but helpful. When discussing medical concerns, always recommend consulting with a pediatrician.` 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});