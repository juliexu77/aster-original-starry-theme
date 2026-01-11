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
    
    // Format intake as natural conversation the astrologer had
    let clientSession = '';
    if (intakeType === 'voice' && intakeData?.transcript) {
      clientSession = `The client shared: "${intakeData.transcript}"`;
    } else if (intakeType === 'skip' || !intakeData) {
      clientSession = `The client is seeking general cosmic guidance for this period.`;
    } else {
      // Questions intake - safely handle potentially missing arrays
      const q1 = Array.isArray(intakeData?.q1) ? intakeData.q1.join(', ') : (intakeData?.q1 || 'general guidance');
      const q2 = Array.isArray(intakeData?.q2) ? intakeData.q2.join(', ') : (intakeData?.q2 || 'their current state');
      const q3 = intakeData?.q3 || 'cosmic perspective';
      const q4 = intakeData?.q4 || '';
      clientSession = `During the consultation, the client mentioned focusing on: ${q1}. They've observed: ${q2}. They're seeking: ${q3}.${q4 ? ` They asked: "${q4}"` : ''}`;
    }

    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const yearNum = currentDate.getFullYear();

    // Calculate Chinese zodiac if needed
    let chineseZodiacInfo = '';
    let chineseAnimal = '';
    let chineseElement = '';
    if (zodiacSystem === 'eastern' || zodiacSystem === 'both') {
      // Pass full birthday to account for lunar new year
      const zodiacData = getChineseZodiac(memberData.birthday);
      chineseAnimal = zodiacData.animal;
      chineseElement = zodiacData.element;
      chineseZodiacInfo = `${chineseElement} ${chineseAnimal}`;
    }

    // Current year's Chinese zodiac for context
    const currentYearZodiac = getChineseZodiac(yearNum);

    // Period-specific adjustments
    const isYearly = period === 'year';

    // Build Eastern zodiac specific sections
    let easternSections = '';
    if (zodiacSystem === 'eastern' || zodiacSystem === 'both') {
      easternSections = `
    {"title": "Your ${chineseAnimal} Nature", "content": "2-3 paragraphs exploring how the ${chineseElement} ${chineseAnimal} energy manifests, including strengths, shadow aspects, and how ${yearNum} (Year of the ${currentYearZodiac.element} ${currentYearZodiac.animal}) interacts with their chart"},
    {"title": "Elemental Balance", "content": "2 paragraphs on their ${chineseElement} element - how to nurture it, what depletes it, and practical ways to stay in harmony"},`;
    }

    // Zodiac system specific framing
    let zodiacFramework = '';
    if (zodiacSystem === 'western') {
      zodiacFramework = `You practice Western astrology with deep knowledge of planetary transits, houses, and aspects. You naturally reference Sun, Moon, and Rising sign dynamics.`;
    } else if (zodiacSystem === 'eastern') {
      zodiacFramework = `You practice Chinese astrology with mastery of the 12 animal signs, five elements, and the complex interplay of yearly, monthly, and hourly pillars. This client is a ${chineseZodiacInfo}. This is the Year of the ${currentYearZodiac.element} ${currentYearZodiac.animal} (${yearNum}). You understand clash animals, compatible allies, secret friends, and elemental cycles.`;
    } else {
      zodiacFramework = `You are a rare practitioner fluent in both Western and Chinese astrology. You see how this client's Western chart (their Sun sign, transits) and their Chinese chart (${chineseZodiacInfo}) create a unified picture. This is the Year of the ${currentYearZodiac.element} ${currentYearZodiac.animal}. You weave both systems seamlessly, never treating them as separate.`;
    }

    const systemPrompt = `You are a gifted, experienced astrologer with decades of practice. You have an intuitive gift - you sense things about your clients that you weave naturally into readings without explaining how you know.

${zodiacFramework}

Your style:
- Speak as if you're sitting across from the client, sharing wisdom accumulated over years
- Never say "based on what you told me" or "according to your responses" - you simply KNOW these things
- Reference specific details naturally, as observations or intuitions, not as data points
- Be warm but authoritative. You've seen these patterns before.
- Blend the cosmic with the practical seamlessly
- For children: You understand child development intimately and see how celestial patterns influence their unfolding
- For parents: You see the whole person, not just the parent role

CRITICAL: Never explicitly reference "intake responses," "app data," "calibration data," or anything that sounds like you're reading from a file. You are a wise counselor who simply perceives.`;

    const contextNarrative = contextData.length > 0 
      ? `\n\n[Your intuitive sense about this client - integrate naturally, never reference directly:\n${contextData.join('\n')}]`
      : '';

    // Build natal chart description using passed signs or calculated sun sign
    const sunSign = memberData.sunSign || getSunSign(memberData.birthday);
    const moonSign = memberData.moonSign || null;
    const risingSign = memberData.risingSign || null;
    
    // Build the natal chart description for the prompt
    let natalChartDescription = `Sun Sign: ${sunSign}`;
    if (moonSign) {
      natalChartDescription += `\nMoon Sign: ${moonSign} (emotional nature, inner world, instinctual responses)`;
    }
    if (risingSign) {
      natalChartDescription += `\nRising Sign/Ascendant: ${risingSign} (how they present to the world, first impressions, physical vitality)`;
    }
    
    console.log('Natal chart for reading:', { sunSign, moonSign, risingSign });

    const userPrompt = `Create a ${isYearly ? 'yearly' : 'monthly'} reading for ${memberData.name}.

[NATAL CHART - This is their personal birth chart, use it throughout the reading:]
${natalChartDescription}
Birthday: ${memberData.birthday}${memberData.birth_time ? `, born at ${memberData.birth_time}` : ''}${memberData.birth_location ? ` in ${memberData.birth_location}` : ''}
${zodiacSystem !== 'western' ? `Chinese zodiac: ${chineseZodiacInfo}` : ''}

IMPORTANT: This reading MUST reflect their specific natal placements. A ${sunSign} Sun${moonSign ? ` with ${moonSign} Moon` : ''}${risingSign ? ` and ${risingSign} Rising` : ''} will experience transits differently than someone with different placements. Reference their specific signs throughout.

Reading for: ${isYearly ? yearNum : `${monthName} ${yearNum}`}

[${clientSession}]
${contextNarrative}

Write as if speaking directly to ${isChild ? 'the parents about their child' : 'the client'}. Generate JSON:

{
  "astrologicalSeason": "${isYearly ? `Year of powerful ${zodiacSystem === 'western' ? 'transformation' : currentYearZodiac.animal + ' energy'}` : 'e.g., Capricorn Season'}",
  "lunarPhase": "${isYearly ? 'Key lunar themes for the year' : 'Current lunar phase and meaning'}",
  ${zodiacSystem !== 'western' ? `"chineseZodiac": "${chineseAnimal}",\n  "chineseElement": "${chineseElement}",` : ''}
  "opening": "3-4 sentences. Speak directly and warmly. Set the cosmic scene while acknowledging what you sense about their current situation - don't explain how you know, just show that you understand.",
  "sections": [
    ${zodiacSystem !== 'western' ? easternSections : ''}
    {"title": "${isChild ? 'Their Energy Right Now' : 'Your Energy This ' + (isYearly ? 'Year' : 'Month')}", "content": "2-3 paragraphs. Describe what you see in their chart and how it's manifesting. Be specific."},
    {"title": "${isChild ? 'Growth & Unfolding' : 'Purpose & Direction'}", "content": "2-3 paragraphs on development/ambition. For children, speak to their developmental moment with astrological insight."},
    {"title": "${isChild ? 'Daily Rhythms' : 'Home & Heart'}", "content": "2-3 paragraphs on practical daily life, sleep/feeding for children, family dynamics for adults."},
    {"title": "Guidance", "content": "2-3 paragraphs with 3-5 specific suggestions. Frame as astrological wisdom, not advice from a form."},
    {"title": "Shadows to Navigate", "content": "1-2 paragraphs on challenges ahead. Be honest but compassionate."},
    {"title": "${isChild ? 'Whats Emerging' : 'Connection & Love'}", "content": "1-2 paragraphs on what's coming/relationships"}${isYearly ? `,
    {"title": "Seasonal Map", "content": "Quarter-by-quarter overview of the year's energies"}` : ''}
  ],
  "significantDates": [
    {"title": "Venus conjunct your Sun (Feb 3-10)", "details": "Explain the transit AND connect it directly to what they're focused on from the intake. Example: 'This activates your 5th house of creativity - ideal timing for that writing project you mentioned wanting to prioritize.'"},
    {"title": "Saturn square your Moon (Mar 15-Apr 2)", "details": "Name the challenge AND tie it to their stated concerns. Example: 'Emotional pressure in your domestic sector - this may intensify the work-life balance tension you're navigating.'"},
    {"title": "Jupiter trine your Rising (Apr 20-May 5)", "details": "Describe the opportunity AND link to their goals. Example: 'Expansion in how others perceive you - leverage this for the career transition you're contemplating.'"}
  ]
  
  CRITICAL for significantDates - CONNECT TO THEIR INTAKE:
  
  Each "details" field MUST:
  1. Name the astrological aspect and which house/area it activates
  2. Connect it directly to something they mentioned in the intake (their focus areas, concerns, questions, observations)
  3. Give specific guidance on what to do or watch for
  
  Example format: "[Transit explanation] - [connection to their stated focus]. [Actionable guidance]."
  
  Bad example: "Venus enters your 7th house bringing harmony to relationships."
  Good example: "Venus enters your 7th house bringing harmony to partnerships - this is prime timing for the deeper connection with your partner you mentioned wanting to cultivate. Plan a meaningful date or conversation around Feb 14th when this energy peaks."
  
  Calculate 5-8 KEY PLANETARY TRANSITS TO THEIR PERSONAL CHART:
  - Transiting planets aspecting THEIR natal Sun, Moon, Rising
  - Format: "Planet aspect their Point (date range)"
  - Include: conjunctions, trines, squares, oppositions to their natal placements
  - House ingresses of Jupiter, Saturn, or outer planets
  - Retrogrades affecting their key houses
  - Lunations (New/Full Moons) in their personal houses
  ${zodiacSystem !== 'western' ? `- For Chinese astrology: clash days, ally animal periods, and element balance timing` : ''}
}

Remember: You KNOW this person and what they're focused on. Every significant date should feel like you've studied their chart AND listened to their concerns, then identified the cosmic moments that matter most for THEIR specific journey.`;

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

    // Use the signs we already calculated above
    const finalSunSign = sunSign;
    const finalMoonSign = moonSign;
    const finalRisingSign = risingSign;
    
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
      sunSign: finalSunSign,
      moonSign: finalMoonSign,
      risingSign: finalRisingSign,
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

