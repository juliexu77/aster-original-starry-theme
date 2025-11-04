import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AISchedulePrediction } from "@/utils/adaptiveScheduleGenerator";

interface TodayAtGlanceProps {
  prediction: AISchedulePrediction | null;
  loading: boolean;
}

export const TodayAtGlance = ({ prediction, loading }: TodayAtGlanceProps) => {
  if (loading) {
    return (
      <div className="px-4 py-3 bg-accent/10 rounded-lg border border-border/40 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing patterns...</p>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  // Show transition info if baby is transitioning schedules
  if (prediction.is_transitioning && prediction.transition_note) {
    return (
      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            Schedule Transition
          </Badge>
        </div>
        <p className="text-sm text-foreground">
          {prediction.transition_note}
        </p>
      </div>
    );
  }

  // Don't render anything if not transitioning (schedule timeline shows all details)
  return null;
};
