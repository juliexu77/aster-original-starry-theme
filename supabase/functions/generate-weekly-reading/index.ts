import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get current week start (Monday)
function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Calculate lunar phase data with dates
function getLunarPhaseData(): { 
  phase: string; 
  emoji: string; 
  isSignificant: boolean;
  significantPhaseDate: string | null;
} {
  const knownNewMoon = new Date('2024-01-11').getTime();
  const lunarCycle = 29.53 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const msSinceNew = (now - knownNewMoon) % lunarCycle;
  const daysSinceNew = msSinceNew / (24 * 60 * 60 * 1000);
  
  // Calculate the start of the current lunar cycle
  const cyclesSinceKnown = Math.floor((now - knownNewMoon) / lunarCycle);
  const currentCycleStart = new Date(knownNewMoon + cyclesSinceKnown * lunarCycle);
  
  // New Moon is at cycle start
  const newMoonDate = currentCycleStart.toISOString().split('T')[0];
  // Full Moon is approximately 14.77 days after new moon
  const fullMoonDate = new Date(currentCycleStart.getTime() + 14.77 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Check if we're within 1.5 days of new or full moon (significant phases)
  const isNewMoon = daysSinceNew < 1.85;
  const isFullMoon = daysSinceNew >= 14.77 && daysSinceNew < 16.61;
  const isSignificant = isNewMoon || isFullMoon;
  
  let phase: string;
  let emoji: string;
  let significantPhaseDate: string | null = null;
  
  if (daysSinceNew < 1.85) {
    phase = 'New Moon';
    emoji = '🌑';
    significantPhaseDate = newMoonDate;
  } else if (daysSinceNew < 7.38) {
    phase = 'Waxing Crescent';
    emoji = '🌒';
  } else if (daysSinceNew < 9.23) {
    phase = 'First Quarter';
    emoji = '🌓';
  } else if (daysSinceNew < 14.77) {
    phase = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (daysSinceNew < 16.61) {
    phase = 'Full Moon';
    emoji = '🌕';
    significantPhaseDate = fullMoonDate;
  } else if (daysSinceNew < 22.15) {
    phase = 'Waning Gibbous';
    emoji = '🌖';
  } else if (daysSinceNew < 23.99) {
    phase = 'Last Quarter';
    emoji = '🌗';
  } else {
    phase = 'Waning Crescent';
    emoji = '🌘';
  }
  
  return { phase, emoji, isSignificant, significantPhaseDate };
}

// Get the cache key - either week start or lunar phase date
function getCacheKey(lunarData: ReturnType<typeof getLunarPhaseData>): string {
  if (lunarData.isSignificant && lunarData.significantPhaseDate) {
    return lunarData.significantPhaseDate;
  }
  return getCurrentWeekStart();
}

// Get sun sign from birthday
function getSunSign(birthday: string): string {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

// Calculate age from birthday
function calculateAge(birthday: string): string {
  const birthDate = new Date(birthday);
  const now = new Date();
  const ageMs = now.getTime() - birthDate.getTime();
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  
  if (ageDays < 30) return `${ageDays} days old`;
  if (ageDays < 365) return `${Math.floor(ageDays / 30)} months old`;
  
  const years = Math.floor(ageDays / 365);
  const remainingMonths = Math.floor((ageDays % 365) / 30);
  if (remainingMonths > 0) return `${years} years, ${remainingMonths} months old`;
  return `${years} years old`;
}

// Get current lunar phase (simplified) - kept for backward compatibility
function getLunarPhase(): { phase: string; emoji: string } {
  const data = getLunarPhaseData();
  return { phase: data.phase, emoji: data.emoji };
}

// Get current planetary positions (simplified for weekly context)
function getCurrentTransits(): string[] {
  const now = new Date();
  const month = now.getMonth();
  
  // Simplified transit info based on general 2026 positions
  const transits: string[] = [];
  
  // Sun always transits through signs monthly
  const sunSigns = ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 
                    'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'];
  transits.push(`Sun in ${sunSigns[month]}`);
  
  // Add seasonal context
  if (month >= 2 && month <= 4) transits.push('Spring energy - new beginnings');
  if (month >= 5 && month <= 7) transits.push('Summer vitality - peak expression');
  if (month >= 8 && month <= 10) transits.push('Autumn harvest - reflection');
  if (month >= 11 || month <= 1) transits.push('Winter introspection - inner work');
  
  return transits;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberId, memberData, householdId, forceRegenerate } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get lunar phase data for cache key determination
    const lunarData = getLunarPhaseData();
    const cacheKey = getCacheKey(lunarData);
    
    console.log('Generating weekly reading for:', memberId, memberData.name, 'Cache key:', cacheKey, 'Lunar:', lunarData.phase, lunarData.isSignificant ? '(SIGNIFICANT)' : '');

    // Check if we already have a reading for this cache key (week or lunar phase)
    if (!forceRegenerate) {
      const { data: existing } = await supabase
        .from('weekly_readings')
        .select('*')
        .eq('household_id', householdId)
        .eq('member_id', memberId)
        .eq('week_start', cacheKey)
        .maybeSingle();

      if (existing) {
        console.log('Returning existing reading for cache key:', cacheKey);
        return new Response(JSON.stringify({ 
          reading: existing.reading_content,
          weekStart: cacheKey,
          cached: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get current cosmic context
    const lunar = { phase: lunarData.phase, emoji: lunarData.emoji };
    const transits = getCurrentTransits();
    const sunSign = memberData.sunSign || getSunSign(memberData.birthday);
    const isChild = memberData.type === 'child';
    
    // Build the week date range or lunar context
    let contextRange: string;
    if (lunarData.isSignificant) {
      const now = new Date();
      contextRange = `${lunarData.phase} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      const weekStartDate = new Date(cacheKey);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      contextRange = `${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    // Build natal info
    let natalInfo = `Sun Sign: ${sunSign}`;
    if (memberData.moonSign) natalInfo += `, Moon in ${memberData.moonSign}`;
    if (memberData.risingSign) natalInfo += `, ${memberData.risingSign} Rising`;
    
    // Child age context
    let ageContext = '';
    if (isChild && memberData.birthday) {
      ageContext = `Age: ${calculateAge(memberData.birthday)}`;
    }

const systemPrompt = `You are a warm, intuitive astrologer providing brief weekly cosmic context. Your tone is conversational and grounded, like a wise friend sharing insights over coffee.

CRITICAL VOICE GUIDELINES:
- Keep it SHORT and focused. This is a quick weekly check-in, not a full reading.
- Be specific and practical. What to watch for THIS WEEK.
- No fluffy inspirational language. Speak plainly.
- For children: address the parents directly about their child.
- Reference their actual sun sign and current transits.

WRITING STYLE (MANDATORY):
- Never use em dashes (—). Use commas, periods, or rewrite the sentence.
- Never use semicolons. Use separate sentences instead.
- Avoid starting sentences with "This" or "It" when possible.
- No colons except in titles. Rewrite to avoid them in body text.
- Write short sentences. Mix in longer ones sparingly.
- Avoid words like "delve", "tapestry", "landscape", "beacon", "realm", "embark", "navigate", "embrace".
- Avoid phrases like "it's important to", "remember that", "don't hesitate to".
- Sound like a real person talking, not a press release.

You create personalized weekly cosmic snapshots. Just 2-3 paragraphs of insight.`;

    const userPrompt = `Create a brief weekly cosmic reading for ${memberData.name}.

NATAL CHART:
${natalInfo}
${ageContext ? `\n${ageContext}` : ''}

CURRENT COSMIC WEATHER:
- Lunar Phase: ${lunar.phase}
- ${transits.join('\n- ')}

This is for: ${contextRange}.${lunarData.isSignificant ? ` This is a ${lunarData.phase} reading - make it feel especially significant and appropriate for this lunar milestone.` : ''}

Generate a JSON response:
{
  "headline": "Short 3-5 word theme for the week (e.g., 'Patience Pays Off' or 'Creative Bursts Incoming')",
  "lunarContext": "One sentence about how this ${lunar.phase} affects ${isChild ? 'children' : 'you'}",
  "weeklyInsight": "2-3 paragraphs of personalized insight for ${memberData.name}. ${isChild ? 'Address the parents about what to notice with their child this week.' : 'Speak directly to them about their week ahead.'} Reference their ${sunSign} nature and how current transits interact with it. Be specific about days or energies to watch for.",
  "focusArea": "One specific thing to pay attention to this week",
  "gentleReminder": "One grounding thought or practical tip"
}

Keep the total text under 300 words. Be warm but concise.`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    // Call AI API
    let response;
    try {
      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    let rawContent = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }

    let readingContent;
    try {
      readingContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid response format from AI. Please try again.');
    }

    // Validate required fields
    const requiredFields = ['headline', 'lunarContext', 'weeklyInsight', 'focusArea', 'gentleReminder'];
    const missingFields = requiredFields.filter(field => !readingContent[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields in weekly reading:', missingFields);
      throw new Error('Incomplete reading generated. Please try again.');
    }
    
    // Add metadata
    const fullReading = {
      ...readingContent,
      memberName: memberData.name,
      memberType: memberData.type,
      sunSign,
      moonSign: memberData.moonSign || null,
      risingSign: memberData.risingSign || null,
      weekStart: cacheKey,
      weekRange: contextRange,
      isLunarPhaseReading: lunarData.isSignificant,
      lunarPhase: lunar.phase,
      lunarEmoji: lunar.emoji,
      generatedAt: new Date().toISOString(),
    };

    // Store in database (upsert)
    const { error: upsertError } = await supabase
      .from('weekly_readings')
      .upsert({
        household_id: householdId,
        member_id: memberId,
        member_type: memberData.type,
        week_start: cacheKey,
        reading_content: fullReading,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'household_id,member_id,week_start'
      });

    if (upsertError) {
      console.error('Error storing weekly reading:', upsertError);
    }

    return new Response(JSON.stringify({ 
      reading: fullReading,
      weekStart: cacheKey,
      cached: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating weekly reading:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
