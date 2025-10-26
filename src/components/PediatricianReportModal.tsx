import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface Activity {
  id: string;
  type: string;
  created_at: string;
  time_input?: string;
  duration?: number;
  quantity?: number;
  notes?: string;
}

interface PediatricianReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[];
  babyName?: string;
}

export function PediatricianReportModal({
  open,
  onOpenChange,
  activities,
  babyName = "Baby",
}: PediatricianReportModalProps) {
  const [dateRange, setDateRange] = useState<'last-week' | 'last-month' | 'custom'>('last-week');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [includeFeeds, setIncludeFeeds] = useState(true);
  const [includeSleep, setIncludeSleep] = useState(true);
  const [includeDiapers, setIncludeDiapers] = useState(true);
  const [observations, setObservations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'last-week':
        return { start: subDays(now, 7), end: now };
      case 'last-month':
        return { start: subDays(now, 30), end: now };
      case 'custom':
        return { 
          start: customStartDate || subDays(now, 7), 
          end: customEndDate || now 
        };
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const { start, end } = getDateRange();
      
      // Filter activities by date range
      const filtered = activities.filter(a => {
        const activityDate = new Date(a.created_at);
        return activityDate >= startOfDay(start) && activityDate <= endOfDay(end);
      });

      // Calculate summaries
      const feeds = includeFeeds ? filtered.filter(a => a.type === 'feed') : [];
      const sleeps = includeSleep ? filtered.filter(a => a.type === 'nap') : [];
      const diapers = includeDiapers ? filtered.filter(a => a.type === 'diaper') : [];

      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

      const feedingSummary = {
        total: feeds.length,
        avgPerDay: feeds.length / totalDays,
        totalVolume: feeds.reduce((sum, f) => sum + (f.quantity || 0), 0),
      };

      const totalSleepMinutes = sleeps.reduce((sum, s) => sum + (s.duration || 0), 0);
      const sleepSummary = {
        totalHours: totalSleepMinutes / 60,
        avgPerDay: totalSleepMinutes / 60 / totalDays,
        nightSleeps: sleeps.filter(s => {
          const hour = parseInt(s.time_input?.split(':')[0] || '0');
          return hour >= 19 || hour < 6;
        }).length,
        naps: sleeps.filter(s => {
          const hour = parseInt(s.time_input?.split(':')[0] || '0');
          return hour >= 6 && hour < 19;
        }).length,
      };

      // Generate daily logs
      const dailyLogs: Array<{ date: string; feeds: number; sleepHours: number; diapers: number }> = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayActivities = filtered.filter(a => 
          format(new Date(a.created_at), 'yyyy-MM-dd') === dateStr
        );
        
        dailyLogs.push({
          date: format(currentDate, 'MMM dd'),
          feeds: dayActivities.filter(a => a.type === 'feed').length,
          sleepHours: dayActivities.filter(a => a.type === 'nap').reduce((sum, s) => sum + (s.duration || 0), 0) / 60,
          diapers: dayActivities.filter(a => a.type === 'diaper').length,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Extract milestones from notes
      const milestones = filtered
        .filter(a => a.notes && a.notes.length > 10)
        .map(a => `${format(new Date(a.created_at), 'MMM dd')}: ${a.notes}`)
        .slice(0, 10);

      // Call edge function
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
          observations,
          excludedDays: [],
        },
      });

      if (error) throw error;

      // Download the PDF
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${babyName.toLowerCase()}-pediatrician-summary-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Pediatrician Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-sm text-muted-foreground">
            PDF is optimized for printing; looks the same for everyone.
          </div>

          <div className="space-y-3">
            <Label>Date Range</Label>
            <RadioGroup value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last-week" id="last-week" />
                <Label htmlFor="last-week" className="font-normal cursor-pointer">Last 7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last-month" id="last-month" />
                <Label htmlFor="last-month" className="font-normal cursor-pointer">Last 30 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">Custom range</Label>
              </div>
            </RadioGroup>

            {dateRange === 'custom' && (
              <div className="flex gap-4 ml-6">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <DatePicker selected={customStartDate} onSelect={setCustomStartDate} />
                </div>
                <div className="flex-1">
                  <Label>End Date</Label>
                  <DatePicker selected={customEndDate} onSelect={setCustomEndDate} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Include in Report</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="feeds" checked={includeFeeds} onCheckedChange={(c) => setIncludeFeeds(!!c)} />
                <Label htmlFor="feeds" className="font-normal cursor-pointer">Feeding Summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sleep" checked={includeSleep} onCheckedChange={(c) => setIncludeSleep(!!c)} />
                <Label htmlFor="sleep" className="font-normal cursor-pointer">Sleep Summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="diapers" checked={includeDiapers} onCheckedChange={(c) => setIncludeDiapers(!!c)} />
                <Label htmlFor="diapers" className="font-normal cursor-pointer">Diaper Changes</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Additional Observations (optional)</Label>
            <Textarea
              id="observations"
              placeholder="Any concerns or notes you'd like to share with your pediatrician..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={generateReport} 
            disabled={isGenerating || (!includeFeeds && !includeSleep && !includeDiapers)}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
