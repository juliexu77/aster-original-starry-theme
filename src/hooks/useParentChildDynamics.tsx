import { useState, useCallback } from 'react';

interface Parent {
  name: string;
  sunSign: string;
  moonSign: string | null;
}

interface Child {
  name: string;
  sunSign: string;
  moonSign: string | null;
  ageMonths: number;
}

interface ParentChildDynamics {
  hook: string;
  parentQualities: string[];
  youreTheParentWho: string[];
  whatChildNeeds: string[];
  whatYouAlreadyGive: string;
  currentPhaseInsight: string;
  friction: string[];
  deepConnection: string;
}

interface DynamicsState {
  [childId: string]: {
    dynamics: ParentChildDynamics | null;
    loading: boolean;
    error: string | null;
  };
}

export const useParentChildDynamics = () => {
  const [state, setState] = useState<DynamicsState>({});

  const generateDynamics = useCallback(async (childId: string, parent: Parent, child: Child) => {
    setState(prev => ({
      ...prev,
      [childId]: { dynamics: null, loading: true, error: null }
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-parent-child-dynamics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ parent, child }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('Service temporarily unavailable.');
        }
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        [childId]: { dynamics: data, loading: false, error: null }
      }));
    } catch (e) {
      console.error('Parent-child dynamics error:', e);
      setState(prev => ({
        ...prev,
        [childId]: { 
          dynamics: null, 
          loading: false, 
          error: e instanceof Error ? e.message : 'Unknown error' 
        }
      }));
    }
  }, []);

  const getDynamicsForChild = (childId: string) => {
    return state[childId] || { dynamics: null, loading: false, error: null };
  };

  return { getDynamicsForChild, generateDynamics };
};
