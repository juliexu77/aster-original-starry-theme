import { Activity } from "@/components/ActivityCard";
import { differenceInMinutes } from "date-fns";
import { getActivityEventDate } from "@/utils/activityDate";
import { getWakeWindowForAge, calculateAgeInWeeks } from "@/utils/ageAppropriateBaselines";

// Arc layout constants
export const ARC_CONFIG = {
  viewBoxWidth: 520, // Increased for more padding
  viewBoxHeight: 200,
  centerX: 260, // Centered in new width
  centerY: 180,
  arcRadius: 180,
  // Narrower arc to prevent edge clipping: 0.78π to 0.22π (140.4° to 39.6°)
  startAngle: Math.PI * 0.78,
  endAngle: Math.PI * 0.22,
} as const;

export const ANGLE_RANGE = ARC_CONFIG.startAngle - ARC_CONFIG.endAngle;

// Determine if we're in daytime or nighttime
export const isDaytime = (
  currentHour: number,
  nightSleepStartHour: number,
  nightSleepEndHour: number
): boolean => {
  if (nightSleepStartHour > nightSleepEndHour) {
    return currentHour >= nightSleepEndHour && currentHour < nightSleepStartHour;
  } else {
    return currentHour < nightSleepStartHour || currentHour >= nightSleepEndHour;
  }
};

// Calculate duration string
export const getDurationString = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get the most recent meaningful activity
export const getMostRecentActivity = (activities: Activity[]): Activity | null => {
  if (activities.length === 0) return null;
  
  const sorted = [...activities].sort((a, b) => {
    const aTime = new Date(a.loggedAt || '').getTime();
    const bTime = new Date(b.loggedAt || '').getTime();
    return bTime - aTime;
  });
  
  return sorted[0] || null;
};

// Calculate arc position (0.0 to 1.0+)
export const calculateArcPosition = (
  activities: Activity[],
  ongoingNap: Activity | null,
  babyBirthday?: string
): number => {
  const now = new Date();
  
  // NAP LOGIC
  if (ongoingNap?.details?.startTime) {
    const [hours, minutes] = ongoingNap.details.startTime.split(':').map(Number);
    const startDate = new Date(now);
    startDate.setHours(hours, minutes, 0, 0);
    const napMinutes = differenceInMinutes(now, startDate);
    const targetNapMinutes = 90; // 1.5 hour target
    return Math.min(Math.max(napMinutes / targetNapMinutes, 0), 1.2);
  }
  
  // WAKE WINDOW LOGIC
  const lastSleep = activities
    .filter(a => a.type === 'nap' && a.details?.endTime)
    .sort((a, b) => {
      const aTime = new Date(a.loggedAt || '').getTime();
      const bTime = new Date(b.loggedAt || '').getTime();
      return bTime - aTime;
    })[0];
  
  if (lastSleep?.details?.endTime) {
    const [hours, minutes] = lastSleep.details.endTime.split(':').map(Number);
    const wakeDate = getActivityEventDate(lastSleep);
    wakeDate.setHours(hours, minutes, 0, 0);
    const minutesElapsed = differenceInMinutes(now, wakeDate);
    
    let recommendedWindow = 150; // Default 2.5h
    if (babyBirthday) {
      const ageInWeeks = calculateAgeInWeeks(babyBirthday);
      const wakeWindowData = getWakeWindowForAge(ageInWeeks);
      if (wakeWindowData?.wakeWindows?.[0]) {
        const windowStr = wakeWindowData.wakeWindows[0];
        const match = windowStr.match(/([\d.]+)(?:-[\d.]+)?h/);
        if (match) recommendedWindow = parseFloat(match[1]) * 60;
      }
    }
    return Math.min(Math.max(minutesElapsed / recommendedWindow, 0), 1.5);
  }
  
  return 0.25; // Default starting position if no data
};

// Calculate icon position on arc
export const calculateIconPosition = (position: number): { x: number; y: number } => {
  const clampedPosition = Math.min(position, 1.0);
  const arcAngle = ARC_CONFIG.startAngle - (clampedPosition * ANGLE_RANGE);
  
  return {
    x: ARC_CONFIG.centerX + Math.cos(arcAngle) * ARC_CONFIG.arcRadius,
    y: ARC_CONFIG.centerY - Math.sin(arcAngle) * ARC_CONFIG.arcRadius,
  };
};

// Create trail path
export const createTrailPath = (position: number): string => {
  const { centerX, centerY, arcRadius, startAngle } = ARC_CONFIG;
  
  // Start Point (Left side of arc)
  const startX = centerX + Math.cos(startAngle) * arcRadius;
  const startY = centerY - Math.sin(startAngle) * arcRadius;
  
  // End Point (Current position)
  const currentAngle = startAngle - (Math.min(position, 1.0) * ANGLE_RANGE);
  const endX = centerX + Math.cos(currentAngle) * arcRadius;
  const endY = centerY - Math.sin(currentAngle) * arcRadius;
  
  // Use small arc flag since angle < 180°
  return `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 1 ${endX} ${endY}`;
};

// Create full base arc path
export const createBaseArcPath = (): string => {
  const { centerX, centerY, arcRadius, startAngle, endAngle } = ARC_CONFIG;
  
  const startX = centerX + Math.cos(startAngle) * arcRadius;
  const startY = centerY - Math.sin(startAngle) * arcRadius;
  const endX = centerX + Math.cos(endAngle) * arcRadius;
  const endY = centerY - Math.sin(endAngle) * arcRadius;
  
  return `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 1 ${endX} ${endY}`;
};
