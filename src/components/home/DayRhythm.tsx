import { Moon, Sun, Sunset } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface DayRhythmProps {
  ageInWeeks: number;
}

interface RhythmBlock {
  label: string;
  icon: React.ReactNode;
  description: string;
}

const getRhythmBlocks = (ageInWeeks: number): RhythmBlock[] => {
  // For very young babies (many naps)
  if (ageInWeeks < 16) {
    return [
      {
        label: "Morning",
        icon: <Sun className="w-5 h-5" />,
        description: "Wake, feed, short play"
      },
      {
        label: "Midday",
        icon: <Sun className="w-5 h-5" />,
        description: "Naps come frequently"
      },
      {
        label: "Afternoon",
        icon: <Sunset className="w-5 h-5" />,
        description: "Rest before evening"
      },
      {
        label: "Evening",
        icon: <Moon className="w-5 h-5" />,
        description: "Wind down to night"
      }
    ];
  }
  
  // For babies with 2-3 naps
  if (ageInWeeks < 52) {
    return [
      {
        label: "Morning",
        icon: <Sun className="w-5 h-5" />,
        description: "Wake, play, first nap"
      },
      {
        label: "Midday",
        icon: <Sun className="w-5 h-5" />,
        description: "Active time, second nap"
      },
      {
        label: "Afternoon",
        icon: <Sunset className="w-5 h-5" />,
        description: "Gentle play, maybe a catnap"
      },
      {
        label: "Evening",
        icon: <Moon className="w-5 h-5" />,
        description: "Calm routine, bedtime"
      }
    ];
  }
  
  // For toddlers with 1-2 naps
  return [
    {
      label: "Morning",
      icon: <Sun className="w-5 h-5" />,
      description: "Active play and exploration"
    },
    {
      label: "Midday",
      icon: <Moon className="w-5 h-5" />,
      description: "Main nap of the day"
    },
    {
      label: "Afternoon",
      icon: <Sun className="w-5 h-5" />,
      description: "More play, outdoor time"
    },
    {
      label: "Evening",
      icon: <Moon className="w-5 h-5" />,
      description: "Wind down, bedtime"
    }
  ];
};

export const DayRhythm = ({ ageInWeeks }: DayRhythmProps) => {
  const blocks = getRhythmBlocks(ageInWeeks);
  
  return (
    <GlassCard className="mx-5">
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Today's rhythm
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between gap-2">
          {blocks.map((block, index) => (
            <div 
              key={index}
              className="flex-1 text-center"
            >
              {/* Icon in soft circle */}
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {block.icon}
              </div>
              
              {/* Label */}
              <p className="text-xs font-medium text-foreground mb-0.5">
                {block.label}
              </p>
              
              {/* Description */}
              <p className="text-[10px] text-muted-foreground leading-tight">
                {block.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
