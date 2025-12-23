import { useMemo } from "react";
import { Moon, Sun, Sparkles, Star } from "lucide-react";

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

const getZodiacSign = (birthday?: string): { name: string; symbol: string } => {
  if (!birthday) return { name: "Starlight", symbol: "✦" };
  
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries", symbol: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus", symbol: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini", symbol: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer", symbol: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo", symbol: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo", symbol: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", symbol: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio", symbol: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius", symbol: "♐" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Capricorn", symbol: "♑" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius", symbol: "♒" };
  return { name: "Pisces", symbol: "♓" };
};

// Current phase based on age
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
  const zodiac = getZodiacSign(babyBirthday);
  const currentPhase = getCurrentPhase(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }, []);

  return (
    <div className="px-5 pt-8 pb-4">
      {/* Greeting - uppercase, tracking */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-4 text-center">
        {greeting}
      </p>
      
      <div className="flex items-start gap-4">
        {/* Avatar - circular with initial */}
        <div className="w-14 h-14 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center shrink-0">
          <span className="text-xl font-serif text-foreground/70">
            {babyName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name and metadata */}
        <div className="flex-1 min-w-0">
          {/* Baby name - large, prominent */}
          <h1 className="text-3xl font-serif text-foreground tracking-tight">
            {babyName}
          </h1>
          
          {/* Subtitle row: zodiac · age · phase */}
          <div className="flex flex-wrap items-center gap-x-2 mt-1 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <span className="text-sm">{zodiac.symbol}</span>
              <span>{zodiac.name}</span>
            </span>
            <span className="opacity-40">·</span>
            <span>{ageLabel}</span>
            <span className="opacity-40">·</span>
            <span className="italic">{currentPhase}</span>
          </div>
        </div>
      </div>
    </div>
  );
};