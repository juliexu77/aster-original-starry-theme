import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, activities, babyName, babyAge, timezone, isInitial } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log("Timezone received:", timezone);
    console.log("Is initial request:", isInitial);

    // Build context from today's activities using the user's timezone
    const now = new Date();
    const todayActivities = activities?.filter((a: any) => {
      const activityDate = new Date(a.logged_at);
      return activityDate.toDateString() === now.toDateString();
    }) || [];

    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: timezone || 'UTC'
      });
    };

    const activitySummary = todayActivities.length > 0 
      ? `Today's activities for ${babyName || "baby"} (${babyAge || "unknown"} months old):\n${todayActivities.map((a: any) => {
          const time = formatTime(a.logged_at);
          if (a.type === "feed") return `- ${time}: Fed ${a.details?.quantity || ""}${a.details?.unit || ""}`;
          if (a.type === "nap") {
            const duration = a.details?.duration ? ` (${Math.round(a.details.duration / 60)} min)` : "";
            return `- ${time}: Nap${duration}`;
          }
          if (a.type === "diaper") return `- ${time}: Diaper change (${a.details?.diaperType || ""})`;
          if (a.type === "note") return `- ${time}: Note - ${a.details?.note || ""}`;
          return `- ${time}: ${a.type}`;
        }).join("\n")}`
      : "No activities logged yet today.";

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
            content: `You are a caring, knowledgeable pediatric assistant - think of yourself as a warm pediatrician who knows this family. You're comforting, personable, and evidence-based in your guidance.

${activitySummary}

IMPORTANT GUIDELINES:
- Reference specific activities and patterns you notice from today's data
- Be warm and reassuring, acknowledging the parents' efforts
- When giving daily summaries, focus on patterns, what's going well, and gentle suggestions
- Keep responses conversational - like talking to a trusted pediatrician over coffee
- For medical concerns, recommend consulting their pediatrician while offering general guidance
- Use the baby's name (${babyName}) naturally in conversation
- Consider the baby's age (${babyAge} months) for developmentally appropriate advice

${isInitial ? "This is the first message - provide a warm daily summary of how things are going based on today's activities. Keep it to 3-4 sentences, focusing on positives and any gentle observations." : "Provide personalized advice based on their question and the activity data."}` 
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