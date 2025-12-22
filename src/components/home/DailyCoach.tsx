import { Sun, Coffee, Baby, Sparkles, BookOpen, Music, Footprints, Eye, Hand } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { BabyProfileCard } from "./BabyProfileCard";
import { DayRhythm } from "./DayRhythm";
import { DevelopmentTable } from "./DevelopmentTable";
import { TimeOfDayBackground } from "./TimeOfDayBackground";

interface DailyCoachProps {
  babyName?: string;
  babyBirthday?: string;
}

interface ActivitySuggestion {
  title: string;
  icon: React.ReactNode;
}

const getAgeInWeeks = (birthday?: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getActivitySuggestions = (ageInWeeks: number): ActivitySuggestion[] => {
  if (ageInWeeks < 8) {
    return [
      { title: "Tummy time", icon: <Baby className="w-5 h-5" /> },
      { title: "Face gazing", icon: <Eye className="w-5 h-5" /> },
      { title: "Soft singing", icon: <Music className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 16) {
    return [
      { title: "Tummy time", icon: <Baby className="w-5 h-5" /> },
      { title: "Contrast cards", icon: <Eye className="w-5 h-5" /> },
      { title: "Talking", icon: <Music className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 26) {
    return [
      { title: "Floor play", icon: <Hand className="w-5 h-5" /> },
      { title: "Reading", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Mirror time", icon: <Eye className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 52) {
    return [
      { title: "Exploring", icon: <Footprints className="w-5 h-5" /> },
      { title: "Books", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Outside", icon: <Sun className="w-5 h-5" /> }
    ];
  }
  return [
    { title: "Active play", icon: <Footprints className="w-5 h-5" /> },
    { title: "Pretend", icon: <Baby className="w-5 h-5" /> },
    { title: "Outside", icon: <Sun className="w-5 h-5" /> }
  ];
};

// Observational notes - not instructional
const getObservations = (ageInWeeks: number): string[] => {
  if (ageInWeeks < 4) {
    return [
      "Drawn to faces up close",
      "Comforted by familiar voices",
      "Mostly sleeping and feeding"
    ];
  } else if (ageInWeeks < 8) {
    return [
      "Eyes following movement",
      "Soft sounds emerging",
      "Head lifting during tummy time"
    ];
  } else if (ageInWeeks < 12) {
    return [
      "Smiling back at you",
      "Hands meeting in the middle",
      "More alert, more curious"
    ];
  } else if (ageInWeeks < 16) {
    return [
      "Reaching for things",
      "Laughing sometimes",
      "Stronger and steadier"
    ];
  } else if (ageInWeeks < 26) {
    return [
      "Rolling happening",
      "Knows familiar faces",
      "Interested in food"
    ];
  } else if (ageInWeeks < 39) {
    return [
      "Sitting up",
      "Babbling away",
      "Attached to favorite people"
    ];
  } else if (ageInWeeks < 52) {
    return [
      "On the move",
      "Understanding more words",
      "Waving and gesturing"
    ];
  } else {
    return [
      "First words coming",
      "Walking or nearly there",
      "Pretending and imagining"
    ];
  }
};

const getFeedingNote = (ageInWeeks: number): string => {
  if (ageInWeeks < 12) return "Feeding often, on demand.";
  if (ageInWeeks < 26) return "Still feeding frequently.";
  if (ageInWeeks < 52) return "Milk and maybe solids.";
  return "Mix of milk and meals.";
};

export const DailyCoach = ({ babyName, babyBirthday }: DailyCoachProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const activities = getActivitySuggestions(ageInWeeks);
  const observations = getObservations(ageInWeeks);
  const displayName = babyName || "your baby";

  if (!babyBirthday) {
    return (
      <TimeOfDayBackground>
        <div className="px-5 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-serif text-foreground">Welcome</h1>
            <p className="text-muted-foreground">
              Add your baby's birthday in settings to see their portrait.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>
    );
  }

  return (
    <TimeOfDayBackground>
      <div className="space-y-4 pb-24">
        {/* Profile Card */}
        <BabyProfileCard babyName={displayName} babyBirthday={babyBirthday} />

        {/* Day's Shape */}
        <DayRhythm ageInWeeks={ageInWeeks} />

        {/* Current Traits */}
        <DevelopmentTable ageInWeeks={ageInWeeks} />

        {/* Things to Try */}
        <GlassCard className="mx-5">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Try</p>
          </div>
          <div className="p-4">
            <div className="flex justify-around">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {activity.icon}
                  </div>
                  <p className="text-xs font-medium text-foreground">{activity.title}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* You Might Notice */}
        <GlassCard className="mx-5">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Baby className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Noticing</p>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {observations.map((observation, i) => (
                <span 
                  key={i} 
                  className="inline-block px-3 py-1.5 rounded-full bg-muted/30 border border-border/20 text-xs text-foreground"
                >
                  {observation}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Feeding */}
        <GlassCard className="mx-5">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Feeding</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground">
              {getFeedingNote(ageInWeeks)}
            </p>
          </div>
        </GlassCard>

        {/* Affirming footer */}
        <div className="pt-4 text-center px-5">
          <p className="text-xs text-muted-foreground/70 italic">
            You know your baby best.
          </p>
        </div>
      </div>
    </TimeOfDayBackground>
  );
};
