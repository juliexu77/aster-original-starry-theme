import { useMemo } from "react";
import { Activity } from "@/components/ActivityCard";
import { format, startOfDay, differenceInMinutes, isAfter } from "date-fns";
import { useNightSleepWindow } from "@/hooks/useNightSleepWindow";
import { Milk } from "lucide-react";

interface FeedFrequencyProps {
  activities: Activity[];
}

export const FeedFrequency = ({ activities }: FeedFrequencyProps) => {
  const { nightSleepStartHour, nightSleepEndHour } = useNightSleepWindow();
  
  const feedData = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    
    // Get today's feeds
    const todayFeeds = activities.filter(a => {
      if (a.type !== 'feed') return false;
      const activityDate = new Date(a.loggedAt);
      return activityDate >= todayStart;
    }).sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
    
    // Convert feeds to time markers (minutes since midnight)
    const feedMarkers = todayFeeds.map(feed => {
      const feedTime = new Date(feed.loggedAt);
      return differenceInMinutes(feedTime, todayStart);
    });
    
    // Define day segments based on sleep windows
    const morningStart = nightSleepEndHour * 60;
    const nightStart = nightSleepStartHour * 60;
    const dayDuration = nightStart - morningStart;
    const nightDuration = (24 * 60) - dayDuration;
    
    // Categorize feeds into day/night
    const dayFeeds = feedMarkers.filter(m => m >= morningStart && m < nightStart);
    const nightFeeds = feedMarkers.filter(m => m < morningStart || m >= nightStart);
    
    return {
      dayFeeds,
      nightFeeds,
      morningStart,
      nightStart,
      dayDuration,
      nightDuration,
      totalFeeds: todayFeeds.length
    };
  }, [activities, nightSleepStartHour, nightSleepEndHour]);
  
  // Calculate position percentage along the timeline
  const getPositionPercent = (minutes: number, segmentStart: number, segmentDuration: number) => {
    const relativeMinutes = minutes - segmentStart;
    return Math.max(0, Math.min(100, (relativeMinutes / segmentDuration) * 100));
  };
  
  return (
    <div className="w-full rounded-[28px] bg-gradient-to-b from-[hsl(22,45%,94%)] via-[hsl(18,40%,90%)] to-[hsl(16,36%,87%)] border border-[hsl(18,28%,85%)]/40 shadow-[inset_0_1px_0_0_hsla(30,60%,98%,0.6),inset_0_0_16px_0_hsla(30,50%,95%,0.25),0_2px_4px_-1px_hsla(18,45%,40%,0.04),0_8px_20px_-4px_hsla(18,45%,45%,0.1),0_0_30px_-8px_hsla(15,45%,65%,0.12)] p-6 dark:rounded-xl dark:bg-card dark:border-border/40 dark:shadow-none transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Milk className="h-5 w-5 text-[hsl(var(--rb-terracotta-rose))]" />
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Today's Feeds</h3>
        </div>
        <div className="text-2xl font-bold text-[hsl(var(--rb-terracotta-rose))] dark:text-primary">
          {feedData.totalFeeds}
        </div>
      </div>
      
      {/* Day Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-muted-foreground font-medium">
            {format(new Date().setHours(feedData.morningStart / 60, 0), 'h:mm a')}
          </span>
          <span className="text-xs text-[hsl(var(--rb-terracotta-rose))] font-semibold">Day</span>
          <span className="text-xs text-muted-foreground font-medium">
            {format(new Date().setHours(feedData.nightStart / 60, 0), 'h:mm a')}
          </span>
        </div>
        
        {/* Day timeline bar */}
        <div className="relative h-3 rounded-full bg-gradient-to-r from-[hsl(40,60%,85%)] via-[hsl(45,70%,88%)] to-[hsl(35,55%,82%)] shadow-inner overflow-visible">
          {feedData.dayFeeds.map((feedTime, idx) => {
            const position = getPositionPercent(feedTime, feedData.morningStart, feedData.dayDuration);
            return (
              <div
                key={`day-feed-${idx}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-[hsl(var(--rb-terracotta-rose))] opacity-30 blur-md animate-pulse" />
                  {/* Dot */}
                  <div className="relative w-4 h-4 rounded-full bg-[hsl(var(--rb-terracotta-rose))] border-2 border-white shadow-lg" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Night Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-muted-foreground font-medium">
            {format(new Date().setHours(feedData.nightStart / 60, 0), 'h:mm a')}
          </span>
          <span className="text-xs text-[hsl(var(--rb-berry-mauve))] font-semibold">Night</span>
          <span className="text-xs text-muted-foreground font-medium">
            {format(new Date().setHours(feedData.morningStart / 60, 0), 'h:mm a')}
          </span>
        </div>
        
        {/* Night timeline bar */}
        <div className="relative h-3 rounded-full bg-gradient-to-r from-[hsl(250,35%,78%)] via-[hsl(245,40%,75%)] to-[hsl(255,32%,80%)] shadow-inner overflow-visible">
          {feedData.nightFeeds.map((feedTime, idx) => {
            // For night feeds, calculate position within night window
            let relativeTime = feedTime;
            if (feedTime >= feedData.nightStart) {
              relativeTime = feedTime - feedData.nightStart;
            } else {
              relativeTime = feedTime + (24 * 60 - feedData.nightStart);
            }
            const position = (relativeTime / feedData.nightDuration) * 100;
            
            return (
              <div
                key={`night-feed-${idx}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-[hsl(var(--rb-berry-mauve))] opacity-30 blur-md animate-pulse" />
                  {/* Dot */}
                  <div className="relative w-4 h-4 rounded-full bg-[hsl(var(--rb-berry-mauve))] border-2 border-white shadow-lg" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Empty state */}
      {feedData.totalFeeds === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No feeds logged today yet
        </div>
      )}
    </div>
  );
};
