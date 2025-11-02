import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface HeroInsightCardProps {
  insight: string;
  confidence: string;
  loading?: boolean;
}

export const HeroInsightCard = ({ insight, confidence, loading }: HeroInsightCardProps) => {
  if (loading) {
    return (
      <div className="mb-6 p-5 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="h-6 w-48 bg-primary/20 rounded"></div>
          <div className="h-5 w-24 bg-primary/20 rounded-full"></div>
        </div>
        <div className="h-4 w-full bg-primary/20 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-primary/20 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Today's Insight
          </h3>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          {confidence}
        </Badge>
      </div>
      <p className="text-base text-foreground leading-relaxed">
        {insight}
      </p>
    </div>
  );
};
