import { Sun, Coffee, Baby, Sparkles, BookOpen, Music, Footprints, Eye, Hand } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { BabyProfileCard } from "./BabyProfileCard";
import { DayRhythm } from "./DayRhythm";
import { TimeOfDayBackground } from "./TimeOfDayBackground";

interface DailyCoachProps {
  babyName?: string;
  babyBirthday?: string;
}

interface ActivitySuggestion {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface MilestoneSet {
  emergingSkills: string[];
  tribalTip?: string;
  reminder?: string;
}

const getAgeInWeeks = (birthday?: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

// Returns exactly 3 suggestions - icons as primary signal, short labels
const getActivitySuggestions = (ageInWeeks: number): ActivitySuggestion[] => {
  if (ageInWeeks < 8) {
    return [
      { title: "Tummy time", description: "", icon: <Baby className="w-5 h-5" /> },
      { title: "Face gazing", description: "", icon: <Eye className="w-5 h-5" /> },
      { title: "Gentle singing", description: "", icon: <Music className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 16) {
    return [
      { title: "Tummy time", description: "", icon: <Baby className="w-5 h-5" /> },
      { title: "Contrast cards", description: "", icon: <Eye className="w-5 h-5" /> },
      { title: "Talk & narrate", description: "", icon: <Music className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 26) {
    return [
      { title: "Floor play", description: "", icon: <Hand className="w-5 h-5" /> },
      { title: "Reading", description: "", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Mirror play", description: "", icon: <Eye className="w-5 h-5" /> }
    ];
  } else if (ageInWeeks < 52) {
    return [
      { title: "Exploration", description: "", icon: <Footprints className="w-5 h-5" /> },
      { title: "Reading", description: "", icon: <BookOpen className="w-5 h-5" /> },
      { title: "Outdoor time", description: "", icon: <Sun className="w-5 h-5" /> }
    ];
  }
  return [
    { title: "Active play", description: "", icon: <Footprints className="w-5 h-5" /> },
    { title: "Pretend play", description: "", icon: <Baby className="w-5 h-5" /> },
    { title: "Outdoor time", description: "", icon: <Sun className="w-5 h-5" /> }
  ];
};

const getMilestones = (ageInWeeks: number): MilestoneSet | null => {
  if (ageInWeeks < 4) {
    return {
      emergingSkills: [
        "Focusing on faces at close range",
        "Responding to familiar voices",
        "Brief moments of alertness"
      ],
      tribalTip: "Skin-to-skin contact helps regulate baby's temperature and heart rate.",
      reminder: "Every baby develops at their own pace."
    };
  } else if (ageInWeeks < 8) {
    return {
      emergingSkills: [
        "Starting to track moving objects",
        "Cooing sounds beginning",
        "Stronger neck control during tummy time"
      ],
      tribalTip: "Respond to baby's coos — this back-and-forth builds language skills.",
      reminder: "Fussy evenings are common and temporary."
    };
  } else if (ageInWeeks < 12) {
    return {
      emergingSkills: [
        "Social smiles becoming more frequent",
        "Bringing hands together",
        "Lifting head during tummy time"
      ],
      tribalTip: "Smiling back reinforces social bonding.",
      reminder: "Growth spurts may temporarily disrupt sleep."
    };
  } else if (ageInWeeks < 16) {
    return {
      emergingSkills: [
        "Reaching for objects",
        "Laughing out loud",
        "Better head control"
      ],
      tribalTip: "Offer safe objects to grasp and explore.",
      reminder: "Sleep may consolidate around this age."
    };
  } else if (ageInWeeks < 26) {
    return {
      emergingSkills: [
        "Rolling from tummy to back",
        "Recognizing familiar faces",
        "Showing interest in solid foods"
      ],
      tribalTip: "Create safe floor time for rolling practice.",
      reminder: "Every baby rolls at different times."
    };
  } else if (ageInWeeks < 39) {
    return {
      emergingSkills: [
        "Sitting with support",
        "Babbling with consonant sounds",
        "Passing objects between hands"
      ],
      tribalTip: "Narrate your day — babies absorb language constantly.",
      reminder: "Separation anxiety may appear."
    };
  } else if (ageInWeeks < 52) {
    return {
      emergingSkills: [
        "Crawling or scooting",
        "Pulling to stand",
        "Understanding simple words"
      ],
      tribalTip: "Baby-proof low spaces as mobility increases.",
      reminder: "Some babies skip crawling — that's okay."
    };
  } else {
    return {
      emergingSkills: [
        "First words emerging",
        "Walking with support or independently",
        "Simple gestures like waving"
      ],
      tribalTip: "Celebrate communication attempts, even imperfect ones.",
      reminder: "Language develops on a wide spectrum."
    };
  }
};

const getFeedingNote = (ageInWeeks: number): string => {
  if (ageInWeeks < 12) return "Feed on demand. Frequent feeding is normal and expected.";
  if (ageInWeeks < 26) return "Most babies this age still feed frequently, around 6–8 times per day.";
  if (ageInWeeks < 52) return "Feeding patterns become more predictable. Solids may be starting.";
  return "A mix of milk and solids throughout the day is typical.";
};

export const DailyCoach = ({ babyName, babyBirthday }: DailyCoachProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const activities = getActivitySuggestions(ageInWeeks);
  const milestones = getMilestones(ageInWeeks);
  const displayName = babyName || "your baby";

  if (!babyBirthday) {
    return (
      <TimeOfDayBackground>
        <div className="px-5 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-serif text-foreground">Welcome</h1>
            <p className="text-muted-foreground">
              Add your baby's birthday in settings to see personalized guidance.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>
    );
  }

  return (
    <TimeOfDayBackground>
      <div className="space-y-4 pb-24">
        {/* Profile Card - identity and "signs" */}
        <BabyProfileCard babyName={displayName} babyBirthday={babyBirthday} />

        {/* Day Rhythm - shape not schedule */}
        <DayRhythm ageInWeeks={ageInWeeks} />

        {/* Things to Try - icons as primary signal */}
        <GlassCard className="mx-5">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Things to Try</p>
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

        {/* What to Expect */}
        {milestones && (
          <GlassCard className="mx-5">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <Baby className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">What to Expect</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">You might notice</p>
                <ul className="space-y-1.5">
                  {milestones.emergingSkills.slice(0, 3).map((skill, i) => (
                    <li key={i} className="text-sm text-foreground leading-relaxed">
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {milestones.tribalTip && (
                <div className="pt-3 border-t border-border/30">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    💡 {milestones.tribalTip}
                  </p>
                </div>
              )}

              {milestones.reminder && (
                <p className="text-xs text-muted-foreground/80 italic">
                  {milestones.reminder}
                </p>
              )}
            </div>
          </GlassCard>
        )}

        {/* Feeding Note */}
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

        {/* Footer reassurance */}
        <div className="pt-4 text-center px-5">
          <p className="text-xs text-muted-foreground/70 italic">
            You're doing great. Trust your instincts.
          </p>
        </div>
      </div>
    </TimeOfDayBackground>
  );
};