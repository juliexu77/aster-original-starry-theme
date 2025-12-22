import { Moon, Sun, Sparkles, Heart, Hand, MessageCircle, Eye, Footprints } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TraitsCardProps {
  ageInWeeks: number;
}

interface Trait {
  icon: React.ReactNode;
  label: string;
}

const getTraits = (ageInWeeks: number): Trait[] => {
  if (ageInWeeks < 4) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "Sleeping in short stretches" },
      { icon: <Eye className="w-3.5 h-3.5" />, label: "Focusing on close faces" },
      { icon: <Heart className="w-3.5 h-3.5" />, label: "Seeking warmth and closeness" },
      { icon: <Hand className="w-3.5 h-3.5" />, label: "Reflexive movements" },
    ];
  }
  if (ageInWeeks < 8) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "Many short naps" },
      { icon: <Eye className="w-3.5 h-3.5" />, label: "Following movement with eyes" },
      { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Beginning to coo" },
      { icon: <Hand className="w-3.5 h-3.5" />, label: "Lifting head briefly" },
    ];
  }
  if (ageInWeeks < 12) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "Sleep rhythm emerging" },
      { icon: <Heart className="w-3.5 h-3.5" />, label: "Social smiling" },
      { icon: <Hand className="w-3.5 h-3.5" />, label: "Hands finding each other" },
      { icon: <Eye className="w-3.5 h-3.5" />, label: "Noticing colors" },
    ];
  }
  if (ageInWeeks < 16) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "Naps becoming steadier" },
      { icon: <Heart className="w-3.5 h-3.5" />, label: "Laughing out loud" },
      { icon: <Hand className="w-3.5 h-3.5" />, label: "Reaching and grasping" },
      { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Early babbling" },
    ];
  }
  if (ageInWeeks < 26) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "Around 3 naps" },
      { icon: <Footprints className="w-3.5 h-3.5" />, label: "Rolling over" },
      { icon: <Eye className="w-3.5 h-3.5" />, label: "Recognizing familiar people" },
      { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Curious about everything" },
    ];
  }
  if (ageInWeeks < 39) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "2–3 naps" },
      { icon: <Footprints className="w-3.5 h-3.5" />, label: "Sitting and reaching" },
      { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Babbling with sounds" },
      { icon: <Heart className="w-3.5 h-3.5" />, label: "Strong attachments forming" },
    ];
  }
  if (ageInWeeks < 52) {
    return [
      { icon: <Moon className="w-3.5 h-3.5" />, label: "2 naps" },
      { icon: <Footprints className="w-3.5 h-3.5" />, label: "Crawling and cruising" },
      { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "Understanding words" },
      { icon: <Hand className="w-3.5 h-3.5" />, label: "Waving and pointing" },
    ];
  }
  return [
    { icon: <Moon className="w-3.5 h-3.5" />, label: "1–2 naps" },
    { icon: <Footprints className="w-3.5 h-3.5" />, label: "Walking and climbing" },
    { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "First words appearing" },
    { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Pretend play beginning" },
  ];
};

export const DevelopmentTable = ({ ageInWeeks }: TraitsCardProps) => {
  const traits = getTraits(ageInWeeks);

  return (
    <GlassCard className="mx-5">
      <div className="px-4 py-3 border-b border-border/30">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Right now</p>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, index) => (
            <div 
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/30 border border-border/20"
            >
              <span className="text-muted-foreground">{trait.icon}</span>
              <span className="text-xs text-foreground">{trait.label}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
