import { useState } from "react";
import { Check } from "lucide-react";
import { MilestoneConfirmationModal } from "./MilestoneConfirmationModal";
import { toast } from "@/hooks/use-toast";

interface MilestoneConfirmationButtonProps {
  stageNumber: number;
  stageName: string;
  domainId: string;
  babyName: string;
  babyId: string;
  confirmedDate?: string | null;
  onConfirm?: (date: string, timing: string | null) => void;
  onUndo?: () => void;
}

export const MilestoneConfirmationButton = ({
  stageNumber,
  stageName,
  domainId,
  babyName,
  babyId,
  confirmedDate,
  onConfirm,
  onUndo,
}: MilestoneConfirmationButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localConfirmedDate, setLocalConfirmedDate] = useState<string | null>(confirmedDate || null);

  const handleConfirm = (timing: string | null) => {
    // Calculate the date based on timing
    const now = new Date();
    let confirmDate = now;
    
    if (timing === "few-days") {
      confirmDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    } else if (timing === "week") {
      confirmDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    }

    const dateString = confirmDate.toISOString().split('T')[0];
    setLocalConfirmedDate(dateString);
    setIsModalOpen(false);

    // Show success toast
    toast({
      title: "Timeline updated ✓",
      duration: 2000,
    });

    // Call parent callback if provided
    onConfirm?.(dateString, timing);
  };

  const handleUndo = () => {
    setLocalConfirmedDate(null);
    onUndo?.();
    
    toast({
      title: "Milestone unmarked",
      duration: 2000,
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isConfirmed = localConfirmedDate !== null;

  return (
    <div className="space-y-2">
      {isConfirmed ? (
        // Confirmed state
        <>
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl 
                       bg-[#C4A574]/10 border border-[#C4A574]/20 cursor-default"
          >
            <Check className="w-4 h-4 text-[#C4A574]" />
            <span className="text-[#C4A574] text-sm font-medium">
              Started {formatDate(localConfirmedDate)}
            </span>
          </button>
          <button
            onClick={handleUndo}
            className="w-full text-center py-1 text-xs text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors"
          >
            Not quite yet?
          </button>
        </>
      ) : (
        // Unconfirmed state
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl 
                     border border-[#C4A574]/40 bg-transparent
                     hover:bg-[#C4A574]/10 hover:border-[#C4A574]/60
                     active:scale-[0.98] transition-all duration-200"
        >
          <Check className="w-4 h-4 text-[#C4A574]" />
          <span className="text-[#C4A574] text-sm font-medium">
            We're seeing this!
          </span>
        </button>
      )}

      {/* Confirmation Modal */}
      <MilestoneConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        stageName={stageName}
        stageNumber={stageNumber}
        babyName={babyName}
      />
    </div>
  );
};
