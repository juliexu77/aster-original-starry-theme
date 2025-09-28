import { Activity } from "@/components/ActivityCard";

export interface PatternInsight {
  icon: any;
  text: string;
  confidence: 'high' | 'medium' | 'low';
  type: 'feeding' | 'sleep' | 'general';
  details: {
    description: string;
    data: Array<{
      activity: Activity;
      value?: string | number;
      calculation?: string;
    }>;
    calculation?: string;
  };
}

export const usePatternAnalysis = () => {
  const getTimeInMinutes = (timeString: string) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = (hours % 12) * 60 + minutes;
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes = minutes;
    return totalMinutes;
  };

  const analyzePatterns = (activities: Activity[]): PatternInsight[] => {
    if (activities.length < 2) {
      return [];
    }

    const insights: PatternInsight[] = [];

    // Analyze feeding patterns
    const feedingInsights = analyzeFeedingPatterns(activities);
    insights.push(...feedingInsights);

    // Analyze sleep patterns  
    const sleepInsights = analyzeSleepPatterns(activities);
    insights.push(...sleepInsights);

    // Analyze bedtime trends
    const bedtimeInsights = analyzeBedtimePatterns(activities);
    insights.push(...bedtimeInsights);

    return insights;
  };

  const analyzeFeedingPatterns = (activities: Activity[]): PatternInsight[] => {
    const insights: PatternInsight[] = [];
    const feeds = activities.filter(a => a.type === 'feed');
    
    if (feeds.length < 3) return insights;

    const intervals: Array<{ interval: number; feed1: Activity; feed2: Activity }> = [];
    for (let i = 1; i < feeds.length; i++) {
      const current = getTimeInMinutes(feeds[i-1].time);
      const previous = getTimeInMinutes(feeds[i].time);
      const interval = Math.abs(current - previous);
      if (interval > 30 && interval < 360) {
        intervals.push({
          interval,
          feed1: feeds[i],
          feed2: feeds[i-1]
        });
      }
    }

    if (intervals.length >= 2) {
      const avgInterval = intervals.reduce((a, b) => a + b.interval, 0) / intervals.length;
      const hours = Math.round(avgInterval / 60 * 10) / 10;
      
      insights.push({
        icon: null, // Will be set by consuming component
        text: `Usually feeds every ${hours}h`,
        confidence: intervals.length >= 5 ? 'high' : intervals.length >= 3 ? 'medium' : 'low',
        type: 'feeding',
        details: {
          description: `Based on ${intervals.length} feeding intervals, the average time between feeds is ${hours} hours.`,
          data: intervals.map(({ interval, feed1, feed2 }) => ({
            activity: feed1,
            value: `${Math.round(interval / 60 * 10) / 10}h`,
            calculation: `Time between ${feed2.time} and ${feed1.time}`
          })),
          calculation: `Average: ${intervals.map(i => Math.round(i.interval / 60 * 10) / 10).join(' + ')} ÷ ${intervals.length} = ${hours}h`
        }
      });

      // Check for consistency
      const variance = intervals.reduce((sum, { interval }) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev < 30) {
        insights.push({
          icon: null,
          text: 'Very consistent feeding schedule',
          confidence: 'high',
          type: 'feeding',
          details: {
            description: `Feeding intervals vary by only ${Math.round(stdDev)} minutes on average, showing high consistency.`,
            data: intervals.map(({ interval, feed1, feed2 }) => ({
              activity: feed1,
              value: `${Math.round(interval / 60 * 10) / 10}h`,
              calculation: `Deviation from average: ${Math.round(Math.abs(interval - avgInterval))} minutes`
            }))
          }
        });
      } else if (stdDev > 90) {
        insights.push({
          icon: null,
          text: 'Feeding times vary - growing appetite?',
          confidence: 'medium',
          type: 'feeding',
          details: {
            description: `Feeding intervals vary by ${Math.round(stdDev)} minutes on average, which could indicate growth spurts or changing needs.`,
            data: intervals.map(({ interval, feed1, feed2 }) => ({
              activity: feed1,
              value: `${Math.round(interval / 60 * 10) / 10}h`,
              calculation: `Deviation from average: ${Math.round(Math.abs(interval - avgInterval))} minutes`
            }))
          }
        });
      }
    }

    return insights;
  };

  const analyzeSleepPatterns = (activities: Activity[]): PatternInsight[] => {
    const insights: PatternInsight[] = [];
    
    // Analyze today's naps
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    const naps = activities.filter(a => {
      if (a.type !== 'nap') return false;
      if (!a.loggedAt) return true;
      const activityDate = new Date(a.loggedAt);
      if (!(activityDate >= todayStart && activityDate < todayEnd)) return false;
      
      const napTime = getTimeInMinutes(a.time);
      if (napTime >= 18 * 60) return false;
      
      return true;
    });
    
    if (naps.length >= 2) {
      insights.push({
        icon: null,
        text: `Taking ${naps.length} naps today`,
        confidence: 'medium',
        type: 'sleep',
        details: {
          description: `Recorded ${naps.length} nap activities today. Here are the nap times:`,
          data: naps.map(nap => ({
            activity: nap,
            value: nap.details.startTime && nap.details.endTime 
              ? `${nap.details.startTime} - ${nap.details.endTime}`
              : nap.time,
            calculation: nap.details.startTime && nap.details.endTime 
              ? (() => {
                  const start = new Date(`2000/01/01 ${nap.details.startTime}`);
                  const end = new Date(`2000/01/01 ${nap.details.endTime}`);
                  const diffMs = end.getTime() - start.getTime();
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  return `Duration: ${hours}h ${minutes}m`;
                })()
              : 'Single time logged'
          }))
        }
      });

      // Analyze nap timing preferences
      const napTimes = naps.map(nap => getTimeInMinutes(nap.time));
      const morningNaps = napTimes.filter(time => time < 12 * 60);
      const afternoonNaps = napTimes.filter(time => time >= 12 * 60 && time < 18 * 60);
      
      if (morningNaps.length > afternoonNaps.length && morningNaps.length >= 2) {
        const morningNapActivities = naps.filter(nap => getTimeInMinutes(nap.time) < 12 * 60);
        insights.push({
          icon: null,
          text: 'Prefers morning naps',
          confidence: 'medium',
          type: 'sleep',
          details: {
            description: `${morningNaps.length} out of ${naps.length} naps occur in the morning (before 12 PM).`,
            data: morningNapActivities.map(nap => ({
              activity: nap,
              value: nap.time,
              calculation: 'Morning nap (before 12 PM)'
            }))
          }
        });
      } else if (afternoonNaps.length > morningNaps.length && afternoonNaps.length >= 2) {
        const afternoonNapActivities = naps.filter(nap => {
          const time = getTimeInMinutes(nap.time);
          return time >= 12 * 60 && time < 18 * 60;
        });
        insights.push({
          icon: null,
          text: 'Afternoon sleeper',
          confidence: 'medium',
          type: 'sleep',
          details: {
            description: `${afternoonNaps.length} out of ${naps.length} naps occur in the afternoon (12 PM - 6 PM).`,
            data: afternoonNapActivities.map(nap => ({
              activity: nap,
              value: nap.time,
              calculation: 'Afternoon nap (12 PM - 6 PM)'
            }))
          }
        });
      }
    }

    return insights;
  };

  const analyzeBedtimePatterns = (activities: Activity[]): PatternInsight[] => {
    const insights: PatternInsight[] = [];
    const bedtimes: Array<{ time: number; activity: Activity; date: string }> = [];
    
    // Group activities by date
    const activitiesByDate = new Map<string, Activity[]>();
    activities.forEach(activity => {
      if (!activity.loggedAt) return;
      const date = new Date(activity.loggedAt);
      const dateKey = date.toDateString();
      if (!activitiesByDate.has(dateKey)) {
        activitiesByDate.set(dateKey, []);
      }
      activitiesByDate.get(dateKey)!.push(activity);
    });

    // Find bedtime indicators
    activitiesByDate.forEach((dayActivities, dateKey) => {
      const eveningSleepActivities = dayActivities.filter(activity => {
        if (activity.type !== 'nap') return false;
        const activityTime = getTimeInMinutes(activity.time);
        if (activityTime < 18 * 60) return false;
        if (activity.details.isDreamFeed) return false;
        return true;
      });
      
      if (eveningSleepActivities.length > 0) {
        const latestSleepActivity = eveningSleepActivities.reduce((latest, current) => {
          const latestTime = getTimeInMinutes(latest.time);
          const currentTime = getTimeInMinutes(current.time);
          return currentTime > latestTime ? current : latest;
        });
        
        const bedtimeMinutes = getTimeInMinutes(latestSleepActivity.time);
        if (bedtimeMinutes >= 18 * 60 && bedtimeMinutes <= 23 * 60) {
          bedtimes.push({
            time: bedtimeMinutes,
            activity: latestSleepActivity,
            date: dateKey
          });
        }
      }
    });

    if (bedtimes.length >= 3) {
      const avgBedtime = bedtimes.reduce((sum, b) => sum + b.time, 0) / bedtimes.length;
      const bedtimeHours = Math.floor(avgBedtime / 60);
      const bedtimeMinutes = Math.round(avgBedtime % 60);
      const bedtimeText = `${bedtimeHours === 0 ? 12 : bedtimeHours > 12 ? bedtimeHours - 12 : bedtimeHours}:${bedtimeMinutes.toString().padStart(2, '0')} ${bedtimeHours >= 12 ? 'PM' : 'AM'}`;

      if (bedtimes.length >= 4) {
        const firstHalf = bedtimes.slice(0, Math.floor(bedtimes.length / 2));
        const secondHalf = bedtimes.slice(Math.floor(bedtimes.length / 2));
        const firstAvg = firstHalf.reduce((sum, b) => sum + b.time, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, b) => sum + b.time, 0) / secondHalf.length;
        const timeDiff = Math.abs(secondAvg - firstAvg);

        if (timeDiff >= 30) {
          const isGettingLater = secondAvg > firstAvg;
          const direction = isGettingLater ? 'later' : 'earlier';
          insights.push({
            icon: null,
            text: `Bedtime trending ${direction} - now ~${bedtimeText}`,
            confidence: 'medium',
            type: 'sleep',
            details: {
              description: `Over the past ${bedtimes.length} days, bedtime has been trending ${direction}. Current average is ${bedtimeText}, which is ${Math.round(timeDiff)} minutes ${direction} than earlier this week.`,
              data: bedtimes.map(({ time, activity, date }) => {
                const h = Math.floor(time / 60);
                const m = Math.round(time % 60);
                const timeText = `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
                return {
                  activity,
                  value: timeText,
                  calculation: `Last activity on ${new Date(date).toLocaleDateString()}`
                };
              })
            }
          });
        } else {
          insights.push({
            icon: null,
            text: `Consistent bedtime routine ~${bedtimeText}`,
            confidence: 'high',
            type: 'sleep',
            details: {
              description: `Your baby has a consistent bedtime around ${bedtimeText}. This stable routine is great for healthy sleep patterns.`,
              data: bedtimes.map(({ time, activity, date }) => {
                const h = Math.floor(time / 60);
                const m = Math.round(time % 60);
                const timeText = `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
                return {
                  activity,
                  value: timeText,
                  calculation: `Bedtime on ${new Date(date).toLocaleDateString()}`
                };
              })
            }
          });
        }
      }
    }

    return insights;
  };

  return {
    analyzePatterns,
    getTimeInMinutes
  };
};