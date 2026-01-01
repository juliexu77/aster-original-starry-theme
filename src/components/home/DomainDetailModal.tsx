import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, Circle, Minus } from "lucide-react";
import { DomainData, getStagesForDomain } from "./DevelopmentTable";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MilestoneConfirmationButton } from "./MilestoneConfirmationButton";

interface DomainDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: DomainData | null | undefined;
  ageInWeeks: number;
  birthday?: string;
  babyName?: string;
  babyId?: string;
  allDomains: DomainData[];
  onNavigate: (domainId: string) => void;
  onMilestoneConfirm?: (domainId: string, stageNumber: number, date: string) => void;
}

// Support tips by domain

// Support tips by domain
const getSupportTips = (domainId: string): string[] => {
  const tips: Record<string, string[]> = {
    physical: [
      "Provide safe spaces for movement and exploration",
      "Create opportunities for practice at their current level",
      "Celebrate effort and progress, not just achievement",
      "Let them practice without rushing to help",
    ],
    fine_motor: [
      "Offer age-appropriate objects to manipulate",
      "Let mealtimes get messy—it's learning",
      "Provide varied textures and materials to explore",
      "Resist the urge to do things for them",
    ],
    language: [
      "Narrate your day and their activities",
      "Read together every day, even briefly",
      "Wait and give time to respond",
      "Expand on their words and sounds",
    ],
    social: [
      "Model kind interactions and sharing",
      "Provide opportunities for peer observation and play",
      "Respect their pace with new people",
      "Role-play social situations through play",
    ],
    cognitive: [
      "Follow their interests and curiosity",
      "Ask open-ended questions",
      "Provide appropriate challenges without frustration",
      "Let them figure things out before helping",
    ],
    emotional: [
      "Name emotions as they happen",
      "Stay calm during big feelings",
      "Validate their experience before redirecting",
      "Create consistent, predictable routines",
    ],
    sleep: [
      "Maintain consistent bedtime routine even when sleep is disrupted",
      "Respond to night wakings calmly and briefly",
      "Ensure good daytime naps to prevent overtiredness",
      "Create a dark, quiet, and comfortable sleep environment",
    ],
    feeding: [
      "Offer new foods alongside familiar favorites",
      "Let them explore food with hands - mess is learning",
      "Keep mealtimes pleasant, not battles",
      "Respect their hunger and fullness cues",
    ],
  };

  return tips[domainId] || [];
};

export const DomainDetailModal = ({
  isOpen,
  onClose,
  domain,
  ageInWeeks,
  birthday,
  babyName = "your baby",
  babyId = "",
  allDomains,
  onNavigate,
  onMilestoneConfirm,
}: DomainDetailModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmedMilestones, setConfirmedMilestones] = useState<Record<string, string>>({});

  useEffect(() => {
    if (domain) {
      const index = allDomains.findIndex(d => d.id === domain.id);
      if (index >= 0) setCurrentIndex(index);
    }
  }, [domain, allDomains]);

  if (!domain) return null;

  const supportTips = getSupportTips(domain.id);
  const stages = getStagesForDomain(domain.id);
  
  // Find current and next stage info
  const currentStageInfo = stages.find(s => s.stage === domain.currentStage);
  const nextStageInfo = stages.find(s => s.stage === domain.currentStage + 1);

  // Calculate estimated time to next stage
  const getTimeToNextStage = (): string => {
    if (!nextStageInfo) return "";
    const weeksUntilNextStageEnd = nextStageInfo.ageRangeWeeks[0] - ageInWeeks;
    if (weeksUntilNextStageEnd <= 0) return "any time now";
    if (weeksUntilNextStageEnd <= 2) return "1-2 weeks";
    if (weeksUntilNextStageEnd <= 4) return "2-4 weeks";
    if (weeksUntilNextStageEnd <= 8) return "1-2 months";
    return "a few months";
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < allDomains.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      onNavigate(allDomains[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(allDomains[currentIndex + 1].id);
    }
  };

  // Stop touch events from propagating to parent to prevent child switching
  const handleTouchEvent = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div 
          className="flex flex-col h-full max-h-[85vh]"
          onTouchStart={handleTouchEvent}
          onTouchMove={handleTouchEvent}
          onTouchEnd={handleTouchEvent}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{domain.icon}</span>
              <h2 className="text-lg font-serif text-foreground">{domain.label}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Current Stage */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Current Stage
              </h3>
              <div className="bg-primary/5 rounded-lg px-4 py-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-light text-primary">{domain.currentStage}</span>
                  <span className="text-lg font-serif text-foreground">{domain.stageName}</span>
                  {domain.isEmerging && (
                    <span className="text-xs text-amber-500 uppercase tracking-wider">emerging to next</span>
                  )}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {currentStageInfo?.description}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Progress
              </h3>
              <div className="flex items-center gap-1.5">
                {stages.map((stage, i) => (
                  <div
                    key={stage.stage}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      stage.stage < domain.currentStage 
                        ? "bg-primary" 
                        : stage.stage === domain.currentStage 
                          ? domain.isEmerging ? "bg-primary/60" : "bg-primary"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">Stage 1</span>
                <span className="text-[10px] text-muted-foreground">Stage {stages.length}</span>
              </div>
            </div>

            {/* Next Stage */}
            {nextStageInfo && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Next Stage
                </h3>
                <div className="border border-border/30 rounded-lg px-4 py-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-light text-muted-foreground">{nextStageInfo.stage}</span>
                    <span className="text-base font-serif text-foreground/80">{nextStageInfo.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Likely emerging {getTimeToNextStage()}
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                    {nextStageInfo.description}
                  </p>

                  {/* Milestone Confirmation Button */}
                  <MilestoneConfirmationButton
                    stageNumber={nextStageInfo.stage}
                    stageName={nextStageInfo.name}
                    domainId={domain.id}
                    babyName={babyName}
                    babyId={babyId}
                    confirmedDate={confirmedMilestones[`${domain.id}-${nextStageInfo.stage}`]}
                    onConfirm={(date, timing) => {
                      setConfirmedMilestones(prev => ({
                        ...prev,
                        [`${domain.id}-${nextStageInfo.stage}`]: date
                      }));
                      onMilestoneConfirm?.(domain.id, nextStageInfo.stage, date);
                    }}
                    onUndo={() => {
                      setConfirmedMilestones(prev => {
                        const updated = { ...prev };
                        delete updated[`${domain.id}-${nextStageInfo.stage}`];
                        return updated;
                      });
                    }}
                  />
                </div>
              </div>
            )}

            {/* How to Support */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                How to Support
              </h3>
              <ul className="space-y-2.5">
                {supportTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/30">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Prev</span>
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {allDomains.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => onNavigate(d.id)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoNext 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
