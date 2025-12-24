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
  // Auto-generate on mount if no dynamics yet
  useEffect(() => {
    if (!dynamics && !loading && !error) {
      onGenerate();
    }
  }, [dynamics, loading, error, onGenerate]);

  const preview = dynamics?.hook || "Loading...";
  const parentGlyph = getZodiacGlyph(parentSun);
  const childGlyph = getZodiacGlyph(childSun);

  return (
    <CollapsibleCard
      title={`${parentName} + ${babyName}`}
      subtitle={`${getZodiacName(parentSun)} ${parentGlyph} · ${getZodiacName(childSun)} ${childGlyph}`}
      preview={preview}
    >
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
          <span className="ml-2 text-[14px] text-muted-foreground">Generating...</span>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-[14px] text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={onGenerate}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Try again
          </Button>
        </div>
      ) : dynamics ? (
        <>
          <p className="text-[14px] text-foreground/80 mb-4 leading-[1.5]">{dynamics.hook}</p>
          
          <div className="mb-4">
            <p className="text-[12px] text-muted-foreground/60 uppercase tracking-wide mb-2">
              {getZodiacName(parentSun)}{parentMoon ? ` + ${getZodiacName(parentMoon)} ☽` : ''} gives you
            </p>
            <ul className="space-y-1">
              {dynamics.parentQualities.slice(0, 6).map((q, i) => (
                <li key={i} className="text-[14px] text-foreground/70 pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-foreground/30">
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <CollapsibleSubsection title="You're the parent who">
            <ul className="space-y-1">
              {dynamics.youreTheParentWho.map((item, i) => (
                <li key={i} className="text-[14px] text-foreground/70 pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-foreground/30">
                  {item}
                </li>
              ))}
            </ul>
          </CollapsibleSubsection>

          <CollapsibleSubsection title={`What ${babyName} needs`}>
            <ul className="space-y-1">
              {dynamics.whatChildNeeds.map((need, i) => (
                <li key={i} className="text-[14px] text-foreground/70 pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-foreground/30">
                  {need}
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-foreground/60 mt-3">{dynamics.whatYouAlreadyGive}</p>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Current phase">
            <p className="text-[14px] text-foreground/70">{dynamics.currentPhaseInsight}</p>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Friction points">
            <ul className="space-y-1">
              {dynamics.friction.map((f, i) => (
                <li key={i} className="text-[14px] text-foreground/70 pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-foreground/30">
                  {f}
                </li>
              ))}
            </ul>
          </CollapsibleSubsection>

          <CollapsibleSubsection title="Deep connection">
            <p className="text-[14px] text-foreground/70">{dynamics.deepConnection}</p>
          </CollapsibleSubsection>
        </>
      ) : (
        <p className="text-[14px] text-muted-foreground">Loading...</p>
      )}
    </CollapsibleCard>
  );
};
