import { Moon, Sun, Sparkles, Heart, Hand, MessageCircle, Eye, Footprints } from "lucide-react";

interface DevelopmentTableProps {
  ageInWeeks: number;
}

interface TraitRow {
  sign: string;
  planet: string;
  planetSymbol: React.ReactNode;
  house?: number;
}

const getTraitRows = (ageInWeeks: number): TraitRow[] => {
  // 0-4 weeks: Fourth trimester
  if (ageInWeeks < 4) {
    return [
      { sign: "Dreamer", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" />, house: 1 },
      { sign: "Watcher", planet: "EYES", planetSymbol: <Eye className="w-3 h-3" />, house: 2 },
      { sign: "Seeker", planet: "HEART", planetSymbol: <Heart className="w-3 h-3" /> },
      { sign: "Reflex", planet: "HANDS", planetSymbol: <Hand className="w-3 h-3" />, house: 3 },
    ];
  }
  // 4-8 weeks: Emerging awareness
  if (ageInWeeks < 8) {
    return [
      { sign: "Catnapper", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" />, house: 1 },
      { sign: "Tracker", planet: "EYES", planetSymbol: <Eye className="w-3 h-3" /> },
      { sign: "Coo-er", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Lifter", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" /> },
    ];
  }
  // 8-12 weeks: Social awakening
  if (ageInWeeks < 12) {
    return [
      { sign: "Consolidator", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Smiler", planet: "HEART", planetSymbol: <Heart className="w-3 h-3" />, house: 1 },
      { sign: "Finder", planet: "HANDS", planetSymbol: <Hand className="w-3 h-3" />, house: 2 },
      { sign: "Noticer", planet: "EYES", planetSymbol: <Eye className="w-3 h-3" /> },
    ];
  }
  // 12-16 weeks: Active engagement
  if (ageInWeeks < 16) {
    return [
      { sign: "Steady", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Laugher", planet: "HEART", planetSymbol: <Heart className="w-3 h-3" />, house: 1 },
      { sign: "Reacher", planet: "HANDS", planetSymbol: <Hand className="w-3 h-3" />, house: 2 },
      { sign: "Babbler", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" /> },
    ];
  }
  // 16-26 weeks (4-6 months): Physical exploration
  if (ageInWeeks < 26) {
    return [
      { sign: "Three-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Roller", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Knower", planet: "EYES", planetSymbol: <Eye className="w-3 h-3" /> },
      { sign: "Curious", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" />, house: 2 },
    ];
  }
  // 26-39 weeks (6-9 months): Sitting & attachment
  if (ageInWeeks < 39) {
    return [
      { sign: "Two-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Sitter", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Chatter", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" /> },
      { sign: "Attached", planet: "HEART", planetSymbol: <Heart className="w-3 h-3" />, house: 2 },
    ];
  }
  // 39-52 weeks (9-12 months): Mobility emerging
  if (ageInWeeks < 52) {
    return [
      { sign: "Two-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Cruiser", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Understander", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Pointer", planet: "HANDS", planetSymbol: <Hand className="w-3 h-3" /> },
    ];
  }
  // 52-78 weeks (12-18 months): Early toddler
  if (ageInWeeks < 78) {
    return [
      { sign: "Transitioning", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Walker", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "First-words", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Tester", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 78-104 weeks (18-24 months): Toddler independence
  if (ageInWeeks < 104) {
    return [
      { sign: "One-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Climber", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Word-collector", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Imitator", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 104-130 weeks (24-30 months): Language explosion
  if (ageInWeeks < 130) {
    return [
      { sign: "Steady-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Runner", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Phrase-maker", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Pretender", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 130-156 weeks (30-36 months): Preschool readiness
  if (ageInWeeks < 156) {
    return [
      { sign: "May-skip-nap", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
      { sign: "Jumper", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
      { sign: "Storyteller", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
      { sign: "Imaginer", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" /> },
    ];
  }
  // 3+ years
  return [
    { sign: "Quiet-time", planet: "SLEEP", planetSymbol: <Moon className="w-3 h-3" /> },
    { sign: "Adventurer", planet: "BODY", planetSymbol: <Footprints className="w-3 h-3" />, house: 1 },
    { sign: "Questioner", planet: "VOICE", planetSymbol: <MessageCircle className="w-3 h-3" />, house: 2 },
    { sign: "Creator", planet: "SPARK", planetSymbol: <Sparkles className="w-3 h-3" /> },
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
              {/* Sign name (left column) */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  {row.sign}
                </span>
              </div>

              {/* Planet with symbol (middle column) */}
              <div className="flex items-center gap-1.5 text-muted-foreground px-4">
                <span className="opacity-70">{row.planetSymbol}</span>
                <span className="text-xs uppercase tracking-wide">{row.planet}</span>
              </div>

              {/* House number (right column) - only show if present */}
              <div className="w-8 text-right">
                {row.house && (
                  <span className="text-lg font-light text-foreground">
                    {row.house}
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
