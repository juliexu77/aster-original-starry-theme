/**
 * Generate meaningful insights for Today's Story
 * Replaces generic metrics with emotional highlights, patterns, and predictions
 */

import { Activity } from "@/components/ActivityCard";
import { isDaytimeNap } from "./napClassification";

interface StoryInsightData {
  activities: Activity[];
  feedCount: number;
  napCount: number;
  totalNapMinutes: number;
  longestWakeWindowMinutes: number;
  nightSleepStartHour: number;
  nightSleepEndHour: number;
  babyName: string;
}

interface StoryInsight {
  icon: string;
  label: string;
  text: string;
  animationDelay: string;
}

/**
 * Calculate average nap length from completed naps
 */
function calculateAverageNapLength(activities: Activity[], nightSleepStartHour: number, nightSleepEndHour: number): number {
  const napsWithDuration = activities
    .filter(a => a.type === "nap" && isDaytimeNap(a, nightSleepStartHour, nightSleepEndHour) && a.details.startTime && a.details.endTime)
    .map(a => {
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hStr, mStr] = time.split(':');
        let h = parseInt(hStr, 10);
        const m = parseInt(mStr || '0', 10);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      
      const startMinutes = parseTime(a.details.startTime);
      const endMinutes = parseTime(a.details.endTime);
      return endMinutes >= startMinutes 
        ? endMinutes - startMinutes 
        : (24 * 60) - startMinutes + endMinutes;
    });

  if (napsWithDuration.length === 0) return 0;
  return Math.round(napsWithDuration.reduce((sum, d) => sum + d, 0) / napsWithDuration.length);
}

/**
 * Calculate feed spacing variance
 */
function calculateFeedSpacing(activities: Activity[]): { isEven: boolean; avgGapMinutes: number } {
  const feeds = activities
    .filter(a => a.type === "feed")
    .map(a => new Date(a.loggedAt).getTime())
    .sort((a, b) => a - b);

  if (feeds.length < 2) return { isEven: true, avgGapMinutes: 0 };

  const gaps = [];
  for (let i = 1; i < feeds.length; i++) {
    gaps.push((feeds[i] - feeds[i - 1]) / (1000 * 60)); // Convert to minutes
  }

  const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avgGap, 2), 0) / gaps.length;
  const stdDev = Math.sqrt(variance);

  // Even spacing if standard deviation is less than 30% of average
  const isEven = stdDev < avgGap * 0.3;

  return { isEven, avgGapMinutes: Math.round(avgGap) };
}

/**
 * Get first and last nap times for predictions
 */
function getFirstNapTime(activities: Activity[], nightSleepStartHour: number, nightSleepEndHour: number): number | null {
  const firstNap = activities
    .filter(a => a.type === "nap" && isDaytimeNap(a, nightSleepStartHour, nightSleepEndHour) && a.details.startTime)
    .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())[0];

  if (!firstNap?.details.startTime) return null;

  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  return parseTime(firstNap.details.startTime);
}

/**
 * Generate 4 meaningful insights
 */
export function generateStoryInsights(data: StoryInsightData): StoryInsight[] {
  const { 
    activities, 
    feedCount, 
    napCount, 
    totalNapMinutes, 
    longestWakeWindowMinutes,
    nightSleepStartHour,
    nightSleepEndHour,
    babyName
  } = data;

  const insights: StoryInsight[] = [];
  const avgNapLength = calculateAverageNapLength(activities, nightSleepStartHour, nightSleepEndHour);
  const feedSpacing = calculateFeedSpacing(activities);
  const firstNapTime = getFirstNapTime(activities, nightSleepStartHour, nightSleepEndHour);

  // Historical baselines (simplified - in production would come from actual history)
  const avgNapMinutes = 180;
  const avgWakeWindow = 120;

  // 1. HIGHLIGHT OF THE DAY (Emotional)
  let highlight = "";
  if (napCount >= 3 && avgNapLength < 45) {
    highlight = "Short naps today but energy stayed steady — very resilient.";
  } else if (totalNapMinutes > avgNapMinutes + 60) {
    highlight = "Longer rest today set a calm, regulated tone.";
  } else if (longestWakeWindowMinutes > avgWakeWindow + 30) {
    highlight = `${babyName} handled transitions smoothly today — very adaptable.`;
  } else if (feedSpacing.isEven) {
    highlight = "Feeding rhythm flowed naturally all day — beautifully in sync.";
  } else if (napCount === 2 && avgNapLength > 90) {
    highlight = "Deeper, consolidated naps — a sign of maturing sleep patterns.";
  } else {
    highlight = "A steady, balanced day — mood stayed regulated throughout.";
  }

  insights.push({
    icon: "✨",
    label: "Today's highlight",
    text: highlight,
    animationDelay: "1s"
  });

  // 2. MEANINGFUL PATTERN (Practical coaching)
  let pattern = "";
  if (longestWakeWindowMinutes > avgWakeWindow) {
    const diffMinutes = longestWakeWindowMinutes - avgWakeWindow;
    pattern = `Longest wake window stretched ${diffMinutes} minutes — age-appropriate and totally normal.`;
  } else if (napCount < 3 && totalNapMinutes > 150) {
    pattern = "Consolidating to fewer, longer naps — a natural progression.";
  } else if (feedCount >= 8) {
    pattern = "Feeds clustered more than usual — often a sign of a growth spurt.";
  } else if (totalNapMinutes < avgNapMinutes - 30 && napCount >= 3) {
    pattern = "Shorter naps but he balanced it with steady wake windows.";
  } else {
    pattern = "Wake windows remained consistent — a stable daily pattern.";
  }

  insights.push({
    icon: "🔄",
    label: "Pattern noticed",
    text: pattern,
    animationDelay: "1.5s"
  });

  // 3. CONTEXTUALIZED METRIC (Interpreted)
  let metric = "";
  if (Math.abs(totalNapMinutes - avgNapMinutes) <= 30) {
    metric = "Total nap time landed right in the sweet spot today.";
  } else if (feedSpacing.isEven) {
    const hours = Math.floor(feedSpacing.avgGapMinutes / 60);
    const mins = feedSpacing.avgGapMinutes % 60;
    metric = `Feed spacing averaged ${hours}h ${mins}m — very even rhythm.`;
  } else if (napCount === avgNapMinutes / 60) {
    metric = "Nap count aligned perfectly with age-appropriate expectations.";
  } else {
    metric = "Daily rhythm stayed within expected ranges — well-regulated.";
  }

  insights.push({
    icon: "📊",
    label: "Balance check",
    text: metric,
    animationDelay: "2s"
  });

  // 4. TOMORROW WATCH-FOR (Predictive)
  let prediction = "";
  if (firstNapTime !== null) {
    const hours = Math.floor(firstNapTime / 60);
    const mins = firstNapTime % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const timeRange = `${displayHours}:${mins.toString().padStart(2, '0')}${period}`;
    prediction = `If wake time is similar, expect first nap around ${timeRange} tomorrow.`;
  } else if (totalNapMinutes < avgNapMinutes - 30) {
    prediction = "After a lighter nap day, tomorrow may need an earlier bedtime.";
  } else if (longestWakeWindowMinutes > avgWakeWindow + 30) {
    prediction = "After a long wake today, tomorrow may start with a longer first nap.";
  } else {
    prediction = "Tomorrow likely to follow a similar rhythm — consistency is emerging.";
  }

  insights.push({
    icon: "🔮",
    label: "For tomorrow",
    text: prediction,
    animationDelay: "2.5s"
  });

  return insights;
}
