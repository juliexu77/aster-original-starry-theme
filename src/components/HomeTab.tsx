import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Milk, Moon, Baby, Utensils, CircleDot, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMinutes } from "date-fns";
import { Activity } from "@/components/ActivityCard";
import { useHousehold } from "@/hooks/useHousehold";
import { BabyCarePredictionEngine } from "@/utils/predictionEngine";
import { getTodayActivities } from "@/utils/activityDateFilters";
import { cn } from "@/lib/utils";

interface HomeTabProps {
  activities: Activity[];
  babyName?: string;
  userName?: string;
  babyBirthday?: string;
  onAddActivity: (type?: 'feed' | 'nap' | 'diaper', prefillActivity?: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onEndNap?: () => void;
  ongoingNap?: Activity | null;
  userRole?: string;
  showBadge?: boolean;
  percentile?: number | null;
  addActivity?: (type: string, details?: any, activityDate?: Date, activityTime?: string) => Promise<void>;
}

export const HomeTab = ({ activities, babyName, onAddActivity, onEndNap, ongoingNap }: HomeTabProps) => {
  const { t } = useLanguage();
  const { household } = useHousehold();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get today's activities
  const todayActivities = getTodayActivities(activities);

  // Helper: parse time string to minutes
  const parseTimeToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  // Calculate awake time
  const getAwakeTime = () => {
    if (ongoingNap) return null;

    const recentNaps = todayActivities.filter(a =>
      a.type === 'nap' && a.details?.endTime
    );

    if (recentNaps.length === 0) return null;

    const napsWithEndDate = recentNaps.map(nap => {
      const loggedDate = nap.loggedAt ? new Date(nap.loggedAt) : new Date();
      const baseDate = new Date(loggedDate.toDateString());
      const endMinutes = parseTimeToMinutes(nap.details!.endTime!);
      const startMinutes = nap.details?.startTime ? parseTimeToMinutes(nap.details.startTime) : null;

      const endDate = new Date(baseDate);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      endDate.setHours(endHours, endMins, 0, 0);

      if (startMinutes !== null && endMinutes < startMinutes) {
        endDate.setDate(endDate.getDate() + 1);
      }

      return { nap, endDate };
    });

    const last = napsWithEndDate.sort((a, b) => b.endDate.getTime() - a.endDate.getTime())[0];

    const awakeMinutes = differenceInMinutes(currentTime, last.endDate);
    if (awakeMinutes < 0) return null;
    const awakeHours = Math.floor(awakeMinutes / 60);
    const remainingMinutes = awakeMinutes % 60;

    return awakeHours > 0 ? `${awakeHours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  // Get sleep duration for ongoing nap
  const getSleepDuration = () => {
    if (!ongoingNap) return null;
    
    const startTime = ongoingNap.details?.startTime || ongoingNap.time;
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    const today = new Date();
    const napStart = new Date(today.toDateString());
    napStart.setHours(hour24, minutes, 0, 0);
    
    const sleepMinutes = differenceInMinutes(currentTime, napStart);
    const sleepHours = Math.floor(sleepMinutes / 60);
    const remainingMinutes = sleepMinutes % 60;
    
    return sleepHours > 0 
      ? `${sleepHours}h ${remainingMinutes}m` 
      : `${remainingMinutes}m`;
  };

  // Get last feed
  const feedsToday = todayActivities.filter(a => a.type === 'feed');
  const lastFeed = feedsToday.sort((a, b) => {
    const aTime = a.loggedAt ? new Date(a.loggedAt).getTime() : 0;
    const bTime = b.loggedAt ? new Date(b.loggedAt).getTime() : 0;
    return bTime - aTime;
  })[0];

  // Get prediction
  const engine = activities.length > 0 ? new BabyCarePredictionEngine(activities, household?.baby_birthday || undefined) : null;
  const prediction = engine?.getNextAction();

  // Format time for display
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Get what's next message
  const getWhatsNextMessage = () => {
    if (ongoingNap) {
      const sleepDuration = getSleepDuration();
      const wakeTime = prediction?.timing?.nextWakeAt;
      return {
        icon: Moon,
        title: "Next wake window starts",
        time: wakeTime ? `around ${formatTime(wakeTime)}` : "soon",
        subtitle: `Asleep for ${sleepDuration || '...'}`,
        action: "Baby woke up",
        actionType: "wakeup" as const,
        gradient: "from-primary/10 via-primary/5 to-transparent"
      };
    }

    if (prediction?.intent === "FEED_SOON") {
      const feedTime = prediction.timing?.nextFeedAt;
      const lastFeedText = lastFeed ? `Last feed: ${lastFeed.time}${lastFeed.details?.quantity ? ` (${lastFeed.details.quantity}${lastFeed.details.unit || 'ml'})` : ''}` : null;
      return {
        icon: Milk,
        title: "Next feed expected",
        time: feedTime ? `around ${formatTime(feedTime)}` : "soon",
        subtitle: lastFeedText,
        action: "Log feed",
        actionType: "feed" as const,
        gradient: "from-[hsl(var(--feed-color))]/10 via-[hsl(var(--feed-color))]/5 to-transparent"
      };
    }

    if (prediction?.intent === "START_WIND_DOWN") {
      const napTime = prediction.timing?.nextNapWindowStart;
      const awakeTime = getAwakeTime();
      return {
        icon: Moon,
        title: "Next nap likely",
        time: napTime ? `around ${formatTime(napTime)}` : "soon",
        subtitle: awakeTime ? `Awake for ${awakeTime}` : null,
        action: "Log nap now",
        actionType: "nap" as const,
        gradient: "from-[hsl(var(--nap-color))]/10 via-[hsl(var(--nap-color))]/5 to-transparent"
      };
    }

    // Default fallback
    const awakeTime = getAwakeTime();
    return {
      icon: Clock,
      title: "Building rhythm",
      time: null,
      subtitle: awakeTime ? `Awake for ${awakeTime}` : "Log activities to see predictions",
      action: null,
      actionType: null,
      gradient: "from-primary/10 via-primary/5 to-transparent"
    };
  };

  const whatsNext = getWhatsNextMessage();
  const awakeTime = getAwakeTime();
  const sleepDuration = getSleepDuration();

  // Calculate today's progress
  const feedCount = feedsToday.length;
  const napCount = todayActivities.filter(a => a.type === 'nap' && a.details?.endTime).length;
  
  // Get expected counts based on age
  const getExpectedCounts = () => {
    if (!household?.baby_birthday) return { feeds: 6, naps: 4 };
    
    const ageMonths = Math.floor((Date.now() - new Date(household.baby_birthday).getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (ageMonths < 3) return { feeds: 8, naps: 5 };
    if (ageMonths < 6) return { feeds: 6, naps: 4 };
    if (ageMonths < 9) return { feeds: 5, naps: 3 };
    if (ageMonths < 12) return { feeds: 4, naps: 2 };
    return { feeds: 3, naps: 2 };
  };

  const expected = getExpectedCounts();

  // Get encouragement message
  const getEncouragement = () => {
    if (feedCount >= expected.feeds && napCount >= expected.naps - 1) {
      return "Rhythms are smooth today — you're right on track";
    }
    if (napCount >= expected.naps - 1) {
      return `Only ${expected.naps - napCount} nap${expected.naps - napCount !== 1 ? 's' : ''} to go before bedtime`;
    }
    return "Building today's rhythm together";
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Hero Card - What's Next */}
      <Card className={cn(
        "relative overflow-hidden border-none shadow-lg p-8",
        "bg-gradient-to-br",
        whatsNext.gradient
      )}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-background/80 backdrop-blur">
                  <whatsNext.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    What's Next
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {whatsNext.title}
                </h2>
                {whatsNext.time && (
                  <p className="text-xl text-foreground/80 font-medium">
                    {whatsNext.time}
                  </p>
                )}
                {whatsNext.subtitle && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {whatsNext.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {whatsNext.action && (
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => {
                if (whatsNext.actionType === "wakeup" && onEndNap) {
                  onEndNap();
                } else if (whatsNext.actionType === "feed" || whatsNext.actionType === "nap") {
                  onAddActivity(whatsNext.actionType);
                }
              }}
            >
              {whatsNext.action}
            </Button>
          )}
        </div>
      </Card>

      {/* Quick Log Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
          onClick={() => onAddActivity('feed')}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-[hsl(var(--feed-color))]/10">
              <Milk className="h-6 w-6 text-[hsl(var(--feed-color))]" />
            </div>
            <span className="font-semibold">Log Feed</span>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
          onClick={() => onAddActivity('nap')}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-[hsl(var(--nap-color))]/10">
              <Moon className="h-6 w-6 text-[hsl(var(--nap-color))]" />
            </div>
            <span className="font-semibold">Log Nap</span>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
          onClick={() => onAddActivity('diaper')}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-[hsl(var(--diaper-color))]/10">
              <CircleDot className="h-6 w-6 text-[hsl(var(--diaper-color))]" />
            </div>
            <span className="font-semibold">Diaper</span>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
          onClick={() => onAddActivity()}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold">Solids</span>
          </div>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card className="p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Feeds</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: expected.feeds }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i < feedCount
                        ? "bg-[hsl(var(--feed-color))]"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">
                {feedCount}/{expected.feeds}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Naps</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: expected.naps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i < napCount
                        ? "bg-[hsl(var(--nap-color))]"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">
                {napCount}/{expected.naps}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Contextual Info */}
      <Card className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {ongoingNap ? "Asleep for" : "Awake for"}
            </span>
            <span className="font-semibold">
              {ongoingNap ? sleepDuration || '...' : awakeTime || 'Just woke up'}
            </span>
          </div>
          {lastFeed && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last feed</span>
              <span className="font-semibold">
                {lastFeed.time}
                {lastFeed.details?.quantity && ` · ${lastFeed.details.quantity}${lastFeed.details.unit || 'ml'}`}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Encouragement Footer */}
      <div className="text-center px-4">
        <p className="text-sm text-muted-foreground">
          {getEncouragement()}
        </p>
      </div>
    </div>
  );
};