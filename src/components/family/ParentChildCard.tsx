import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { CollapsibleSubsection } from "./CollapsibleSubsection";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getZodiacName, ZodiacSign } from "@/lib/zodiac";

interface ParentChildDynamics {
  hook: string;
  parentQualities: string[];
  youreTheParentWho: string[];
  whatChildNeeds: string[];
  whatYouAlreadyGive: string;
  currentPhaseInsight: string;
  friction: string[];
  deepConnection: string;
  cultivationTips?: string[];
  dailyRituals?: string[];
  signStrengthsToNurture?: string[];
}

interface ParentChildCardProps {
  babyId: string;
  babyName: string;
  parentName: string;
  parentSun: ZodiacSign;
  parentMoon: ZodiacSign | null;
  childSun: ZodiacSign;
  childMoon: ZodiacSign | null;
  ageMonths: number;
  dynamics: ParentChildDynamics | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

export const ParentChildCard = ({
  babyId,
  babyName,
  parentName,
  parentSun,
  parentMoon,
  childSun,
  childMoon,
  ageMonths,
  dynamics,
  loading,
  error,
  onGenerate,
}: ParentChildCardProps) => {
  useEffect(() => {
    if (!dynamics && !loading && !error) {
      onGenerate();
    }
  }, [dynamics, loading, error, onGenerate]);
  
  // Co-Star style preview - no sign naming
  const preview = dynamics?.hook || "Natural fit. Intuitive connection.";

  return (
    <CollapsibleCard
      title={`${parentName} + ${babyName}`}
      subtitle={`${getZodiacName(parentSun)} · ${getZodiacName(childSun)}`}
      preview={preview}
    >
      {loading ? (
        <div className="flex items-center gap-2 py-2">
          <LoadingSpinner />
          <span className="text-[13px] text-foreground/40">Generating...</span>
        </div>
      ) : error ? (
        <div className="py-2">
          <p className="text-[13px] text-foreground/40 mb-2">{error}</p>
          <Button variant="ghost" size="sm" onClick={onGenerate} className="text-foreground/40 hover:text-foreground/60">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      ) : dynamics ? (
        <>
          <p className="text-[13px] text-foreground/60 leading-[1.6]">{dynamics.hook}</p>

          <CollapsibleSubsection title="Right Now">
            <p className="text-[13px] text-foreground/50 leading-[1.6]">{dynamics.currentPhaseInsight}</p>
          </CollapsibleSubsection>

          {/* Cultivation Tips - New Section */}
          {dynamics.cultivationTips && dynamics.cultivationTips.length > 0 && (
            <CollapsibleSubsection title="How To Cultivate">
              <div className="space-y-2">
                {dynamics.cultivationTips.slice(0, 5).map((tip, i) => (
                  <p key={i} className="text-[13px] text-foreground/50 leading-[1.6]">{tip}</p>
                ))}
              </div>
            </CollapsibleSubsection>
          )}

          {/* Daily Rituals - New Section */}
          {dynamics.dailyRituals && dynamics.dailyRituals.length > 0 && (
            <CollapsibleSubsection title="Daily Rituals">
              <div className="space-y-2">
                {dynamics.dailyRituals.slice(0, 4).map((ritual, i) => (
                  <p key={i} className="text-[13px] text-foreground/50 leading-[1.6]">{ritual}</p>
                ))}
              </div>
            </CollapsibleSubsection>
          )}

          {/* Strengths to Nurture - New Section */}
          {dynamics.signStrengthsToNurture && dynamics.signStrengthsToNurture.length > 0 && (
            <CollapsibleSubsection title="Strengths To Nurture">
              <div className="space-y-2">
                {dynamics.signStrengthsToNurture.slice(0, 4).map((strength, i) => (
                  <p key={i} className="text-[13px] text-foreground/50 leading-[1.6]">{strength}</p>
                ))}
              </div>
            </CollapsibleSubsection>
          )}

          <CollapsibleSubsection title="Friction Points">
            <div className="space-y-1">
              {dynamics.friction.slice(0, 3).map((f, i) => (
                <p key={i} className="text-[13px] text-foreground/50">{f}</p>
              ))}
            </div>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Deep Connection">
            <p className="text-[13px] text-foreground/50 leading-[1.6]">{dynamics.deepConnection}</p>
          </CollapsibleSubsection>
        </>
      ) : null}
    </CollapsibleCard>
  );
};
