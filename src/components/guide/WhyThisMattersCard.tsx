import { Lightbulb } from "lucide-react";

interface WhyThisMattersCardProps {
  explanation: string;
  loading?: boolean;
}

export const WhyThisMattersCard = ({ explanation, loading }: WhyThisMattersCardProps) => {
  if (loading) {
    return (
      <div className="mt-6 p-5 bg-accent/30 rounded-xl border border-border animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="h-5 w-32 bg-muted rounded"></div>
        </div>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-5 bg-accent/30 rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Why This Matters
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};
