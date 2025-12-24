import { useEffect } from "react";
import { Heart, RefreshCw } from "lucide-react";
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
  // Auto-generate on mount if no dynamics yet
  useEffect(() => {
    if (!dynamics && !loading && !error) {
      onGenerate();
    }
  }, [dynamics, loading, error, onGenerate]);

  const preview = dynamics?.hook || "Tap to discover your cosmic connection with this child.";

  return (
    <CollapsibleCard
      icon={<Heart className="w-4 h-4" />}
      title={`${parentName} + ${babyName}`}
      subtitle={`${getZodiacName(parentSun)} parent • ${getZodiacName(childSun)} child`}
      preview={preview}
    >
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
          <span className="ml-2 text-sm text-muted-foreground">Generating insights...</span>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={onGenerate}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Try again
          </Button>
        </div>
      ) : dynamics ? (
        <>
          <p className="text-sm text-foreground mb-4">{dynamics.hook}</p>
          
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Your {getZodiacName(parentSun)}{parentMoon ? ` + ${getZodiacName(parentMoon)} Moon` : ''} gives you:
            </p>
            <ul className="space-y-1">
              {dynamics.parentQualities.slice(0, 6).map((q, i) => (
                <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <CollapsibleSubsection title={`You're the parent who...`}>
            <ul className="space-y-1">
              {dynamics.youreTheParentWho.map((item, i) => (
                <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleSubsection>

          <CollapsibleSubsection title={`What ${babyName} needs`}>
            <ul className="space-y-1">
              {dynamics.whatChildNeeds.map((need, i) => (
                <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                  {need}
                </li>
              ))}
            </ul>
            <p className="text-sm text-foreground/90 mt-3 italic">{dynamics.whatYouAlreadyGive}</p>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Current phase insight">
            <p className="text-sm text-foreground/90">{dynamics.currentPhaseInsight}</p>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Where to watch for friction">
            <ul className="space-y-1">
              {dynamics.friction.map((f, i) => (
                <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                  {f}
                </li>
              ))}
            </ul>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Your deep connection">
            <p className="text-sm text-foreground/90">{dynamics.deepConnection}</p>
          </CollapsibleSubsection>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Loading insights...</p>
      )}
    </CollapsibleCard>
  );
};
