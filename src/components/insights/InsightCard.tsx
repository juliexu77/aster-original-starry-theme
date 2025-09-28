import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatternInsight } from "@/hooks/usePatternAnalysis";

interface InsightCardProps {
  insight: PatternInsight;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export const InsightCard = ({ insight, icon, isExpanded, onToggle }: InsightCardProps) => {
  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-orange-600 bg-orange-50';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-foreground">
                {insight.text}
              </CardTitle>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${getConfidenceColor(insight.confidence)}`}>
                {insight.confidence} confidence
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.details.description}
            </p>
            
            {insight.details.data.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
                  Supporting Data
                </h4>
                <div className="space-y-2">
                  {insight.details.data.map((dataPoint, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <span className="text-sm text-foreground">
                        {dataPoint.activity.time} - {dataPoint.activity.type}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {dataPoint.value}
                        </div>
                        {dataPoint.calculation && (
                          <div className="text-xs text-muted-foreground">
                            {dataPoint.calculation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {insight.details.calculation && (
              <div className="p-3 bg-muted/30 rounded-md">
                <h4 className="text-xs font-medium text-foreground uppercase tracking-wide mb-1">
                  Calculation
                </h4>
                <p className="text-sm text-muted-foreground font-mono">
                  {insight.details.calculation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};