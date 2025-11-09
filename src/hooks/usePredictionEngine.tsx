import { useMemo } from "react";
import { Activity } from "@/components/ActivityCard";
import { BabyCarePredictionEngine, NextActionResult } from "@/utils/predictionEngine";
import { useHousehold } from "./useHousehold";

/**
 * Unified prediction hook - one brain, many voices
 * All prediction logic flows through this single source of truth
 */
export function usePredictionEngine(activities: Activity[]) {
  const { household } = useHousehold();

  const prediction = useMemo(() => {
    console.log('🔮 usePredictionEngine - checking data:', { 
      activitiesCount: activities?.length || 0,
      hasActivities: !!activities,
      babyBirthday: household?.baby_birthday,
      sampleActivities: activities?.slice(0, 3).map(a => ({
        type: a.type,
        time: a.time,
        loggedAt: a.loggedAt,
        timezone: a.timezone
      }))
    });

    if (!activities || activities.length === 0) {
      console.log('🚫 No activities available for predictions');
      return null;
    }

    // Check minimum data requirements for predictions
    const naps = activities.filter(a => a.type === 'nap');
    const feeds = activities.filter(a => a.type === 'feed');
    
    console.log('🔮 Filtered activity counts:', { 
      totalActivities: activities.length,
      naps: naps.length, 
      feeds: feeds.length,
      activityTypes: [...new Set(activities.map(a => a.type))],
      feedSample: feeds[0]
    });
    
    // P2: Relaxed requirements
    // - Show age-based nap predictions after 1 nap (but not feed predictions until 4+ feeds)
    // - Show "Still learning" badge until 4+4
    const hasMinNaps = naps.length >= 1;
    const hasMinFeeds = feeds.length >= 4;
    const isFullyPersonalized = naps.length >= 4 && feeds.length >= 4;
    
    if (!hasMinNaps) {
      console.log('🚫 Insufficient data for predictions:', { 
        naps: naps.length, 
        feeds: feeds.length,
        required: { naps: 1, feeds: 0 }
      });
      return null;
    }

    console.log('✅ Sufficient data - creating prediction engine');
    const engine = new BabyCarePredictionEngine(
      activities,
      household?.baby_birthday || undefined
    );

    const result = engine.getNextAction();
    
    // Add learning state to result
    const enrichedResult = {
      ...result,
      isStillLearning: !isFullyPersonalized,
      canPredictFeeds: hasMinFeeds,
      canPredictNaps: hasMinNaps
    };
    
    console.log('🔮 Prediction result:', {
      intent: enrichedResult.intent,
      confidence: enrichedResult.confidence,
      isStillLearning: enrichedResult.isStillLearning,
      canPredictFeeds: enrichedResult.canPredictFeeds,
      canPredictNaps: enrichedResult.canPredictNaps,
      rationale: enrichedResult.rationale,
      timing: enrichedResult.timing,
      reasons: enrichedResult.reasons
    });
    return enrichedResult;
  }, [activities, household?.baby_birthday]);

  // Helper to translate intent to user-friendly copy
  const getIntentCopy = (result: any | null, babyName?: string): string => {
    if (!result) return "Keep logging activities to build your baby's rhythm";

    const name = babyName?.split(' ')[0] || 'Baby';
    const { intent, confidence, timing, canPredictFeeds } = result;
    
    // Don't predict feeds if we don't have enough feed data
    if (intent === 'FEED_SOON' && !canPredictFeeds) {
      return `Watch for hunger cues — still learning ${name}'s feeding patterns`;
    }

    // High confidence - declarative
    if (confidence === 'high') {
      switch (intent) {
        case 'FEED_SOON':
          return timing.nextFeedAt
            ? `Next feed around ${formatTime(timing.nextFeedAt)}${timing.expectedFeedVolume ? ` — typically ${timing.expectedFeedVolume} ml` : ''}`
            : `${name} will likely be ready for a feed soon`;
        case 'START_WIND_DOWN':
          return timing.nextNapWindowStart
            ? `Nap window starting around ${formatTime(timing.nextNapWindowStart)}`
            : `Time to start winding down for a nap`;
        case 'LET_SLEEP_CONTINUE':
          return timing.nextWakeAt
            ? `May wake around ${formatTime(timing.nextWakeAt)}`
            : `${name} is resting peacefully`;
        case 'INDEPENDENT_TIME':
          return `${name} is in a good groove right now`;
        default:
          return 'All is well';
      }
    }

    // Medium confidence - suggestive
    if (confidence === 'medium') {
      switch (intent) {
        case 'FEED_SOON':
          return timing.nextFeedAt
            ? `Likely feed around ${formatTime(timing.nextFeedAt)} — watch for hunger cues`
            : `Feed could be coming up — watch for cues`;
        case 'START_WIND_DOWN':
          return timing.nextNapWindowStart
            ? `Nap likely around ${formatTime(timing.nextNapWindowStart)} — watch for sleepy cues`
            : `Watch for sleepy cues — nap window approaching`;
        case 'LET_SLEEP_CONTINUE':
          // Check if there's an ongoing nap to determine sleep type
          const ongoingNap = activities.find(a => a.type === 'nap' && a.details?.startTime && !a.details?.endTime);
          const isNightSleep = ongoingNap?.details?.isNightSleep;
          const sleepType = isNightSleep ? 'sleeping' : 'napping';
          return timing.nextWakeAt
            ? `Likely waking around ${formatTime(timing.nextWakeAt)}`
            : `${name} is ${sleepType} — let them rest`;
        case 'INDEPENDENT_TIME':
          return `${name} is showing flexible patterns — that's okay`;
        default:
          return "You're finding your rhythm";
      }
    }

    // Low confidence - educational
    switch (intent) {
      case 'FEED_SOON':
        return 'Feed or nap could be next — watch for hunger and sleep cues';
      case 'START_WIND_DOWN':
        return 'Nap or feed could be next — trust your instincts';
      case 'LET_SLEEP_CONTINUE':
        return `${name} is resting — we'll learn more as patterns emerge`;
      case 'INDEPENDENT_TIME':
        return `${name} is between patterns — both feeding and nap could happen soon`;
      default:
        return 'Keep logging to help AI understand your rhythm better';
    }
  };

  // Helper to get reasons with appropriate tone
  const getReasonsCopy = (result: NextActionResult | null): string[] => {
    if (!result || result.reasons.length === 0) {
      return ['AI building pattern model from your logs'];
    }
    return result.reasons;
  };

  // Helper to format time
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper to get progress comparison text
  const getProgressText = (result: NextActionResult | null, type: 'feeds' | 'naps'): string => {
    if (!result) return '';

    const { dayProgress } = result;
    const count = type === 'feeds' ? dayProgress.feedsToday : dayProgress.napsToday;
    const min = type === 'feeds' ? dayProgress.expectedFeedsMin : dayProgress.expectedNapsMin;
    const max = type === 'feeds' ? dayProgress.expectedFeedsMax : dayProgress.expectedNapsMax;

    if (count === 0) {
      return type === 'feeds'
        ? 'Just getting started today — every feed builds your routine'
        : 'Working on today first nap — every rest counts';
    }

    if (count >= min && count <= max) {
      return type === 'feeds'
        ? 'Right on rhythm — steady days help build confident nights'
        : 'Solid nap rhythm — practicing self-regulation beautifully';
    }

    if (count < min) {
      return type === 'feeds'
        ? 'Light feeding day — still within healthy range'
        : 'Shorter nap day — normal during transitions';
    }

    return type === 'feeds'
      ? 'Extra feeds today — often a sign of growth spurt or comfort need'
      : 'Extra restful day — sometimes babies need more recovery time';
  };

  return {
    prediction,
    getIntentCopy,
    getReasonsCopy,
    getProgressText,
    formatTime
  };
}
