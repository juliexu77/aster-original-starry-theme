import { Activity } from "@/components/ActivityCard";
import { Card } from "@/components/ui/card";
import { 
  ARC_CONFIG, 
  isDaytime, 
  calculateArcPosition, 
  calculateIconPosition,
  createTrailPath 
} from "@/utils/arcCalculations";
import { getCurrentState } from "@/utils/arcStateMessages";
import { ArcVisualization } from "./ArcVisualization";

interface CurrentMomentArcProps {
  activities: Activity[];
  babyName?: string;
  ongoingNap?: Activity | null;
  nightSleepStartHour: number;
  nightSleepEndHour: number;
  babyBirthday?: string;
}

export const CurrentMomentArc = ({
  activities,
  babyName,
  ongoingNap,
  nightSleepStartHour,
  nightSleepEndHour,
  babyBirthday
}: CurrentMomentArcProps) => {
  const now = new Date();
  const currentHour = now.getHours();
  const isDay = isDaytime(currentHour, nightSleepStartHour, nightSleepEndHour);
  const currentState = getCurrentState(activities, ongoingNap || null, nightSleepStartHour, nightSleepEndHour);
  
  const arcPosition = calculateArcPosition(activities, ongoingNap || null, babyBirthday);
  const { x: iconX, y: iconY } = calculateIconPosition(arcPosition);
  const trailPath = createTrailPath(arcPosition);
  
  const inTwilightZone = arcPosition >= 0.8 && arcPosition <= 1.0;
  const isOvertired = arcPosition > 1.0;

  return (
    <div className="px-6 pb-0 relative z-10">
      <div className="relative w-full flex flex-col items-center">
        <ArcVisualization
          isDay={isDay}
          arcPosition={arcPosition}
          trailPath={trailPath}
          iconX={iconX}
          iconY={iconY}
          isOvertired={isOvertired}
          inTwilightZone={inTwilightZone}
        />
        
        {/* State Card - Connected to arc bottom */}
        <Card className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-3 shadow-md border-border/40 bg-card">
          <p className="text-[18px] font-serif font-semibold text-foreground tracking-tight text-center leading-snug whitespace-nowrap" 
             style={{ fontVariationSettings: '"SOFT" 100' }}>
            {currentState}
          </p>
        </Card>
      </div>
    </div>
  );
};
