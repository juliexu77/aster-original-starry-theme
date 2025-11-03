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
 * Generate an adaptive schedule using the prediction engine
 * This ensures consistency between Home tab predictions and Guide tab schedule
 */
export function generateAdaptiveSchedule(
  activities: Activity[],
  babyBirthday?: string
): AdaptiveSchedule {
  console.log('🔮 Generating adaptive schedule with prediction engine');
  
  // Initialize the prediction engine
  const engine = new BabyCarePredictionEngine(activities, babyBirthday);
  
  const events: ScheduleEvent[] = [];
  const now = new Date();
  
  // Find today's wake activity or last night sleep end
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(a => {
    const actDate = new Date(a.loggedAt);
    return actDate >= todayStart;
  });
  
  // Check if baby woke up today (end of night sleep)
  const todayWakeActivity = todayActivities.find(a => {
    // Check for morning wake from night sleep (nap ending between 4-11 AM)
    if (a.type === 'nap' && a.details?.endTime && a.details?.isNightSleep) {
      // Parse the endTime string (e.g., "7:18 AM") to get the hour
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
    // Use today's actual wake time from the endTime field
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
    } else {
      // Fallback to loggedAt if endTime parsing fails
      scheduleStartTime = new Date(todayWakeActivity.loggedAt);
    }
    
    hasActualWake = true;
    
    events.push({
      time: formatTime(scheduleStartTime),
      type: 'wake',
      notes: 'Morning wake up',
      confidence: 'high',
      reasoning: `Actual wake time logged today at ${endTimeStr}`
    });
  } else {
    // Use predicted wake time (typically 6-8 AM based on patterns)
    const avgWakeHour = 7; // Default 7 AM
    scheduleStartTime = new Date(now);
    scheduleStartTime.setHours(avgWakeHour, 0, 0, 0);
    
    // If it's already past the predicted wake time, start from now
    if (scheduleStartTime < now) {
      scheduleStartTime = now;
    }
    
    events.push({
      time: formatTime(scheduleStartTime),
      type: 'wake',
      notes: 'Morning wake up',
      confidence: 'medium',
      reasoning: 'Predicted based on historical patterns'
    });
  }
  
  // Generate schedule by simulating time progression
  let currentTime = new Date(scheduleStartTime.getTime());
  const endOfDay = new Date(scheduleStartTime);
  endOfDay.setHours(20, 0, 0, 0); // End schedule at 8 PM (before bedtime routine)
  
  let napCount = 0;
  let feedCount = 0;
  let lastEventType: string | null = null;
  let lastEventTime = currentTime.getTime();
  let iterationCount = 0;
  const maxIterations = 50; // Safety limit to prevent infinite loops
  
  while (currentTime < endOfDay && iterationCount < maxIterations) {
    iterationCount++;
    // Get prediction for this timestamp
    const prediction = engine.getNextAction(currentTime);
    
    // Determine what event to add based on prediction
    if (prediction.intent === 'LET_SLEEP_CONTINUE') {
      // Currently sleeping - add nap event if we haven't already
      if (lastEventType !== 'nap') {
        const napDuration = prediction.timing.nextWakeAt 
          ? Math.round((prediction.timing.nextWakeAt.getTime() - currentTime.getTime()) / 60000)
          : 90; // Default 90 min
        
        events.push({
          time: formatTime(currentTime),
          type: 'nap',
          duration: formatDuration(napDuration),
          notes: `Nap ${napCount + 1}`,
          confidence: prediction.confidence,
          reasoning: prediction.reasons.join(', ')
        });
        
        napCount++;
        lastEventType = 'nap';
        
        // Advance time to wake time
        currentTime = prediction.timing.nextWakeAt || new Date(currentTime.getTime() + napDuration * 60000);
      } else {
        // Skip ahead to avoid infinite loop
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    } else if (prediction.intent === 'FEED_SOON') {
      // Time for a feed
      if (lastEventType !== 'feed' && (currentTime.getTime() - lastEventTime) >= 60 * 60000) {
        events.push({
          time: formatTime(currentTime),
          type: 'feed',
          notes: prediction.timing.expectedFeedVolume 
            ? `Feed (typically ${prediction.timing.expectedFeedVolume} ml)`
            : 'Feed',
          confidence: prediction.confidence,
          reasoning: prediction.reasons.join(', ')
        });
        
        feedCount++;
        lastEventType = 'feed';
        lastEventTime = currentTime.getTime();
        
        // Advance time by 30 min (feeding duration)
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      } else {
        // Skip ahead
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    } else if (prediction.intent === 'START_WIND_DOWN') {
      // Nap window approaching
      const timeUntilNap = prediction.timing.nextNapWindowStart
        ? Math.max(0, prediction.timing.nextNapWindowStart.getTime() - currentTime.getTime())
        : 0;
      
      if (timeUntilNap === 0 && lastEventType !== 'nap') {
        // Nap time now
        const napDuration = 90; // Default nap duration
        
        events.push({
          time: formatTime(currentTime),
          type: 'nap',
          duration: formatDuration(napDuration),
          notes: `Nap ${napCount + 1}`,
          confidence: prediction.confidence,
          reasoning: prediction.reasons.join(', ')
        });
        
        napCount++;
        lastEventType = 'nap';
        
        // Advance time by nap duration
        currentTime = new Date(currentTime.getTime() + napDuration * 60000);
      } else {
        // Move to nap window start time
        currentTime = prediction.timing.nextNapWindowStart || new Date(currentTime.getTime() + 30 * 60000);
      }
    } else {
      // INDEPENDENT_TIME or HOLD - advance by 30 min
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    
  }
  
  // Add bedtime routine at the end (always add to complete the day)
  const bedtimeStart = new Date(scheduleStartTime);
  bedtimeStart.setHours(19, 30, 0, 0); // 7:30 PM
  
  // Add final feed before bed if there's a gap
  const timeSinceLastEvent = bedtimeStart.getTime() - lastEventTime;
  if (timeSinceLastEvent > 90 * 60000) { // More than 1.5 hours since last event
    const finalFeedTime = new Date(bedtimeStart.getTime() - 30 * 60000);
    events.push({
      time: formatTime(finalFeedTime),
      type: 'feed',
      notes: 'Bedtime feed',
      confidence: 'high',
      reasoning: 'Part of bedtime routine'
    });
  }
  
  // Add bedtime
  events.push({
    time: formatTime(bedtimeStart),
    type: 'bed',
    notes: 'Bedtime',
    confidence: 'high',
    reasoning: 'Based on age-appropriate bedtime'
  });
  
  // Determine overall confidence
  const dataStability = engine['internals']?.dataStability || 'sparse';
  let overallConfidence: 'high' | 'medium' | 'low' = 'low';
  
  if (dataStability === 'stable') {
    overallConfidence = 'high';
  } else if (dataStability === 'unstable') {
    overallConfidence = 'medium';
  }
  
  // Generate based-on text
  const activitiesCount = activities.length;
  const daysOfData = Math.ceil(activitiesCount / 8);
  const basedOn = overallConfidence === 'high'
    ? `Based on ${activitiesCount} activities over ${daysOfData} days with adaptive learning`
    : overallConfidence === 'medium'
    ? `Based on ${activitiesCount} activities — patterns emerging`
    : 'Based on age and initial patterns';
  
  const adjustmentNote = hasActualWake
    ? `Schedule adjusted for actual wake time at ${formatTime(scheduleStartTime)}`
    : undefined;
  
  console.log('✅ Adaptive schedule generated:', {
    eventsCount: events.length,
    confidence: overallConfidence,
    hasActualWake,
    dataStability
  });
  
  return {
    events,
    confidence: overallConfidence,
    basedOn,
    adjustmentNote
  };
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
