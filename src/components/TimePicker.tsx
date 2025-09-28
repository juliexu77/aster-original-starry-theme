import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  label?: string;
}

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
  const initialTime = useMemo(() => {
    if (value) return value;
    const now = new Date();
    return now.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  }, [value]);

  const [inputValue, setInputValue] = useState(() => value || initialTime);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  const parseTimeInput = (input: string): string => {
    const cleaned = input.replace(/[^\d:apmAP\s]/g, '').trim();
    
    // If empty, return empty
    if (!cleaned) return '';

    // Check for existing AM/PM
    const hasAMPM = /[apmAP]/i.test(cleaned);
    let timeStr = cleaned.replace(/[apmAP]/gi, '').trim();
    let period = '';
    
    if (hasAMPM) {
      const match = cleaned.match(/([apmAP]+)/i);
      period = match ? match[0].toUpperCase().substring(0, 2) : '';
      if (period === 'A') period = 'AM';
      if (period === 'P') period = 'PM';
    }

    // Handle different input formats
    if (timeStr.length <= 2) {
      // Just hour: "8" or "10"
      const hour = parseInt(timeStr);
      if (hour >= 1 && hour <= 12) {
        if (!period) {
          // Auto-detect AM/PM based on current time
          const now = new Date();
          const currentHour = now.getHours();
          
          if (hour === 12) {
            period = currentHour < 12 ? 'AM' : 'PM';
          } else if (hour >= 6 && hour <= 11) {
            // Morning hours
            period = 'AM';
          } else if (hour >= 1 && hour <= 5) {
            // Could be early morning or afternoon/evening
            period = currentHour < 12 ? 'AM' : 'PM';
          } else {
            period = currentHour < 12 ? 'AM' : 'PM';
          }
        }
        return `${hour}:00 ${period}`;
      }
    } else if (timeStr.length === 3) {
      // "845" -> "8:45"
      const hour = parseInt(timeStr.substring(0, 1));
      const minute = parseInt(timeStr.substring(1, 3));
      if (hour >= 1 && hour <= 9 && minute >= 0 && minute <= 59) {
        if (!period) {
          const now = new Date();
          const currentHour = now.getHours();
          
          if (hour >= 6 && hour <= 9) {
            period = 'AM';
          } else {
            period = currentHour < 12 ? 'AM' : 'PM';
          }
        }
        return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
      }
    } else if (timeStr.length === 4) {
      // Handle both "1045" -> "10:45" and "950" -> "9:50"
      let hour, minute;
      
      // Try parsing as two-digit hour first (e.g., "1045")
      const twoDigitHour = parseInt(timeStr.substring(0, 2));
      if (twoDigitHour >= 1 && twoDigitHour <= 12) {
        hour = twoDigitHour;
        minute = parseInt(timeStr.substring(2, 4));
      } else {
        // Parse as single-digit hour (e.g., "950" -> "9:50")
        hour = parseInt(timeStr.substring(0, 1));
        minute = parseInt(timeStr.substring(1, 4));
      }
      
      if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
        if (!period) {
          const now = new Date();
          const currentHour = now.getHours();
          
          if (hour >= 6 && hour <= 11) {
            period = 'AM';
          } else if (hour === 12) {
            period = currentHour < 12 ? 'AM' : 'PM';
          } else {
            period = currentHour < 12 ? 'AM' : 'PM';
          }
        }
        return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
      }
    } else if (timeStr.includes(':')) {
      // Already formatted: "8:45" or "10:30"
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        const hour = parseInt(parts[0]);
        const minute = parseInt(parts[1]);
        if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
          if (!period) {
            const now = new Date();
            const currentHour = now.getHours();
            
            if (hour >= 6 && hour <= 11) {
              period = 'AM';
            } else if (hour === 12) {
              period = currentHour < 12 ? 'AM' : 'PM';
            } else {
              period = currentHour < 12 ? 'AM' : 'PM';
            }
          }
          return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
        }
      }
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      // If empty, reset to initial time
      setInputValue(initialTime);
      onChange(initialTime);
      return;
    }

    const parsed = parseTimeInput(inputValue);
    if (parsed) {
      setInputValue(parsed);
      onChange(parsed);
    } else {
      // Reset to initial time if invalid
      setInputValue(initialTime);
      onChange(initialTime);
    }
  };

  return (
    <div>
      {label && <Label htmlFor="time-input">{label}</Label>}
      <Input
        id="time-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="845, 8:45, 8:45am"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Type: 845, 8:45, or 8:45am
      </p>
    </div>
  );
};