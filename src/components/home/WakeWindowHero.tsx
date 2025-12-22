import { useMemo } from "react";

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
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''} old`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} old`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''} old`;
  return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
};

interface DayBriefing {
  wakeWindowLabel: string;
  napLabel: string;
}

const getDayBriefing = (ageInWeeks: number): DayBriefing => {
  // 0-8 weeks
  if (ageInWeeks < 8) {
    return { 
      wakeWindowLabel: "around 45 min – 1¼ hours",
      napLabel: "4–5 naps"
    };
  }
  // 8-16 weeks (2-4 months)
  if (ageInWeeks < 16) {
    return { 
      wakeWindowLabel: "around 1–1½ hours",
      napLabel: "about 4 naps"
    };
  }
  // 16-26 weeks (4-6 months)
  if (ageInWeeks < 26) {
    return { 
      wakeWindowLabel: "around 1½–2 hours",
      napLabel: "about 3 naps"
    };
  }
  // 26-39 weeks (6-9 months)
  if (ageInWeeks < 39) {
    return { 
      wakeWindowLabel: "around 2–2½ hours",
      napLabel: "about 3 naps"
    };
  }
  // 39-52 weeks (9-12 months)
  if (ageInWeeks < 52) {
    return { 
      wakeWindowLabel: "around 2½–3½ hours",
      napLabel: "about 2 naps"
    };
  }
  // 52-78 weeks (12-18 months)
  if (ageInWeeks < 78) {
    return { 
      wakeWindowLabel: "around 3–4 hours",
      napLabel: "1–2 naps"
    };
  }
  // 78-104 weeks (18-24 months)
  if (ageInWeeks < 104) {
    return { 
      wakeWindowLabel: "around 4–5 hours",
      napLabel: "1 nap"
    };
  }
  // 104-156 weeks (2-3 years)
  if (ageInWeeks < 156) {
    return { 
      wakeWindowLabel: "around 5–6 hours",
      napLabel: "1 nap or quiet time"
    };
  }
  // 3+ years
  return { 
    wakeWindowLabel: "full days awake",
    napLabel: "quiet time if needed"
  };
};

export const WakeWindowHero = ({ babyName, babyBirthday }: WakeWindowHeroProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageLabel = getAgeLabel(ageInWeeks);
  const briefing = getDayBriefing(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="px-5 pt-8 pb-6 text-center">
      {/* Greeting */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
        {greeting}
      </p>
      
      {/* Baby name - large and prominent */}
      <h1 className="text-4xl font-serif text-foreground mb-1">
        {babyName}
      </h1>
      
      {/* Age - secondary info */}
      <p className="text-base text-muted-foreground mb-8">
        {ageLabel}
      </p>

      {/* Primary briefing - calm, qualitative */}
      <div className="space-y-2">
        <p className="text-xl text-foreground font-light font-serif">
          Wake windows {briefing.wakeWindowLabel}
        </p>
        <p className="text-lg text-muted-foreground">
          {briefing.napLabel} today
        </p>
      </div>
    </div>
  );
};
