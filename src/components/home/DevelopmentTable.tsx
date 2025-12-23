import { Footprints, Hand, MessageCircle, Users, Brain, Heart, Star, Sparkles } from "lucide-react";

interface DevelopmentTableProps {
  ageInWeeks: number;
  birthday?: string;
}

interface DomainData {
  domain: string;
  label: string;
  icon: React.ReactNode;
  phrase: string;
  stage: "emerging" | "growing" | "confident";
}

// Get sun sign from birthday
const getSunSign = (birthday: string): { sign: string; symbol: string } => {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", symbol: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", symbol: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", symbol: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒" };
  return { sign: "Pisces", symbol: "♓" };
};

// Get Chinese zodiac from birth year
const getChineseZodiac = (birthday: string): { animal: string; symbol: string } => {
  const year = new Date(birthday).getFullYear();
  const animals = [
    { animal: "Rat", symbol: "🐀" },
    { animal: "Ox", symbol: "🐂" },
    { animal: "Tiger", symbol: "🐅" },
    { animal: "Rabbit", symbol: "🐇" },
    { animal: "Dragon", symbol: "🐉" },
    { animal: "Snake", symbol: "🐍" },
    { animal: "Horse", symbol: "🐎" },
    { animal: "Goat", symbol: "🐐" },
    { animal: "Monkey", symbol: "🐒" },
    { animal: "Rooster", symbol: "🐓" },
    { animal: "Dog", symbol: "🐕" },
    { animal: "Pig", symbol: "🐖" },
  ];
  return animals[(year - 4) % 12];
};

