import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBabies } from "@/hooks/useBabies";

export interface WeeklyReading {
  headline: string;
  lunarContext: string;
  weeklyInsight: string;
  focusArea: string;
  gentleReminder: string;
  memberName: string;
  memberType: string;
  sunSign: string;
  moonSign: string | null;
  risingSign: string | null;
  weekStart: string;
  weekRange: string;
  lunarPhase: string;
  lunarEmoji: string;
  generatedAt: string;
  isLunarPhaseReading?: boolean;
}

// Get current week start (Monday)
function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Calculate lunar phase data with significant phase detection
function getLunarPhaseData(): { 
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
  
  // Check if we're within the new or full moon phase windows
  const isNewMoon = daysSinceNew < 1.85;
  const isFullMoon = daysSinceNew >= 14.77 && daysSinceNew < 16.61;
  const isSignificant = isNewMoon || isFullMoon;
  
  return { 
    isSignificant, 
    significantPhaseDate: isNewMoon ? newMoonDate : (isFullMoon ? fullMoonDate : null)
  };
}

// Get cache key - either week start or lunar phase date
function getCacheKey(): string {
  const lunarData = getLunarPhaseData();
  if (lunarData.isSignificant && lunarData.significantPhaseDate) {
    return lunarData.significantPhaseDate;
  }
  return getCurrentWeekStart();
}

export const useWeeklyReading = (
  memberId: string | null,
  memberData: {
    name: string;
    type: 'child' | 'parent' | 'partner';
    birthday: string;
    birth_time?: string | null;
    birth_location?: string | null;
    sunSign?: string | null;
    moonSign?: string | null;
    risingSign?: string | null;
  } | null
) => {
  const { babies } = useBabies();
  const [reading, setReading] = useState<WeeklyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get household ID from babies
  const getHouseholdId = useCallback(async () => {
    if (babies.length > 0) {
      const { data, error: fetchError } = await supabase
        .from('babies')
        .select('household_id')
        .eq('id', babies[0].id)
        .single();

      if (fetchError) {
        console.error('Error fetching household ID:', fetchError);
        throw new Error('Failed to load family data. Please try again.');
      }

      if (!data?.household_id) {
        throw new Error('No household found for this family member.');
      }

      return data.household_id;
    }
    return null;
  }, [babies]);

  // Fetch or generate weekly reading
  const fetchWeeklyReading = useCallback(async () => {
    if (!memberId || !memberData?.birthday) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const householdId = await getHouseholdId();
      if (!householdId) {
        setLoading(false);
        return;
      }

      const cacheKey = getCacheKey();

      // First check cache in database using lunar-aware cache key
      const { data: cached } = await supabase
        .from('weekly_readings')
        .select('reading_content')
        .eq('household_id', householdId)
        .eq('member_id', memberId)
        .eq('week_start', cacheKey)
        .maybeSingle();

      if (cached?.reading_content) {
        setReading(cached.reading_content as unknown as WeeklyReading);
        setLoading(false);
        return;
      }

      // Generate new reading via edge function
      const { data, error: funcError } = await supabase.functions.invoke('generate-weekly-reading', {
        body: {
          memberId,
          memberData: {
            name: memberData.name,
            type: memberData.type,
            birthday: memberData.birthday,
            birth_time: memberData.birth_time,
            birth_location: memberData.birth_location,
            sunSign: memberData.sunSign,
            moonSign: memberData.moonSign,
            risingSign: memberData.risingSign,
          },
          householdId,
        }
      });

      if (funcError) {
        throw funcError;
      }

      if (data?.reading) {
        setReading(data.reading);
      }
    } catch (err) {
      console.error('Error fetching weekly reading:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weekly reading');
    } finally {
      setLoading(false);
    }
  }, [memberId, memberData, getHouseholdId]);

  useEffect(() => {
    fetchWeeklyReading();
  }, [fetchWeeklyReading]);

  return {
    reading,
    loading,
    error,
    refetch: fetchWeeklyReading,
  };
};
