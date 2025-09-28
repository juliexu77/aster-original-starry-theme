import { SleepDataDay } from "@/types/sleep";

interface SleepChartVisualizationProps {
  sleepData: SleepDataDay[];
  showFullDay: boolean;
}

export const SleepChartVisualization = ({ sleepData, showFullDay }: SleepChartVisualizationProps) => {
  return (
    <>
      {/* Day headers */}
      <div className="grid grid-cols-[60px_1fr] gap-4 mb-2">
        <div></div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${sleepData.length}, 1fr)` }}>
          {sleepData.map((day, index) => (
            <div key={day.fullDate.getTime()} className="text-center text-caption font-medium text-foreground">
              {day.date}
            </div>
          ))}
        </div>
      </div>

      {/* Sleep chart grid with hour lines */}
      <div className="grid grid-cols-[60px_1fr] gap-4 relative">
        {/* Time labels */}
        <div className="flex flex-col justify-between py-2" style={{ height: showFullDay ? '480px' : '360px' }}>
          {Array.from({ length: showFullDay ? 25 : 16 }, (_, i) => {
            const hour = showFullDay ? i : i + 6;
            let timeLabel = '';
            if (hour === 0) timeLabel = '12am';
            else if (hour < 12) timeLabel = `${hour}am`;
            else if (hour === 12) timeLabel = '12pm';
            else timeLabel = `${hour - 12}pm`;
            
            return (
              <div key={`hour-${hour}`} className="text-label text-muted-foreground text-right">
                {timeLabel}
              </div>
            );
          })}
        </div>

        {/* Sleep blocks with hour grid lines */}
        <div className="relative" style={{ height: showFullDay ? '480px' : '360px' }}>
          {/* Hour grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {Array.from({ length: showFullDay ? 25 : 16 }, (_, i) => (
              <div key={i} className="h-px bg-border/20" />
            ))}
          </div>
          
          {/* Sleep blocks */}
          <div className="grid gap-2 h-full" style={{ gridTemplateColumns: `repeat(${sleepData.length}, 1fr)` }}>
            {sleepData.map((day, dayIndex) => (
              <div key={day.fullDate.getTime()} className="relative">
                {/* Sleep bars - render continuous blocks */}
                {day.sleepBlocks.map((isAsleep, hourIndex) => {
                  if (!isAsleep) return null;
                  
                  // Find continuous sleep blocks to avoid overlapping bars
                  let blockStart = hourIndex;
                  let blockEnd = hourIndex;
                  
                  // Find the end of this sleep block
                  while (blockEnd < day.sleepBlocks.length - 1 && day.sleepBlocks[blockEnd + 1]) {
                    blockEnd++;
                  }
                  
                  // Only render if this is the start of a block (prevents duplicates)
                  if (blockStart !== hourIndex) return null;
                  
                  const blockLength = blockEnd - blockStart + 1;
                  const blockHeight = (blockLength / (showFullDay ? 24 : 15)) * 100;
                  const blockTop = (blockStart / (showFullDay ? 24 : 15)) * 100;
                  
                  return (
                    <div
                      key={`sleep-block-${blockStart}-${blockEnd}`}
                      className="absolute w-full bg-gradient-to-b from-nap to-nap/80 rounded-sm border border-nap/20"
                      style={{
                        top: `${blockTop}%`,
                        height: `${blockHeight}%`,
                        minHeight: '2px', // Ensure visibility of short naps
                      }}
                      title={`Sleep: ${blockLength} hour${blockLength > 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};