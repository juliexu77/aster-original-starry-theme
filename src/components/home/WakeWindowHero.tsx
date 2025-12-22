import { useMemo } from "react";
import { Moon, Sun } from "lucide-react";

interface WakeWindowHeroProps {
  babyName: string;
  babyBirthday?: string;
}

const getAgeInWeeks = (birthday?: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getAgeLabel = (ageInWeeks: number): string => {
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''}`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
};

interface WakeWindowInfo {
  minMinutes: number;
  maxMinutes: number;
  napCount: number;
}

const getWakeWindowInfo = (ageInWeeks: number): WakeWindowInfo => {
  if (ageInWeeks < 8) return { minMinutes: 45, maxMinutes: 75, napCount: 4 };
  if (ageInWeeks < 16) return { minMinutes: 60, maxMinutes: 90, napCount: 4 };
  if (ageInWeeks < 26) return { minMinutes: 90, maxMinutes: 120, napCount: 3 };
  if (ageInWeeks < 39) return { minMinutes: 120, maxMinutes: 150, napCount: 3 };
  if (ageInWeeks < 52) return { minMinutes: 150, maxMinutes: 210, napCount: 2 };
  if (ageInWeeks < 78) return { minMinutes: 180, maxMinutes: 240, napCount: 2 };
  return { minMinutes: 240, maxMinutes: 360, napCount: 1 };
};

const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const WakeWindowHero = ({ babyName, babyBirthday }: WakeWindowHeroProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageLabel = getAgeLabel(ageInWeeks);
  const wakeInfo = getWakeWindowInfo(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Simulate current wake window progress (in a real app, this would come from tracked data)
  const avgWakeWindow = (wakeInfo.minMinutes + wakeInfo.maxMinutes) / 2;

  return (
    <div className="px-5 pt-8 pb-4 text-center">
      {/* Baby name and age - Weather app style large text */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
        {greeting}
      </p>
      <h1 className="text-3xl font-serif text-foreground mb-0.5">
        {babyName}
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        {ageLabel}
      </p>

      {/* Wake window display - like temperature in Weather app */}
      <div className="relative inline-flex flex-col items-center">
        <div className="text-7xl font-light text-foreground tracking-tight mb-1">
          {formatMinutes(avgWakeWindow)}
        </div>
        <p className="text-sm text-muted-foreground">
          typical wake window
        </p>
      </div>

      {/* Nap summary - like high/low in Weather app */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {wakeInfo.napCount} nap{wakeInfo.napCount !== 1 ? 's' : ''} expected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatMinutes(wakeInfo.minMinutes)}–{formatMinutes(wakeInfo.maxMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
};