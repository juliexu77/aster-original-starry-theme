import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Household {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Baby {
  id: string;
  household_id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  photo_url: string | null;
}

interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

// Extended household with baby info
interface HouseholdWithBaby extends Household {
  baby_name: string | null;
  baby_birthday: string | null;
  baby_photo_url: string | null;
  baby_sex?: string | null;
}

export type { Household, Baby, HouseholdMember, HouseholdWithBaby };

export const useHousehold = () => {
  const { user } = useAuth();
  const [household, setHousehold] = useState<HouseholdWithBaby | null>(null);
  const [baby, setBaby] = useState<Baby | null>(null);
  const [collaborators, setCollaborators] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchHousehold();
  }, [user]);

  const fetchHousehold = async () => {
    if (!user) return;

    try {
      setError(null);

      // Get user's household membership
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('household_id, role')
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
        setHousehold(null);
        setLoading(false);
        return;
      }

      // Fetch household
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', memberData.household_id)
        .single();

      if (householdError) {
        console.error('Error fetching household:', householdError);
        setError('Failed to load household');
        setLoading(false);
        return;
      }

      // Fetch baby for this household
      const { data: babyData } = await supabase
        .from('babies')
        .select('*')
        .eq('household_id', memberData.household_id)
        .limit(1)
        .maybeSingle();

      setBaby(babyData);

      // Combine household and baby info
      const combined: HouseholdWithBaby = {
        ...householdData,
        baby_name: babyData?.name || null,
        baby_birthday: babyData?.birthday || null,
        baby_photo_url: babyData?.photo_url || null,
        baby_sex: null
      };

      setHousehold(combined);

      // Fetch members
      const { data: membersData } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', memberData.household_id);

      setCollaborators(membersData || []);

    } catch (error) {
      console.error('Error in fetchHousehold:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createHousehold = async (babyName: string, babyBirthday?: string, babyBirthTime?: string, babyBirthLocation?: string) => {
    if (!user) throw new Error('User must be authenticated');

    const newHouseholdId = crypto.randomUUID();

    // Create household
    const { error: householdError } = await supabase
      .from('households')
      .insert([{
        id: newHouseholdId,
        name: `${babyName}'s Household`,
        created_by: user.id
      }]);

    if (householdError) throw householdError;

    // Add user as owner
    await supabase
      .from('household_members')
      .insert([{
        household_id: newHouseholdId,
        user_id: user.id,
        role: 'owner'
      }]);

    // Create baby
    await supabase
      .from('babies')
      .insert([{
        household_id: newHouseholdId,
        name: babyName,
        birthday: babyBirthday || null,
        birth_time: babyBirthTime || null,
        birth_location: babyBirthLocation || null
      }]);

    await fetchHousehold();
  };

  const updateHousehold = async (updates: { baby_name?: string; baby_birthday?: string; baby_photo_url?: string; baby_sex?: string }) => {
    if (!household || !baby) throw new Error('No household or baby');

    // Update baby record
    const { error } = await supabase
      .from('babies')
      .update({
        name: updates.baby_name ?? baby.name,
        birthday: updates.baby_birthday ?? baby.birthday,
        photo_url: updates.baby_photo_url ?? baby.photo_url
      })
      .eq('id', baby.id);

    if (error) throw error;

    await fetchHousehold();
  };

  const refetch = async () => {
    setLoading(true);
    await fetchHousehold();
  };

  return {
    household,
    baby,
    collaborators,
    loading,
    error,
    createHousehold,
    updateHousehold,
    refetch,
    fetchHousehold
  };
};
