import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface MilestoneConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (timing: string | null) => void;
  stageName: string;
  stageNumber: number;
  babyName: string;
}

type TimingOption = "today" | "few-days" | "week" | null;

export const MilestoneConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  stageName,
  stageNumber,
  babyName,
}: MilestoneConfirmationModalProps) => {
  const [selectedTiming, setSelectedTiming] = useState<TimingOption>(null);

  const handleConfirm = () => {
    onConfirm(selectedTiming);
    setSelectedTiming(null);
  };

  const handleSkip = () => {
    onConfirm(null);
  };

  const handleClose = () => {
    setSelectedTiming(null);
    onClose();
  };

  const timingOptions: { value: TimingOption; label: string }[] = [
    { value: "today", label: "Just today" },
    { value: "few-days", label: "A few days ago" },
    { value: "week", label: "About a week ago" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent 
        className="fixed left-1/2 -translate-x-1/2 bottom-0 top-auto translate-y-0
                   sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 
                   w-[calc(100%-1rem)] sm:max-w-md rounded-t-2xl sm:rounded-2xl border-0 bg-[#2a2a2a] p-0 shadow-2xl
                   animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300
                   focus:outline-none"
        style={{ maxHeight: "85vh" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-muted-foreground/60 hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-8 pb-6 space-y-6">
          {/* Celebration Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C4A574]/10 mb-2">
              <Sparkles className="w-6 h-6 text-[#C4A574]" />
            </div>
            <h2 className="text-xl font-serif text-foreground">Milestone reached!</h2>
            <p className="text-sm text-muted-foreground">
              This helps us understand {babyName}'s rhythm
            </p>
          </div>

          {/* Timing Question */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground/80">
              When did you first notice this?
            </p>
            <div className="space-y-2">
              {timingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTiming(option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200
                    ${selectedTiming === option.value
                      ? "bg-[#C4A574]/15 border border-[#C4A574]/40"
                      : "bg-[#1a1a1a] border border-transparent hover:border-[#C4A574]/20"
                    }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${selectedTiming === option.value 
                        ? "border-[#C4A574] bg-[#C4A574]" 
                        : "border-muted-foreground/40"
                      }`}
                  >
                    {selectedTiming === option.value && (
                      <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                    )}
                  </div>
                  <span className={`text-base ${selectedTiming === option.value ? "text-foreground" : "text-foreground/80"}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Skip option */}
            <button
              onClick={handleSkip}
              className="w-full text-center py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={selectedTiming === null}
            className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-200
              ${selectedTiming !== null
                ? "bg-[#C4A574] text-[#1a1a1a] hover:bg-[#D4A574] active:scale-[0.98]"
                : "bg-[#C4A574]/30 text-[#1a1a1a]/50 cursor-not-allowed"
              }`}
          >
            Update {babyName}'s timeline
          </button>
        </div>

        {/* Safe area padding for iPhone */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </DialogContent>
    </Dialog>
  );
};
