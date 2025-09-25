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
      <div className="flex gap-2 bg-muted/50 rounded-lg p-3 items-center justify-center">
        {/* Hours */}
        <div className="flex items-center">
          {[selectedHour - 1, selectedHour, selectedHour + 1].filter(h => h >= 1 && h <= 12).map((hour) => (
            <div
              key={hour}
              className={`w-10 h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                selectedHour === hour 
                  ? 'text-primary font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedHour(hour)}
            >
              {hour}
            </div>
          ))}
        </div>

        <span className="text-muted-foreground font-medium">:</span>

        {/* Minutes */}
        <div className="flex items-center">
          {[selectedMinute - 5, selectedMinute, selectedMinute + 5].filter(m => m >= 0 && m <= 55).map((minute) => (
            <div
              key={minute}
              className={`w-10 h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                selectedMinute === minute 
                  ? 'text-primary font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedMinute(minute)}
            >
              {minute.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* AM/PM */}
        <div className="flex gap-1 ml-2">
          {periods.map((period) => (
            <div
              key={period}
              className={`px-3 py-2 rounded text-sm font-medium cursor-pointer transition-colors ${
                selectedPeriod === period 
                  ? 'text-primary font-bold bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => setSelectedPeriod(period as "AM" | "PM")}
            >
              {period}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};