import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  label?: string;
}

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
  const [inputValue, setInputValue] = useState("");

  // Initialize with current time
  const initialFormattedTime = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentPeriod = currentHour >= 12 ? "PM" : "AM";
    const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
    
    return `${displayHour}:${currentMinute.toString().padStart(2, "0")} ${currentPeriod}`;
  }, []);

  // Set initial display value
  useEffect(() => {
    if (!inputValue && !value) {
      setInputValue(initialFormattedTime);
      onChange(initialFormattedTime);
    }
  }, []);

  // Update input when external value changes
  useEffect(() => {
    if (value && value !== parseTimeInput(inputValue)) {
      setInputValue(value);
    }
  }, [value]);

  const parseTimeInput = (input: string): string => {
    if (!input) return "";
    
    let cleanInput = input.replace(/[^\d\sapm]/gi, "").trim();
    
    // Extract AM/PM if specified
    const ampmMatch = cleanInput.match(/(am|pm)/i);
    const specifiedPeriod = ampmMatch ? ampmMatch[1].toUpperCase() : null;
    
    // Remove AM/PM from input to get just numbers
    const numbersOnly = cleanInput.replace(/(am|pm)/gi, "").trim();
    
    if (!numbersOnly) return "";
    
    let hour: number;
    let minute: number;
    
    if (numbersOnly.length <= 2) {
      // Just hour (e.g., "8" -> 8:00)
      hour = parseInt(numbersOnly);
      minute = 0;
    } else if (numbersOnly.length === 3) {
      // Hour + minute (e.g., "845" -> 8:45)
      hour = parseInt(numbersOnly[0]);
      minute = parseInt(numbersOnly.substring(1));
    } else if (numbersOnly.length === 4) {
      // Hour + minute (e.g., "1245" -> 12:45)
      hour = parseInt(numbersOnly.substring(0, 2));
      minute = parseInt(numbersOnly.substring(2));
    } else {
      return "";
    }
    
    // Validate ranges
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
      return "";
    }
    
    // Determine AM/PM if not specified
    let period = specifiedPeriod;
    if (!period) {
      const now = new Date();
      const currentHour = now.getHours();
      
      if (hour === 12) {
        period = currentHour >= 12 ? "PM" : "AM";
      } else if (hour >= 7) {
        // 7-11: default to AM if current time is before noon, PM if after
        period = currentHour < 12 ? "AM" : "PM";
      } else {
        // 1-6: default to PM if current time is after 6 AM, AM if before
        period = currentHour >= 6 ? "PM" : "AM";
      }
    }
    
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
    
    const parsedTime = parseTimeInput(input);
    if (parsedTime) {
      onChange(parsedTime);
    }
  };

  const handleBlur = () => {
    const parsedTime = parseTimeInput(inputValue);
    if (parsedTime) {
      setInputValue(parsedTime);
    } else if (!inputValue) {
      setInputValue(initialFormattedTime);
      onChange(initialFormattedTime);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter time (e.g., 845, 845pm, 12:30 AM)"
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Type time like "845" (8:45) or "845pm". AM/PM auto-detected.
      </p>
    </div>
  );
};