// Lunar New Year dates (month, day) for years 1900-2050+
// Chinese zodiac changes on Lunar New Year, NOT January 1
const LUNAR_NEW_YEAR_DATES: Record<number, [number, number]> = {
  1900: [1, 31], 1901: [2, 19], 1902: [2, 8], 1903: [1, 29], 1904: [2, 16],
  1905: [2, 4], 1906: [1, 25], 1907: [2, 13], 1908: [2, 2], 1909: [1, 22],
  1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6], 1914: [1, 26],
  1915: [2, 14], 1916: [2, 3], 1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
  1920: [2, 20], 1921: [2, 8], 1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
  1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23], 1929: [2, 10],
  1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26], 1934: [2, 14],
  1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
  1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
  1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3], 2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19],
  2035: [2, 8], 2036: [1, 28], 2037: [2, 15], 2038: [2, 4], 2039: [1, 24],
  2040: [2, 12], 2041: [2, 1], 2042: [1, 22], 2043: [2, 10], 2044: [1, 30],
  2045: [2, 17], 2046: [2, 6], 2047: [1, 26], 2048: [2, 14], 2049: [2, 2],
  2050: [1, 23]
};

function getChineseZodiacYear(birthday: string): number {
  // Determine the Chinese zodiac year accounting for Lunar New Year
  const [year, month, day] = birthday.split('-').map(Number);
  const lnyDate = LUNAR_NEW_YEAR_DATES[year];
  
  // If we don't have the LNY date for this year, approximate (LNY is usually late Jan/early Feb)
  if (!lnyDate) {
    // Fallback: assume Feb 5 as average LNY
    if (month < 2 || (month === 2 && day < 5)) {
      return year - 1;
    }
    return year;
  }
  
  const [lnyMonth, lnyDay] = lnyDate;
  
  // If birthday is before Lunar New Year, they belong to the previous year's zodiac
  if (month < lnyMonth || (month === lnyMonth && day < lnyDay)) {
    return year - 1;
  }
  
  return year;
}

function getChineseZodiac(birthYearOrDate: number | string): { animal: string; element: string } {
  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
  
  // Element cycle starting from 1900 (Metal): Metal, Water, Wood, Fire, Earth (each element covers 2 years)
  const elements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
  
  // Determine the zodiac year (accounting for lunar calendar if full date provided)
  let zodiacYear: number;
  if (typeof birthYearOrDate === 'string' && birthYearOrDate.includes('-')) {
    zodiacYear = getChineseZodiacYear(birthYearOrDate);
  } else {
    zodiacYear = typeof birthYearOrDate === 'number' ? birthYearOrDate : parseInt(birthYearOrDate, 10);
  }
  
  // Chinese zodiac starts from 1900 which was Year of the Rat
  const baseYear = 1900;
  const animalIndex = (zodiacYear - baseYear) % 12;
  const elementIndex = (zodiacYear - baseYear) % 10;
  
  // Handle negative modulo for years before 1900
  const animal = animals[((animalIndex % 12) + 12) % 12];
  const element = elements[((elementIndex % 10) + 10) % 10];
  
  return { animal, element };
}
