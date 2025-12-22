import { useMemo } from "react";
import { Sun, Moon, Coffee, Baby, Sparkles, BookOpen, Music, Footprints, Eye, Hand } from "lucide-react";

interface DailyCoachProps {
  babyName?: string;
  babyBirthday?: string;
}

interface NapPlan {
  count: number;
  wakeWindow: string;
  description: string;
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

const getAgeLabel = (ageInWeeks: number): string => {
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''} old`;
  const months = Math.floor(ageInWeeks / 4.33);
  const remainingWeeks = Math.round(ageInWeeks % 4.33);
  if (months < 1) return `${ageInWeeks} weeks old`;
  if (remainingWeeks === 0) return `${months} month${months !== 1 ? 's' : ''} old`;
  return `${months} month${months !== 1 ? 's' : ''}, ${remainingWeeks} week${remainingWeeks !== 1 ? 's' : ''} old`;
};

const getNapPlan = (ageInWeeks: number): NapPlan => {
  if (ageInWeeks < 8) {
    return { count: 4, wakeWindow: "45–75 min", description: "Short wake windows. Sleep when tired." };
  } else if (ageInWeeks < 16) {
    return { count: 4, wakeWindow: "60–90 min", description: "Wake windows lengthening slightly." };
  } else if (ageInWeeks < 26) {
    return { count: 3, wakeWindow: "1.5–2 hours", description: "Three naps is typical now." };
  } else if (ageInWeeks < 39) {
    return { count: 3, wakeWindow: "2–2.5 hours", description: "Settling into a rhythm." };
  } else if (ageInWeeks < 52) {
    return { count: 2, wakeWindow: "2.5–3.5 hours", description: "Two naps feel natural." };
  } else if (ageInWeeks < 78) {
    return { count: 2, wakeWindow: "3–4 hours", description: "Morning and afternoon nap." };
  } else {
    return { count: 1, wakeWindow: "4–6 hours", description: "One midday nap." };
  }
};

const getActivitySuggestions = (ageInWeeks: number): ActivitySuggestion[] => {
  const activities: ActivitySuggestion[] = [];

  if (ageInWeeks < 8) {
    activities.push(
      { title: "Tummy time", description: "1–2 minutes on a firm surface", icon: <Baby className="w-4 h-4" /> },
      { title: "Face gazing", description: "Hold baby 8–12 inches away", icon: <Eye className="w-4 h-4" /> },
      { title: "Gentle singing", description: "Any song, your voice matters", icon: <Music className="w-4 h-4" /> }
    );
  } else if (ageInWeeks < 16) {
    activities.push(
      { title: "Tummy time", description: "Short sessions throughout the day", icon: <Baby className="w-4 h-4" /> },
      { title: "High-contrast cards", description: "Black and white patterns", icon: <Eye className="w-4 h-4" /> },
      { title: "Gentle movement", description: "Bicycle legs, arm stretches", icon: <Hand className="w-4 h-4" /> },
      { title: "Talk and narrate", description: "Describe what you're doing", icon: <Music className="w-4 h-4" /> }
    );
  } else if (ageInWeeks < 26) {
    activities.push(
      { title: "Tummy time", description: "Longer sessions, reaching for toys", icon: <Baby className="w-4 h-4" /> },
      { title: "Floor play", description: "Safe objects to grasp and explore", icon: <Hand className="w-4 h-4" /> },
      { title: "Reading together", description: "Board books with simple pictures", icon: <BookOpen className="w-4 h-4" /> },
      { title: "Mirror play", description: "Baby loves their reflection", icon: <Eye className="w-4 h-4" /> }
    );
  } else if (ageInWeeks < 52) {
    activities.push(
      { title: "Floor exploration", description: "Safe space to move and discover", icon: <Footprints className="w-4 h-4" /> },
      { title: "Cause and effect toys", description: "Buttons, rattles, stacking cups", icon: <Hand className="w-4 h-4" /> },
      { title: "Reading together", description: "Point and name objects", icon: <BookOpen className="w-4 h-4" /> },
      { title: "Outdoor time", description: "Fresh air and new sights", icon: <Sun className="w-4 h-4" /> }
    );
  } else {
    activities.push(
      { title: "Active play", description: "Crawling, cruising, or walking", icon: <Footprints className="w-4 h-4" /> },
      { title: "Simple pretend play", description: "Feeding dolls, toy phones", icon: <Baby className="w-4 h-4" /> },
      { title: "Books and songs", description: "Interactive reading time", icon: <BookOpen className="w-4 h-4" /> },
      { title: "Outdoor exploration", description: "Park, backyard, neighborhood walk", icon: <Sun className="w-4 h-4" /> }
    );
  }

  return activities;
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
      reminder: "Every baby develops at their own pace. These are general guides."
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

export const DailyCoach = ({ babyName, babyBirthday }: DailyCoachProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageLabel = getAgeLabel(ageInWeeks);
  const napPlan = getNapPlan(ageInWeeks);
  const activities = getActivitySuggestions(ageInWeeks);
  const milestones = getMilestones(ageInWeeks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const displayName = babyName || "your baby";

  if (!babyBirthday) {
    return (
      <div className="px-5 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-serif text-foreground">{greeting}</h1>
          <p className="text-muted-foreground">
            Add your baby's birthday in settings to see personalized guidance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-serif text-foreground">{greeting}</h1>
        <p className="text-sm text-muted-foreground">
          {displayName} is {ageLabel}
        </p>
      </div>

      {/* Today's Nap Plan */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Today's Sleep</h2>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/40">
          <p className="text-lg font-medium text-foreground mb-1">
            Expect about {napPlan.count} nap{napPlan.count !== 1 ? 's' : ''} today
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Wake windows: {napPlan.wakeWindow}
          </p>
          <p className="text-sm text-muted-foreground/80 italic">
            {napPlan.description}
          </p>
        </div>
      </section>

      {/* Activity Suggestions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Things to Try</h2>
        </div>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-4 border border-border/40 flex items-start gap-3"
            >
              <div className="text-primary mt-0.5">{activity.icon}</div>
              <div>
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What to Expect */}
      {milestones && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">What to Expect</h2>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/40 space-y-4">
            {/* Emerging Skills */}
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

            {/* Tribal Tip */}
            {milestones.tribalTip && (
              <div className="pt-3 border-t border-border/40">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  💡 {milestones.tribalTip}
                </p>
              </div>
            )}

            {/* Reassurance */}
            {milestones.reminder && (
              <p className="text-xs text-muted-foreground/80 italic pt-2">
                {milestones.reminder}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Feeding Note */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Feeding</h2>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/40">
          <p className="text-sm text-foreground">
            {ageInWeeks < 12 
              ? "Feed on demand. Frequent feeding is normal and expected."
              : ageInWeeks < 26
              ? "Most babies this age still feed frequently, around 6–8 times per day."
              : ageInWeeks < 52
              ? "Feeding patterns become more predictable. Solids may be starting."
              : "A mix of milk and solids throughout the day is typical."
            }
          </p>
        </div>
      </section>

      {/* Footer reassurance */}
      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground/70 italic">
          You're doing great. Trust your instincts.
        </p>
      </div>
    </div>
  );
};
