import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  label?: string;
}

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (value) {
      const [time, periodPart] = value.split(" ");
      const [h, m] = time.split(":");
      setHour(h);
      setMinute(m);
      setPeriod(periodPart);
    } else {
      // Set to current time
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentPeriod = currentHour >= 12 ? "PM" : "AM";
      const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
      
      setHour(displayHour.toString());
      setMinute(currentMinute.toString().padStart(2, "0"));
      setPeriod(currentPeriod);
    }
  }, [value]);

  useEffect(() => {
    onChange(`${hour}:${minute} ${period}`);
  }, [hour, minute, period, onChange]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-2">
        <Select value={hour} onValueChange={setHour}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-foreground">:</span>
        
        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};