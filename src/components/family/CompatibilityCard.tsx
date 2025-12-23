import { Heart, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { CompatibilityResult } from "@/lib/zodiac";

interface CompatibilityCardProps {
  person1Name: string;
  person1Sign: string;
  person1Symbol: string;
  person2Name: string;
  person2Sign: string;
  person2Symbol: string;
  compatibility: CompatibilityResult;
  relationshipType: "parent-child" | "siblings";
}

export const CompatibilityCard = ({
  person1Name,
  person1Sign,
  person1Symbol,
  person2Name,
  person2Sign,
  person2Symbol,
  compatibility,
}: CompatibilityCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-emerald-600 dark:text-emerald-400";
      case "medium":
        return "text-amber-600 dark:text-amber-400";
      case "challenging":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case "high":
        return "bg-emerald-500/10";
      case "medium":
        return "bg-amber-500/10";
      case "challenging":
        return "bg-orange-500/10";
      default:
        return "bg-muted/50";
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      {/* Header with names and signs */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl">{person1Symbol}</span>
            <span className="text-xs font-medium text-foreground">{person1Name}</span>
            <span className="text-[10px] text-muted-foreground">{person1Sign}</span>
          </div>
          
          <Heart className="w-4 h-4 text-primary/60" />
          
          <div className="flex flex-col items-center">
            <span className="text-2xl">{person2Symbol}</span>
            <span className="text-xs font-medium text-foreground">{person2Name}</span>
            <span className="text-[10px] text-muted-foreground">{person2Sign}</span>
          </div>
        </div>
        
        {/* Compatibility score */}
        <div className="flex justify-center mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getLevelColor(compatibility.level)} ${getLevelBg(compatibility.level)}`}>
            {compatibility.level} compatibility
          </span>
        </div>
      </div>
      
      {/* Summary */}
      <div className="p-4 border-b border-border/20">
        <p className="text-sm text-foreground text-center leading-relaxed">
          {compatibility.summary}
        </p>
      </div>
      
      {/* Details */}
      <div className="p-4 space-y-4">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Strengths</span>
          </div>
          <ul className="space-y-1">
            {compatibility.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-foreground/90 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary/40">
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Challenges */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Challenges</span>
          </div>
          <ul className="space-y-1">
            {compatibility.challenges.map((challenge, i) => (
              <li key={i} className="text-sm text-foreground/90 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary/40">
                {challenge}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tips */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tips</span>
          </div>
          <ul className="space-y-1">
            {compatibility.tips.map((tip, i) => (
              <li key={i} className="text-sm text-foreground/90 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary/40">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
};
