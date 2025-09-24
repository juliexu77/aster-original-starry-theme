import { Activity } from "./ActivityCard";
import { Baby, Moon, Clock } from "lucide-react";

interface InlineInsightsProps {
  activities: Activity[];
}

export const InlineInsights = ({ activities }: InlineInsightsProps) => {
  const getTodaysStats = () => {
    const today = new Date().toDateString();
    const todaysActivities = activities.filter(activity => {
      // In a real app, you'd check the actual date
      return true; // For demo, using all activities
    });

    const feeds = todaysActivities.filter(a => a.type === "feed");
    const naps = todaysActivities.filter(a => a.type === "nap");
    
    // Calculate total feed volume
    let totalVolume = 0;
    feeds.forEach(feed => {
      if (feed.details?.quantity) {
        const quantity = parseFloat(feed.details.quantity.replace(/[^\d.]/g, ''));
        if (!isNaN(quantity)) {
          totalVolume += quantity;
        }
      }
    });

    // Calculate total nap time (simplified)
    const totalNapMinutes = naps.length * 90; // Assume 1.5h average per nap
    const napHours = Math.floor(totalNapMinutes / 60);
    const napMins = totalNapMinutes % 60;

    // Time since last feed
    const lastFeed = feeds[0]; // Assuming activities are sorted by time
    let timeSinceLastFeed = "";
    if (lastFeed) {
      // This is simplified - in a real app you'd calculate actual time difference
      timeSinceLastFeed = "2h 15m ago";
    }

    return {
      totalFeeds: feeds.length,
      totalVolume: totalVolume > 0 ? totalVolume : null,
      totalNapTime: totalNapMinutes > 0 ? `${napHours}h${napMins > 0 ? ` ${napMins}m` : ''}` : null,
      timeSinceLastFeed,
      hasActivities: todaysActivities.length > 0
    };
  };

  const stats = getTodaysStats();

  if (!stats.hasActivities) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-4 mb-6 border border-primary/10">
      <div className="flex items-center gap-4 text-sm">
        {stats.totalFeeds > 0 && (
          <div className="flex items-center gap-1.5">
            <Baby className="h-4 w-4 text-pink-600" />
            <span className="font-medium text-foreground">
              {stats.totalVolume ? `${stats.totalVolume}oz` : `${stats.totalFeeds} feeds`} today
            </span>
            {stats.totalVolume && (
              <span className="text-muted-foreground">({stats.totalFeeds} feeds)</span>
            )}
          </div>
        )}

        {stats.totalNapTime && (
          <div className="flex items-center gap-1.5">
            <Moon className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-foreground">
              {stats.totalNapTime} naps so far
            </span>
          </div>
        )}

        {stats.timeSinceLastFeed && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-muted-foreground text-xs">
              Last feed {stats.timeSinceLastFeed}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};