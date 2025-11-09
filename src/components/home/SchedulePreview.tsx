import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Moon, Sun } from "lucide-react";

interface SchedulePreviewProps {
  babyName?: string;
  onViewFullSchedule: () => void;
}

export const SchedulePreview = ({ babyName, onViewFullSchedule }: SchedulePreviewProps) => {
  const name = babyName?.split(' ')[0] || 'Baby';

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              {name}'s predicted schedule is ready!
            </h3>
            <p className="text-xs text-muted-foreground">
              Based on the nap you just logged
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-border/40">
          <Moon className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground flex-1">
            See predicted nap times, wake windows, and more
          </p>
        </div>

        <Button 
          onClick={onViewFullSchedule}
          variant="default"
          className="w-full"
          size="sm"
        >
          View {name}'s schedule
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          💡 Predictions improve as you log more activities
        </p>
      </div>
    </Card>
  );
};