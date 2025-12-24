import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Baby {
  id: string;
  household_id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  archived?: boolean;
}

export const useBabies = () => {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [activeBabyId, setActiveBabyId] = useState<string | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBabies = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Get user's household membership
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching membership:', memberError);
        setError('Failed to load household');
        setLoading(false);
        return;
      }

      if (!memberData) {
        setBabies([]);
        setHouseholdId(null);
        setLoading(false);
        return;
      }

      setHouseholdId(memberData.household_id);

      // Fetch all babies for this household
      const { data: babiesData, error: babiesError } = await supabase
        .from('babies')
        .select('*')
        .eq('household_id', memberData.household_id)
        .order('created_at', { ascending: true });

      if (babiesError) {
        console.error('Error fetching babies:', babiesError);
        setError('Failed to load children');
        setLoading(false);
        return;
      }

      setBabies(babiesData || []);
      
      // Set active baby to first one if not set
      if (babiesData && babiesData.length > 0 && !activeBabyId) {
        setActiveBabyId(babiesData[0].id);
      }

    } catch (error) {
      console.error('Error in fetchBabies:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user, activeBabyId]);

  useEffect(() => {
    if (user) {
      fetchBabies();
    } else {
      setBabies([]);
      setActiveBabyId(null);
      setHouseholdId(null);
      setLoading(false);
    }
  }, [user]);

  const activeBaby = babies.find(b => b.id === activeBabyId) || babies[0] || null;

  const addBaby = async (name: string, birthday?: string) => {
    if (!user || !householdId) throw new Error('No household');

    const { data, error } = await supabase
      .from('babies')
      .insert([{
        household_id: householdId,
        name,
        birthday: birthday || null
      }])
      .select()
      .single();

    if (error) throw error;

    await fetchBabies();
    setActiveBabyId(data.id);
    return data;
  };

  const updateBaby = async (babyId: string, updates: { name?: string; birthday?: string; birth_time?: string | null; birth_location?: string | null }) => {
    const { error } = await supabase
      .from('babies')
      .update(updates)
      .eq('id', babyId);

    if (error) throw error;
    await fetchBabies();
  };

  const archiveBaby = async (babyId: string) => {
    // For now, we'll just delete - could add an archived column later
    const { error } = await supabase
      .from('babies')
      .delete()
      .eq('id', babyId);

    if (error) throw error;
    
    // Switch to another baby if we archived the active one
    if (activeBabyId === babyId) {
      const remaining = babies.filter(b => b.id !== babyId);
      setActiveBabyId(remaining[0]?.id || null);
    }
    
    await fetchBabies();
  };

  const switchBaby = (babyId: string) => {
    setActiveBabyId(babyId);
  };

  const switchToNextBaby = () => {
    if (babies.length <= 1) return;
    const currentIndex = babies.findIndex(b => b.id === activeBabyId);
    const nextIndex = (currentIndex + 1) % babies.length;
    setActiveBabyId(babies[nextIndex].id);
  };

  const switchToPrevBaby = () => {
    if (babies.length <= 1) return;
    const currentIndex = babies.findIndex(b => b.id === activeBabyId);
    const prevIndex = (currentIndex - 1 + babies.length) % babies.length;
    setActiveBabyId(babies[prevIndex].id);
  };

  return {
    babies,
    activeBaby,
    activeBabyId,
    householdId,
    loading,
    error,
    addBaby,
    updateBaby,
    archiveBaby,
    switchBaby,
    switchToNextBaby,
    switchToPrevBaby,
    refetch: fetchBabies
  };
};
