import { Activity } from "./ActivityCard";
import { useState } from "react";
import { useSleepData } from "@/hooks/useSleepData";
import { SleepChartVisualization } from "./sleep/SleepChartVisualization";
import { SleepStats } from "./sleep/SleepStats";
import { SleepChartControls } from "./sleep/SleepChartControls";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';

interface SleepChartProps {
  activities: Activity[];
}

export const SleepChart = ({ activities }: SleepChartProps) => {
  const { t } = useLanguage();
  const [showFullDay, setShowFullDay] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const { toast } = useToast();
  
  const { sleepData, averageDailySummary } = useSleepData(activities, showFullDay, currentWeekOffset);

  const handleShareSchedule = async () => {
    try {
      const element = document.getElementById('weekly-sleep-chart');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const weekLabel = currentWeekOffset === 0 ? 'This Week' : 'Last Week';
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (currentWeekOffset * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (currentWeekOffset * 7));
      const caption = `${weekLabel}: ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'sleep-schedule.png', { type: 'image/png' });
          await navigator.share({
            title: 'Weekly Sleep Schedule',
            text: caption,
            files: [file]
          });
          toast({ title: "Shared!", description: "Sleep schedule shared successfully" });
          return;
        } catch (err) { }
      }

      const link = document.createElement('a');
      link.download = `sleep-schedule-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Downloaded!", description: "Chart saved to your device" });
    } catch (error) {
      toast({ title: "Share Failed", description: "Could not share chart", variant: "destructive" });
    }
  };
  
  // Generate interpretation based on sleep patterns
  const getSleepScheduleInterpretation = () => {
    // Analyze recent nap activities directly
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weekNaps = activities.filter(a => 
      a.type === 'nap' && 
      a.details.startTime && 
      a.details.endTime &&
      a.loggedAt && 
      new Date(a.loggedAt) >= last7Days
    );
    
    if (weekNaps.length === 0) {
      return "Building your sleep story — patterns emerge over time.";
    }
    
    // Analyze morning naps (before noon)
    const morningNaps = weekNaps.filter(nap => {
      const timeParts = nap.details.startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeParts) return false;
      let hour = parseInt(timeParts[1]);
      const period = timeParts[3];
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return hour < 12;
    });
    
    // Check consistency of morning nap timing
    const morningNapHours = morningNaps.map(nap => {
      const timeParts = nap.details.startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeParts) return 0;
      let hour = parseInt(timeParts[1]);
      const period = timeParts[3];
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return hour;
    });
    
    if (morningNapHours.length >= 3) {
      const avgTime = morningNapHours.reduce((a, b) => a + b, 0) / morningNapHours.length;
      const variance = morningNapHours.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / morningNapHours.length;
      
      if (variance < 1) {
        return "Morning naps are becoming more predictable — a lovely sign of stability.";
      }
    }
    
    // Check for consolidated sleep patterns
    const napDurations = weekNaps.map(nap => {
      const start = new Date(`2000/01/01 ${nap.details.startTime}`);
      const end = new Date(`2000/01/01 ${nap.details.endTime}`);
      let diff = end.getTime() - start.getTime();
      if (diff < 0) diff += (24 * 60 * 60 * 1000);
      return diff / (1000 * 60 * 60);
    });
    
    const avgDuration = napDurations.reduce((a, b) => a + b, 0) / napDurations.length;
    
    if (avgDuration > 1.5) {
      return "Sleep is consolidating beautifully — longer, more restful stretches.";
    }
    
    return "Your unique sleep rhythm is taking shape — beautiful progress.";
  };

  return (
    <div className="space-y-6">
      {/* Sleep Chart */}
      <div id="weekly-sleep-chart" className="bg-card/50 backdrop-blur rounded-xl p-6 shadow-card border border-border">
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('weeklySleepSchedule')}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareSchedule}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <div className="flex bg-muted/30 rounded-lg p-1">
                <Button
                  variant={currentWeekOffset === 0 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentWeekOffset(0)}
                  className="h-8 px-3 rounded-md"
                >
                  {t('thisWeek')}
                </Button>
                <Button
                  variant={currentWeekOffset === 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentWeekOffset(1)}
                  className="h-8 px-3 rounded-md"
                >
                  {t('lastWeek')}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground">
            {getSleepScheduleInterpretation()}
          </p>
        </div>
        
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullDay(!showFullDay)}
            className="text-muted-foreground text-caption hover:text-foreground"
          >
            {showFullDay ? t('showCondensed') : t('showFullDay')}
          </Button>
        </div>
        
        <SleepChartVisualization 
          sleepData={sleepData}
          showFullDay={showFullDay}
        />
      </div>
    </div>
  );
};