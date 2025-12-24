import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacFromBirthday, getZodiacName, ZodiacSign } from "@/lib/zodiac";

interface BabyProfileCardProps {
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
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''} old`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} old`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''} old`;
  return `${years}y ${remainingMonths}m`;
};

const getCurrentPhase = (ageInWeeks: number): string => {
  if (ageInWeeks < 4) return "Fourth trimester";
  if (ageInWeeks < 8) return "Awakening";
  if (ageInWeeks < 12) return "Social smiling";
  if (ageInWeeks < 16) return "Reaching out";
  if (ageInWeeks < 26) return "Rolling days";
  if (ageInWeeks < 39) return "Finding rhythm";
  if (ageInWeeks < 52) return "On the move";
  if (ageInWeeks < 78) return "First steps";
  if (ageInWeeks < 104) return "Exploring all";
  if (ageInWeeks < 130) return "Language burst";
  if (ageInWeeks < 156) return "Imagination";
  if (ageInWeeks < 208) return "Why phase";
  if (ageInWeeks < 260) return "Making friends";
  if (ageInWeeks < 312) return "School ready";
  if (ageInWeeks < 364) return "Growing up";
  if (ageInWeeks < 416) return "Finding self";
  if (ageInWeeks < 468) return "Pre-teen shift";
  return "Becoming";
};

export const BabyProfileCard = ({ babyName, babyBirthday }: BabyProfileCardProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageLabel = getAgeLabel(ageInWeeks);
  const zodiacSign = getZodiacFromBirthday(babyBirthday);
  const zodiacName = zodiacSign ? getZodiacName(zodiacSign) : null;
  const currentPhase = getCurrentPhase(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }, []);

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Greeting */}
      <p className="text-[10px] text-foreground/30 uppercase tracking-[0.25em] mb-3 text-center">
        {greeting}
      </p>
      
      <div className="flex items-start gap-4">
        {/* Avatar with zodiac icon */}
        <div className="w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
          {zodiacSign ? (
            <ZodiacIcon sign={zodiacSign} size={20} strokeWidth={1.5} className="text-foreground/50" />
          ) : (
            <span className="text-lg font-serif text-foreground/50">
              {babyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name and metadata */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-serif text-foreground/90 tracking-tight">
            {babyName}
          </h1>
          
          {/* Subtitle row */}
          <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5 text-foreground/40 text-[11px]">
            <span>{ageLabel}</span>
            {currentPhase && <span className="opacity-40">·</span>}
            {currentPhase && <span>{currentPhase}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
