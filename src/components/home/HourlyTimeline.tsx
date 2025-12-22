import { Moon, Sun } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface HourlyTimelineProps {
  ageInWeeks: number;
}

interface TimeSlot {
  hour: number;
  label: string;
  isNap: boolean;
  isNight: boolean;
}

const generateDaySchedule = (ageInWeeks: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const currentHour = new Date().getHours();
  
  // Generate wake/nap patterns based on age
  let napCount = 4;
  let wakeWindowHours = 1.25;
  let napDurationHours = 1;
  
  if (ageInWeeks >= 8 && ageInWeeks < 16) {
    napCount = 4;
    wakeWindowHours = 1.5;
    napDurationHours = 1;
  } else if (ageInWeeks >= 16 && ageInWeeks < 26) {
    napCount = 3;
    wakeWindowHours = 2;
    napDurationHours = 1.5;
  } else if (ageInWeeks >= 26 && ageInWeeks < 52) {
    napCount = 2;
    wakeWindowHours = 3;
    napDurationHours = 1.5;
  } else if (ageInWeeks >= 52) {
    napCount = 1;
    wakeWindowHours = 5;
    napDurationHours = 2;
  }

  // Build 12-hour timeline from current hour
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour + i) % 24;
    const isNight = hour >= 19 || hour < 7;
    
    // Simple pattern: alternate between wake and nap based on timing
    const hourOfDay = hour;
    let isNap = false;
    
    if (!isNight) {
      // Distribute naps throughout wake hours (7am-7pm)
      const wakeHour = hourOfDay - 7;
      const cycleLength = wakeWindowHours + napDurationHours;
      const positionInCycle = wakeHour % cycleLength;
      isNap = positionInCycle >= wakeWindowHours && positionInCycle < cycleLength;
    }
    
    const formatHour = (h: number) => {
      if (h === 0) return "12AM";
      if (h === 12) return "12PM";
      if (h < 12) return `${h}AM`;
      return `${h - 12}PM`;
    };
    
    slots.push({
      hour,
      label: i === 0 ? "Now" : formatHour(hour),
      isNap: isNight ? true : isNap,
      isNight,
    });
  }
  
  return slots;
};

export const HourlyTimeline = ({ ageInWeeks }: HourlyTimelineProps) => {
  const slots = generateDaySchedule(ageInWeeks);
  
  return (
    <GlassCard className="mx-5">
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Expected pattern today
        </p>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 px-2 py-4 min-w-max">
          {slots.map((slot, index) => (
            <div 
              key={index}
              className="flex flex-col items-center w-14 shrink-0"
            >
              <span className={`text-xs mb-2 ${slot.label === "Now" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {slot.label}
              </span>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                slot.isNight 
                  ? "bg-indigo-500/20" 
                  : slot.isNap 
                    ? "bg-primary/20" 
                    : "bg-amber-400/20"
              }`}>
                {slot.isNight || slot.isNap ? (
                  <Moon className={`w-4 h-4 ${slot.isNight ? "text-indigo-400" : "text-primary"}`} />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </div>
              
              <span className="text-[10px] text-muted-foreground mt-1.5">
                {slot.isNight ? "Night" : slot.isNap ? "Nap" : "Wake"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};