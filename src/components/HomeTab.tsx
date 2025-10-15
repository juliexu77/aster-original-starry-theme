import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Baby, Droplet, Moon, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format, isToday, differenceInMinutes } from "date-fns";

interface Activity {
  id: string;
  type: string;
  time: string;
  loggedAt?: string;
  details: any;
}

interface HomeTabProps {
  activities: Activity[];
  babyName?: string;
  userName?: string;
  babyBirthday?: string;
  onAddActivity: () => void;
}

export const HomeTab = ({ activities, babyName, userName, babyBirthday, onAddActivity }: HomeTabProps) => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calculate baby's age in months
  const getBabyAgeInMonths = () => {
    if (!babyBirthday) return null;
    const birthDate = new Date(babyBirthday);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
  };

  const babyAgeMonths = getBabyAgeInMonths();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get today's activities only
  const todayActivities = activities.filter(a => 
    a.loggedAt && isToday(new Date(a.loggedAt))
  );

  // Find ongoing nap
  const ongoingNap = todayActivities.find(
    a => a.type === 'nap' && a.details?.startTime && !a.details?.endTime
  );

  // Calculate awake time
  const getAwakeTime = () => {
    if (ongoingNap) return null;
    
    const lastNap = todayActivities
      .filter(a => a.type === 'nap' && a.details?.endTime)
      .sort((a, b) => new Date(b.loggedAt!).getTime() - new Date(a.loggedAt!).getTime())[0];
    
    if (!lastNap || !lastNap.details?.endTime) return null;
    
    // Parse end time
    const [time, period] = lastNap.details.endTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    const wakeTime = new Date(lastNap.loggedAt!);
    wakeTime.setHours(hour24, minutes, 0, 0);
    
    const awakeMinutes = differenceInMinutes(currentTime, wakeTime);
    const awakeHours = Math.floor(awakeMinutes / 60);
    const remainingMinutes = awakeMinutes % 60;
    
    if (awakeHours > 0) {
      return `${awakeHours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  // Get last feed
  const lastFeed = todayActivities
    .filter(a => a.type === 'feed')
    .sort((a, b) => new Date(b.loggedAt!).getTime() - new Date(a.loggedAt!).getTime())[0];

  // Get last diaper
  const lastDiaper = todayActivities
    .filter(a => a.type === 'diaper')
    .sort((a, b) => new Date(b.loggedAt!).getTime() - new Date(a.loggedAt!).getTime())[0];

  // Get sleep status message
  const getSleepStatus = () => {
    if (ongoingNap) {
      const startTime = ongoingNap.details?.startTime || ongoingNap.time;
      return `${babyName || 'Baby'} has been sleeping since ${startTime}`;
    }
    
    const awakeTime = getAwakeTime();
    if (awakeTime) {
      return `${babyName || 'Baby'} has been awake for ${awakeTime}`;
    }
    
    return `${babyName || 'Baby'} is ready to start the day`;
  };

  // Activity summary data
  const getDailySummary = () => {
    const feedCount = todayActivities.filter(a => a.type === 'feed').length;
    const napCount = todayActivities.filter(a => a.type === 'nap' && a.details?.endTime).length;
    const diaperCount = todayActivities.filter(a => a.type === 'diaper').length;

    return { feedCount, napCount, diaperCount };
  };

  // Get age-appropriate expectations
  const getExpectedFeeds = (months: number | null) => {
    if (months === null) return null;
    if (months < 1) return { min: 8, max: 12, typical: "8-12" };
    if (months < 3) return { min: 6, max: 8, typical: "6-8" };
    if (months < 6) return { min: 5, max: 7, typical: "5-7" };
    if (months < 9) return { min: 4, max: 6, typical: "4-6" };
    if (months < 12) return { min: 3, max: 5, typical: "3-5" };
    return { min: 3, max: 4, typical: "3-4" };
  };

  const getExpectedNaps = (months: number | null) => {
    if (months === null) return null;
    if (months < 3) return { min: 4, max: 6, typical: "4-6" };
    if (months < 6) return { min: 3, max: 4, typical: "3-4" };
    if (months < 9) return { min: 2, max: 3, typical: "2-3" };
    if (months < 12) return { min: 2, max: 3, typical: "2-3" };
    if (months < 18) return { min: 1, max: 2, typical: "1-2" };
    return { min: 1, max: 2, typical: "1-2" };
  };

  const getFeedComparison = (count: number, months: number | null) => {
    const expected = getExpectedFeeds(months);
    if (!expected) return "Tracking your unique rhythm";
    
    if (count >= expected.min && count <= expected.max) {
      return `Right on track for ${months} months (typical: ${expected.typical})`;
    } else if (count < expected.min) {
      return `Below typical range (${expected.typical} for ${months} months)`;
    } else {
      return `Above typical range (${expected.typical} for ${months} months)`;
    }
  };

  const getNapComparison = (count: number, months: number | null) => {
    const expected = getExpectedNaps(months);
    if (!expected) return "Every nap is progress";
    
    if (count >= expected.min && count <= expected.max) {
      return `Consistent with ${months}-month patterns (${expected.typical} typical)`;
    } else if (count < expected.min) {
      return `Shorter schedule (${expected.typical} typical for ${months} months)`;
    } else {
      return `Extra naps today (${expected.typical} typical for ${months} months)`;
    }
  };

  const summary = getDailySummary();
  const awakeTime = getAwakeTime();

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      {/* Greeting Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          {getGreeting()}{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {getSleepStatus()}
        </p>
      </div>

      {/* Today's Quick View */}
      <Card className="p-4 space-y-3 bg-card/50 backdrop-blur">
        <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wide">
          Today at a glance
        </h2>
        
        <div className="space-y-2">
          {/* Last Feed */}
          {lastFeed && (
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Last feed: <span className="font-medium">{lastFeed.time}</span>
                  {lastFeed.details?.amount && (
                    <span className="text-muted-foreground ml-1">
                      • {lastFeed.details.amount} {lastFeed.details.unit || 'ml'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Last Diaper */}
          {lastDiaper && (
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Last diaper: <span className="font-medium">{lastDiaper.time}</span>
                  {lastDiaper.details?.type && (
                    <span className="text-muted-foreground ml-1">
                      • {lastDiaper.details.type}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Awake Window */}
          {!ongoingNap && awakeTime && (
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Awake window: <span className="font-medium">{awakeTime}</span>
                </p>
              </div>
            </div>
          )}

          {/* Currently Sleeping */}
          {ongoingNap && (
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Currently sleeping since <span className="font-medium">{ongoingNap.details?.startTime || ongoingNap.time}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Add Prompt */}
        {todayActivities.length === 0 && (
          <button
            onClick={onAddActivity}
            className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-lg"
          >
            Tap the green + below to log your first event
          </button>
        )}
      </Card>

      {/* How You're Doing Today */}
      <Card className="p-4 space-y-3 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wide">
            How you're doing today
          </h2>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-lg">🌤️</span>
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium">Feeds:</span> {summary.feedCount} logged today
              </p>
              <p className="text-xs text-muted-foreground">
                {getFeedComparison(summary.feedCount, babyAgeMonths)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-lg">🌈</span>
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium">Sleep:</span> {summary.napCount} nap{summary.napCount !== 1 ? 's' : ''} completed
              </p>
              <p className="text-xs text-muted-foreground">
                {getNapComparison(summary.napCount, babyAgeMonths)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-lg">🌿</span>
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium">Overall:</span> Calm and steady
              </p>
              <p className="text-xs text-muted-foreground">
                You're doing great—keep trusting your rhythm
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity Summary */}
      {todayActivities.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wide">
            Recent activity
          </h2>
          <div className="text-sm text-muted-foreground">
            {summary.feedCount} feed{summary.feedCount !== 1 ? 's' : ''} • 
            {summary.napCount} nap{summary.napCount !== 1 ? 's' : ''} • 
            {summary.diaperCount} diaper{summary.diaperCount !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};
