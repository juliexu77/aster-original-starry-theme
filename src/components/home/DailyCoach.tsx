import { BabyProfileCard } from "./BabyProfileCard";
import { DevelopmentTable } from "./DevelopmentTable";
import { FocusThisMonth } from "./FocusThisMonth";
import { TimeOfDayBackground } from "./TimeOfDayBackground";

interface DailyCoachProps {
  babyName?: string;
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

export const DailyCoach = ({ babyName, babyBirthday }: DailyCoachProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const displayName = babyName || "your baby";

  if (!babyBirthday) {
    return (
      <TimeOfDayBackground>
        <div className="px-5 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-serif text-foreground">Welcome</h1>
            <p className="text-muted-foreground">
              Add a birthday in settings to see their portrait.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>
    );
  }

  return (
    <div className="relative min-h-screen">
      <TimeOfDayBackground>
        {/* Sticky Profile Card */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-foreground/5">
          <BabyProfileCard babyName={displayName} babyBirthday={babyBirthday} />
        </div>

        <div className="pb-24 space-y-4 pt-4">
          {/* Development Domains */}
          <DevelopmentTable ageInWeeks={ageInWeeks} birthday={babyBirthday} babyName={displayName} />

          {/* Focus This Month */}
          <FocusThisMonth 
            babyName={displayName} 
            ageInWeeks={ageInWeeks} 
            birthday={babyBirthday} 
          />

          {/* Footer */}
          <div className="pt-4 text-center px-5">
            <p className="text-[10px] text-foreground/20 tracking-wide">
              You know your child best.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>
    </div>
  );
};
