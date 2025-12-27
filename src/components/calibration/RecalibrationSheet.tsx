import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalibrationFlow, CalibrationData } from "./CalibrationFlow";
import { ChartGenerating } from "./ChartGenerating";
import { formatLastCalibrated, isCalibrationStale } from "@/hooks/useCalibrationPrompt";
import { Calibration } from "@/hooks/useCalibration";
import { RefreshCw } from "lucide-react";

interface RecalibrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  babyName: string;
  babyBirthday: string;
  calibration: Calibration | null;
  onComplete: (data: CalibrationData, emergingFlags: Record<string, boolean>) => Promise<void>;
}

export const RecalibrationSheet = ({
  open,
  onOpenChange,
  babyName,
  babyBirthday,
  calibration,
  onComplete,
}: RecalibrationSheetProps) => {
  const [showFlow, setShowFlow] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartCalibration = () => {
    setShowFlow(true);
  };

  const handleComplete = async (data: CalibrationData, emergingFlags: Record<string, boolean>) => {
    setShowFlow(false);
    setIsGenerating(true);
    
    try {
      await onComplete(data, emergingFlags);
      // Wait a moment for the generating animation
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsGenerating(false);
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    setShowFlow(false);
  };

  const isStale = isCalibrationStale(calibration);
  const lastCalibrated = formatLastCalibrated(calibration);

  if (isGenerating) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <ChartGenerating babyName={babyName} />
        </SheetContent>
      </Sheet>
    );
  }

  if (showFlow) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 overflow-y-auto pointer-events-auto">
          <div className="pointer-events-auto">
            <CalibrationFlow
              babyName={babyName}
              babyBirthday={babyBirthday}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="font-serif text-xl">
            Update {babyName}'s Baseline
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-foreground/60">
              The developmental chart was last updated{" "}
              <span className={isStale ? "text-foreground/80 font-medium" : ""}>
                {lastCalibrated.toLowerCase()}
              </span>.
              {isStale && " It might be time to refresh."}
            </p>
            <p className="text-sm text-foreground/60">
              Answer a few quick questions to update the stages based on where {babyName} is now.
            </p>
          </div>

          <Button 
            onClick={handleStartCalibration} 
            className="w-full gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Review Calibration Questions
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
