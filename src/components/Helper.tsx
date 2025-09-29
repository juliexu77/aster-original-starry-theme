import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, AlertCircle, Baby, Target, ChevronDown, ChevronUp } from "lucide-react";
import { format, differenceInWeeks, startOfDay, endOfDay, subDays } from "date-fns";
import { useHousehold } from "@/hooks/useHousehold";

interface Activity {
  id: string;
  type: string;
  logged_at: string;
  details: any;
}

interface HelperProps {
  activities: Activity[];
  babyBirthDate?: Date;
}

interface HelperCard {
  title: string;
  summary: string;
  bullets: string[];
  icon: any;
  confidence?: number;
}

export const Helper = ({ activities, babyBirthDate }: HelperProps) => {
  console.log('Helper component received activities:', activities.length, activities.slice(0, 3));
  const { household } = useHousehold();

  const getAllInsights = (): HelperCard[] => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const yesterday = subDays(today, 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const weekAgo = subDays(today, 7);

    const todayActivities = activities.filter(a => {
      const activityDate = new Date(a.logged_at);
      return activityDate >= todayStart && activityDate <= todayEnd;
    });

    const yesterdayActivities = activities.filter(a => {
      const activityDate = new Date(a.logged_at);
      return activityDate >= yesterdayStart && activityDate <= yesterdayEnd;
    });

    const weekActivities = activities.filter(a => {
      const activityDate = new Date(a.logged_at);
      return activityDate >= weekAgo;
    });

    const insights: HelperCard[] = [];

    // 1. Today's Status (highest priority)
    const todayFeeds = todayActivities.filter(a => a.type === "feed");
    const todayNaps = todayActivities.filter(a => a.type === "nap");
    const todayDiapers = todayActivities.filter(a => a.type === "diaper");

    if (activities.length === 0) {
      insights.push({
        title: "Getting Started",
        summary: "Ready to track your baby's day",
        bullets: [
          "Start by logging activities as they happen",
          "I'll learn patterns and provide insights",
          "Tap the + button to add feeding, naps, or diaper changes"
        ],
        icon: Baby,
        confidence: 1.0
      });
      return insights;
    }

    // Current day summary - fix field mapping
    const totalIntakeToday = todayFeeds.reduce((sum, f) => {
      const quantity = f.details?.quantity || f.details?.amount || 0;
      return sum + (parseFloat(quantity) || 0);
    }, 0);
    
    // Calculate total nap time properly
    const totalNapTimeToday = todayNaps.reduce((sum, n) => {
      if (n.details?.duration) {
        // Parse duration string like "1h 30m" or "45m"
        const duration = n.details.duration;
        if (typeof duration === 'string') {
          const hours = duration.match(/(\d+)h/)?.[1] || '0';
          const minutes = duration.match(/(\d+)m/)?.[1] || '0';
          return sum + (parseInt(hours) * 60) + parseInt(minutes);
        }
        return sum + parseInt(duration) || 0;
      }
      // Fallback: calculate from start/end times
      if (n.details?.startTime && n.details?.endTime) {
        const start = new Date(`1970-01-01 ${n.details.startTime}`);
        const end = new Date(`1970-01-01 ${n.details.endTime}`);
        return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      }
      return sum;
    }, 0);
    
    let todayStatus = "tracking well";
    const currentHour = new Date().getHours();
    
    if (currentHour < 12 && todayFeeds.length === 0) {
      todayStatus = "haven't logged morning feed yet";
    } else if (currentHour > 18 && todayFeeds.length < 4) {
      todayStatus = "fewer feeds than usual today";
    }

    insights.push({
      title: "Today's Progress",
      summary: `${todayFeeds.length} feeds • ${isNaN(totalNapTimeToday) || totalNapTimeToday === 0 ? '0h' : Math.round(totalNapTimeToday / 60) + 'h'} sleep • ${todayDiapers.length} diapers`,
      bullets: [
        totalIntakeToday > 0 ? `Total intake: ${totalIntakeToday}${todayFeeds.some(f => f.details?.unit === 'ml') ? 'ml' : 'oz'}` : "No intake tracked yet today",
        todayNaps.length > 0 && totalNapTimeToday > 0 && !isNaN(totalNapTimeToday) ? `Nap time: ${Math.floor(totalNapTimeToday / 60)}h ${totalNapTimeToday % 60}m` : todayNaps.length > 0 ? "Nap logged (calculating time...)" : "No naps logged today",
        `Status: ${todayStatus}`
      ].filter(Boolean),
      icon: Clock,
      confidence: todayFeeds.length >= 2 ? 0.85 : 0.6
    });

    // 2. What's Next Prediction
    if (activities.length >= 3) {
      const recentFeeds = activities
        .filter(a => a.type === "feed")
        .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
        .slice(0, 4);

      if (recentFeeds.length >= 2) {
        const intervals = [];
        for (let i = 1; i < recentFeeds.length; i++) {
          const diff = (new Date(recentFeeds[i-1].logged_at).getTime() - new Date(recentFeeds[i].logged_at).getTime()) / (1000 * 60);
          intervals.push(diff);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const lastFeed = new Date(recentFeeds[0].logged_at);
        const nextFeed = new Date(lastFeed.getTime() + avgInterval * 60 * 1000);
        const minutesUntil = Math.round((nextFeed.getTime() - new Date().getTime()) / (1000 * 60));
        
        let timing = "soon";
        if (minutesUntil > 60) timing = `in ${Math.round(minutesUntil / 60)}h`;
        else if (minutesUntil > 0) timing = `in ${minutesUntil}m`;
        else if (minutesUntil > -30) timing = "now";
        else timing = "overdue";

        insights.push({
          title: "Next Feed Prediction",
          summary: `Expected ${timing} around ${format(nextFeed, "h:mma")}`,
          bullets: [
            `Based on ${recentFeeds.length} recent feeds`,
            `Average interval: ${Math.round(avgInterval / 60)}h ${Math.round(avgInterval % 60)}m`,
            minutesUntil < -30 ? "⚠️ Later than usual pattern" : "📍 Following typical schedule"
          ],
          icon: Target,
          confidence: Math.min(0.9, recentFeeds.length / 4)
        });
      }
    }

    // 3. Anomaly Detection (show if any detected)
    if (yesterdayActivities.length > 0 && weekActivities.length > 7) {
      const weeklyAvgFeeds = weekActivities.filter(a => a.type === "feed").length / 7;
      const yesterdayFeeds = yesterdayActivities.filter(a => a.type === "feed").length;
      
      const anomalies = [];
      if (yesterdayFeeds > weeklyAvgFeeds * 1.4) {
        anomalies.push("📈 Fed more frequently than usual yesterday");
      } else if (yesterdayFeeds < weeklyAvgFeeds * 0.6) {
        anomalies.push("📉 Fewer feeds than typical yesterday");
      }

      const weeklyNaps = weekActivities.filter(a => a.type === "nap");
      const avgNapDuration = weeklyNaps.reduce((sum, n) => {
        if (n.details?.duration) {
          const duration = n.details.duration;
          if (typeof duration === 'string') {
            const hours = duration.match(/(\d+)h/)?.[1] || '0';
            const minutes = duration.match(/(\d+)m/)?.[1] || '0';
            return sum + (parseInt(hours) * 60) + parseInt(minutes);
          }
          return sum + parseInt(duration) || 0;
        }
        if (n.details?.startTime && n.details?.endTime) {
          const start = new Date(`1970-01-01 ${n.details.startTime}`);
          const end = new Date(`1970-01-01 ${n.details.endTime}`);
          return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        }
        return sum;
      }, 0) / Math.max(weeklyNaps.length, 1);
      
      const yesterdayNaps = yesterdayActivities.filter(a => a.type === "nap");
      const yesterdayAvgNap = yesterdayNaps.reduce((sum, n) => {
        if (n.details?.duration) {
          const duration = n.details.duration;
          if (typeof duration === 'string') {
            const hours = duration.match(/(\d+)h/)?.[1] || '0';
            const minutes = duration.match(/(\d+)m/)?.[1] || '0';
            return sum + (parseInt(hours) * 60) + parseInt(minutes);
          }
          return sum + parseInt(duration) || 0;
        }
        if (n.details?.startTime && n.details?.endTime) {
          const start = new Date(`1970-01-01 ${n.details.startTime}`);
          const end = new Date(`1970-01-01 ${n.details.endTime}`);
          return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        }
        return sum;
      }, 0) / Math.max(yesterdayNaps.length, 1);
      
      if (yesterdayAvgNap < avgNapDuration * 0.7) {
        anomalies.push("😴 Shorter naps than usual yesterday");
      } else if (yesterdayAvgNap > avgNapDuration * 1.4) {
        anomalies.push("💤 Longer naps than normal yesterday");
      }

      if (anomalies.length > 0) {
        insights.push({
          title: "Pattern Alerts",
          summary: `${anomalies.length} things worth noting`,
          bullets: anomalies,
          icon: AlertCircle,
          confidence: 0.8
        });
      }
    }

    // 4. Weekly Trends Summary
    if (weekActivities.length > 10) {
      const feedsByDay = {};
      const napsByDay = {};
      
      for (let i = 0; i < 7; i++) {
        const day = format(subDays(today, i), "yyyy-MM-dd");
        const dayStart = startOfDay(subDays(today, i));
        const dayEnd = endOfDay(subDays(today, i));
        
        const dayActivities = activities.filter(a => {
          const activityDate = new Date(a.logged_at);
          return activityDate >= dayStart && activityDate <= dayEnd;
        });
        
        feedsByDay[day] = dayActivities.filter(a => a.type === "feed").length;
        napsByDay[day] = dayActivities.filter(a => a.type === "nap").length;
      }

      const avgFeeds = (Object.values(feedsByDay) as number[]).reduce((a, b) => a + b, 0) / 7;
      const avgNaps = (Object.values(napsByDay) as number[]).reduce((a, b) => a + b, 0) / 7;
      const todayFeeds = feedsByDay[format(today, "yyyy-MM-dd")] || 0;

      let trendDirection = "steady";
      if (todayFeeds > avgFeeds * 1.2) trendDirection = "increasing";
      else if (todayFeeds < avgFeeds * 0.8) trendDirection = "decreasing";

      insights.push({
        title: "Weekly Pattern",
        summary: `Averaging ${avgFeeds.toFixed(1)} feeds and ${avgNaps.toFixed(1)} naps daily`,
        bullets: [
          `Most consistent: ${avgFeeds > avgNaps ? "Feeding schedule" : "Nap routine"}`,
          `Trend: ${trendDirection} feeding frequency`,
          `Range: ${Math.min(...(Object.values(feedsByDay) as number[]))}-${Math.max(...(Object.values(feedsByDay) as number[]))} feeds per day`
        ],
        icon: TrendingUp,
        confidence: 0.7
      });
    }

    // 5. Age-appropriate guidance (if birth date provided)
    if (babyBirthDate) {
      const ageInWeeks = differenceInWeeks(new Date(), babyBirthDate);
      let guidance = [];
      let agePhase = "";

      if (ageInWeeks < 6) {
        agePhase = "Newborn phase";
        guidance = [
          "Every 2-3 hours feeding is normal",
          "14-17 hours total sleep expected", 
          "Growth spurts around weeks 2-3, 6"
        ];
      } else if (ageInWeeks < 16) {
        agePhase = "Early infant";
        guidance = [
          "4-6 hour stretches becoming possible",
          "More predictable patterns emerging",
          "Night feeds may still be needed"
        ];
      } else if (ageInWeeks < 26) {
        agePhase = "Established routine phase";
        guidance = [
          "Longer sleep stretches expected",
          "3-4 hour feeding windows",
          "Watch for sleep regressions"
        ];
      } else {
        agePhase = "Mature infant";
        guidance = [
          "Solid patterns should be established",
          "Night weaning may be possible",
          "Growth spurts still affect schedules"
        ];
      }

      insights.push({
        title: `${agePhase} (${ageInWeeks} weeks)`,
        summary: "Age-appropriate expectations",
        bullets: guidance,
        icon: Calendar,
        confidence: 0.9
      });
    }

    return insights.slice(0, 6); // Limit to top 6 insights
  };

  const insights = getAllInsights();

  return (
    <div className="space-y-6 p-4">
      {insights.map((insight, index) => (
        <InsightCard key={index} insight={insight} />
      ))}
    </div>
  );
};

interface InsightCardProps {
  insight: HelperCard;
}

const InsightCard = ({ insight }: InsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = insight.icon;
  const confidenceColor = insight.confidence && insight.confidence > 0.8 
    ? "text-emerald-600 dark:text-emerald-400" 
    : insight.confidence && insight.confidence > 0.6 
    ? "text-amber-600 dark:text-amber-400" 
    : "text-muted-foreground";

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="w-5 h-5 text-primary" />
            {insight.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {insight.confidence && (
              <Badge variant="outline" className={confidenceColor}>
                {Math.round(insight.confidence * 100)}%
              </Badge>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
        <p className="text-muted-foreground">{insight.summary}</p>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {insight.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary text-xs mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};