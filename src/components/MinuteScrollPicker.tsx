import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";

interface MinuteScrollPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const MinuteScrollPicker = ({ value, onChange, label }: MinuteScrollPickerProps) => {
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value) : 0);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Generate minutes 0-60
  const minutes = Array.from({ length: 61 }, (_, i) => i);

  useEffect(() => {
    if (value) {
      const minute = parseInt(value);
      if (!isNaN(minute)) {
        setSelectedMinute(minute);
      }
    }
  }, [value]);

  useEffect(() => {
    // Scroll to selected minute
    if (minuteRef.current) {
      const itemHeight = 40;
      minuteRef.current.scrollTop = selectedMinute * itemHeight - itemHeight * 2;
    }
  }, [selectedMinute]);

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    onChange(minute.toString());
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <div className="relative">
        {/* Selected indicator overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-10 bg-primary/10 border-y-2 border-primary/20 rounded" />
        </div>

        {/* Scrollable minute picker */}
        <div
          ref={minuteRef}
          className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth"
          style={{
            scrollSnapType: 'y mandatory',
          }}
        >
          {/* Top padding for centering */}
          <div className="h-20" />
          
          {minutes.map((minute) => (
            <div
              key={minute}
              className="h-10 flex items-center justify-center cursor-pointer transition-all scroll-snap-align-center"
              style={{
                scrollSnapAlign: 'center',
                opacity: selectedMinute === minute ? 1 : 0.4,
                fontSize: selectedMinute === minute ? '1.25rem' : '1rem',
                fontWeight: selectedMinute === minute ? 600 : 400,
              }}
              onClick={() => handleMinuteChange(minute)}
            >
              {minute}
            </div>
          ))}
          
          {/* Bottom padding for centering */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
};
