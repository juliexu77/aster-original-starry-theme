import { BabyCarePredictionEngine, type NextActionResult } from "./predictionEngine";
import { Activity } from "@/components/ActivityCard";

export interface ScheduleEvent {
  time: string;
  type: 'wake' | 'nap' | 'feed' | 'bed';
  duration?: string;
  notes?: string;
  confidence?: 'high' | 'medium' | 'low';
  reasoning?: string;
}

export interface AdaptiveSchedule {
  events: ScheduleEvent[];
  confidence: 'high' | 'medium' | 'low';
  basedOn: string;
  adjustmentNote?: string;
  accuracyScore?: number; // 0-100 percentage
  lastUpdated?: string;
}

/**
 * Generate an adaptive schedule based on historical patterns
 * Creates a full-day schedule with multiple naps and feeds
 */
export function generateAdaptiveSchedule(
  activities: Activity[],
  babyBirthday?: string
): AdaptiveSchedule {
  console.log('🔮 Generating adaptive schedule from patterns');
  
  const events: ScheduleEvent[] = [];
  const now = new Date();
  
  // Find today's wake activity
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(a => {
    const actDate = new Date(a.loggedAt);
    return actDate >= todayStart;
  });
  
  // Check if baby woke up today
  const todayWakeActivity = todayActivities.find(a => {
    if (a.type === 'nap' && a.details?.endTime && a.details?.isNightSleep) {
      const timeMatch = a.details.endTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const period = timeMatch[3].toUpperCase();
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return hour >= 4 && hour <= 11;
      }
    }
    return false;
  });
  
  let scheduleStartTime: Date;
  let hasActualWake = false;
  
  if (todayWakeActivity) {
    const endTimeStr = todayWakeActivity.details?.endTime || '';
    const timeMatch = endTimeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      scheduleStartTime = new Date(now);
      scheduleStartTime.setHours(hour, minute, 0, 0);
      hasActualWake = true;
    } else {
      scheduleStartTime = new Date(todayWakeActivity.loggedAt);
      hasActualWake = true;
    }
  } else {
    // Calculate average wake time from historical data
    const recentNightSleeps = activities
      .filter(a => a.type === 'nap' && a.details?.endTime && a.details?.isNightSleep)
      .slice(0, 14); // Last 2 weeks
    
    let avgWakeHour = 7;
    let avgWakeMinute = 0;
    
    if (recentNightSleeps.length > 0) {
      let totalMinutes = 0;
      let count = 0;
      
      recentNightSleeps.forEach(sleep => {
        const timeMatch = sleep.details.endTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          const minute = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();
          
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          
          if (hour >= 4 && hour <= 11) {
            totalMinutes += hour * 60 + minute;
            count++;
          }
        }
      });
      
      if (count > 0) {
        const avgTotalMinutes = Math.round(totalMinutes / count);
        avgWakeHour = Math.floor(avgTotalMinutes / 60);
        avgWakeMinute = avgTotalMinutes % 60;
      }
    }
    
    scheduleStartTime = new Date(now);
    scheduleStartTime.setHours(avgWakeHour, avgWakeMinute, 0, 0);
  }
  
  // Add wake event
  events.push({
    time: formatTime(scheduleStartTime),
    type: 'wake',
    notes: 'Wake up',
    confidence: hasActualWake ? 'high' : 'medium',
    reasoning: hasActualWake ? 'Actual logged wake time' : 'Based on typical wake pattern'
  });
  
  // Calculate patterns from historical data
  const recentFeeds = activities.filter(a => a.type === 'feed').slice(0, 50);
  const recentNaps = activities.filter(a => a.type === 'nap' && !a.details?.isNightSleep).slice(0, 30);
  
  // Calculate average feed interval
  let avgFeedInterval = 180; // Default 3 hours
  if (recentFeeds.length >= 2) {
    const intervals: number[] = [];
    for (let i = 0; i < recentFeeds.length - 1 && i < 20; i++) {
      const t1 = new Date(recentFeeds[i].loggedAt).getTime();
      const t2 = new Date(recentFeeds[i + 1].loggedAt).getTime();
      const diff = Math.abs(t1 - t2) / 60000; // minutes
      if (diff > 60 && diff < 360) { // Between 1-6 hours
        intervals.push(diff);
      }
    }
    if (intervals.length > 0) {
      avgFeedInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    }
  }
  
  // Calculate nap patterns
  let napDurations: number[] = [];
  let napTimings: number[] = []; // Minutes from wake
  
  recentNaps.forEach(nap => {
    if (nap.details?.startTime && nap.details?.endTime) {
      const start = parseTimeString(nap.details.startTime);
      const end = parseTimeString(nap.details.endTime);
      if (start && end) {
        const duration = (end.getTime() - start.getTime()) / 60000;
        if (duration > 15 && duration < 240) { // 15 min to 4 hours
          napDurations.push(duration);
          
          // Calculate time from start of day
          const minutesFromMidnight = start.getHours() * 60 + start.getMinutes();
          napTimings.push(minutesFromMidnight);
        }
      }
    }
  });
  
  // Determine typical nap count and durations
  const avgNapDuration = napDurations.length > 0 
    ? Math.round(napDurations.reduce((a, b) => a + b, 0) / napDurations.length)
    : 90;
  
  const dailyNapCounts = new Map<string, number>();
  recentNaps.forEach(nap => {
    const date = new Date(nap.loggedAt).toDateString();
    dailyNapCounts.set(date, (dailyNapCounts.get(date) || 0) + 1);
  });
  
  const napCountsArray = Array.from(dailyNapCounts.values());
  const avgNapCount = napCountsArray.length > 0
    ? Math.round(napCountsArray.reduce((a, b) => a + b, 0) / napCountsArray.length)
    : 2;
  
  // Generate schedule events
  let currentTime = new Date(scheduleStartTime.getTime());
  
  // Add immediate wake-up feed
  currentTime = new Date(currentTime.getTime() + 5 * 60000); // 5 min after wake
  events.push({
    time: formatTime(currentTime),
    type: 'feed',
    notes: 'Feed',
    confidence: 'high',
    reasoning: 'Typically feeds right after waking'
  });
  
  // Generate naps and feeds throughout the day
  const firstNapStart = currentTime.getTime() + (avgNapCount === 1 ? 3.5 : 2.5) * 60 * 60000;
  const napCount = Math.min(avgNapCount, 3);
  
  for (let i = 0; i < napCount; i++) {
    // Calculate nap timing
    let napStartTime: Date;
    if (i === 0) {
      napStartTime = new Date(firstNapStart);
    } else {
      // Space naps evenly through the day
      const hoursPerCycle = napCount === 1 ? 4 : napCount === 2 ? 3.5 : 3;
      napStartTime = new Date(firstNapStart + (i * hoursPerCycle * 60 * 60000));
    }
    
    // Don't schedule naps after 5 PM
    if (napStartTime.getHours() >= 17) continue;
    
    const napDuration = i === 0 ? avgNapDuration : Math.round(avgNapDuration * 0.85);
    
    // Add feed before nap if enough time has passed
    const timeSinceLastFeed = napStartTime.getTime() - currentTime.getTime();
    if (timeSinceLastFeed >= (avgFeedInterval - 30) * 60000) {
      const preFeedTime = new Date(napStartTime.getTime() - 15 * 60000);
      events.push({
        time: formatTime(preFeedTime),
        type: 'feed',
        notes: 'Feed',
        confidence: 'medium',
        reasoning: 'Typical feeding interval'
      });
      currentTime = preFeedTime;
    }
    
    // Add nap
    events.push({
      time: formatTime(napStartTime),
      type: 'nap',
      duration: formatDuration(napDuration),
      notes: `Nap ${i + 1}`,
      confidence: 'medium',
      reasoning: 'Based on typical nap patterns'
    });
    
    const napEndTime = new Date(napStartTime.getTime() + napDuration * 60000);
    
    // Add feed after nap
    const postNapFeed = new Date(napEndTime.getTime() + 10 * 60000);
    if (postNapFeed.getHours() < 18) {
      events.push({
        time: formatTime(postNapFeed),
        type: 'feed',
        notes: 'Feed',
        confidence: 'medium',
        reasoning: 'Typically feeds after waking from nap'
      });
      currentTime = postNapFeed;
    }
  }
  
  // Add additional feeds to fill gaps
  const lastFeedTime = events.filter(e => e.type === 'feed').slice(-1)[0];
  if (lastFeedTime) {
    const lastFeed = parseDisplayTime(lastFeedTime.time, scheduleStartTime);
    const bedtimeHour = 19; // 7 PM
    const bedtimeMinutes = bedtimeHour * 60;
    const lastFeedMinutes = lastFeed.getHours() * 60 + lastFeed.getMinutes();
    const gapMinutes = bedtimeMinutes - lastFeedMinutes;
    
    if (gapMinutes > avgFeedInterval) {
      const additionalFeeds = Math.floor(gapMinutes / avgFeedInterval);
      for (let i = 1; i <= additionalFeeds; i++) {
        const feedTime = new Date(lastFeed.getTime() + (i * avgFeedInterval * 60000));
        if (feedTime.getHours() < 19) {
          events.push({
            time: formatTime(feedTime),
            type: 'feed',
            notes: 'Feed',
            confidence: 'medium',
            reasoning: 'Maintaining feeding interval'
          });
        }
      }
    }
  }
  
  // Sort events by time
  events.sort((a, b) => {
    const timeA = parseDisplayTime(a.time, scheduleStartTime);
    const timeB = parseDisplayTime(b.time, scheduleStartTime);
    return timeA.getTime() - timeB.getTime();
  });
  
  // Add bedtime routine
  const bedtimeRoutine = new Date(scheduleStartTime);
  bedtimeRoutine.setHours(19, 0, 0, 0); // 7:00 PM
  
  events.push({
    time: formatTime(bedtimeRoutine),
    type: 'bed',
    notes: 'Bedtime routine',
    confidence: 'high',
    reasoning: 'Age-appropriate bedtime'
  });
  
  const bedtimeFeed = new Date(bedtimeRoutine.getTime() + 10 * 60000);
  events.push({
    time: formatTime(bedtimeFeed),
    type: 'feed',
    notes: 'Bedtime feed',
    confidence: 'high',
    reasoning: 'Part of bedtime routine'
  });
  
  const sleepBy = new Date(bedtimeRoutine.getTime() + 30 * 60000);
  events.push({
    time: `Sleep by ${formatTime(sleepBy)}`,
    type: 'bed',
    notes: '',
    confidence: 'high',
    reasoning: ''
  });
  
  // Add dream feed
  const dreamFeed = new Date(scheduleStartTime);
  dreamFeed.setHours(22, 0, 0, 0); // 10:00 PM
  events.push({
    time: formatTime(dreamFeed),
    type: 'feed',
    notes: 'Dream feed',
    confidence: 'medium',
    reasoning: 'Optional late evening feed'
  });
  
  // Determine confidence
  const dataStability = activities.length > 100 ? 'stable' : activities.length > 30 ? 'unstable' : 'sparse';
  let overallConfidence: 'high' | 'medium' | 'low' = 'low';
  
  if (dataStability === 'stable') {
    overallConfidence = 'high';
  } else if (dataStability === 'unstable') {
    overallConfidence = 'medium';
  }
  
  const activitiesCount = activities.length;
  const daysOfData = Math.ceil(activitiesCount / 8);
  const basedOn = `Based on ${activitiesCount} activities over ${daysOfData} days with adaptive learning`;
  
  console.log('✅ Adaptive schedule generated:', {
    eventsCount: events.length,
    confidence: overallConfidence,
    hasActualWake,
    avgFeedInterval,
    avgNapCount,
    avgNapDuration
  });
  
  return {
    events,
    confidence: overallConfidence,
    basedOn
  };
}

function parseTimeString(timeStr: string): Date | null {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch) return null;
  
  let hour = parseInt(timeMatch[1]);
  const minute = parseInt(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

function parseDisplayTime(displayTime: string, baseDate: Date): Date {
  // Handle "Sleep by X:XX AM/PM" format
  const sleepByMatch = displayTime.match(/Sleep by (.+)/);
  if (sleepByMatch) {
    displayTime = sleepByMatch[1];
  }
  
  const parsed = parseTimeString(displayTime);
  if (!parsed) return baseDate;
  
  const result = new Date(baseDate);
  result.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
  return result;
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
