import { useUserProfile } from "./useUserProfile";

/**
 * Hook to access configurable night sleep window settings.
 * Returns the start and end hours for overnight sleep period.
 * Defaults to 7 PM - 7 AM if not configured.
 */
export const useNightSleepWindow = () => {
  const { userProfile } = useUserProfile();

  // Type assertion until migration completes and types regenerate
  const profile = userProfile as any;
  const nightSleepStartHour = profile?.night_sleep_start_hour ?? 19; // Default 7 PM
  const nightSleepStartMinute = profile?.night_sleep_start_minute ?? 0; // Default :00
  const nightSleepEndHour = profile?.night_sleep_end_hour ?? 7; // Default 7 AM
  const nightSleepEndMinute = profile?.night_sleep_end_minute ?? 0; // Default :00

  /**
   * Check if a given hour (0-23) falls within the night sleep window
   */
  const isNightHour = (hour: number): boolean => {
    if (nightSleepStartHour > nightSleepEndHour) {
      // Window crosses midnight (e.g., 19-7)
      return hour >= nightSleepStartHour || hour < nightSleepEndHour;
    } else {
      // Window doesn't cross midnight
      return hour >= nightSleepStartHour && hour < nightSleepEndHour;
    }
  };

  /**
   * Check if a given timestamp falls within the night sleep window
   */
  const isNightTime = (timestamp: Date): boolean => {
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    const totalMinutes = hour * 60 + minute;
    const startTotalMinutes = nightSleepStartHour * 60 + nightSleepStartMinute;
    const endTotalMinutes = nightSleepEndHour * 60 + nightSleepEndMinute;
    
    if (startTotalMinutes > endTotalMinutes) {
      // Window crosses midnight
      return totalMinutes >= startTotalMinutes || totalMinutes < endTotalMinutes;
    } else {
      // Window doesn't cross midnight
      return totalMinutes >= startTotalMinutes && totalMinutes < endTotalMinutes;
    }
  };

  /**
   * Check if a given time string (e.g., "7:30 PM") falls within night window
   */
  const isNightTimeString = (timeStr: string): boolean => {
    const hour = parseTimeStringToHour(timeStr);
    if (hour === null) return false;
    return isNightHour(hour);
  };

  /**
   * Parse time string to hour (0-23)
   */
  const parseTimeStringToHour = (timeStr: string): number | null => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    
    let hours = parseInt(match[1], 10);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours;
  };

  return {
    nightSleepStartHour,
    nightSleepStartMinute,
    nightSleepEndHour,
    nightSleepEndMinute,
    isNightHour,
    isNightTime,
    isNightTimeString,
  };
};
