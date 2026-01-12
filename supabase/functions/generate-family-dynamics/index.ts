import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to calculate sun sign
const getSunSign = (birthday: string): string => {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

const getElement = (sign: string): string => {
  const elements: Record<string, string> = {
    Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
    Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
    Gemini: 'air', Libra: 'air', Aquarius: 'air',
    Cancer: 'water', Scorpio: 'water', Pisces: 'water',
  };
  return elements[sign] || 'fire';
};

const getModality = (sign: string): string => {
  const modalities: Record<string, string> = {
    Aries: 'cardinal', Cancer: 'cardinal', Libra: 'cardinal', Capricorn: 'cardinal',
    Taurus: 'fixed', Leo: 'fixed', Scorpio: 'fixed', Aquarius: 'fixed',
    Gemini: 'mutable', Virgo: 'mutable', Sagittarius: 'mutable', Pisces: 'mutable',
  };
  return modalities[sign] || 'cardinal';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { householdId, members } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    console.log('Generating family dynamics for household:', householdId);
    console.log('Members:', members.map((m: any) => m.name));

    // Build member profiles with astrological data
    const memberProfiles = members
      .filter((m: any) => m.birthday)
      .map((m: any) => {
        const sign = getSunSign(m.birthday);
        return {
          name: m.name,
          type: m.type,
          sign,
          element: getElement(sign),
          modality: getModality(sign),
        };
      });

    if (memberProfiles.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Need at least 2 members with birthdays' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate element and modality balance
    const elementCounts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
    const modalityCounts: Record<string, number> = { cardinal: 0, fixed: 0, mutable: 0 };

    memberProfiles.forEach((m: any) => {
      elementCounts[m.element]++;
      modalityCounts[m.modality]++;
    });

    const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0];
    const dominantModality = Object.entries(modalityCounts).sort((a, b) => b[1] - a[1])[0][0];

    const systemPrompt = `You are a gifted family astrologer who specializes in understanding family dynamics through the cosmic lens. You observe how different zodiac energies interact within a household and offer deeply insightful, grounded observations.

VOICE GUIDELINES:
- Speak as a wise friend observing the family, not a generic horoscope
- Be specific and concrete, not abstract or platitude-heavy
- Acknowledge both harmony and tension—real families have both
- For each insight, ground it in observable behavior, not just cosmic theory
- Vary sentence length. Mix brief observations with longer explorations
- Write warmly but honestly—families appreciate truth with kindness

BAD: "Your family has beautiful potential for growth and connection."
GOOD: "With three fire signs under one roof, dinner conversations probably never lack for passion. The challenge comes when everyone wants to be heard at once."

BAD: "The cosmic energies support your journey together."
GOOD: "Your Virgo's attention to detail might occasionally frustrate your Sagittarius's big-picture enthusiasm—but notice how they actually need each other."`;

    const memberList = memberProfiles.map((m: any) => 
      `- ${m.name} (${m.type}): ${m.sign} (${m.element}, ${m.modality})`
    ).join('\n');

    const userPrompt = `Generate a family dynamics reading for this household.

FAMILY MEMBERS:
${memberList}

ELEMENTAL BALANCE:
- Fire: ${elementCounts.fire} | Earth: ${elementCounts.earth} | Air: ${elementCounts.air} | Water: ${elementCounts.water}
- Dominant element: ${dominantElement}

MODALITY BALANCE:
- Cardinal (initiators): ${modalityCounts.cardinal} | Fixed (stabilizers): ${modalityCounts.fixed} | Mutable (adapters): ${modalityCounts.mutable}
- Dominant modality: ${dominantModality}

Generate a JSON response with this structure:
{
  "headline": "A poetic 5-10 word summary of this family's energy (e.g., 'Where fire meets water, steam rises')",
  "overview": "2-3 paragraphs describing the overall family dynamic. What's the general vibe? How do these signs typically interact day-to-day? What's the household energy like?",
  "strengths": [
    "Specific strength based on the sign combinations (1-2 sentences)",
    "Another specific strength (1-2 sentences)",
    "Third strength (1-2 sentences)"
  ],
  "tensions": [
    "Specific tension or challenge area with practical context (1-2 sentences)",
    "Another tension with how it might manifest (1-2 sentences)"
  ],
  "advice": "2-3 paragraphs of practical wisdom for this specific family. How can they leverage their cosmic chemistry? What practices might help? Be concrete.",
  "rituals": [
    "A specific family ritual or practice suited to their elemental mix (1-2 sentences)",
    "Another ritual suggestion (1-2 sentences)"
  ]
}

Remember: This is THEIR family, not a generic reading. Reference specific members by name when relevant.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON from response
    let dynamics;
    try {
      // Handle markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      dynamics = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse family dynamics');
    }

    console.log('Generated family dynamics successfully');

    return new Response(
      JSON.stringify({ 
        dynamics,
        elementBalance: elementCounts,
        modalityBalance: modalityCounts,
        memberProfiles 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating family dynamics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
