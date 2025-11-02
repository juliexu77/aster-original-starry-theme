import { Activity } from "./ActivityCard";
import { Card } from "@/components/ui/card";
import { Clock, Milk, Moon, Sun, Sunrise, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, ChevronDown, Lightbulb } from "lucide-react";
import { calculateAgeInWeeks } from "@/utils/huckleberrySchedules";
import { useHousehold } from "@/hooks/useHousehold";
import { usePredictionEngine } from "@/hooks/usePredictionEngine";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface InsightsTabProps {
  activities: Activity[];
}

interface TimeSegment {
  start: number; // hour (0-24)
  end: number;
  type: 'awake' | 'nap' | 'night';
  label?: string;
}

interface DailyPattern {
  wakeTime: string;
  naps: Array<{ start: string; end: string; duration: number }>;
  feeds: Array<{ time: string }>;
  bedtime: string;
  nightWake?: string;
}

export const InsightsTab = ({ activities }: InsightsTabProps) => {
  const { household, loading: householdLoading } = useHousehold();
  const { prediction, getIntentCopy, formatTime } = usePredictionEngine(activities);
  const [showTrendDetails, setShowTrendDetails] = useState(false);
  
  if (householdLoading || !household) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rhythm data...</p>
        </div>
      </div>
    );
  }

  const ageInWeeks = household?.baby_birthday ? calculateAgeInWeeks(household.baby_birthday) : 0;
  const ageInMonths = Math.floor(ageInWeeks / 4.33);
  const babyName = household?.baby_name || 'Baby';

  // Calculate average daily pattern from last 5 days
  const averagePattern = useMemo(() => {
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(a => {
      const activityDate = a.loggedAt ? new Date(a.loggedAt) : new Date();
      return activityDate >= fiveDaysAgo;
    });

    // Helper to parse time strings to minutes since midnight
    const parseTimeToMinutes = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours % 12) * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes = minutes;
      return totalMinutes;
    };

    // Calculate average nap times
    const naps = recentActivities.filter(a => a.type === 'nap' && a.details.startTime && a.details.endTime);
    const napsByOrder: Array<Array<{ start: number; end: number }>> = [[], [], []]; // First 3 naps

    naps.forEach(nap => {
      const startMinutes = parseTimeToMinutes(nap.details.startTime!);
      const endMinutes = parseTimeToMinutes(nap.details.endTime!);
      
      // Categorize into nap order based on time
      if (startMinutes < 11 * 60) napsByOrder[0].push({ start: startMinutes, end: endMinutes });
      else if (startMinutes < 15 * 60) napsByOrder[1].push({ start: startMinutes, end: endMinutes });
      else if (startMinutes < 19 * 60) napsByOrder[2].push({ start: startMinutes, end: endMinutes });
    });

    // Calculate averages
    const avgNaps = napsByOrder.map((napGroup, idx) => {
      if (napGroup.length === 0) return null;
      const avgStart = napGroup.reduce((sum, n) => sum + n.start, 0) / napGroup.length;
      const avgEnd = napGroup.reduce((sum, n) => sum + n.end, 0) / napGroup.length;
      const avgDuration = avgEnd - avgStart;
      
      return {
        start: formatMinutesToTime(avgStart),
        end: formatMinutesToTime(avgEnd),
        duration: Math.round(avgDuration),
        order: idx + 1
      };
    }).filter(Boolean);

    // Calculate average wake time (first activity or nap end before 9am)
    const morningActivities = recentActivities.filter(a => {
      const time = parseTimeToMinutes(a.time);
      return time >= 5 * 60 && time < 9 * 60;
    });
    const avgWakeMinutes = morningActivities.length > 0
      ? morningActivities.reduce((sum, a) => sum + parseTimeToMinutes(a.time), 0) / morningActivities.length
      : 6 * 60 + 30;

    // Calculate average bedtime (last nap after 6pm)
    const eveningNaps = naps.filter(n => parseTimeToMinutes(n.details.startTime!) >= 18 * 60);
    const avgBedtimeMinutes = eveningNaps.length > 0
      ? eveningNaps.reduce((sum, n) => sum + parseTimeToMinutes(n.details.startTime!), 0) / eveningNaps.length
      : 19 * 60 + 30;

    return {
      wakeTime: formatMinutesToTime(avgWakeMinutes),
      naps: avgNaps as Array<{ start: string; end: string; duration: number; order: number }>,
      bedtime: formatMinutesToTime(avgBedtimeMinutes),
      feeds: [] // Simplified for now
    };
  }, [activities]);

  // Helper to format minutes to time string
  const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Calculate pattern shifts (this week vs last week)
  const patternShifts = useMemo(() => {
    const now = new Date();
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeekNaps = activities.filter(a => {
      const date = a.loggedAt ? new Date(a.loggedAt) : new Date();
      return a.type === 'nap' && date >= thisWeekStart;
    });
    
    const lastWeekNaps = activities.filter(a => {
      const date = a.loggedAt ? new Date(a.loggedAt) : new Date();
      return a.type === 'nap' && date >= lastWeekStart && date < thisWeekStart;
    });

    const shifts: string[] = [];
    
    // Nap timing comparison
    if (thisWeekNaps.length > 0 && lastWeekNaps.length > 0) {
      const thisWeekAvgStart = thisWeekNaps.reduce((sum, n) => {
        if (!n.details.startTime) return sum;
        const [time, period] = n.details.startTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        return sum + (hours + minutes / 60);
      }, 0) / thisWeekNaps.length;
      
      const lastWeekAvgStart = lastWeekNaps.reduce((sum, n) => {
        if (!n.details.startTime) return sum;
        const [time, period] = n.details.startTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        return sum + (hours + minutes / 60);
      }, 0) / lastWeekNaps.length;
      
      const diff = Math.abs(thisWeekAvgStart - lastWeekAvgStart) * 60;
      if (diff > 15) {
        shifts.push(`Naps have been starting ~${Math.round(diff)} min ${thisWeekAvgStart < lastWeekAvgStart ? 'earlier' : 'later'} this week`);
      }
    }
    
    // Total sleep consistency
    const thisWeekSleepTotal = thisWeekNaps.reduce((sum, n) => {
      if (!n.details.startTime || !n.details.endTime) return sum;
      const parseTime = (t: string) => {
        const [time, period] = t.split(' ');
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m + (period === 'PM' && h !== 12 ? 12 * 60 : 0);
      };
      return sum + (parseTime(n.details.endTime) - parseTime(n.details.startTime));
    }, 0) / thisWeekNaps.length;
    
    if (thisWeekSleepTotal > 0) {
      const hours = Math.floor(thisWeekSleepTotal / 60);
      const mins = Math.round(thisWeekSleepTotal % 60);
      shifts.push(`Total daytime sleep steady at ${hours} h ${mins} m`);
    }

    // Bedtime consistency
    if (averagePattern.bedtime) {
      shifts.push(`Bedtime holding consistent around ${averagePattern.bedtime}`);
    }

    return shifts;
  }, [activities, averagePattern]);

  // Generate coaching cards
  const coachingCards = useMemo(() => {
    const cards = [];
    
    // Age-based coaching
    if (ageInMonths >= 6 && ageInMonths < 9) {
      cards.push({
        type: 'know',
        title: 'Nap Consolidation',
        message: `Nap timings are consolidating — this pattern is common around ${ageInMonths} months.`,
        icon: Lightbulb
      });
      cards.push({
        type: 'do',
        title: 'Stretch Wake Windows',
        message: 'Try stretching the first wake window to 3 hours to support the 2-nap transition.',
        icon: CheckCircle2
      });
    } else if (ageInMonths < 4) {
      cards.push({
        type: 'know',
        title: 'Building Rhythm',
        message: 'Patterns are still emerging — consistency helps your baby learn day vs night.',
        icon: Lightbulb
      });
      cards.push({
        type: 'do',
        title: 'Follow Wake Windows',
        message: 'Watch for sleepy cues after 1-1.5 hours awake — this prevents overtiredness.',
        icon: CheckCircle2
      });
    } else {
      cards.push({
        type: 'know',
        title: 'Rhythm Stability',
        message: 'Sleep patterns are more predictable now — your baby is learning self-regulation.',
        icon: Lightbulb
      });
      cards.push({
        type: 'do',
        title: 'Maintain Consistency',
        message: 'Keep nap times within 20-30 minutes of usual times to support circadian development.',
        icon: CheckCircle2
      });
    }
    
    return cards;
  }, [ageInMonths]);

  // Generate today's forecast
  const todayForecast = useMemo(() => {
    if (!prediction) return [];
    
    const forecast = [];
    
    // Add predicted naps based on pattern
    averagePattern.naps.forEach((nap, idx) => {
      forecast.push({
        type: 'nap',
        label: `Nap ${idx + 1}`,
        time: `${nap.start}–${nap.end}`,
        icon: Moon
      });
    });
    
    // Add bedtime
    if (averagePattern.bedtime) {
      forecast.push({
        type: 'bedtime',
        label: 'Bedtime',
        time: `around ${averagePattern.bedtime}`,
        icon: Moon
      });
    }
    
    return forecast;
  }, [prediction, averagePattern]);

  // Generate timeline segments
  const timelineSegments = useMemo((): TimeSegment[] => {
    const segments: TimeSegment[] = [];
    
    // Parse times to hours
    const parseToHour = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      const [hours] = time.split(':').map(Number);
      let hour = hours % 12;
      if (period === 'PM') hour += 12;
      return hour;
    };
    
    const wakeHour = parseToHour(averagePattern.wakeTime);
    const bedtimeHour = parseToHour(averagePattern.bedtime);
    
    // Night sleep (before wake time)
    if (wakeHour > 6) {
      segments.push({
        start: 0,
        end: wakeHour,
        type: 'night',
        label: `Wake ${averagePattern.wakeTime}`
      });
    }
    
    // Daytime with naps
    let currentHour = wakeHour;
    averagePattern.naps.forEach((nap, idx) => {
      const napStartHour = parseToHour(nap.start);
      const napEndHour = parseToHour(nap.end);
      
      // Awake period before nap
      if (napStartHour > currentHour) {
        segments.push({
          start: currentHour,
          end: napStartHour,
          type: 'awake'
        });
      }
      
      // Nap period
      segments.push({
        start: napStartHour,
        end: napEndHour,
        type: 'nap',
        label: `Nap ${idx + 1} ${nap.start}–${nap.end}`
      });
      
      currentHour = napEndHour;
    });
    
    // Final awake period until bedtime
    if (bedtimeHour > currentHour) {
      segments.push({
        start: currentHour,
        end: bedtimeHour,
        type: 'awake'
      });
    }
    
    // Night sleep (after bedtime)
    segments.push({
      start: bedtimeHour,
      end: 24,
      type: 'night',
      label: `Bedtime ${averagePattern.bedtime}`
    });
    
    return segments;
  }, [averagePattern]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {babyName} • {ageInMonths} month{ageInMonths !== 1 ? 's' : ''}
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Average Day (last 5 days)
        </p>
        <p className="text-xs text-muted-foreground">
          Here's when {babyName} usually eats, naps, and sleeps based on recent patterns.
        </p>
      </div>

      {/* Daily Rhythm Timeline */}
      <Card className="overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Daily Rhythm</h2>
          </div>
          
          {/* Timeline visualization */}
          <div className="relative">
            {/* Hour labels */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>6 AM</span>
              <span>Noon</span>
              <span>6 PM</span>
              <span>Midnight</span>
            </div>
            
            {/* Timeline bar */}
            <div className="relative h-16 rounded-lg overflow-hidden border border-border">
              {timelineSegments.map((segment, idx) => {
                const width = ((segment.end - segment.start) / 24) * 100;
                const left = (segment.start / 24) * 100;
                
                const bgColor = segment.type === 'night' 
                  ? 'bg-blue-500/20' 
                  : segment.type === 'nap'
                  ? 'bg-purple-400/30'
                  : 'bg-amber-200/40';
                
                return (
                  <div
                    key={idx}
                    className={`absolute h-full ${bgColor} border-r border-border/30`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    {segment.label && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-foreground/80 px-1 text-center leading-tight">
                          {segment.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-3 w-3 text-amber-500" />
                <span>Awake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Moon className="h-3 w-3 text-purple-500" />
                <span>Naps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Moon className="h-3 w-3 text-blue-500" />
                <span>Night Sleep</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pattern Shift Summary */}
      {patternShifts.length > 0 && (
        <Card>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Today's Rhythm Shift</h2>
            </div>
            <div className="space-y-2">
              {patternShifts.slice(0, 2).map((shift, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  • {shift}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Coaching Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {coachingCards.map((card, idx) => (
          <Card key={idx} className={card.type === 'know' ? 'bg-blue-500/5' : 'bg-green-500/5'}>
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <card.icon className={`h-5 w-5 ${card.type === 'know' ? 'text-blue-500' : 'text-green-500'}`} />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  {card.type === 'know' ? 'What to Know' : 'What to Do'}
                </h3>
              </div>
              <p className="text-lg font-medium text-foreground">{card.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.message}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Today's Forecast */}
      {todayForecast.length > 0 && (
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Today's Expected Rhythm</h2>
            </div>
            <div className="space-y-3">
              {todayForecast.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    ⏰ Remind
                  </Button>
                </div>
              ))}
            </div>
            {patternShifts.length > 1 && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                {patternShifts[0].includes('earlier') 
                  ? "Looks like an earlier rhythm today — naps may shift 10–15 min forward."
                  : "Rhythm is steady — expect times within usual range."}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Optional Trend View Toggle */}
      <Button
        variant="ghost"
        className="w-full text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setShowTrendDetails(!showTrendDetails)}
      >
        {showTrendDetails ? 'Hide' : 'View'} trend lines
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showTrendDetails ? 'rotate-180' : ''}`} />
      </Button>

      {showTrendDetails && (
        <Card>
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Pattern Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Naps per day</p>
                <p className="text-2xl font-semibold text-foreground">{averagePattern.naps.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg nap duration</p>
                <p className="text-2xl font-semibold text-foreground">
                  {averagePattern.naps.length > 0 
                    ? Math.round(averagePattern.naps.reduce((sum, n) => sum + n.duration, 0) / averagePattern.naps.length)
                    : 0} min
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Wake time</p>
                <p className="text-2xl font-semibold text-foreground">{averagePattern.wakeTime}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
