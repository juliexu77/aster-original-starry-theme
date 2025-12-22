import { Moon, Sun, Sunset } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface DayRhythmProps {
  ageInWeeks: number;
}

interface RhythmBlock {
  label: string;
  icon: React.ReactNode;
  note: string;
}

const getRhythmBlocks = (ageInWeeks: number): RhythmBlock[] => {
  // 0-16 weeks: Newborn/young infant - frequent naps
  if (ageInWeeks < 16) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Wake & feed" },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Frequent naps" },
      { label: "Afternoon", icon: <Sunset className="w-5 h-5" />, note: "Rest" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Wind down" }
    ];
  }
  
  // 16-52 weeks (4-12 months): More defined rhythm
  if (ageInWeeks < 52) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Play & nap" },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Active time" },
      { label: "Afternoon", icon: <Sunset className="w-5 h-5" />, note: "Gentle play" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
    ];
  }
  
  // 52-78 weeks (12-18 months): Transitioning naps
  if (ageInWeeks < 78) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Play & explore" },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Main nap" },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Active time" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
    ];
  }
  
  // 78-104 weeks (18-24 months): One solid nap
  if (ageInWeeks < 104) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Busy play" },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Nap time" },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Outside" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Wind down" }
    ];
  }
  
  // 104-156 weeks (2-3 years): Nap may be dropping
  if (ageInWeeks < 156) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Active play" },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Nap or rest" },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Play & learn" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Routine" }
    ];
  }
  
  // 3+ years: Quiet time replaces nap
  return [
    { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Explore" },
    { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Quiet time" },
    { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Play" },
    { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
  ];
};

export const DayRhythm = ({ ageInWeeks }: DayRhythmProps) => {
  const blocks = getRhythmBlocks(ageInWeeks);
  
  return (
    <GlassCard className="mx-5">
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Today's shape
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between gap-2">
          {blocks.map((block, index) => (
            <div 
              key={index}
              className="flex-1 text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {block.icon}
              </div>
              <p className="text-xs font-medium text-foreground mb-0.5">
                {block.label}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {block.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
