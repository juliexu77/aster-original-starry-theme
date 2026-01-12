import { useState, useCallback } from "react";
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
}

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
}

export const useFamilyDynamics = () => {
  const [dynamics, setDynamics] = useState<FamilyDynamics | null>(null);
  const [memberProfiles, setMemberProfiles] = useState<FamilyMemberProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDynamics = useCallback(async (
    householdId: string,
    members: FamilyMember[]
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
        }
      });

      if (funcError) {
        throw funcError;
      }

      if (data?.dynamics) {
        setDynamics(data.dynamics);
        setMemberProfiles(data.memberProfiles || []);
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

  const clearDynamics = useCallback(() => {
    setDynamics(null);
    setMemberProfiles([]);
    setError(null);
  }, []);

  return {
    dynamics,
    memberProfiles,
    loading,
    error,
    generateDynamics,
    clearDynamics,
    hasDynamics: !!dynamics,
  };
};
