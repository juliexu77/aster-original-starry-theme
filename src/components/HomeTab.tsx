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
  onAddActivity: () => void;
}

export const HomeTab = ({ activities, babyName, userName, onAddActivity }: HomeTabProps) => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

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
                {summary.feedCount >= 6 ? 'Right on rhythm' : 'Building your routine'}
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
                {summary.napCount >= 2 ? 'Consistent sleep patterns' : 'Every nap is progress'}
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
