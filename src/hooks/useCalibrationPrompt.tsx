import { useMemo } from 'react';
import { Calibration } from './useCalibration';

interface UseCalibrationPromptResult {
  shouldShowPrompt: boolean;
  nextMilestoneMonth: number | null;
}

export function useCalibrationPrompt(
  calibration: Calibration | null,
  babyBirthday: string | undefined,
  ageInMonths: number
): UseCalibrationPromptResult {
  return useMemo(() => {
    // No calibration exists - don't show age-based prompt (initial flow handles this)
    if (!calibration || !babyBirthday) {
      return { shouldShowPrompt: false, nextMilestoneMonth: null };
    }

    // If user has dismissed 2+ times in a row, reduce frequency
    const dismissCount = calibration.promptDismissCount;
    const frequencyMultiplier = dismissCount >= 2 ? 2 : 1;

    // Calculate milestone months based on age
    const getMilestoneMonths = (): number[] => {
      const months: number[] = [];
      
      // Monthly from 6-12 months
      for (let m = 6; m <= 12; m++) {
        months.push(m);
      }
      
      // Every 2 months from 12-18 months
      for (let m = 14; m <= 18; m += 2) {
        months.push(m);
      }
      
      // Quarterly after 18 months (up to 5 years = 60 months)
      for (let m = 21; m <= 60; m += 3) {
        months.push(m);
      }
      
      return months;
    };

    const milestoneMonths = getMilestoneMonths();
    
    // Find the next applicable milestone
    const nextMilestone = milestoneMonths.find(m => m >= ageInMonths);
    
    if (!nextMilestone || nextMilestone !== ageInMonths) {
      return { shouldShowPrompt: false, nextMilestoneMonth: nextMilestone || null };
    }

    // Check if already dismissed recently for this milestone
    if (calibration.lastPromptDismissedAt) {
      const lastDismissed = new Date(calibration.lastPromptDismissedAt);
      const daysSinceDismiss = Math.floor(
        (Date.now() - lastDismissed.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Don't show again for at least 7 days after dismiss (or 14 if reduced frequency)
      const cooldownDays = 7 * frequencyMultiplier;
      if (daysSinceDismiss < cooldownDays) {
        return { shouldShowPrompt: false, nextMilestoneMonth: nextMilestone };
      }
    }

    // Check if calibration is recent enough (within last 3 weeks)
    const lastUpdated = new Date(calibration.updatedAt);
    const daysSinceUpdate = Math.floor(
      (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceUpdate < 21) {
      return { shouldShowPrompt: false, nextMilestoneMonth: nextMilestone };
    }

    return { shouldShowPrompt: true, nextMilestoneMonth: nextMilestone };
  }, [calibration, babyBirthday, ageInMonths]);
}

// Helper to check if calibration is stale (>2 months old)
export function isCalibrationStale(calibration: Calibration | null): boolean {
  if (!calibration) return false;
  
  const lastUpdated = new Date(calibration.updatedAt);
  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceUpdate > 60; // More than 2 months
}

// Format the last updated date for display
export function formatLastCalibrated(calibration: Calibration | null): string {
  if (!calibration) return "Never";
  
  const lastUpdated = new Date(calibration.updatedAt);
  const now = new Date();
  const daysSince = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSince === 0) return "Today";
  if (daysSince === 1) return "Yesterday";
  if (daysSince < 7) return `${daysSince} days ago`;
  if (daysSince < 30) return `${Math.floor(daysSince / 7)} weeks ago`;
  if (daysSince < 60) return "About a month ago";
  return `${Math.floor(daysSince / 30)} months ago`;
}
