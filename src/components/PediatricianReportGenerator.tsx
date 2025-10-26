import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useActivities } from "@/hooks/useActivities";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { convertOzToMl } from "@/utils/unitConversion";

import type { ReportConfig } from "./ReportConfigModal";

interface PediatricianReportGeneratorProps {
  open: boolean;
  onDone: () => void;
  babyName?: string;
  config?: ReportConfig;
}

export function PediatricianReportGenerator({ open, onDone, babyName = "Baby", config }: PediatricianReportGeneratorProps) {
  const { activities: dbActivities } = useActivities();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const parseTimeToMinutes = (timeStr: string): number | null => {
      const match12h = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match12h) {
        let hours = parseInt(match12h[1], 10);
        const minutes = parseInt(match12h[2], 10);
        const period = match12h[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      }
      const match24h = timeStr.match(/(\d+):(\d+)/);
      if (match24h) {
        const hours = parseInt(match24h[1], 10);
        const minutes = parseInt(match24h[2], 10);
        return hours * 60 + minutes;
      }
      return null;
    };

    const generate = async () => {
      try {
        // Determine date range
        const now = new Date();
        let start: Date;
        let end: Date;
        if (config?.dateRange === 'custom' && config.customStartDate && config.customEndDate) {
          start = config.customStartDate;
          end = config.customEndDate;
        } else if (config?.dateRange === 'last-week') {
          const lastWeekStart = startOfWeek(now, { weekStartsOn: 0 });
          lastWeekStart.setDate(lastWeekStart.getDate() - 7);
          start = lastWeekStart;
          end = endOfWeek(lastWeekStart, { weekStartsOn: 0 });
        } else {
          // this-week default
          start = startOfWeek(now, { weekStartsOn: 0 });
          end = endOfWeek(now, { weekStartsOn: 0 });
        }

        // Filter activities within range
        const inRange = dbActivities.filter(a => {
          const ts = new Date(a.logged_at);
          return ts >= start && ts <= end;
        });

        const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

        // Feeds
        const feeds = (config?.includeFeeds !== false) ? inRange.filter(a => a.type === 'feed') : [];
        const feedingSummary = {
          total: feeds.length,
          avgPerDay: feeds.length / totalDays,
          totalVolume: feeds.reduce((sum, f) => {
            const qty = parseFloat(f.details?.quantity);
            if (isNaN(qty)) return sum;
            const unit = f.details?.unit || 'oz';
            const ml = unit === 'oz' ? convertOzToMl(qty) : qty;
            return sum + ml;
          }, 0),
        };

        // Sleep (naps)
        const sleeps = (config?.includeSleep !== false) ? inRange.filter(a => a.type === 'nap') : [];
        const napDurations = sleeps.map(s => {
          const startT: string | undefined = s.details?.startTime;
          const endT: string | undefined = s.details?.endTime;
          if (!startT || !endT) return 0;
          const sm = parseTimeToMinutes(startT);
          const em = parseTimeToMinutes(endT);
          if (sm === null || em === null) return 0;
          let dur = em - sm;
          if (dur < 0) dur += 24 * 60;
          return dur;
        });
        const totalSleepMinutes = napDurations.reduce((a, b) => a + b, 0);
        const sleepSummary = {
          totalHours: totalSleepMinutes / 60,
          avgPerDay: totalSleepMinutes / 60 / totalDays,
          nightSleeps: sleeps.filter(s => {
            const startT: string | undefined = s.details?.startTime;
            if (!startT) return false;
            const hour = (parseTimeToMinutes(startT) ?? 0) / 60;
            return hour >= 19 || hour < 6;
          }).length,
          naps: sleeps.filter(s => {
            const startT: string | undefined = s.details?.startTime;
            if (!startT) return true;
            const hour = (parseTimeToMinutes(startT) ?? 0) / 60;
            return hour >= 6 && hour < 19;
          }).length,
        };

        // Daily logs
        const days = eachDayOfInterval({ start, end });
        const dailyLogs = days.map(d => {
          const dayKey = format(d, 'yyyy-MM-dd');
          const dayActs = inRange.filter(a => format(new Date(a.logged_at), 'yyyy-MM-dd') === dayKey);
          const dayFeeds = dayActs.filter(a => a.type === 'feed').length;
          const dayNaps = dayActs.filter(a => a.type === 'nap');
          const daySleepMin = dayNaps.map(s => {
            const st = s.details?.startTime;
            const et = s.details?.endTime;
            if (!st || !et) return 0;
            const sm = parseTimeToMinutes(st);
            const em = parseTimeToMinutes(et);
            if (sm === null || em === null) return 0;
            let dur = em - sm;
            if (dur < 0) dur += 24 * 60;
            return dur;
          }).reduce((a, b) => a + b, 0);
          const dayDiapers = dayActs.filter(a => a.type === 'diaper').length;
          return {
            date: format(d, 'MMM dd'),
            feeds: dayFeeds,
            sleepHours: daySleepMin / 60,
            diapers: dayDiapers,
          };
        });

        // Milestones from note activities
        const milestones = inRange
          .filter(a => a.type === 'note' && a.details?.note && a.details?.note.length > 10)
          .map(a => `${format(new Date(a.logged_at), 'MMM dd')}: ${a.details.note}`)
          .slice(0, 10);

        // Invoke server PDF generator
        const { data, error } = await supabase.functions.invoke('generate-pediatrician-report', {
          body: {
            babyName,
            dateRange: {
              start: format(start, 'MMM dd, yyyy'),
              end: format(end, 'MMM dd, yyyy'),
            },
            locale: navigator.language,
            feedingSummary,
            sleepSummary,
            dailyLogs,
            milestones,
            observations: '',
            excludedDays: [],
          },
        });

        if (error) throw error;

        // Download the PDF
        const blob = new Blob([data as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${babyName.toLowerCase()}-pediatrician-summary-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to generate pediatrician PDF:', err);
      } finally {
        if (!cancelled) onDone();
      }
    };

    generate();
    return () => {
      cancelled = true;
    };
  }, [open, onDone, babyName, config, dbActivities]);

  return null;
}
