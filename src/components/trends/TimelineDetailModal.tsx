import { Activity } from "@/components/ActivityCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, eachDayOfInterval } from "date-fns";
import { isDaytimeNap } from "@/utils/napClassification";
import { normalizeVolume } from "@/utils/unitConversion";
import { getActivitiesByDate } from "@/utils/activityDateFilters";
import { Moon, Sun, Milk, Clock } from "lucide-react";

interface TimelineDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekStart: Date;
  weekEnd: Date;
  activities: Activity[];
  metricType?: 'nightSleep' | 'dayNaps' | 'feedVolume' | 'wakeWindows';
  nightSleepStartHour: number;
  nightSleepEndHour: number;
}

export const TimelineDetailModal = ({
  open,
  onOpenChange,
  weekStart,
  weekEnd,
  activities,
  metricType,
  nightSleepStartHour,
  nightSleepEndHour
}: TimelineDetailModalProps) => {
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const parseTimeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const getDailyData = (date: Date) => {
    const dayActivities = getActivitiesByDate(activities, date);
    
    switch (metricType) {
      case 'nightSleep': {
        const nightSleeps = dayActivities.filter(a => 
          a.type === 'nap' && !isDaytimeNap(a, nightSleepStartHour, nightSleepEndHour)
        );
        let totalMinutes = 0;
        nightSleeps.forEach(sleep => {
          if (sleep.details?.startTime && sleep.details?.endTime) {
            const start = parseTimeToMinutes(sleep.details.startTime);
            let end = parseTimeToMinutes(sleep.details.endTime);
            if (end < start) end += 24 * 60;
            totalMinutes += (end - start);
          }
        });
        return { value: totalMinutes / 60, unit: 'h', icon: Moon, activities: nightSleeps };
      }
      
      case 'dayNaps': {
        const dayNaps = dayActivities.filter(a => 
          a.type === 'nap' && isDaytimeNap(a, nightSleepStartHour, nightSleepEndHour)
        );
        return { value: dayNaps.length, unit: ' naps', icon: Sun, activities: dayNaps };
      }
      
      case 'feedVolume': {
        const feeds = dayActivities.filter(a => a.type === 'feed');
        let total = 0;
        feeds.forEach(feed => {
          if (feed.details?.quantity) {
            const normalized = normalizeVolume(feed.details.quantity, feed.details.unit);
            total += Math.min(normalized.value, 20);
          }
        });
        return { value: total, unit: 'oz', icon: Milk, activities: feeds };
      }
      
      case 'wakeWindows': {
        const dayNaps = dayActivities.filter(a => 
          a.type === 'nap' && isDaytimeNap(a, nightSleepStartHour, nightSleepEndHour) && 
          a.details?.startTime && a.details?.endTime
        );
        const windows: number[] = [];
        for (let i = 1; i < dayNaps.length; i++) {
          const prevEnd = parseTimeToMinutes(dayNaps[i - 1].details.endTime!);
          const currStart = parseTimeToMinutes(dayNaps[i].details.startTime!);
          const window = currStart - prevEnd;
          if (window > 0 && window < 360) windows.push(window);
        }
        const avgWindow = windows.length > 0 ? windows.reduce((a, b) => a + b, 0) / windows.length / 60 : 0;
        return { value: avgWindow, unit: 'h', icon: Clock, activities: dayNaps };
      }
      
      default:
        return { value: 0, unit: '', icon: Clock, activities: [] };
    }
  };

  const getTitle = () => {
    switch (metricType) {
      case 'nightSleep': return 'Night Sleep Details';
      case 'dayNaps': return 'Day Naps Details';
      case 'feedVolume': return 'Feed Volume Details';
      case 'wakeWindows': return 'Wake Windows Details';
      default: return 'Details';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </DialogHeader>
        
        <div className="space-y-3">
          {days.map((day) => {
            const data = getDailyData(day);
            const Icon = data.icon;
            
            return (
              <div key={day.toISOString()} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{format(day, 'EEE, MMM d')}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {data.value > 0 ? `${data.value.toFixed(1)}${data.unit}` : '-'}
                  </span>
                </div>
                
                {data.activities.length > 0 && (
                  <div className="space-y-1 pl-6">
                    {data.activities.map((activity, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        {activity.details?.startTime && activity.details?.endTime && (
                          <span>{activity.details.startTime} - {activity.details.endTime}</span>
                        )}
                        {activity.type === 'feed' && activity.details?.quantity && (
                          <span> • {activity.details.quantity} {activity.details.unit}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
