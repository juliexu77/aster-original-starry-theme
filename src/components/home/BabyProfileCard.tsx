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

// Developmental "archetype" based on age
const getDevelopmentalArchetype = (ageInWeeks: number): { name: string; symbol: React.ReactNode } => {
  if (ageInWeeks < 4) return { name: "Dreamer", symbol: <Moon className="w-3 h-3" /> };
  if (ageInWeeks < 8) return { name: "Watcher", symbol: <Star className="w-3 h-3" /> };
  if (ageInWeeks < 12) return { name: "Smiler", symbol: <Sun className="w-3 h-3" /> };
  if (ageInWeeks < 16) return { name: "Reacher", symbol: <Sparkles className="w-3 h-3" /> };
  if (ageInWeeks < 26) return { name: "Roller", symbol: <Star className="w-3 h-3" /> };
  if (ageInWeeks < 39) return { name: "Sitter", symbol: <Sun className="w-3 h-3" /> };
  if (ageInWeeks < 52) return { name: "Mover", symbol: <Sparkles className="w-3 h-3" /> };
  if (ageInWeeks < 78) return { name: "Walker", symbol: <Star className="w-3 h-3" /> };
  if (ageInWeeks < 104) return { name: "Climber", symbol: <Sun className="w-3 h-3" /> };
  if (ageInWeeks < 130) return { name: "Runner", symbol: <Sparkles className="w-3 h-3" /> };
  if (ageInWeeks < 156) return { name: "Imaginer", symbol: <Star className="w-3 h-3" /> };
  return { name: "Explorer", symbol: <Sparkles className="w-3 h-3" /> };
};

// Rhythm archetype based on sleep patterns
const getRhythmArchetype = (ageInWeeks: number): { name: string; symbol: React.ReactNode } => {
  if (ageInWeeks < 8) return { name: "Catnapper", symbol: <Moon className="w-3 h-3" /> };
  if (ageInWeeks < 16) return { name: "Consolidator", symbol: <Moon className="w-3 h-3" /> };
  if (ageInWeeks < 39) return { name: "Rhythm-finder", symbol: <Sun className="w-3 h-3" /> };
  if (ageInWeeks < 52) return { name: "Steady", symbol: <Star className="w-3 h-3" /> };
  if (ageInWeeks < 78) return { name: "Transitioning", symbol: <Moon className="w-3 h-3" /> };
  if (ageInWeeks < 104) return { name: "One-napper", symbol: <Sun className="w-3 h-3" /> };
  if (ageInWeeks < 156) return { name: "May-skip", symbol: <Sparkles className="w-3 h-3" /> };
  return { name: "Quiet-timer", symbol: <Star className="w-3 h-3" /> };
};

export const BabyProfileCard = ({ babyName, babyBirthday }: BabyProfileCardProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageLabel = getAgeLabel(ageInWeeks);
  const zodiac = getZodiacSign(babyBirthday);
  const developmentalArchetype = getDevelopmentalArchetype(ageInWeeks);
  const rhythmArchetype = getRhythmArchetype(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="px-5 pt-8 pb-4">
      {/* Greeting - small, muted */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">
        {greeting}
      </p>
      
      <div className="flex items-start gap-4">
        {/* Avatar placeholder - circular with initial */}
        <div className="w-16 h-16 rounded-full bg-muted/30 border border-border/30 flex items-center justify-center shrink-0 overflow-hidden">
          <span className="text-2xl font-serif text-foreground/60">
            {babyName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name and signs */}
        <div className="flex-1 min-w-0">
          {/* Baby name - prominent */}
          <h1 className="text-2xl font-serif text-foreground truncate">
            {babyName}
          </h1>
          
          {/* Signs row - Co-Star style: symbol + name inline */}
          <div className="flex flex-wrap items-center gap-x-3 mt-1.5 text-muted-foreground text-xs">
            {/* Zodiac sign */}
            <span>
              <span className="opacity-70 mr-0.5">{zodiac.symbol}</span> {zodiac.name}
            </span>
            
            {/* Developmental archetype */}
            <span className="flex items-center gap-0.5">
              <span className="opacity-70">{developmentalArchetype.symbol}</span> {developmentalArchetype.name}
            </span>
            
            {/* Rhythm archetype */}
            <span className="flex items-center gap-0.5">
              <span className="opacity-70">{rhythmArchetype.symbol}</span> {rhythmArchetype.name}
            </span>
          </div>
          
          {/* Age - tertiary info */}
          <p className="text-xs text-muted-foreground/50 mt-1">
            {ageLabel}
          </p>
        </div>
      </div>
    </div>
  );
};
