import { Activity } from "./ActivityCard";
import { Brain, Clock, TrendingUp, Baby, Moon } from "lucide-react";
import { useState } from "react";
import { usePatternAnalysis } from "@/hooks/usePatternAnalysis";
import { InsightCard } from "./insights/InsightCard";

interface PatternInsightsProps {
  activities: Activity[];
}

export const PatternInsights = ({ activities }: PatternInsightsProps) => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const { analyzePatterns } = usePatternAnalysis();

  const insights = analyzePatterns(activities);

  const getIconForInsight = (insight: any) => {
    if (insight.text.includes('feed')) return <Baby className="h-4 w-4 text-primary" />;
    if (insight.text.includes('consistent') && insight.type === 'feeding') return <Clock className="h-4 w-4 text-primary" />;
    if (insight.text.includes('vary')) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (insight.type === 'sleep') return <Moon className="h-4 w-4 text-primary" />;
    return <Brain className="h-4 w-4 text-primary" />;
  };

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Brain className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Patterns Yet</h3>
        <p className="text-muted-foreground text-sm">
          Keep logging activities to discover your baby's unique patterns and get personalized insights!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <InsightCard
          key={index}
          insight={insight}
          icon={getIconForInsight(insight)}
          isExpanded={expandedInsight === index}
          onToggle={() => setExpandedInsight(expandedInsight === index ? null : index)}
        />
      ))}
    </div>
  );
};