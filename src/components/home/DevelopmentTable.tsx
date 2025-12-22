import { Moon, Sun, Sparkles, Heart, Hand, MessageCircle, Eye, Footprints } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface DevelopmentTableProps {
  ageInWeeks: number;
}

interface TraitRow {
  category: string;
  trait: string;
  icon: React.ReactNode;
  phase?: string;
}

const getTraits = (ageInWeeks: number): TraitRow[] => {
  if (ageInWeeks < 4) {
    return [
      { category: "Sleep", trait: "Catnapper", icon: <Moon className="w-3.5 h-3.5" />, phase: "1" },
      { category: "Movement", trait: "Reflexive", icon: <Hand className="w-3.5 h-3.5" />, phase: "1" },
      { category: "Social", trait: "Bonding", icon: <Heart className="w-3.5 h-3.5" />, phase: "1" },
      { category: "Senses", trait: "Awakening", icon: <Eye className="w-3.5 h-3.5" />, phase: "1" },
      { category: "Voice", trait: "Crying", icon: <MessageCircle className="w-3.5 h-3.5" /> },
      { category: "Play", trait: "Observing", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 8) {
    return [
      { category: "Sleep", trait: "Catnapper", icon: <Moon className="w-3.5 h-3.5" />, phase: "1" },
      { category: "Movement", trait: "Head lifting", icon: <Hand className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Social", trait: "First smiles", icon: <Heart className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Senses", trait: "Tracking", icon: <Eye className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Voice", trait: "Cooing", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Play", trait: "Face gazing", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 12) {
    return [
      { category: "Sleep", trait: "Consolidating", icon: <Moon className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Movement", trait: "Reaching", icon: <Hand className="w-3.5 h-3.5" />, phase: "3" },
      { category: "Social", trait: "Social smiles", icon: <Heart className="w-3.5 h-3.5" />, phase: "3" },
      { category: "Senses", trait: "Color vision", icon: <Eye className="w-3.5 h-3.5" />, phase: "3" },
      { category: "Voice", trait: "Vowel sounds", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "3" },
      { category: "Play", trait: "Batting", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 16) {
    return [
      { category: "Sleep", trait: "Rhythm forming", icon: <Moon className="w-3.5 h-3.5" />, phase: "2" },
      { category: "Movement", trait: "Grasping", icon: <Hand className="w-3.5 h-3.5" />, phase: "4" },
      { category: "Social", trait: "Laughing", icon: <Heart className="w-3.5 h-3.5" />, phase: "4" },
      { category: "Senses", trait: "Depth aware", icon: <Eye className="w-3.5 h-3.5" />, phase: "4" },
      { category: "Voice", trait: "Babbling", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "4" },
      { category: "Play", trait: "Mouthing", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 26) {
    return [
      { category: "Sleep", trait: "3 nap rhythm", icon: <Moon className="w-3.5 h-3.5" />, phase: "3" },
      { category: "Movement", trait: "Rolling", icon: <Footprints className="w-3.5 h-3.5" />, phase: "5" },
      { category: "Social", trait: "Stranger aware", icon: <Heart className="w-3.5 h-3.5" />, phase: "5" },
      { category: "Senses", trait: "Full color", icon: <Eye className="w-3.5 h-3.5" />, phase: "5" },
      { category: "Voice", trait: "Consonants", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "5" },
      { category: "Play", trait: "Exploring", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 39) {
    return [
      { category: "Sleep", trait: "2–3 naps", icon: <Moon className="w-3.5 h-3.5" />, phase: "4" },
      { category: "Movement", trait: "Sitting", icon: <Footprints className="w-3.5 h-3.5" />, phase: "6" },
      { category: "Social", trait: "Attachment", icon: <Heart className="w-3.5 h-3.5" />, phase: "6" },
      { category: "Senses", trait: "Object permanence", icon: <Eye className="w-3.5 h-3.5" />, phase: "6" },
      { category: "Voice", trait: "Mama/Dada", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "6" },
      { category: "Play", trait: "Cause & effect", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  if (ageInWeeks < 52) {
    return [
      { category: "Sleep", trait: "2 nap rhythm", icon: <Moon className="w-3.5 h-3.5" />, phase: "5" },
      { category: "Movement", trait: "Cruising", icon: <Footprints className="w-3.5 h-3.5" />, phase: "7" },
      { category: "Social", trait: "Waving", icon: <Heart className="w-3.5 h-3.5" />, phase: "7" },
      { category: "Senses", trait: "Full vision", icon: <Eye className="w-3.5 h-3.5" />, phase: "7" },
      { category: "Voice", trait: "First words", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "7" },
      { category: "Play", trait: "Imitation", icon: <Sparkles className="w-3.5 h-3.5" /> },
    ];
  }
  return [
    { category: "Sleep", trait: "1–2 naps", icon: <Moon className="w-3.5 h-3.5" />, phase: "6" },
    { category: "Movement", trait: "Walking", icon: <Footprints className="w-3.5 h-3.5" />, phase: "8" },
    { category: "Social", trait: "Empathy emerging", icon: <Heart className="w-3.5 h-3.5" />, phase: "8" },
    { category: "Senses", trait: "Adult-like", icon: <Eye className="w-3.5 h-3.5" />, phase: "8" },
    { category: "Voice", trait: "Word combining", icon: <MessageCircle className="w-3.5 h-3.5" />, phase: "8" },
    { category: "Play", trait: "Pretend play", icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];
};

export const DevelopmentTable = ({ ageInWeeks }: DevelopmentTableProps) => {
  const traits = getTraits(ageInWeeks);

  return (
    <GlassCard className="mx-5 overflow-hidden">
      {/* Header row mimicking the astrology app's TABLE / CIRCLE toggle */}
      <div className="flex justify-center gap-4 py-3 border-b border-border/30">
        <span className="text-xs font-medium text-foreground uppercase tracking-wide">
          Profile
        </span>
        <span className="text-xs text-muted-foreground/50 uppercase tracking-wide">
          |
        </span>
        <span className="text-xs text-muted-foreground/50 uppercase tracking-wide">
          Timeline
        </span>
      </div>

      {/* Table structure */}
      <div className="relative">
        {/* Vertical labels - like "SIGNS" and "HOUSES" in the reference */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center border-r border-border/20">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest writing-mode-vertical rotate-180"
                style={{ writingMode: 'vertical-rl' }}>
            Traits
          </span>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center border-l border-border/20">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest"
                style={{ writingMode: 'vertical-rl' }}>
            Phase
          </span>
        </div>

        {/* Main table content */}
        <div className="mx-6">
          {traits.map((row, index) => (
            <div 
              key={row.category}
              className={`flex items-center py-2.5 ${
                index !== traits.length - 1 ? 'border-b border-border/10' : ''
              }`}
            >
              {/* Category */}
              <div className="w-24 shrink-0">
                <span className="text-sm text-foreground font-medium">
                  {row.category}
                </span>
              </div>
              
              {/* Icon + Trait */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-muted-foreground">{row.icon}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {row.trait}
                </span>
              </div>
              
              {/* Phase number */}
              <div className="w-8 text-right">
                {row.phase && (
                  <span className="text-lg font-light text-foreground/80">
                    {row.phase}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 py-3 border-t border-border/30 bg-muted/5">
        <p className="text-[10px] text-muted-foreground/60 text-center italic">
          Every baby develops uniquely — these are gentle signposts, not milestones to hit.
        </p>
      </div>
    </GlassCard>
  );
};
