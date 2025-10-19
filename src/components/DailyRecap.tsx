import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, AlertCircle, Moon } from "lucide-react";
import { Activity } from "@/components/ActivityCard";
import { isToday, format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { normalizeVolume } from "@/utils/unitConversion";

interface DailyRecapProps {
  activities: Activity[];
  babyName?: string;
  userRole?: string;
  onDismiss: () => void;
}

export const DailyRecap = ({ activities, babyName, userRole, onDismiss }: DailyRecapProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  // Only show to parents
  if (userRole !== 'parent') return null;

  // Check time - show between 5 PM and midnight
  const currentHour = new Date().getHours();
  if (currentHour < 17 || currentHour >= 24) return null;

  // Filter today's activities
  const todayActivities = activities.filter(a => 
    a.loggedAt && isToday(new Date(a.loggedAt))
  );

  // Check if there's any activity today
  if (todayActivities.length === 0) return null;

  // Check for caregiver activity in past several hours
  const recentCaregiverActivity = todayActivities.some(a => {
    if (!a.loggedAt) return false;
    const activityTime = new Date(a.loggedAt).getTime();
    const hoursAgo = (Date.now() - activityTime) / (1000 * 60 * 60);
    return hoursAgo <= 6; // Activity within last 6 hours
  });

  if (!recentCaregiverActivity) return null;

  // Calculate daily stats
  const feeds = todayActivities.filter(a => a.type === 'feed');
  const naps = todayActivities.filter(a => a.type === 'nap' && a.details?.endTime);
  const diapers = todayActivities.filter(a => a.type === 'diaper');
  const notes = todayActivities.filter(a => a.type === 'note');

  // Helper to parse time to minutes
  const parseTimeToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  // Calculate total feed volume
  const totalOunces = feeds.reduce((sum, feed) => {
    const quantity = parseFloat(feed.details?.quantity || '0');
    const unit = feed.details?.unit || 'oz';
    const normalized = normalizeVolume(quantity, unit);
    return sum + normalized.value;
  }, 0);

  // Calculate total nap time
  const totalNapMinutes = naps.reduce((sum, nap) => {
    const startTime = nap.details?.startTime;
    const endTime = nap.details?.endTime;
    if (!startTime || !endTime) return sum;
    
    const start = parseTimeToMinutes(startTime);
    const end = parseTimeToMinutes(endTime);
    let duration = end - start;
    
    // Handle overnight naps
    if (duration < 0) duration += 24 * 60;
    
    return sum + duration;
  }, 0);
  const napHours = Math.floor(totalNapMinutes / 60);
  const napMins = totalNapMinutes % 60;

  // Find photo
  const photoActivity = todayActivities.find(a => a.details?.photoUrl);

  // Identify noteworthy items
  const noteworthyItems: { icon: React.ReactNode; text: string }[] = [];
  
  // Low intake check (less than 20oz for babies)
  if (totalOunces > 0 && totalOunces < 20) {
    noteworthyItems.push({
      icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
      text: `Lower intake today (${totalOunces.toFixed(1)}oz)`
    });
  }

  // Skipped nap check (no naps and it's past 5 PM)
  if (naps.length === 0) {
    noteworthyItems.push({
      icon: <Moon className="w-4 h-4 text-blue-500" />,
      text: "No recorded naps today"
    });
  }

  // One-liner summary for collapsed state
  const oneLinerSummary = `${feeds.length} feeds, ${naps.length} naps, ${diapers.length} diapers`;

  if (!isExpanded) {
    return (
      <Card className="mb-4 border-primary/20 bg-card/50">
        <CardContent className="p-4">
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="font-medium text-sm text-foreground">Today's Recap</h3>
              <p className="text-xs text-muted-foreground">{oneLinerSummary}</p>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-primary/20 bg-card/50 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-base text-foreground">
              How {babyName?.split(' ')[0] || 'baby'}'s day went
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-7 w-7 p-0"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Photo if available */}
        {photoActivity?.details?.photoUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={photoActivity.details.photoUrl} 
              alt="Today's moment"
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-foreground">{feeds.length}</p>
            <p className="text-xs text-muted-foreground">Feeds</p>
            {totalOunces > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{totalOunces.toFixed(1)}oz total</p>
            )}
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-foreground">{naps.length}</p>
            <p className="text-xs text-muted-foreground">Naps</p>
            {totalNapMinutes > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {napHours > 0 ? `${napHours}h ${napMins}m` : `${napMins}m`}
              </p>
            )}
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-foreground">{diapers.length}</p>
            <p className="text-xs text-muted-foreground">Diapers</p>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-foreground">{notes.length}</p>
            <p className="text-xs text-muted-foreground">Notes</p>
          </div>
        </div>

        {/* Noteworthy items */}
        {noteworthyItems.length > 0 && (
          <div className="space-y-2">
            {noteworthyItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                {item.icon}
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Gentle message */}
        <p className="text-sm text-muted-foreground italic">
          A calm reflection as the afternoon winds down.
        </p>
      </CardContent>
    </Card>
  );
};