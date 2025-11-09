/**
 * Shared utility for consistently classifying naps as daytime vs. night sleep
 */

interface NapActivity {
  details?: any; // Using any for flexibility with Supabase Json type
}

/**
 * Parse a time string like "7:15 PM" to 24-hour format
 */
const parseTimeToHour = (timeStr: string): number | null => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  
  let hours = parseInt(match[1]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours;
};

/**
 * Calculate duration in hours between two time strings
 * Handles overnight sleep (when end < start, assumes next day)
 */
const calculateDuration = (startTime: string, endTime: string): number => {
  const startMatch = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  const endMatch = endTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  
  if (!startMatch || !endMatch) return 0;
  
  let startHours = parseInt(startMatch[1]);
  const startMinutes = parseInt(startMatch[2]);
  const startPeriod = startMatch[3].toUpperCase();
  
  let endHours = parseInt(endMatch[1]);
  const endMinutes = parseInt(endMatch[2]);
  const endPeriod = endMatch[3].toUpperCase();
  
  if (startPeriod === 'PM' && startHours !== 12) startHours += 12;
  if (startPeriod === 'AM' && startHours === 12) startHours = 0;
  if (endPeriod === 'PM' && endHours !== 12) endHours += 12;
  if (endPeriod === 'AM' && endHours === 12) endHours = 0;
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle overnight (end < start means crossed midnight)
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  return durationMinutes / 60;
};

/**
 * Determine if a nap is a daytime nap (not night sleep)
 * 
 * Rules:
 * 1. Must have start time
 * 2. Start hour must be between nightSleepEndHour and nightSleepStartHour
 * 3. If duration is > 6 hours, it's considered night sleep (not a day nap)
 * 4. If it crosses midnight (ends in early morning), it's night sleep
 * 
 * @param nap - Activity with details.startTime and details.endTime
 * @param nightSleepStartHour - Hour when night sleep typically begins (default 19 = 7 PM)
 * @param nightSleepEndHour - Hour when night sleep typically ends (default 7 = 7 AM)
 */
export const isDaytimeNap = (
  nap: NapActivity,
  nightSleepStartHour: number = 19,
  nightSleepEndHour: number = 7
): boolean => {
  if (!nap.details?.startTime) return false;
  
  const startHour = parseTimeToHour(nap.details.startTime);
  if (startHour === null) return false;
  
  // Must start during "day" hours
  const isDayHours = startHour >= nightSleepEndHour && startHour < nightSleepStartHour;
  if (!isDayHours) return false;
  
  // If we have duration info, exclude long sleeps (> 6 hours = likely night sleep)
  if (nap.details.startTime && nap.details.endTime) {
    const duration = calculateDuration(nap.details.startTime, nap.details.endTime);
    
    // Sleeps longer than 6 hours are considered night sleep, not day naps
    if (duration > 6) {
      return false;
    }
    
    // Check if it ends in early morning (crossed midnight) - also night sleep
    const endHour = parseTimeToHour(nap.details.endTime);
    if (endHour !== null && endHour < nightSleepEndHour && endHour < startHour) {
      return false;
    }
  }
  
  return true;
};

/**
 * Determine if a nap qualifies as night sleep
 */
export const isNightSleep = (
  nap: NapActivity,
  nightSleepStartHour: number = 19,
  nightSleepEndHour: number = 7
): boolean => {
  if (!nap.details?.startTime) return false;
  
  const startHour = parseTimeToHour(nap.details.startTime);
  if (startHour === null) return false;
  
  // Starts during night hours
  if (startHour >= nightSleepStartHour || startHour < nightSleepEndHour) {
    return true;
  }
  
  // Starts during day but is a long sleep or crosses midnight
  if (nap.details.endTime) {
    const duration = calculateDuration(nap.details.startTime, nap.details.endTime);
    if (duration > 6) return true;
    
    const endHour = parseTimeToHour(nap.details.endTime);
    if (endHour !== null && endHour < nightSleepEndHour && endHour < startHour) {
      return true;
    }
  }
  
  return false;
};

export { parseTimeToHour, calculateDuration };
