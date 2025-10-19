import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PercentileData {
  percentile: number | null;
  showBadge: boolean;
}

export function useActivityPercentile(householdId: string | undefined, activityCount: number): PercentileData {
  const [percentile, setPercentile] = useState<number | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (!householdId) {
      setPercentile(null);
      setShowBadge(false);
      return;
    }

    calculatePercentile();
  }, [householdId, activityCount]);

  const calculatePercentile = async () => {
    try {
      // Get activity counts for all households
      const { data: activityCounts, error } = await supabase
        .from('activities')
        .select('household_id')
        .not('household_id', 'is', null);

      if (error) throw error;

      // Count activities per household
      const householdActivityCounts = new Map<string, number>();
      activityCounts?.forEach(activity => {
        const count = householdActivityCounts.get(activity.household_id) || 0;
        householdActivityCounts.set(activity.household_id, count + 1);
      });

      const totalHouseholds = householdActivityCounts.size;

      // Fallback logic: if less than 10 households, use hardcoded thresholds
      if (totalHouseholds < 10) {
        if (activityCount >= 75) {
          setPercentile(1);
          setShowBadge(true);
        } else if (activityCount >= 50) {
          setPercentile(5);
          setShowBadge(true);
        } else if (activityCount >= 30) {
          setPercentile(10);
          setShowBadge(true);
        } else {
          setPercentile(null);
          setShowBadge(false);
        }
        return;
      }

      // Calculate actual percentile
      const allCounts = Array.from(householdActivityCounts.values()).sort((a, b) => b - a);
      const currentRank = allCounts.filter(count => count > activityCount).length + 1;
      const calculatedPercentile = Math.round((currentRank / totalHouseholds) * 100);

      // Only show badge if in top 10%
      if (calculatedPercentile <= 10) {
        setPercentile(calculatedPercentile);
        setShowBadge(true);
      } else {
        setPercentile(calculatedPercentile);
        setShowBadge(false);
      }

    } catch (error) {
      console.error('Error calculating percentile:', error);
      // Fallback on error
      if (activityCount >= 75) {
        setPercentile(1);
        setShowBadge(true);
      } else {
        setPercentile(null);
        setShowBadge(false);
      }
    }
  };

  return { percentile, showBadge };
}