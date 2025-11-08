import { Globe } from "lucide-react";
import { format, startOfMonth } from "date-fns";

interface CollectivePulseProps {
  babyBirthday?: string;
}

export const CollectivePulse = ({ babyBirthday }: CollectivePulseProps) => {
  // Calculate birth month cohort (e.g., "January 2025 Babies")
  const getBirthCohort = () => {
    if (!babyBirthday) return "Your Baby's Cohort";
    const birthDate = new Date(babyBirthday);
    return `${format(birthDate, 'MMMM yyyy')} Babies`;
  };

  // Mock aggregated data - in production, this would come from your backend
  const collectiveData = {
    avgNightSleep: 10.9,
    avgNaps: "2–3",
    commonMilestone: "starting solids",
    weekOverWeekChange: "+0.3h" // optional: show trend
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-accent/20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Collective Pulse
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {getBirthCohort()}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Micro Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Avg Night Sleep</div>
            <div className="text-2xl font-bold text-foreground">
              {collectiveData.avgNightSleep}h
            </div>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Avg Naps/Day</div>
            <div className="text-2xl font-bold text-foreground">
              {collectiveData.avgNaps}
            </div>
          </div>
        </div>

        {/* Summary Text */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          This week, most babies your baby's age are sleeping about{" "}
          <span className="font-medium text-foreground">{collectiveData.avgNightSleep}h</span> a night
          and taking <span className="font-medium text-foreground">{collectiveData.avgNaps} naps</span>.
          Many families are <span className="font-medium text-foreground">{collectiveData.commonMilestone}</span> now.
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-muted-foreground/70 italic">
          Based on aggregated BabyRhythm data — updated weekly.
        </p>
      </div>
    </div>
  );
};
