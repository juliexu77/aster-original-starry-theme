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
    const quantity = parseFloat(String(feed.details.quantity).replace(/[^\d.]/g, ''));
    if (!isNaN(quantity)) totalVolume += quantity;
  }
});

// Helper to parse time and compute minutes
const timeToMinutes = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let m = (hours % 12) * 60 + minutes;
  if (period === 'PM' && hours !== 12) m += 12 * 60;
  if (period === 'AM' && hours === 12) m = minutes;
  return m;
};

// Calculate total nap time from actual start/end
let totalNapMinutes = 0;
naps.forEach(nap => {
  const start = nap.details?.startTime;
  const end = nap.details?.endTime;
  if (start && end) {
    let diff = timeToMinutes(end) - timeToMinutes(start);
    if (diff < 0) diff += 24 * 60; // handle wrap
    totalNapMinutes += diff;
  }
});
const napHours = Math.floor(totalNapMinutes / 60);
const napMins = totalNapMinutes % 60;

// Time since last feed
let timeSinceLastFeed = "";
if (feeds.length > 0) {
  const lastFeed = feeds.slice().sort((a, b) => timeToMinutes(b.time) - timeToMinutes(a.time))[0];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let diff = nowMinutes - timeToMinutes(lastFeed.time);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  timeSinceLastFeed = `${h > 0 ? `${h}h ` : ''}${m}m ago`;
}

return {
  totalFeeds: feeds.length,
  totalVolume: totalVolume > 0 ? Math.round(totalVolume * 10) / 10 : null,
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