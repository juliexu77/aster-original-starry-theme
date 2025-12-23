import { Sun, Coffee, Baby, Sparkles, BookOpen, Music, Footprints, Eye, Hand, Palette, Puzzle, TreeDeciduous } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { BabyProfileCard } from "./BabyProfileCard";
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
  // 0-8 weeks
  if (ageInWeeks < 8) {
    return [
      { title: "Tummy time", icon: <Baby className="w-5 h-5" /> },
      { title: "Face gazing", icon: <Eye className="w-5 h-5" /> },
      { title: "Soft singing", icon: <Music className="w-5 h-5" /> }
    ];
  }
  // 8-16 weeks
  if (ageInWeeks < 16) {
    return [
      { title: "Tummy time", icon: <Baby className="w-5 h-5" /> },
      { title: "Contrast cards", icon: <Eye className="w-5 h-5" /> },
      { title: "Talking", icon: <Music className="w-5 h-5" /> }
    ];
  }
  // 16-26 weeks (4-6 months)
  if (ageInWeeks < 26) {
    return [
      { title: "Floor play", icon: <Hand className="w-5 h-5" /> },
      { title: "Reading", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Mirror time", icon: <Eye className="w-5 h-5" /> }
    ];
  }
  // 26-52 weeks (6-12 months)
  if (ageInWeeks < 52) {
    return [
      { title: "Exploring", icon: <Footprints className="w-5 h-5" /> },
      { title: "Books", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Outside", icon: <Sun className="w-5 h-5" /> }
    ];
  }
  // 52-78 weeks (12-18 months)
  if (ageInWeeks < 78) {
    return [
      { title: "Walking", icon: <Footprints className="w-5 h-5" /> },
      { title: "Stacking", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Dancing", icon: <Music className="w-5 h-5" /> }
    ];
  }
  // 78-104 weeks (18-24 months)
  if (ageInWeeks < 104) {
    return [
      { title: "Running", icon: <Footprints className="w-5 h-5" /> },
      { title: "Drawing", icon: <Palette className="w-5 h-5" /> },
      { title: "Pretend play", icon: <Sparkles className="w-5 h-5" /> }
    ];
  }
  // 104-156 weeks (2-3 years)
  if (ageInWeeks < 156) {
    return [
      { title: "Climbing", icon: <TreeDeciduous className="w-5 h-5" /> },
      { title: "Puzzles", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Imagination", icon: <Sparkles className="w-5 h-5" /> }
    ];
  }
  // 156-208 weeks (3-4 years)
  if (ageInWeeks < 208) {
    return [
      { title: "Building", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Stories", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Nature walks", icon: <TreeDeciduous className="w-5 h-5" /> }
    ];
  }
  // 208-260 weeks (4-5 years)
  if (ageInWeeks < 260) {
    return [
      { title: "Games", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Creating", icon: <Palette className="w-5 h-5" /> },
      { title: "Adventures", icon: <Sun className="w-5 h-5" /> }
    ];
  }
  // 260-312 weeks (5-6 years)
  if (ageInWeeks < 312) {
    return [
      { title: "Learning", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Sports", icon: <Footprints className="w-5 h-5" /> },
      { title: "Art projects", icon: <Palette className="w-5 h-5" /> }
    ];
  }
  // 312-364 weeks (6-7 years)
  if (ageInWeeks < 364) {
    return [
      { title: "Reading", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Team games", icon: <Footprints className="w-5 h-5" /> },
      { title: "Crafts", icon: <Palette className="w-5 h-5" /> }
    ];
  }
  // 364-416 weeks (7-8 years)
  if (ageInWeeks < 416) {
    return [
      { title: "Hobbies", icon: <Sparkles className="w-5 h-5" /> },
      { title: "Building", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Exploring", icon: <TreeDeciduous className="w-5 h-5" /> }
    ];
  }
  // 416-468 weeks (8-9 years)
  if (ageInWeeks < 468) {
    return [
      { title: "Projects", icon: <Puzzle className="w-5 h-5" /> },
      { title: "Music", icon: <Music className="w-5 h-5" /> },
      { title: "Discovery", icon: <Sparkles className="w-5 h-5" /> }
    ];
  }
  // 468+ weeks (9-10 years)
  return [
    { title: "Interests", icon: <Sparkles className="w-5 h-5" /> },
    { title: "Friends", icon: <Coffee className="w-5 h-5" /> },
    { title: "Creating", icon: <Palette className="w-5 h-5" /> }
  ];
};

// Observational notes - behavioral focus for older children
const getObservations = (ageInWeeks: number): string[] => {
  // 0-4 weeks
  if (ageInWeeks < 4) {
    return [
      "Drawn to faces up close",
      "Comforted by familiar voices",
      "Mostly sleeping and feeding"
    ];
  }
  // 4-8 weeks
  if (ageInWeeks < 8) {
    return [
      "Eyes following movement",
      "Soft sounds emerging",
      "Head lifting during tummy time"
    ];
  }
  // 8-12 weeks
  if (ageInWeeks < 12) {
    return [
      "Smiling back at you",
      "Hands meeting in the middle",
      "More alert, more curious"
    ];
  }
  // 12-16 weeks
  if (ageInWeeks < 16) {
    return [
      "Reaching for things",
      "Laughing sometimes",
      "Stronger and steadier"
    ];
  }
  // 16-26 weeks (4-6 months)
  if (ageInWeeks < 26) {
    return [
      "Rolling happening",
      "Knows familiar faces",
      "Interested in food"
    ];
  }
  // 26-39 weeks (6-9 months)
  if (ageInWeeks < 39) {
    return [
      "Sitting up",
      "Babbling away",
      "Attached to favorite people"
    ];
  }
  // 39-52 weeks (9-12 months)
  if (ageInWeeks < 52) {
    return [
      "On the move",
      "Understanding more words",
      "Waving and gesturing"
    ];
  }
  // 52-78 weeks (12-18 months)
  if (ageInWeeks < 78) {
    return [
      "First steps happening",
      "Pointing at everything",
      "A few words emerging"
    ];
  }
  // 78-104 weeks (18-24 months)
  if (ageInWeeks < 104) {
    return [
      "Walking confidently now",
      "Words coming faster",
      "Saying no quite a lot"
    ];
  }
  // 104-130 weeks (2-2.5 years)
  if (ageInWeeks < 130) {
    return [
      "Running and climbing",
      "Two-word phrases",
      "Wanting to do it themselves"
    ];
  }
  // 130-156 weeks (2.5-3 years)
  if (ageInWeeks < 156) {
    return [
      "Jumping and balancing",
      "Full sentences now",
      "Strong preferences emerging"
    ];
  }
  // 156-208 weeks (3-4 years)
  if (ageInWeeks < 208) {
    return [
      "Asking why constantly",
      "Playing with others more",
      "Big feelings to navigate"
    ];
  }
  // 208-260 weeks (4-5 years)
  if (ageInWeeks < 260) {
    return [
      "Making up elaborate games",
      "Negotiating with friends",
      "Testing rules and boundaries"
    ];
  }
  // 260-312 weeks (5-6 years)
  if (ageInWeeks < 312) {
    return [
      "Ready for structure",
      "Making real friendships",
      "Wanting to be capable"
    ];
  }
  // 312-364 weeks (6-7 years)
  if (ageInWeeks < 364) {
    return [
      "Caring about fairness",
      "Reading taking off",
      "Growing more independent"
    ];
  }
  // 364-416 weeks (7-8 years)
  if (ageInWeeks < 416) {
    return [
      "Friendships matter deeply",
      "Developing real interests",
      "Managing emotions better"
    ];
  }
  // 416-468 weeks (8-9 years)
  if (ageInWeeks < 468) {
    return [
      "Thinking more abstractly",
      "Peer opinions mattering",
      "Taking on responsibility"
    ];
  }
  // 468+ weeks (9-10 years)
  return [
    "Identity forming strongly",
    "Complex social dynamics",
    "Seeking more independence"
  ];
};

const getFeedingNote = (ageInWeeks: number): string => {
  if (ageInWeeks < 12) return "Feeding often, on demand.";
  if (ageInWeeks < 26) return "Still feeding frequently.";
  if (ageInWeeks < 39) return "Starting solids alongside milk.";
  if (ageInWeeks < 52) return "More solids, still some milk.";
  if (ageInWeeks < 78) return "Three meals and snacks.";
  if (ageInWeeks < 104) return "Eating with the family.";
  if (ageInWeeks < 156) return "Independent eater mostly.";
  if (ageInWeeks < 260) return "Eating well, some picky phases.";
  if (ageInWeeks < 364) return "Growing appetite, varied tastes.";
  return "Eating like a big kid.";
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
              Add a birthday in settings to see their portrait.
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

        {/* Development Domains */}
        <DevelopmentTable ageInWeeks={ageInWeeks} birthday={babyBirthday} babyName={displayName} />

        {/* Ideas for the Day */}
        <GlassCard className="mx-5">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">If it fits</p>
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
          <p className="text-xs text-muted-foreground/70 italic font-serif">
            You know your child best.
          </p>
        </div>
      </div>
    </TimeOfDayBackground>
  );
};
