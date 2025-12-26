import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

interface CalibrationCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  babyName: string;
  ageInMonths: number;
  onUpdateChart: () => void;
  onMaybeLater: () => void;
}

const getCheckInCopy = (babyName: string, ageInMonths: number): { title: string; subtitle: string } => {
  if (ageInMonths === 12) {
    return {
      title: `${babyName}'s one! 🎂`,
      subtitle: "Time to refresh the chart"
    };
  }
  if (ageInMonths < 12) {
    return {
      title: `${babyName}'s ${ageInMonths} months old today`,
      subtitle: "A lot changes in a month at this age"
    };
  }
  if (ageInMonths < 18) {
    return {
      title: `${babyName} is ${ageInMonths} months`,
      subtitle: "Toddlerhood brings rapid changes"
    };
  }
  return {
    title: `Time to check in on ${babyName}`,
    subtitle: "Let's see how development is progressing"
  };
};

export const CalibrationCheckInModal = ({
  open,
  onOpenChange,
  babyName,
  ageInMonths,
  onUpdateChart,
  onMaybeLater,
}: CalibrationCheckInModalProps) => {
  const { title, subtitle } = getCheckInCopy(babyName, ageInMonths);

  const handleMaybeLater = () => {
    onMaybeLater();
    onOpenChange(false);
  };

  const handleUpdate = () => {
    onUpdateChart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center p-8">
        <div className="space-y-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
            <Moon className="w-6 h-6 text-foreground/40" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-serif text-foreground">{title}</h2>
            <p className="text-sm text-foreground/50">{subtitle}</p>
            <p className="text-sm text-foreground/70 pt-2">
              Want to update the developmental chart?
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button onClick={handleUpdate} className="w-full">
              Update Chart
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleMaybeLater}
              className="w-full text-foreground/40"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
