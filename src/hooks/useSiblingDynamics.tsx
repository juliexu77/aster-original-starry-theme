import { useState, useCallback } from 'react';

interface Child {
  name: string;
  sunSign: string;
  moonSign: string | null;
  ageMonths: number;
}

interface SiblingDynamics {
  currentDynamic: string;
  whatEachBrings: Array<{ child: string; gifts: string[] }>;
  compatibilityLabel: string;
  compatibilityNote: string;
  earlyChildhood: string;
  schoolYears: string;
  teenYears: string;
}

export const useSiblingDynamics = () => {
  const [dynamics, setDynamics] = useState<SiblingDynamics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDynamics = useCallback(async (children: Child[]) => {
    if (children.length < 2) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sibling-dynamics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ children }),
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
      setDynamics(data);
    } catch (e) {
      console.error('Sibling dynamics error:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { dynamics, loading, error, generateDynamics };
};
