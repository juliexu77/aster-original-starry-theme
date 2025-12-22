import { Moon, Sun, Sunset } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface DayRhythmProps {
  ageInWeeks: number;
}

interface RhythmBlock {
  label: string;
  icon: React.ReactNode;
  note: string;
  isAnchor?: boolean;
}

const getRhythmBlocks = (ageInWeeks: number): RhythmBlock[] => {
  // 0-16 weeks: Newborn/young infant - frequent naps, no clear anchor
  if (ageInWeeks < 16) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Wake & feed" },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Frequent naps" },
      { label: "Afternoon", icon: <Sunset className="w-5 h-5" />, note: "Rest" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Wind down", isAnchor: true }
    ];
  }
  
  // 16-52 weeks (4-12 months): Naps are the rhythm
  if (ageInWeeks < 52) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Play & nap" },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Active time", isAnchor: true },
      { label: "Afternoon", icon: <Sunset className="w-5 h-5" />, note: "Gentle play" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
    ];
  }
  
  // 52-78 weeks (12-18 months): Transitioning to one nap - midday anchors
  if (ageInWeeks < 78) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Play & explore" },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Main nap", isAnchor: true },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Active time" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
    ];
  }
  
  // 78-104 weeks (18-24 months): One solid nap anchors midday
  if (ageInWeeks < 104) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Busy play" },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Nap time", isAnchor: true },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Outside" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Wind down" }
    ];
  }
  
  // 104-156 weeks (2-3 years): Nap may be dropping
  if (ageInWeeks < 156) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Active play", isAnchor: true },
      { label: "Midday", icon: <Moon className="w-5 h-5" />, note: "Nap or rest" },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Play & learn" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Routine" }
    ];
  }
  
  // 156-260 weeks (3-5 years): Active mornings anchor
  if (ageInWeeks < 260) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Explore", isAnchor: true },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Quiet time" },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Play" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Bedtime" }
    ];
  }
  
  // 260-364 weeks (5-7 years): School-age rhythm
  if (ageInWeeks < 364) {
    return [
      { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "School ready" },
      { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Learning", isAnchor: true },
      { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Free play" },
      { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Wind down" }
    ];
  }
  
  // 364-520 weeks (7-10 years): Activities and independence
  return [
    { label: "Morning", icon: <Sun className="w-5 h-5" />, note: "Start the day" },
    { label: "Midday", icon: <Sun className="w-5 h-5" />, note: "Activities", isAnchor: true },
    { label: "Afternoon", icon: <Sun className="w-5 h-5" />, note: "Hobbies" },
    { label: "Evening", icon: <Moon className="w-5 h-5" />, note: "Together time" }
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
              className={`flex-1 text-center transition-all ${
                block.isAnchor ? 'scale-105' : 'opacity-70'
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                block.isAnchor 
                  ? 'bg-primary/20 text-primary ring-2 ring-primary/30' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {block.icon}
              </div>
              <p className={`text-xs mb-0.5 ${
                block.isAnchor ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
              }`}>
                {block.label}
              </p>
              <p className={`text-[10px] ${
                block.isAnchor ? 'text-muted-foreground' : 'text-muted-foreground/70'
              }`}>
                {block.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};