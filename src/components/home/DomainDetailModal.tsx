import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, Circle, Minus } from "lucide-react";
import { DomainData } from "./DevelopmentTable";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface DomainDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: DomainData | null | undefined;
  ageInWeeks: number;
  birthday?: string;
  allDomains: DomainData[];
  onNavigate: (domainId: string) => void;
}

interface Milestone {
  text: string;
  status: "achieved" | "emerging" | "not_yet";
}

// Get zodiac sign for astrological flavor
const getZodiacSign = (birthday?: string): string => {
  if (!birthday) return "Aries";
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Astrological flavor text by domain and sign
const getAstroFlavor = (domainId: string, sign: string): string => {
  const flavors: Record<string, Record<string, string>> = {
    physical: {
      Aries: "Aries energy: Bold mover, physical risk-taker who dives into new skills fearlessly.",
      Taurus: "Taurus energy: Deliberate and steady, building physical skills with patience and persistence.",
      Gemini: "Gemini energy: Curious explorer, constantly trying new movements and physical experiments.",
      Cancer: "Cancer energy: Cautious but determined, gaining confidence through familiar routines.",
      Leo: "Leo energy: Confident performer who loves showing off new physical achievements.",
      Virgo: "Virgo energy: Precise and methodical, practicing skills until they're perfected.",
      Libra: "Libra energy: Graceful mover who seeks balance and coordination in all activities.",
      Scorpio: "Scorpio energy: Intense focus on mastering physical challenges, doesn't give up easily.",
      Sagittarius: "Sagittarius energy: Adventurous spirit, always ready to run, jump, and explore.",
      Capricorn: "Capricorn energy: Determined climber, working steadily toward physical milestones.",
      Aquarius: "Aquarius energy: Unique approach to movement, often surprising with unconventional skills.",
      Pisces: "Pisces energy: Fluid and graceful, moving with natural rhythm and intuition.",
    },
    fine_motor: {
      Aries: "Aries energy: Eager to grab, build, and manipulate objects with enthusiasm.",
      Taurus: "Taurus energy: Patient with detailed tasks, enjoys the sensory experience of touch.",
      Gemini: "Gemini energy: Quick hands that love puzzles, buttons, and anything interactive.",
      Cancer: "Cancer energy: Gentle touch, often attached to comfort objects and textures.",
      Leo: "Leo energy: Loves creating and showing their work, proud of artistic efforts.",
      Virgo: "Virgo energy: Precise and careful, excellent at detailed manipulation tasks.",
      Libra: "Libra energy: Drawn to aesthetically pleasing activities like drawing and arranging.",
      Scorpio: "Scorpio energy: Intensely focused on mastering complex hand skills.",
      Sagittarius: "Sagittarius energy: Prefers big movements, may rush through fine motor tasks.",
      Capricorn: "Capricorn energy: Determined to master tools and utensils properly.",
      Aquarius: "Aquarius energy: Creative and inventive with how they use their hands.",
      Pisces: "Pisces energy: Artistic and imaginative in fine motor activities.",
    },
    language: {
      Aries: "Aries energy: Speaks with confidence and directness, first to try new words.",
      Taurus: "Taurus energy: May take time to speak but communicates with purpose and clarity.",
      Gemini: "Gemini energy: Natural talker, often an early speaker with lots to say.",
      Cancer: "Cancer energy: Expressive about feelings, loves familiar songs and stories.",
      Leo: "Leo energy: Dramatic communicator who loves an audience for their words.",
      Virgo: "Virgo energy: Careful with words, often precise and articulate early on.",
      Libra: "Libra energy: Charming communicator, learns social language quickly.",
      Scorpio: "Scorpio energy: Says what they mean, may be quieter but words carry weight.",
      Sagittarius: "Sagittarius energy: Enthusiastic talker, loves asking questions and telling stories.",
      Capricorn: "Capricorn energy: Speaks with purpose, may prefer actions over words.",
      Aquarius: "Aquarius energy: Unique vocabulary and way of expressing ideas.",
      Pisces: "Pisces energy: Imaginative language, often poetic and emotionally expressive.",
    },
    social: {
      Aries: "Aries energy: Natural leader in play, initiates interactions with confidence.",
      Taurus: "Taurus energy: Loyal friend, prefers small groups and familiar playmates.",
      Gemini: "Gemini energy: Social butterfly, easily connects with many different children.",
      Cancer: "Cancer energy: Deeply attached, may be shy at first but nurturing with close friends.",
      Leo: "Leo energy: Loves being the center of attention, generous with friends.",
      Virgo: "Virgo energy: Helpful friend, notices what others need.",
      Libra: "Libra energy: Natural peacemaker, seeks harmony in all relationships.",
      Scorpio: "Scorpio energy: Forms intense bonds, very loyal to chosen friends.",
      Sagittarius: "Sagittarius energy: Friendly with everyone, brings fun to any group.",
      Capricorn: "Capricorn energy: Serious about friendships, reliable playmate.",
      Aquarius: "Aquarius energy: Friendly to all but independent, unique social style.",
      Pisces: "Pisces energy: Empathetic and kind, sensitive to others' feelings.",
    },
    cognitive: {
      Aries: "Aries energy: Quick learner who loves figuring things out independently.",
      Taurus: "Taurus energy: Learns through repetition and hands-on experience.",
      Gemini: "Gemini energy: Curious mind that jumps between interests, absorbs information quickly.",
      Cancer: "Cancer energy: Strong memory, especially for emotionally significant events.",
      Leo: "Leo energy: Confident learner who enjoys being recognized for intelligence.",
      Virgo: "Virgo energy: Analytical mind, notices details others miss.",
      Libra: "Libra energy: Learns through comparison and understanding relationships.",
      Scorpio: "Scorpio energy: Deep thinker, loves solving mysteries and puzzles.",
      Sagittarius: "Sagittarius energy: Big picture thinker, loves learning about the wider world.",
      Capricorn: "Capricorn energy: Systematic learner, builds knowledge step by step.",
      Aquarius: "Aquarius energy: Original thinker, often has unique perspectives and ideas.",
      Pisces: "Pisces energy: Intuitive learner, absorbs information through imagination.",
    },
    emotional: {
      Aries: "Aries energy: Quick to feel and express emotions, recovers fast from upsets.",
      Taurus: "Taurus energy: Steady temperament but can be stubborn when upset.",
      Gemini: "Gemini energy: Changeable moods, easily distracted from difficult emotions.",
      Cancer: "Cancer energy: Deeply feeling, needs lots of emotional connection and comfort.",
      Leo: "Leo energy: Big feelings need to be seen and validated by loved ones.",
      Virgo: "Virgo energy: May worry about things, benefits from reassurance and routine.",
      Libra: "Libra energy: Seeks emotional balance, upset by conflict or unfairness.",
      Scorpio: "Scorpio energy: Intense emotions, feels everything deeply and privately.",
      Sagittarius: "Sagittarius energy: Generally optimistic, bounces back from disappointments.",
      Capricorn: "Capricorn energy: May hold emotions in, needs safe space to express feelings.",
      Aquarius: "Aquarius energy: Independent emotionally, may process feelings differently.",
      Pisces: "Pisces energy: Highly sensitive, absorbs emotions from environment.",
    },
  };

  return flavors[domainId]?.[sign] || `${sign} brings unique qualities to this developmental area.`;
};

// Milestones by domain and age
const getMilestones = (domainId: string, ageInWeeks: number): Milestone[] => {
  // Physical milestones
  if (domainId === "physical") {
    if (ageInWeeks < 16) {
      return [
        { text: "Lifts head during tummy time", status: ageInWeeks >= 4 ? "achieved" : "emerging" },
        { text: "Pushes up on arms", status: ageInWeeks >= 8 ? "achieved" : ageInWeeks >= 4 ? "emerging" : "not_yet" },
        { text: "Rolls one direction", status: ageInWeeks >= 12 ? "emerging" : "not_yet" },
      ];
    }
    if (ageInWeeks < 39) {
      return [
        { text: "Rolls both directions", status: ageInWeeks >= 26 ? "achieved" : "emerging" },
        { text: "Sits independently", status: ageInWeeks >= 30 ? "achieved" : ageInWeeks >= 26 ? "emerging" : "not_yet" },
        { text: "Starts crawling", status: ageInWeeks >= 35 ? "emerging" : "not_yet" },
        { text: "Pulls to stand", status: "not_yet" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Crawls well", status: "achieved" },
        { text: "Pulls to stand", status: ageInWeeks >= 45 ? "achieved" : "emerging" },
        { text: "Cruises along furniture", status: ageInWeeks >= 50 ? "achieved" : ageInWeeks >= 45 ? "emerging" : "not_yet" },
        { text: "Takes first steps", status: ageInWeeks >= 52 ? "emerging" : "not_yet" },
        { text: "Walks independently", status: ageInWeeks >= 65 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Walks confidently", status: "achieved" },
      { text: "Runs with coordination", status: ageInWeeks >= 90 ? "achieved" : "emerging" },
      { text: "Climbs stairs", status: ageInWeeks >= 104 ? "achieved" : "emerging" },
      { text: "Jumps with both feet", status: ageInWeeks >= 120 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
    ];
  }

  // Fine motor milestones
  if (domainId === "fine_motor") {
    if (ageInWeeks < 26) {
      return [
        { text: "Brings hands together", status: ageInWeeks >= 8 ? "achieved" : "emerging" },
        { text: "Reaches for objects", status: ageInWeeks >= 12 ? "achieved" : ageInWeeks >= 8 ? "emerging" : "not_yet" },
        { text: "Grasps and holds toys", status: ageInWeeks >= 16 ? "achieved" : ageInWeeks >= 12 ? "emerging" : "not_yet" },
        { text: "Transfers between hands", status: ageInWeeks >= 22 ? "emerging" : "not_yet" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Transfers objects hand to hand", status: "achieved" },
        { text: "Uses pincer grasp", status: ageInWeeks >= 40 ? "achieved" : ageInWeeks >= 35 ? "emerging" : "not_yet" },
        { text: "Points with finger", status: ageInWeeks >= 45 ? "achieved" : ageInWeeks >= 40 ? "emerging" : "not_yet" },
        { text: "Stacks blocks", status: ageInWeeks >= 52 ? "emerging" : "not_yet" },
        { text: "Scribbles with crayon", status: ageInWeeks >= 65 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Stacks several blocks", status: "achieved" },
      { text: "Uses spoon and fork", status: ageInWeeks >= 90 ? "achieved" : "emerging" },
      { text: "Draws lines and circles", status: ageInWeeks >= 104 ? "achieved" : "emerging" },
      { text: "Cuts with scissors", status: ageInWeeks >= 156 ? "achieved" : ageInWeeks >= 130 ? "emerging" : "not_yet" },
    ];
  }

  // Language milestones
  if (domainId === "language") {
    if (ageInWeeks < 26) {
      return [
        { text: "Coos and makes sounds", status: ageInWeeks >= 6 ? "achieved" : "emerging" },
        { text: "Laughs out loud", status: ageInWeeks >= 12 ? "achieved" : ageInWeeks >= 8 ? "emerging" : "not_yet" },
        { text: "Babbles consonant sounds", status: ageInWeeks >= 20 ? "achieved" : ageInWeeks >= 16 ? "emerging" : "not_yet" },
        { text: "Responds to name", status: ageInWeeks >= 22 ? "emerging" : "not_yet" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Says mama/dada", status: ageInWeeks >= 45 ? "achieved" : ageInWeeks >= 35 ? "emerging" : "not_yet" },
        { text: "Understands simple words", status: ageInWeeks >= 40 ? "achieved" : "emerging" },
        { text: "Says 1-3 words", status: ageInWeeks >= 52 ? "achieved" : ageInWeeks >= 45 ? "emerging" : "not_yet" },
        { text: "Points to show things", status: ageInWeeks >= 55 ? "achieved" : ageInWeeks >= 48 ? "emerging" : "not_yet" },
        { text: "Says 10+ words", status: ageInWeeks >= 70 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Uses many words", status: "achieved" },
      { text: "Combines two words", status: ageInWeeks >= 90 ? "achieved" : "emerging" },
      { text: "Speaks in sentences", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Tells simple stories", status: ageInWeeks >= 156 ? "achieved" : ageInWeeks >= 130 ? "emerging" : "not_yet" },
    ];
  }

  // Social milestones
  if (domainId === "social") {
    if (ageInWeeks < 26) {
      return [
        { text: "Social smiling", status: ageInWeeks >= 6 ? "achieved" : "emerging" },
        { text: "Recognizes caregivers", status: ageInWeeks >= 12 ? "achieved" : "emerging" },
        { text: "Enjoys social play", status: ageInWeeks >= 16 ? "achieved" : "emerging" },
        { text: "Shows stranger awareness", status: ageInWeeks >= 22 ? "emerging" : "not_yet" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Shows attachment to caregivers", status: "achieved" },
        { text: "Waves bye-bye", status: ageInWeeks >= 40 ? "achieved" : ageInWeeks >= 35 ? "emerging" : "not_yet" },
        { text: "Plays simple games", status: ageInWeeks >= 45 ? "achieved" : "emerging" },
        { text: "Imitates others", status: ageInWeeks >= 52 ? "achieved" : "emerging" },
        { text: "Plays alongside peers", status: ageInWeeks >= 65 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Parallel play with peers", status: "achieved" },
      { text: "Begins cooperative play", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Takes turns with help", status: ageInWeeks >= 120 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Makes real friendships", status: ageInWeeks >= 208 ? "achieved" : ageInWeeks >= 156 ? "emerging" : "not_yet" },
    ];
  }

  // Cognitive milestones
  if (domainId === "cognitive") {
    if (ageInWeeks < 26) {
      return [
        { text: "Tracks moving objects", status: ageInWeeks >= 6 ? "achieved" : "emerging" },
        { text: "Explores with mouth", status: ageInWeeks >= 12 ? "achieved" : "emerging" },
        { text: "Discovers cause and effect", status: ageInWeeks >= 16 ? "achieved" : ageInWeeks >= 12 ? "emerging" : "not_yet" },
        { text: "Looks for dropped objects", status: ageInWeeks >= 22 ? "emerging" : "not_yet" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Understands object permanence", status: ageInWeeks >= 40 ? "achieved" : ageInWeeks >= 30 ? "emerging" : "not_yet" },
        { text: "Explores objects in many ways", status: "achieved" },
        { text: "Finds hidden things", status: ageInWeeks >= 45 ? "achieved" : "emerging" },
        { text: "Imitates new actions", status: ageInWeeks >= 52 ? "achieved" : "emerging" },
        { text: "Sorts by shape/color", status: ageInWeeks >= 65 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Sorts shapes and colors", status: "achieved" },
      { text: "Completes simple puzzles", status: ageInWeeks >= 104 ? "achieved" : "emerging" },
      { text: "Understands counting", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Asks why questions", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
    ];
  }

  // Emotional milestones
  if (domainId === "emotional") {
    if (ageInWeeks < 26) {
      return [
        { text: "Shows contentment", status: ageInWeeks >= 4 ? "achieved" : "emerging" },
        { text: "Expresses joy and delight", status: ageInWeeks >= 12 ? "achieved" : "emerging" },
        { text: "Shows frustration", status: ageInWeeks >= 16 ? "achieved" : "emerging" },
        { text: "Comforted by familiar people", status: "achieved" },
      ];
    }
    if (ageInWeeks < 78) {
      return [
        { text: "Shows separation anxiety", status: ageInWeeks >= 30 ? "achieved" : "emerging" },
        { text: "Expresses many emotions", status: "achieved" },
        { text: "Seeks comfort when upset", status: "achieved" },
        { text: "Shows affection openly", status: ageInWeeks >= 52 ? "achieved" : "emerging" },
        { text: "Begins tantrums", status: ageInWeeks >= 52 ? "achieved" : ageInWeeks >= 45 ? "emerging" : "not_yet" },
      ];
    }
    return [
      { text: "Experiences strong emotions", status: "achieved" },
      { text: "Begins to self-regulate", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Names feelings", status: ageInWeeks >= 130 ? "achieved" : ageInWeeks >= 104 ? "emerging" : "not_yet" },
      { text: "Shows empathy for others", status: ageInWeeks >= 156 ? "achieved" : ageInWeeks >= 130 ? "emerging" : "not_yet" },
    ];
  }

  return [];
};

// What's next content
const getWhatsNext = (domainId: string, ageInWeeks: number): string => {
  const content: Record<string, Record<number, string>> = {
    physical: {
      16: "Rolling will likely become more consistent in the coming weeks. Tummy time continues to build strength for sitting.",
      39: "Crawling or scooting is on the horizon. You may notice more attempts to get moving and reach for distant objects.",
      52: "Cruising and standing are emerging. First independent steps typically come between 9-15 months.",
      78: "Walking becomes more confident each week. Running and climbing adventures are just around the corner.",
      104: "Running, jumping, and climbing will become favorite activities. Balance continues to improve daily.",
    },
    fine_motor: {
      26: "The pincer grasp is developing. Small objects become fascinating as fingers gain control.",
      52: "Stacking, nesting, and more precise movements are coming. Self-feeding gets messier but more skilled.",
      104: "Drawing and creating become possible. Expect lots of scribbling as hand control improves.",
    },
    language: {
      39: "First words are on the horizon. Continue naming everything and reading together.",
      52: "Vocabulary is about to explode. New words may appear daily in the coming months.",
      104: "Sentences and conversations are developing. Keep the back-and-forth dialogue going.",
    },
    social: {
      39: "Separation awareness peaks soon. Patient goodbyes and return rituals help build trust.",
      104: "Parallel play evolves toward cooperative play. Learning to share and take turns takes time.",
    },
    cognitive: {
      39: "Object permanence is solidifying. Hide-and-seek games become more engaging.",
      104: "Problem-solving and 'why' questions are increasing. Feed the curiosity with exploration.",
    },
    emotional: {
      78: "Tantrums may increase as independence grows. Stay calm and consistent through big feelings.",
      130: "Emotional vocabulary and regulation are developing. Naming feelings helps build emotional intelligence.",
    },
  };

  const domainContent = content[domainId] || {};
  const relevantAge = Object.keys(domainContent)
    .map(Number)
    .sort((a, b) => b - a)
    .find(age => ageInWeeks >= age - 10);

  return domainContent[relevantAge || 39] || "Development continues to unfold naturally. Each child has their own timeline.";
};

// Support tips
const getSupportTips = (domainId: string, ageInWeeks: number): string[] => {
  const tips: Record<string, string[]> = {
    physical: [
      "Provide safe spaces for movement and exploration",
      "Let them practice without rushing to help",
      "Celebrate effort, not just achievement",
      "Offer varied textures and surfaces to explore",
    ],
    fine_motor: [
      "Offer age-appropriate objects to manipulate",
      "Let mealtimes get messy—it's learning",
      "Provide crayons, play dough, and building blocks",
      "Resist the urge to do things for them",
    ],
    language: [
      "Narrate your day and their activities",
      "Read together every day",
      "Wait and give time to respond",
      "Expand on their words and sounds",
    ],
    social: [
      "Model kind interactions and sharing",
      "Provide opportunities for peer play",
      "Respect their pace with new people",
      "Role-play social situations through play",
    ],
    cognitive: [
      "Follow their interests and curiosity",
      "Ask open-ended questions",
      "Provide puzzles and sorting activities",
      "Let them figure things out before helping",
    ],
    emotional: [
      "Name emotions as they happen",
      "Stay calm during big feelings",
      "Validate their experience before redirecting",
      "Create consistent, predictable routines",
    ],
  };

  return tips[domainId] || [];
};

const MilestoneIcon = ({ status }: { status: string }) => {
  if (status === "achieved") {
    return <Check className="w-4 h-4 text-primary" />;
  }
  if (status === "emerging") {
    return <Minus className="w-4 h-4 text-amber-500" />;
  }
  return <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />;
};

export const DomainDetailModal = ({
  isOpen,
  onClose,
  domain,
  ageInWeeks,
  birthday,
  allDomains,
  onNavigate,
}: DomainDetailModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (domain) {
      const index = allDomains.findIndex(d => d.id === domain.id);
      if (index >= 0) setCurrentIndex(index);
    }
  }, [domain, allDomains]);

  if (!domain) return null;

  const zodiacSign = getZodiacSign(birthday);
  const astroFlavor = getAstroFlavor(domain.id, zodiacSign);
  const milestones = getMilestones(domain.id, ageInWeeks);
  const whatsNext = getWhatsNext(domain.id, ageInWeeks);
  const supportTips = getSupportTips(domain.id, ageInWeeks);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < allDomains.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      onNavigate(allDomains[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(allDomains[currentIndex + 1].id);
    }
  };

  const getStatusBg = (status: string): string => {
    switch (status) {
      case "EMERGING": return "bg-muted";
      case "GROWING": return "bg-primary/20";
      case "STEADY": return "bg-foreground/10";
      case "TRANSITIONING": return "bg-amber-500/20";
      case "CHALLENGING": return "bg-rose-500/20";
      default: return "bg-muted";
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{domain.icon}</span>
              <h2 className="text-lg font-serif text-foreground">{domain.label}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Astrological Flavor */}
            <div className="bg-muted/30 rounded-lg px-4 py-3">
              <p className="text-sm text-foreground/80 italic">
                {astroFlavor}
              </p>
            </div>

            {/* Current Milestones */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Current Milestones
              </h3>
              <div className="space-y-2.5">
                {milestones.map((milestone, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <MilestoneIcon status={milestone.status} />
                    <span className={`text-sm ${
                      milestone.status === "achieved" ? "text-foreground" :
                      milestone.status === "emerging" ? "text-foreground/70" :
                      "text-muted-foreground/60"
                    }`}>
                      {milestone.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Next */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                What's Next
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {whatsNext}
              </p>
            </div>

            {/* How to Support */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                How to Support
              </h3>
              <ul className="space-y-2">
                {supportTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center pt-2">
              <div className={`px-6 py-3 rounded-full ${getStatusBg(domain.status)}`}>
                <span className="text-sm uppercase tracking-wider font-medium text-foreground/80">
                  {domain.status}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/30">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Prev</span>
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {allDomains.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => onNavigate(d.id)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoNext 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};