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
    const { memberId, memberData, intakeType, intakeData, householdId, monthYear, readingOptions } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Reading options with defaults
    const period = readingOptions?.period || 'month';
    const zodiacSystem = readingOptions?.zodiacSystem || 'western';

    console.log('Generating cosmos reading for:', memberId, memberData.name, 'Period:', period, 'System:', zodiacSystem);

    // ========================================
    // FETCH ALL CONTEXTUAL DATA FROM THE APP
    // ========================================
    
    const isChild = memberData.type === 'child';
    let contextData: string[] = [];

    // 1. For children: Fetch calibration data (developmental info, sleep patterns, challenges)
    if (isChild && memberId !== 'parent' && memberId !== 'partner') {
      const { data: calibration } = await supabase
        .from('baby_calibrations')
        .select('*')
        .eq('baby_id', memberId)
        .maybeSingle();

      if (calibration) {
        console.log('Found calibration data for child:', calibration);
        
        if (calibration.physical_skills?.length > 0) {
          contextData.push(`Physical skills observed: ${calibration.physical_skills.join(', ')}`);
        }
        if (calibration.language_sounds) {
          contextData.push(`Language development: ${calibration.language_sounds}`);
        }
        if (calibration.sleep_naps) {
          contextData.push(`Sleep pattern: ${calibration.sleep_naps}`);
        }
        if (calibration.feeding_solids) {
          contextData.push(`Feeding stage: ${calibration.feeding_solids}`);
        }
        if (calibration.social_separation) {
          contextData.push(`Social/separation behavior: ${calibration.social_separation}`);
        }
        if (calibration.current_challenge) {
          contextData.push(`Current parenting challenge: ${calibration.current_challenge}`);
        }
        if (calibration.emerging_early_flags && Object.keys(calibration.emerging_early_flags).length > 0) {
          contextData.push(`Developmental flags noted: ${JSON.stringify(calibration.emerging_early_flags)}`);
        }
      }
    }

    // 2. Fetch all babies in household (for sibling context and family load assessment)
    const { data: allBabies } = await supabase
      .from('babies')
      .select('id, name, birthday, birth_time, birth_location')
      .eq('household_id', householdId);

    if (allBabies && allBabies.length > 0) {
      // Calculate ages for all children
      const childrenWithAges = allBabies
        .filter(b => b.birthday)
        .map(b => ({
          ...b,
          ageMonths: Math.floor((new Date().getTime() - new Date(b.birthday).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
        }));

      // Family load assessment
      const numChildren = childrenWithAges.length;
      const underTwo = childrenWithAges.filter(c => c.ageMonths < 24).length;
      const underFive = childrenWithAges.filter(c => c.ageMonths < 60).length;
      const schoolAge = childrenWithAges.filter(c => c.ageMonths >= 60).length;
      
      let familyLoadDescription = '';
      if (underTwo >= 2) {
        familyLoadDescription = `Very demanding phase: ${underTwo} children under 2 years old - sleep deprivation likely, constant physical demands, little personal time`;
      } else if (underTwo === 1 && underFive >= 2) {
        familyLoadDescription = `High-demand phase: baby plus young toddler(s) - juggling infant needs with toddler energy and attention needs`;
      } else if (underTwo === 1) {
        familyLoadDescription = `Baby phase: one infant requiring intensive care - disrupted sleep, feeding demands, adjustment period`;
      } else if (underFive >= 2 && schoolAge === 0) {
        familyLoadDescription = `Active toddler/preschool phase: ${underFive} young children - high supervision needs, sibling dynamics emerging`;
      } else if (schoolAge > 0 && underFive > 0) {
        familyLoadDescription = `Mixed ages phase: balancing school-age independence with younger child needs - logistical complexity`;
      } else if (schoolAge >= 2) {
        familyLoadDescription = `Established family phase: ${schoolAge} school-age children - more independence but emotional complexity increases`;
      } else if (numChildren === 1 && childrenWithAges[0]?.ageMonths >= 24) {
        familyLoadDescription = `Single child beyond infancy - more focused attention possible, developing relationship deepens`;
      }

      if (familyLoadDescription) {
        contextData.push(`Family situation: ${familyLoadDescription}`);
      }
      
      contextData.push(`Total children: ${numChildren}`);

      // Sibling info
      const siblings = childrenWithAges.filter(b => b.id !== memberId);
      if (siblings.length > 0) {
        const siblingInfo = siblings.map(s => {
          const age = calculateAge(s.birthday);
          const sign = getSunSign(s.birthday);
          return `${s.name} (${age}, ${sign})`;
        }).join(', ');
        contextData.push(`Siblings: ${siblingInfo}`);
      }

      // For the target child, calculate their exact age
      if (isChild) {
        const targetBaby = childrenWithAges.find(b => b.id === memberId);
        if (targetBaby?.birthday) {
          const ageInfo = calculateDetailedAge(targetBaby.birthday);
          contextData.push(`Child's age: ${ageInfo.description}`);
          contextData.push(`Developmental stage: ${ageInfo.stage}`);
        }
      }
    }

    // 3. Fetch parent profile data (for adult readings or parent-child context)
    const { data: householdMembers } = await supabase
      .from('household_members')
      .select('user_id, role')
      .eq('household_id', householdId);

    if (householdMembers && householdMembers.length > 0) {
      const ownerMember = householdMembers.find(m => m.role === 'owner');
      if (ownerMember) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', ownerMember.user_id)
          .maybeSingle();

        if (profile) {
          // For child readings, add parent context
          if (isChild && profile.birthday) {
            const parentSign = getSunSign(profile.birthday);
            contextData.push(`Parent's sun sign: ${parentSign}`);
          }
          
          // Add partner info if available
          if (profile.partner_birthday) {
            const partnerSign = getSunSign(profile.partner_birthday);
            const partnerName = profile.partner_name || 'Partner';
            contextData.push(`Partner: ${partnerName} (${partnerSign})`);
          }

          // For adult readings (parent or partner)
          if (!isChild && memberId === 'parent' && profile.birthday) {
            contextData.push(`Number of children: ${allBabies?.length || 0}`);
          }
        }
      }
    }

    // 4. Recent sleep activity (for child readings)
    if (isChild && memberId !== 'parent' && memberId !== 'partner') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: sleepData } = await supabase
        .from('sleep_activities')
        .select('start_time, end_time, is_night_sleep')
        .eq('baby_id', memberId)
        .gte('start_time', oneWeekAgo.toISOString())
        .order('start_time', { ascending: false })
        .limit(20);

      if (sleepData && sleepData.length > 0) {
        const nightSleeps = sleepData.filter(s => s.is_night_sleep);
        const naps = sleepData.filter(s => !s.is_night_sleep);
        contextData.push(`Recent week: ${nightSleeps.length} night sleeps logged, ${naps.length} naps logged`);
      }
    }

    // ========================================
    // BUILD THE PROMPT WITH ALL CONTEXT
    // ========================================
    
    const intakeContext = intakeType === 'voice' 
      ? `User voice message transcript: "${intakeData.transcript}"`
      : `User intake responses:
Q1 (Focus areas): ${intakeData.q1.join(', ')}
Q2 (Energy observations): ${intakeData.q2.join(', ')}
Q3 (Reading goal): ${intakeData.q3}
${intakeData.q4 ? `Q4 (Additional context): ${intakeData.q4}` : ''}`;

    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const yearNum = currentDate.getFullYear();

    // Build context section
    const appContextSection = contextData.length > 0 
      ? `\n\nAdditional Context from App Data:\n${contextData.map(c => `- ${c}`).join('\n')}`
      : '';

    // Calculate Chinese zodiac if needed
    let chineseZodiacInfo = '';
    if (zodiacSystem === 'eastern' || zodiacSystem === 'both') {
      const birthYear = new Date(memberData.birthday).getFullYear();
      const { animal, element } = getChineseZodiac(birthYear);
      chineseZodiacInfo = `\n\nChinese Zodiac: ${element} ${animal} (born ${birthYear})`;
    }

    // Period-specific prompt adjustments
    const periodDescription = period === 'year' 
      ? `yearly reading for ${yearNum}` 
      : `monthly reading for ${monthName} ${yearNum}`;
    
    const periodGuidance = period === 'year'
      ? 'Focus on major themes, seasons of growth, and overarching energies for the entire year. Include quarterly highlights.'
      : 'Focus on the specific energies and opportunities for this month with weekly nuances where relevant.';

    // Zodiac system prompt adjustments
    let zodiacPrompt = '';
    if (zodiacSystem === 'western') {
      zodiacPrompt = 'Use Western astrology (Sun, Moon, Rising signs) as the primary framework.';
    } else if (zodiacSystem === 'eastern') {
      zodiacPrompt = `Use Chinese astrology as the primary framework. ${chineseZodiacInfo}\nFocus on the animal sign characteristics, elemental influences, and Chinese astrological cycles (e.g., lucky/unlucky years, clash animals, compatible energies).`;
    } else {
      zodiacPrompt = `Blend both Western and Chinese astrology. ${chineseZodiacInfo}\nIntegrate insights from both systems, noting where they align or create interesting tensions.`;
    }

    const systemPrompt = `You are an expert astrologer creating personalized ${period === 'year' ? 'yearly' : 'monthly'} readings. Write with authority but warmth, mystical but grounded. Be specific, never vague. Weave astrology with practical reality.

${zodiacPrompt}

${periodGuidance}

For children: Blend developmental psychology with astrology. Reference their specific developmental stage and any challenges the family is experiencing. Make guidance age-appropriate.

For adults: Acknowledge their full personhood beyond parenting. Reference their family dynamics and relationship with their children where relevant.

Use ALL the contextual data provided to make the reading deeply personal and relevant.`;

    const userPrompt = `Create a personalized ${periodDescription} for ${memberData.name} (${isChild ? 'child' : 'adult'}).

Birth Data:
- Birthday: ${memberData.birthday}
- Birth time: ${memberData.birth_time || 'Unknown'}
- Birth location: ${memberData.birth_location || 'Unknown'}
${chineseZodiacInfo}

Reading Type: ${period === 'year' ? 'YEARLY OVERVIEW' : 'MONTHLY GUIDANCE'}
Zodiac System: ${zodiacSystem === 'both' ? 'Western + Chinese' : zodiacSystem === 'eastern' ? 'Chinese' : 'Western'}

${intakeContext}
${appContextSection}

Generate a JSON response with this exact structure:
{
  "astrologicalSeason": "${period === 'year' ? 'Year of the [relevant theme]' : 'e.g. Capricorn Season'}",
  "lunarPhase": "${period === 'year' ? 'Yearly lunar themes' : 'e.g. Waxing Gibbous'}",
  ${zodiacSystem !== 'western' ? `"chineseZodiac": "e.g. Wood Dragon",\n  "chineseElement": "e.g. Wood",` : ''}
  "opening": "3-4 sentences setting cosmic weather and acknowledging their current situation based on the context provided",
  "sections": [
    {"title": "${isChild ? 'Energy & Temperament' : 'Energy & Focus'}", "content": "2-3 paragraphs. ${isChild ? 'Reference their developmental stage and recent patterns.' : 'Reference their parenting journey and family dynamics.'}${period === 'year' ? ' Include seasonal variations throughout the year.' : ''}"},
    {"title": "${isChild ? 'Development & Learning' : 'Work & Ambition'}", "content": "2-3 paragraphs. ${isChild ? 'Be specific about what developmental leaps to expect based on their age.' : 'Reference their life stage as a parent.'}"},
    {"title": "${isChild ? 'Rhythm & Routine' : 'Parenting & Family'}", "content": "2-3 paragraphs. ${isChild ? 'Address sleep and feeding based on their actual patterns if known.' : 'Reference their children and partner dynamics.'}"},
    {"title": "${isChild ? 'Parenting Guidance' : 'Self-Care & Growth'}", "content": "2-3 paragraphs with 3-5 specific, actionable suggestions aligned with the challenges they mentioned"},
    {"title": "Watch For", "content": "1-2 paragraphs about challenging transits and how they might manifest given this specific child/person"},
    {"title": "${isChild ? "What's Coming" : 'Relationships'}", "content": "1-2 paragraphs"}${period === 'year' ? `,
    {"title": "Quarterly Highlights", "content": "Brief overview of each quarter's distinct energy and opportunities"}` : ''}
  ],
  "significantDates": [${period === 'year' ? '"Q1: Jan-Mar key dates", "Q2: Apr-Jun key dates", "Q3: Jul-Sep key dates", "Q4: Oct-Dec key dates"' : '"Jan 15 - Jupiter direct: expect mood lift", "Jan 22 - New Moon in Aquarius: fresh starts"'}]
}

Make the reading deeply personalized based on ALL the data provided - intake responses AND app context. Address their specific concerns naturally throughout. Reference siblings, developmental stage, and family dynamics where relevant.`;

    console.log('Sending prompt with context items:', contextData.length);

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

    // Calculate signs
    const sunSign = getSunSign(memberData.birthday);
    
    // Calculate Chinese zodiac if needed
    let chineseData = {};
    if (zodiacSystem === 'eastern' || zodiacSystem === 'both') {
      const birthYear = new Date(memberData.birthday).getFullYear();
      const { animal, element } = getChineseZodiac(birthYear);
      chineseData = {
        chineseZodiac: animal,
        chineseElement: element
      };
    }
    
    const reading = {
      id: crypto.randomUUID(),
      monthYear,
      memberName: memberData.name,
      memberType: memberData.type,
      sunSign,
      moonSign: null,
      risingSign: null,
      ...chineseData,
      ...readingData,
      readingPeriod: period,
      zodiacSystem: zodiacSystem,
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

    console.log('Successfully generated reading for:', memberData.name);

    return new Response(JSON.stringify({ reading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
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

function calculateAge(birthday: string): string {
  const birth = new Date(birthday);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} old`;
  }
  const totalMonths = years * 12 + months;
  if (totalMonths > 0) {
    return `${totalMonths} month${totalMonths > 1 ? 's' : ''} old`;
  }
  const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  return weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} old` : `${days} days old`;
}

function calculateDetailedAge(birthday: string): { description: string; stage: string } {
  const birth = new Date(birthday);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  let description: string;
  let stage: string;

  if (years >= 2) {
    description = `${years} years, ${months % 12} months old`;
    stage = 'Toddler/Preschool - developing autonomy, language explosion, pretend play';
  } else if (months >= 12) {
    description = `${months} months old (${years} year${months > 12 ? `, ${months % 12} months` : ''})`;
    stage = 'Toddler - walking, first words, separation awareness, object permanence mastered';
  } else if (months >= 9) {
    description = `${months} months old`;
    stage = 'Late infancy - crawling/cruising, babbling, stranger anxiety, sleep regressions common';
  } else if (months >= 6) {
    description = `${months} months old`;
    stage = 'Mid infancy - sitting, solids introduction, social referencing, separation anxiety emerging';
  } else if (months >= 4) {
    description = `${months} months old`;
    stage = 'Early infancy - 4-month regression, rolling, social smiling, sleep consolidating';
  } else if (weeks >= 8) {
    description = `${weeks} weeks old`;
    stage = 'Early infancy - emerging from fourth trimester, more awake periods, developing circadian rhythm';
  } else {
    description = `${weeks} weeks old`;
    stage = 'Fourth trimester - adjusting to world, feeding frequently, irregular sleep, needs constant closeness';
  }

  return { description, stage };
}

function getChineseZodiac(year: number): { animal: string; element: string } {
  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
  
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  
  // Chinese zodiac starts from 1900 which was Year of the Rat
  const baseYear = 1900;
  const animalIndex = (year - baseYear) % 12;
  const elementIndex = (year - baseYear) % 10;
  
  // Handle negative modulo for years before 1900
  const animal = animals[((animalIndex % 12) + 12) % 12];
  const element = elements[((elementIndex % 10) + 10) % 10];
  
  return { animal, element };
}
