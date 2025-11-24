/**
 * Generate a headline for daily story based on activity counts and patterns
 * Replaces AI-based generation with template logic
 */

interface StoryData {
  feedCount: number;
  napCount: number;
  totalNapMinutes: number;
  longestWakeWindow: number;
  specialMoments: string[];
}

export function generateStoryHeadline(data: StoryData): string {
  const { feedCount, napCount, totalNapMinutes, longestWakeWindow, specialMoments } = data;
  
  // Calculate averages for context
  const avgNapLength = napCount > 0 ? Math.round(totalNapMinutes / napCount) : 0;
  const totalNapHours = Math.floor(totalNapMinutes / 60);
  const totalNapMins = totalNapMinutes % 60;
  
  // Special moments take priority
  if (specialMoments && specialMoments.length > 0) {
    return "✨ A day full of special moments";
  }
  
  // Very long sleep day
  if (totalNapMinutes > 240) {
    return "😴 An extra sleepy, restful day";
  }
  
  // Short sleep day
  if (totalNapMinutes < 90 && napCount > 0) {
    return "⚡ A lively day with short naps";
  }
  
  // Many feeds
  if (feedCount >= 8) {
    return "🍼 Extra hungry today";
  }
  
  // Few feeds
  if (feedCount <= 3 && feedCount > 0) {
    return "🌟 Efficient feeding day";
  }
  
  // Long wake windows (alert baby)
  if (longestWakeWindow > 180) { // 3+ hours
    return "👀 Alert and engaged all day";
  }
  
  // Many short naps
  if (napCount >= 4 && avgNapLength < 45) {
    return "🌈 Frequent catnaps throughout the day";
  }
  
  // Balanced day patterns
  if (napCount === 3 && feedCount >= 5 && feedCount <= 7) {
    return "🌿 A beautifully balanced day";
  }
  
  if (napCount === 2 && feedCount >= 4 && feedCount <= 6) {
    return "☀️ Steady rhythm, peaceful flow";
  }
  
  // Consolidating to fewer naps
  if (napCount === 2 && avgNapLength > 90) {
    return "🌙 Longer, deeper naps today";
  }
  
  // Default balanced
  return "💫 A day in your unique rhythm";
}
