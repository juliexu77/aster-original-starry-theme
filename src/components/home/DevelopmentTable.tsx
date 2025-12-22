import { Moon, Sun, Sparkles, Heart, Hand, MessageCircle, Eye, Footprints, Brain, Users } from "lucide-react";

interface DevelopmentTableProps {
  ageInWeeks: number;
}

interface TraitRow {
  phrase: string;
  domain: string;
  domainSymbol: React.ReactNode;
  stage?: string; // "emerging" | "growing" | "confident"
}

const getTraitRows = (ageInWeeks: number): TraitRow[] => {
  // 0-4 weeks: Fourth trimester
  if (ageInWeeks < 4) {
    return [
      { phrase: "Sleeping often", domain: "REST", domainSymbol: <Moon className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Watching faces", domain: "EYES", domainSymbol: <Eye className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Seeking comfort", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" /> },
      { phrase: "Reflexes guiding", domain: "BODY", domainSymbol: <Hand className="w-3 h-3" />, stage: "emerging" },
    ];
  }
  // 4-8 weeks: Emerging awareness
  if (ageInWeeks < 8) {
    return [
      { phrase: "Napping in bursts", domain: "REST", domainSymbol: <Moon className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Tracking movement", domain: "EYES", domainSymbol: <Eye className="w-3 h-3" /> },
      { phrase: "Cooing softly", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Lifting head", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" /> },
    ];
  }
  // 8-12 weeks: Social awakening
  if (ageInWeeks < 12) {
    return [
      { phrase: "Sleep settling", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Smiling back", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Hands meeting", domain: "BODY", domainSymbol: <Hand className="w-3 h-3" />, stage: "growing" },
      { phrase: "Noticing more", domain: "EYES", domainSymbol: <Eye className="w-3 h-3" /> },
    ];
  }
  // 12-16 weeks: Active engagement
  if (ageInWeeks < 16) {
    return [
      { phrase: "Rhythm forming", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Laughing sometimes", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
      { phrase: "Reaching out", domain: "BODY", domainSymbol: <Hand className="w-3 h-3" />, stage: "growing" },
      { phrase: "Babbling away", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" /> },
    ];
  }
  // 16-26 weeks (4-6 months): Physical exploration
  if (ageInWeeks < 26) {
    return [
      { phrase: "Three naps daily", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Rolling over", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Knowing faces", domain: "HEART", domainSymbol: <Eye className="w-3 h-3" /> },
      { phrase: "Curious about all", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" />, stage: "growing" },
    ];
  }
  // 26-39 weeks (6-9 months): Sitting & attachment
  if (ageInWeeks < 39) {
    return [
      { phrase: "Two naps now", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Sitting steady", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "growing" },
      { phrase: "Chattering often", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" /> },
      { phrase: "Attached deeply", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
    ];
  }
  // 39-52 weeks (9-12 months): Mobility emerging
  if (ageInWeeks < 52) {
    return [
      { phrase: "Two naps still", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Cruising around", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "growing" },
      { phrase: "Understanding words", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "growing" },
      { phrase: "Pointing at things", domain: "BODY", domainSymbol: <Hand className="w-3 h-3" /> },
    ];
  }
  // 52-78 weeks (12-18 months): Early toddler
  if (ageInWeeks < 78) {
    return [
      { phrase: "Nap transition", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Walking more", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "emerging" },
      { phrase: "First words coming", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Testing limits", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 78-104 weeks (18-24 months): Toddler independence
  if (ageInWeeks < 104) {
    return [
      { phrase: "One nap daily", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Climbing everything", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "growing" },
      { phrase: "Words piling up", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "growing" },
      { phrase: "Copying others", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 104-130 weeks (24-30 months): Language explosion
  if (ageInWeeks < 130) {
    return [
      { phrase: "Napping well", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Running freely", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "confident" },
      { phrase: "Sentences forming", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "growing" },
      { phrase: "Pretend play starting", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 130-156 weeks (30-36 months): Preschool readiness
  if (ageInWeeks < 156) {
    return [
      { phrase: "May skip naps", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Jumping and balancing", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "confident" },
      { phrase: "Telling stories", domain: "VOICE", domainSymbol: <MessageCircle className="w-3 h-3" />, stage: "confident" },
      { phrase: "Imagination rich", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 156-208 weeks (3-4 years): Early preschool
  if (ageInWeeks < 208) {
    return [
      { phrase: "Quiet time works", domain: "REST", domainSymbol: <Moon className="w-3 h-3" /> },
      { phrase: "Moving with purpose", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "confident" },
      { phrase: "Asking endless questions", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "growing" },
      { phrase: "Playing with others", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "emerging" },
    ];
  }
  // 208-260 weeks (4-5 years): Late preschool
  if (ageInWeeks < 260) {
    return [
      { phrase: "Energy all day", domain: "BODY", domainSymbol: <Footprints className="w-3 h-3" />, stage: "confident" },
      { phrase: "Making up games", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" />, stage: "confident" },
      { phrase: "Negotiating often", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "growing" },
      { phrase: "Learning letters", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "emerging" },
    ];
  }
  // 260-312 weeks (5-6 years): Kindergarten age
  if (ageInWeeks < 312) {
    return [
      { phrase: "Ready to learn", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "growing" },
      { phrase: "Making friends", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "growing" },
      { phrase: "Following rules", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "emerging" },
      { phrase: "Becoming independent", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 312-364 weeks (6-7 years): Early elementary
  if (ageInWeeks < 364) {
    return [
      { phrase: "Reading emerging", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "growing" },
      { phrase: "Team play growing", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "growing" },
      { phrase: "Understanding fairness", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
      { phrase: "Building skills", domain: "BODY", domainSymbol: <Hand className="w-3 h-3" /> },
    ];
  }
  // 364-416 weeks (7-8 years)
  if (ageInWeeks < 416) {
    return [
      { phrase: "Reading fluently", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "confident" },
      { phrase: "Friendships deepening", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "confident" },
      { phrase: "Handling emotions", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
      { phrase: "Developing interests", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 416-468 weeks (8-9 years)
  if (ageInWeeks < 468) {
    return [
      { phrase: "Thinking critically", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "growing" },
      { phrase: "Peer-focused now", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "confident" },
      { phrase: "Showing empathy", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
      { phrase: "Pursuing hobbies", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 468-520 weeks (9-10 years)
  return [
    { phrase: "Abstract thinking", domain: "MIND", domainSymbol: <Brain className="w-3 h-3" />, stage: "growing" },
    { phrase: "Strong friendships", domain: "SOCIAL", domainSymbol: <Users className="w-3 h-3" />, stage: "confident" },
    { phrase: "Values forming", domain: "HEART", domainSymbol: <Heart className="w-3 h-3" />, stage: "growing" },
    { phrase: "Identity emerging", domain: "SPARK", domainSymbol: <Sparkles className="w-3 h-3" />, stage: "emerging" },
  ];
};

export const DevelopmentTable = ({ ageInWeeks }: DevelopmentTableProps) => {
  const rows = getTraitRows(ageInWeeks);

  return (
    <div className="mx-5 mt-6">
      {/* Table container with border */}
      <div className="relative border border-border/40 rounded-sm">
        {/* Vertical TRAITS label on left */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center">
          <span 
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Traits
          </span>
        </div>

        {/* Vertical PHASE label on right */}
        <div className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center">
          <span 
            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium"
            style={{ writingMode: 'vertical-rl' }}
          >
            Phase
          </span>
        </div>

        {/* Main table content */}
        <div className="mx-6">
          {rows.map((row, index) => (
            <div 
              key={index} 
              className={`flex items-center py-3 ${
                index !== rows.length - 1 ? 'border-b border-border/20' : ''
              }`}
            >
              {/* Phrase (left column) */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  {row.phrase}
                </span>
              </div>

              {/* Domain with symbol (middle column) */}
              <div className="flex items-center gap-1.5 text-muted-foreground px-4">
                <span className="opacity-70">{row.domainSymbol}</span>
                <span className="text-xs uppercase tracking-wide">{row.domain}</span>
              </div>

              {/* Stage indicator (right column) - text instead of numbers */}
              <div className="w-16 text-right">
                {row.stage && (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70 italic">
                    {row.stage}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