const getDomainData = (ageInWeeks: number): DomainData[] => {
  // 0-4 weeks
  if (ageInWeeks < 4) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Reflexes guiding", stage: "emerging" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands fisted", stage: "emerging" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Crying to communicate", stage: "emerging" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Seeking closeness", stage: "emerging" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Drawn to faces", stage: "emerging" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Finding comfort", stage: "emerging" },
    ];
  }
  // 4-8 weeks
  if (ageInWeeks < 8) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Lifting head", stage: "emerging" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands loosening", stage: "emerging" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Cooing softly", stage: "emerging" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Watching faces", stage: "emerging" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Tracking movement", stage: "emerging" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Calmed by voice", stage: "emerging" },
    ];
  }
  // 8-12 weeks
  if (ageInWeeks < 12) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Head steadier", stage: "growing" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands meeting", stage: "emerging" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Vowel sounds", stage: "emerging" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Smiling back", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Noticing patterns", stage: "emerging" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Expressing joy", stage: "emerging" },
    ];
  }
  // 12-16 weeks
  if (ageInWeeks < 16) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Rolling attempts", stage: "emerging" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Reaching out", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Babbling more", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Laughing often", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Cause and effect", stage: "emerging" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Showing delight", stage: "growing" },
    ];
  }
  // 16-26 weeks (4-6 months)
  if (ageInWeeks < 26) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Rolling over", stage: "growing" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Grasping things", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Consonants coming", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Knows family", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Object curiosity", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Stranger awareness", stage: "emerging" },
    ];
  }
  // 26-39 weeks (6-9 months)
  if (ageInWeeks < 39) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Sitting steady", stage: "growing" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Pincer emerging", stage: "emerging" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Ma-ma, da-da", stage: "emerging" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Attached deeply", stage: "confident" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Object permanence", stage: "emerging" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Separation feelings", stage: "growing" },
    ];
  }
  // 39-52 weeks (9-12 months)
  if (ageInWeeks < 52) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Cruising around", stage: "growing" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Pincer grip", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Understanding words", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Waving, pointing", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Problem solving", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Testing reactions", stage: "growing" },
    ];
  }
  // 52-78 weeks (12-18 months)
  if (ageInWeeks < 78) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Walking more", stage: "growing" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Stacking, placing", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "First words", stage: "emerging" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Parallel play", stage: "emerging" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Exploring everything", stage: "confident" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Big feelings arise", stage: "growing" },
    ];
  }
  // 78-104 weeks (18-24 months)
  if (ageInWeeks < 104) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Running, climbing", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Scribbling away", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Words piling up", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Copying others", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Sorting, matching", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Asserting will", stage: "confident" },
    ];
  }
  // 104-130 weeks (24-30 months)
  if (ageInWeeks < 130) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Jumping, kicking", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Using utensils", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Two-word phrases", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Wanting friends", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Pretend play starts", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Tantrums peak", stage: "confident" },
    ];
  }
  // 130-156 weeks (30-36 months)
  if (ageInWeeks < 156) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Balancing better", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Drawing shapes", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Full sentences", stage: "confident" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Taking turns", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Asking why", stage: "confident" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Naming feelings", stage: "growing" },
    ];
  }
  // 156-208 weeks (3-4 years)
  if (ageInWeeks < 208) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Running freely", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Cutting, gluing", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Storytelling", stage: "confident" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Cooperative play", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Counting, sorting", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Empathy growing", stage: "growing" },
    ];
  }
  // 208-260 weeks (4-5 years)
  if (ageInWeeks < 260) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Hopping, skipping", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Writing name", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Complex sentences", stage: "confident" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Making friends", stage: "confident" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Letters, numbers", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Self-regulation", stage: "growing" },
    ];
  }
  // 260-312 weeks (5-6 years)
  if (ageInWeeks < 312) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Sports ready", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Drawing detailed", stage: "confident" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Reading starting", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Group dynamics", stage: "growing" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Logical thinking", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Fairness matters", stage: "confident" },
    ];
  }
  // 312-364 weeks (6-7 years)
  if (ageInWeeks < 364) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Coordination refined", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Writing fluently", stage: "growing" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Reading taking off", stage: "confident" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Real friendships", stage: "confident" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Abstract concepts", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Managing feelings", stage: "growing" },
    ];
  }
  // 364-416 weeks (7-8 years)
  if (ageInWeeks < 416) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Athletic skills", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Detailed crafts", stage: "confident" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Fluent reader", stage: "confident" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Peer-focused", stage: "confident" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Strategic thinking", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Deeper empathy", stage: "confident" },
    ];
  }
  // 416-468 weeks (8-9 years)
  if (ageInWeeks < 468) {
    return [
      { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Strength growing", stage: "confident" },
      { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Precise work", stage: "confident" },
      { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Expressive writing", stage: "growing" },
      { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Social hierarchy", stage: "confident" },
      { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Critical thinking", stage: "growing" },
      { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Self-awareness", stage: "confident" },
    ];
  }
  // 468-520 weeks (9-10 years)
  return [
    { domain: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Body changing", stage: "growing" },
    { domain: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Complex skills", stage: "confident" },
    { domain: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Abstract language", stage: "confident" },
    { domain: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Identity forming", stage: "growing" },
    { domain: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Independent learner", stage: "confident" },
    { domain: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Navigating complexity", stage: "growing" },
  ];
};

const getStageOpacity = (stage: string): string => {
  switch (stage) {
    case "emerging": return "opacity-50";
    case "growing": return "opacity-75";
    case "confident": return "opacity-100";
    default: return "opacity-60";
  }
};

export const DevelopmentTable = ({ ageInWeeks, birthday }: DevelopmentTableProps) => {
  const domains = getDomainData(ageInWeeks);
  const sunSign = birthday ? getSunSign(birthday) : null;
  const chineseZodiac = birthday ? getChineseZodiac(birthday) : null;

  return (
    <div className="mx-5 mt-6">
      {/* Zodiac header */}
      {birthday && (
        <div className="flex items-center justify-center gap-6 mb-4">
          {sunSign && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wide">{sunSign.symbol} {sunSign.sign}</span>
            </div>
          )}
          {chineseZodiac && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wide">{chineseZodiac.symbol} {chineseZodiac.animal}</span>
            </div>
          )}
        </div>
      )}

      {/* 6-domain mosaic grid */}
      <div className="grid grid-cols-2 gap-px bg-border/30 border border-border/40 rounded-sm overflow-hidden">
        {domains.map((domain, index) => (
          <div 
            key={domain.domain}
            className={`bg-background/80 p-4 ${getStageOpacity(domain.stage)}`}
          >
            {/* Domain icon and label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-muted-foreground">{domain.icon}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {domain.label}
              </span>
            </div>
            
            {/* Phrase */}
            <p className="text-sm font-medium text-foreground leading-tight">
              {domain.phrase}
            </p>
            
            {/* Stage indicator */}
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70 mt-1.5 italic">
              {domain.stage}
            </p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-foreground/50"></div>
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground">emerging</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-foreground/75"></div>
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground">growing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-foreground"></div>
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground">confident</span>
        </div>
      </div>
    </div>
  );
};