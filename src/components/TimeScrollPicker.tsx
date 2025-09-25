import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface TimeScrollPickerProps {
  value?: string;
  onChange: (time: string) => void;
  label?: string;
}

export const TimeScrollPicker = ({ value, onChange, label }: TimeScrollPickerProps) => {
  const [selectedHour, setSelectedHour] = useState(() => {
    if (value) {
      const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) return parseInt(match[1]);
    }
    return new Date().getHours() % 12 || 12;
  });
  
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (value) {
      const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) return parseInt(match[2]);
    }
    return Math.round(new Date().getMinutes() / 5) * 5;
  });
  
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    if (value) {
      const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) return match[3].toUpperCase() as "AM" | "PM";
    }
    return new Date().getHours() >= 12 ? "PM" : "AM";
  });

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const periods = ["AM", "PM"];

  useEffect(() => {
    const timeString = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onChange(timeString);
  }, [selectedHour, selectedMinute, selectedPeriod, onChange]);

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number, items: any[]) => {
    if (ref.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        const itemHeight = 40;
        ref.current.scrollTop = index * itemHeight;
      }
    }
  };

  useEffect(() => {
    scrollToValue(hourRef, selectedHour, hours);
    scrollToValue(minuteRef, selectedMinute, minutes);
  }, []);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    items: any[],
    setter: (value: any) => void
  ) => {
    if (ref.current) {
      const itemHeight = 40;
      const scrollTop = ref.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      setter(items[clampedIndex]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium text-muted-foreground">{label}</Label>}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {/* Hours */}
        <div className="flex-1 relative">
          <div className="text-xs text-center py-1 text-muted-foreground font-medium">Hour</div>
          <div 
            ref={hourRef}
            className="h-32 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={() => handleScroll(hourRef, hours, setSelectedHour)}
          >
            <div className="py-10">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={`h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                    selectedHour === hour 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    setSelectedHour(hour);
                    scrollToValue(hourRef, hour, hours);
                  }}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minutes */}
        <div className="flex-1 relative">
          <div className="text-xs text-center py-1 text-muted-foreground font-medium">Min</div>
          <div 
            ref={minuteRef}
            className="h-32 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={() => handleScroll(minuteRef, minutes, setSelectedMinute)}
          >
            <div className="py-10">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={`h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                    selectedMinute === minute 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    setSelectedMinute(minute);
                    scrollToValue(minuteRef, minute, minutes);
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AM/PM */}
        <div className="flex-1 relative">
          <div className="text-xs text-center py-1 text-muted-foreground font-medium">Period</div>
          <div className="h-32 flex flex-col justify-center">
            {periods.map((period) => (
              <div
                key={period}
                className={`h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                  selectedPeriod === period 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedPeriod(period as "AM" | "PM")}
              >
                {period}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};