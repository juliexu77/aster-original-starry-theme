import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { CosmosReading, IntakeResponses, VoiceIntakeData, ReadingOptions } from "@/components/cosmos/types";

export const useCosmosReading = (memberId: string | null) => {
  const { user } = useAuth();
  const { babies } = useBabies();
  const [reading, setReading] = useState<CosmosReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Get current year
  const getCurrentYear = () => {
    return `${new Date().getFullYear()}`;
  };

  // Get household ID from babies
  const getHouseholdId = useCallback(async () => {
    if (babies.length > 0) {
      // Get household from first baby
      const { data } = await supabase
        .from('babies')
        .select('household_id')
        .eq('id', babies[0].id)
        .single();
      return data?.household_id;
    }
    return null;
  }, [babies]);

  // Fetch existing reading for current month or year
  const fetchReading = useCallback(async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const householdId = await getHouseholdId();
      
      if (!householdId) {
        setLoading(false);
        return;
      }

      const monthKey = getCurrentMonth();
      const yearKey = getCurrentYear();
      
      // Check for both monthly and yearly readings
      const { data, error: fetchError } = await supabase
        .from('cosmos_readings')
        .select('*')
        .eq('household_id', householdId)
        .eq('member_id', memberId)
        .in('month_year', [monthKey, yearKey])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching cosmos reading:', fetchError);
        setError(fetchError.message);
      } else if (data) {
        setReading(data.reading_content as unknown as CosmosReading);
      } else {
        setReading(null);
      }
    } catch (err) {
      console.error('Error in fetchReading:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [memberId, getHouseholdId]);

  // Generate new reading
  const generateReading = useCallback(async (
    intakeType: 'questions' | 'voice',
    intakeData: IntakeResponses | VoiceIntakeData,
    memberData: {
      name: string;
      type: 'child' | 'parent' | 'partner';
      birthday: string;
      birth_time?: string | null;
      birth_location?: string | null;
    },
    options?: ReadingOptions
  ) => {
    if (!memberId) return;

    try {
      setGenerating(true);
      setError(null);

      const householdId = await getHouseholdId();
      if (!householdId) {
        throw new Error('No household found');
      }

      const readingOptions = options || { period: 'month' as const, zodiacSystem: 'western' as const };
      const periodKey = readingOptions.period === 'year' ? getCurrentYear() : getCurrentMonth();

      // Call edge function to generate reading
      const { data, error: funcError } = await supabase.functions.invoke('generate-cosmos-reading', {
        body: {
          memberId,
          memberData,
          intakeType,
          intakeData,
          householdId,
          monthYear: periodKey,
          readingOptions
        }
      });

      if (funcError) {
        throw funcError;
      }

      if (data?.reading) {
        setReading(data.reading);
      }

      return data?.reading;
    } catch (err) {
      console.error('Error generating cosmos reading:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate reading');
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [memberId, getHouseholdId]);

  // Update reading (for mid-month refresh)
  const refreshReading = useCallback(async (
    intakeType: 'questions' | 'voice',
    intakeData: IntakeResponses | VoiceIntakeData,
    memberData: {
      name: string;
      type: 'child' | 'parent' | 'partner';
      birthday: string;
      birth_time?: string | null;
      birth_location?: string | null;
    }
  ) => {
    // Same as generate but will overwrite existing
    return generateReading(intakeType, intakeData, memberData);
  }, [generateReading]);

  useEffect(() => {
    fetchReading();
  }, [fetchReading]);

  return {
    reading,
    loading,
    generating,
    error,
    generateReading,
    refreshReading,
    refetch: fetchReading,
    hasReading: !!reading
  };
};
