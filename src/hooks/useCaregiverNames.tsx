import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface CaregiverProfile {
  user_id: string;
  full_name: string | null;
}

export function useCaregiverNames() {
  const { user } = useAuth();
  const [caregivers, setCaregivers] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCaregiverNames = async () => {
      try {
        // Get all collaborators for households the user has access to
        const { data: collaboratorData, error: collabError } = await supabase
          .from('collaborators')
          .select('user_id, household_id');

        if (collabError) throw collabError;

        if (!collaboratorData || collaboratorData.length === 0) {
          setLoading(false);
          return;
        }

        // Get unique user IDs
        const userIds = [...new Set(collaboratorData.map(c => c.user_id))];

        // Fetch profiles for all collaborators
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        if (profileError) throw profileError;

        // Create a map of user_id to full_name
        const nameMap = new Map<string, string>();
        profileData?.forEach((profile: CaregiverProfile) => {
          nameMap.set(
            profile.user_id, 
            profile.full_name || 'Unknown caregiver'
          );
        });

        setCaregivers(nameMap);
      } catch (error) {
        console.error('Error fetching caregiver names:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverNames();
  }, [user]);

  const getCaregiverName = (userId: string): string => {
    return caregivers.get(userId) || 'Unknown';
  };

  return { caregivers, getCaregiverName, loading };
}
