import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { CollapsibleSubsection } from "./CollapsibleSubsection";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getZodiacName, getZodiacGlyph, ZodiacSign } from "@/lib/zodiac";

interface ParentChildDynamics {
  hook: string;
  parentQualities: string[];
  youreTheParentWho: string[];
  whatChildNeeds: string[];
  whatYouAlreadyGive: string;
  currentPhaseInsight: string;
  friction: string[];
  deepConnection: string;
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

  const parentGlyph = getZodiacGlyph(parentSun);
  const childGlyph = getZodiacGlyph(childSun);
  
  // Co-Star style preview - no sign naming
  const preview = dynamics?.hook || "Natural fit. Intuitive connection.";

  return (
    <CollapsibleCard
      title={`${parentName} + ${babyName}`}
      subtitle={`${getZodiacName(parentSun)} ${parentGlyph} · ${getZodiacName(childSun)} ${childGlyph}`}
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
          
          <CollapsibleSubsection title="Qualities">
            <div className="space-y-1">
              {dynamics.parentQualities.slice(0, 4).map((q, i) => (
                <p key={i} className="text-[13px] text-foreground/50">{q}</p>
              ))}
            </div>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Approach">
            <div className="space-y-1">
              {dynamics.youreTheParentWho.slice(0, 3).map((item, i) => (
                <p key={i} className="text-[13px] text-foreground/50">{item}</p>
              ))}
            </div>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Needs">
            <div className="space-y-1">
              {dynamics.whatChildNeeds.slice(0, 3).map((need, i) => (
                <p key={i} className="text-[13px] text-foreground/50">{need}</p>
              ))}
            </div>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Phase">
            <p className="text-[13px] text-foreground/50">{dynamics.currentPhaseInsight}</p>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Friction">
            <div className="space-y-1">
              {dynamics.friction.slice(0, 2).map((f, i) => (
                <p key={i} className="text-[13px] text-foreground/50">{f}</p>
              ))}
            </div>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Connection">
            <p className="text-[13px] text-foreground/50">{dynamics.deepConnection}</p>
          </CollapsibleSubsection>
        </>
      ) : null}
    </CollapsibleCard>
  );
};
