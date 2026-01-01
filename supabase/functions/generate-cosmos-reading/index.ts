import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId, memberData, intakeType, intakeData, householdId, monthYear } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the prompt based on member type and intake
    const isChild = memberData.type === 'child';
    const intakeContext = intakeType === 'voice' 
      ? `User voice message transcript: "${intakeData.transcript}"`
      : `User intake responses:
Q1 (Focus areas): ${intakeData.q1.join(', ')}
Q2 (Energy observations): ${intakeData.q2.join(', ')}
Q3 (Reading goal): ${intakeData.q3}
${intakeData.q4 ? `Q4 (Additional context): ${intakeData.q4}` : ''}`;

    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

    const systemPrompt = `You are an expert astrologer creating personalized monthly readings. Write with authority but warmth, mystical but grounded. Be specific, never vague. Weave astrology with practical reality. For children, blend developmental psychology with astrology. For adults, acknowledge their full personhood beyond parenting.`;

    const userPrompt = `Create a personalized monthly astrological reading for ${memberData.name} (${isChild ? 'child' : 'adult'}).

Birth Data:
- Birthday: ${memberData.birthday}
- Birth time: ${memberData.birth_time || 'Unknown'}
- Birth location: ${memberData.birth_location || 'Unknown'}

Current Month: ${monthName} ${currentDate.getFullYear()}

${intakeContext}

Generate a JSON response with this exact structure:
{
  "astrologicalSeason": "e.g. Capricorn Season",
  "lunarPhase": "e.g. Waxing Gibbous",
  "opening": "3-4 sentences setting cosmic weather and acknowledging their concerns",
  "sections": [
    {"title": "${isChild ? 'Energy & Temperament' : 'Energy & Focus'}", "content": "2-3 paragraphs"},
    {"title": "${isChild ? 'Development & Learning' : 'Work & Ambition'}", "content": "2-3 paragraphs"},
    {"title": "${isChild ? 'Rhythm & Routine' : 'Parenting & Family'}", "content": "2-3 paragraphs"},
    {"title": "${isChild ? 'Parenting Guidance' : 'Self-Care & Growth'}", "content": "2-3 paragraphs with actionable suggestions"},
    {"title": "Watch For", "content": "1-2 paragraphs about challenging transits"},
    {"title": "${isChild ? "What's Coming" : 'Relationships'}", "content": "1-2 paragraphs"}
  ],
  "significantDates": ["Jan 15 - Jupiter direct: expect mood lift", "Jan 22 - New Moon in Aquarius: fresh starts"]
}

Make the reading deeply personalized based on the intake responses. Address their specific concerns naturally throughout.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const readingData = JSON.parse(jsonMatch[0]);

    // Calculate signs (simplified - real implementation would use ephemeris)
    const sunSign = getSunSign(memberData.birthday);
    
    const reading = {
      id: crypto.randomUUID(),
      monthYear,
      memberName: memberData.name,
      memberType: memberData.type,
      sunSign,
      moonSign: null,
      risingSign: null,
      ...readingData,
      generatedAt: new Date().toISOString()
    };

    // Save to database
    const { error: dbError } = await supabase
      .from('cosmos_readings')
      .upsert({
        household_id: householdId,
        member_id: memberId,
        member_type: memberData.type,
        month_year: monthYear,
        reading_content: reading,
        intake_type: intakeType,
        intake_responses: intakeData,
        generated_at: new Date().toISOString()
      }, {
        onConflict: 'household_id,member_id,month_year'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(JSON.stringify({ reading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getSunSign(birthday: string): string {
  const [year, month, day] = birthday.split('-').map(Number);
  const signs = [
    { sign: 'capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'pisces', start: [2, 19], end: [3, 20] },
    { sign: 'aries', start: [3, 21], end: [4, 19] },
    { sign: 'taurus', start: [4, 20], end: [5, 20] },
    { sign: 'gemini', start: [5, 21], end: [6, 20] },
    { sign: 'cancer', start: [6, 21], end: [7, 22] },
    { sign: 'leo', start: [7, 23], end: [8, 22] },
    { sign: 'virgo', start: [8, 23], end: [9, 22] },
    { sign: 'libra', start: [9, 23], end: [10, 22] },
    { sign: 'scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
  ];
  
  for (const { sign, start, end } of signs) {
    if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
      return sign;
    }
  }
  return 'capricorn';
}
