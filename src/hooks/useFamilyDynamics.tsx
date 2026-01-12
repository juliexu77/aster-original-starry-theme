import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FamilyDynamics {
  headline: string;
  overview: string;
  strengths: string[];
  tensions: string[];
  advice: string;
  rituals: string[];
}

export interface FamilyMemberProfile {
  name: string;
  type: 'parent' | 'partner' | 'child';
  sign: string;
  element: string;
  modality: string;
}

interface FamilyDynamicsResponse {
  dynamics: FamilyDynamics;
  elementBalance: Record<string, number>;
  modalityBalance: Record<string, number>;
  memberProfiles: FamilyMemberProfile[];
  cached?: boolean;
  generatedAt?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
}

// Generate a signature from member data to detect changes
const generateMemberSignature = (members: FamilyMember[]): string => {
  const sorted = members
    .filter((m) => m.birthday)
    .map((m) => `${m.id}:${m.birthday}`)
    .sort()
    .join('|');
  return sorted;
};

export const useFamilyDynamics = () => {
  const [dynamics, setDynamics] = useState<FamilyDynamics | null>(null);
  const [memberProfiles, setMemberProfiles] = useState<FamilyMemberProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Fetch cached dynamics from database
  const fetchCachedDynamics = useCallback(async (
    householdId: string,
    members: FamilyMember[]
  ) => {
    try {
      setFetching(true);
      setError(null);

      const validMembers = members.filter(m => m.birthday);
      if (validMembers.length < 2) {
        return null;
      }

      const memberSignature = generateMemberSignature(members);

      const { data, error: fetchError } = await supabase
        .from('family_dynamics')
        .select('*')
        .eq('household_id', householdId)
        .eq('member_signatures', memberSignature)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !data) {
        return null;
      }

      // Type assertion for the JSONB fields
      const dynamicsData = data.dynamics as unknown as FamilyDynamics;
      const profilesData = data.member_profiles as unknown as FamilyMemberProfile[];

      setDynamics(dynamicsData);
      setMemberProfiles(profilesData || []);
      setGeneratedAt(data.generated_at);
      setIsCached(true);

      return {
        dynamics: dynamicsData,
        memberProfiles: profilesData,
        elementBalance: data.element_balance as Record<string, number>,
        modalityBalance: data.modality_balance as Record<string, number>,
        cached: true,
        generatedAt: data.generated_at,
      };
    } catch (err) {
      console.error('Error fetching cached dynamics:', err);
      return null;
    } finally {
      setFetching(false);
    }
  }, []);

  const generateDynamics = useCallback(async (
    householdId: string,
    members: FamilyMember[],
    forceRegenerate = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const validMembers = members.filter(m => m.birthday);
      if (validMembers.length < 2) {
        throw new Error('Need at least 2 family members with birthdays');
      }

      const { data, error: funcError } = await supabase.functions.invoke('generate-family-dynamics', {
        body: {
          householdId,
          members: validMembers,
          forceRegenerate,
        }
      });

      if (funcError) {
        throw funcError;
      }

      if (data?.dynamics) {
        setDynamics(data.dynamics);
        setMemberProfiles(data.memberProfiles || []);
        setGeneratedAt(data.generatedAt || new Date().toISOString());
        setIsCached(data.cached || false);
      }

      return data as FamilyDynamicsResponse;
    } catch (err) {
      console.error('Error generating family dynamics:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate family dynamics';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDynamics = useCallback(async (
    householdId: string,
    members: FamilyMember[]
  ) => {
    return generateDynamics(householdId, members, true);
  }, [generateDynamics]);

  const clearDynamics = useCallback(() => {
    setDynamics(null);
    setMemberProfiles([]);
    setError(null);
    setGeneratedAt(null);
    setIsCached(false);
  }, []);

  return {
    dynamics,
    memberProfiles,
    loading,
    fetching,
    error,
    generatedAt,
    isCached,
    fetchCachedDynamics,
    generateDynamics,
    refreshDynamics,
    clearDynamics,
    hasDynamics: !!dynamics,
  };
};
