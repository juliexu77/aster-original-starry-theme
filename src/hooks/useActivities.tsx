import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useHousehold } from "./useHousehold";

export interface DatabaseActivity {
  id: string;
  household_id: string;
  type: 'feed' | 'diaper' | 'nap' | 'note' | 'measure' | 'photo' | 'solids';
  logged_at: string;
  timezone?: string;
  details: {
    feedType?: "bottle" | "nursing";
    quantity?: string;
    unit?: "oz" | "ml";
    diaperType?: "wet" | "poopy" | "both";
    hasLeak?: boolean;
    hasCream?: boolean;
    startTime?: string;
    endTime?: string;
    duration?: string;
    solidDescription?: string;
    allergens?: string[];
    note?: string;
    displayTime?: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const convertToUIActivity = (dbActivity: DatabaseActivity) => {
  const utcDate = new Date(dbActivity.logged_at);
  const displayTime = utcDate.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  return {
    id: dbActivity.id,
    type: dbActivity.type,
    time: displayTime,
    loggedAt: dbActivity.logged_at,
    timezone: dbActivity.timezone,
    details: dbActivity.details
  };
};

export function useActivities() {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [activities, setActivities] = useState<DatabaseActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Activities table doesn't exist - return empty array
    setActivities([]);
    setLoading(false);
  }, [user, household]);

  const addActivity = async (_activity: {
    type: 'feed' | 'diaper' | 'nap' | 'note' | 'measure' | 'photo' | 'solids';
    time: string;
    details: any;
  }) => {
    // No-op - activities table doesn't exist
    console.warn('Activities feature not available');
    return null;
  };

  const updateActivity = async (_activityId: string, _updates: Partial<DatabaseActivity>) => {
    // No-op
    console.warn('Activities feature not available');
  };

  const deleteActivity = async (_activityId: string) => {
    // No-op
    console.warn('Activities feature not available');
  };

  const calculateDurations = () => {
    return Promise.resolve([]);
  };

  const fetchActivities = async () => {
    setActivities([]);
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    calculateDurations,
    refetch: fetchActivities
  };
}
