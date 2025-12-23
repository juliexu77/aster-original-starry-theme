import { useState } from "react";
import { Footprints, Hand, MessageCircle, Users, Brain, Heart, ChevronRight } from "lucide-react";
import { DomainDetailModal } from "./DomainDetailModal";

interface DevelopmentTableProps {
  ageInWeeks: number;
  birthday?: string;
  babyName?: string;
}

export interface DomainData {
  id: string;
  label: string;
  icon: React.ReactNode;
  phrase: string;
  status: "EMERGING" | "GROWING" | "STEADY" | "TRANSITIONING" | "CHALLENGING";
}

export const getDomainData = (ageInWeeks: number): DomainData[] => {
  // 0-4 weeks
  if (ageInWeeks < 4) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Reflexes guiding", status: "EMERGING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands fisted", status: "EMERGING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Crying to communicate", status: "EMERGING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Seeking closeness", status: "EMERGING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Drawn to faces", status: "EMERGING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Finding comfort", status: "EMERGING" },
    ];
  }
  // 4-8 weeks
  if (ageInWeeks < 8) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Lifting head", status: "EMERGING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands loosening", status: "EMERGING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Cooing softly", status: "EMERGING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Watching faces", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Tracking movement", status: "EMERGING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Calmed by voice", status: "STEADY" },
    ];
  }
  // 8-12 weeks
  if (ageInWeeks < 12) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Head steadier", status: "GROWING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Hands meeting", status: "EMERGING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Vowel sounds", status: "EMERGING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Smiling back", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Noticing patterns", status: "EMERGING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Expressing joy", status: "GROWING" },
    ];
  }
  // 12-16 weeks
  if (ageInWeeks < 16) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Rolling attempts", status: "TRANSITIONING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Reaching out", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Babbling more", status: "GROWING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Laughing often", status: "STEADY" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Cause and effect", status: "EMERGING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Showing delight", status: "STEADY" },
    ];
  }
  // 16-26 weeks (4-6 months)
  if (ageInWeeks < 26) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Rolling over", status: "GROWING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Grasping things", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Consonants coming", status: "GROWING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Knows family", status: "STEADY" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Object curiosity", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Stranger awareness", status: "TRANSITIONING" },
    ];
  }
  // 26-39 weeks (6-9 months)
  if (ageInWeeks < 39) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Sitting steady", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Pincer emerging", status: "TRANSITIONING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Ma-ma, da-da", status: "EMERGING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Attached deeply", status: "STEADY" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Object permanence", status: "EMERGING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Separation feelings", status: "CHALLENGING" },
    ];
  }
  // 39-52 weeks (9-12 months)
  if (ageInWeeks < 52) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Cruising around", status: "TRANSITIONING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Pincer grip", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Understanding words", status: "GROWING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Waving, pointing", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Problem solving", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Testing reactions", status: "TRANSITIONING" },
    ];
  }
  // 52-78 weeks (12-18 months)
  if (ageInWeeks < 78) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Walking more", status: "TRANSITIONING" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Stacking, placing", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "First words", status: "EMERGING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Parallel play", status: "EMERGING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Exploring everything", status: "STEADY" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Big feelings arise", status: "CHALLENGING" },
    ];
  }
  // 78-104 weeks (18-24 months)
  if (ageInWeeks < 104) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Running, climbing", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Scribbling away", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Words piling up", status: "GROWING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Copying others", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Sorting, matching", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Asserting will", status: "CHALLENGING" },
    ];
  }
  // 104-156 weeks (2-3 years)
  if (ageInWeeks < 156) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Jumping, balancing", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Using utensils", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Sentences forming", status: "GROWING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Taking turns", status: "TRANSITIONING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Asking why", status: "STEADY" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Naming feelings", status: "GROWING" },
    ];
  }
  // 156-208 weeks (3-4 years)
  if (ageInWeeks < 208) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Running freely", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Cutting, drawing", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Storytelling", status: "STEADY" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Cooperative play", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Counting, sorting", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Empathy growing", status: "TRANSITIONING" },
    ];
  }
  // 208-312 weeks (4-6 years)
  if (ageInWeeks < 312) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Sports ready", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Writing emerging", status: "TRANSITIONING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Reading starting", status: "TRANSITIONING" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Making friends", status: "GROWING" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Logical thinking", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Fairness matters", status: "STEADY" },
    ];
  }
  // 312-416 weeks (6-8 years)
  if (ageInWeeks < 416) {
    return [
      { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Coordination refined", status: "STEADY" },
      { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Writing fluently", status: "GROWING" },
      { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Reading fluently", status: "STEADY" },
      { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Real friendships", status: "STEADY" },
      { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Strategic thinking", status: "GROWING" },
      { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Managing feelings", status: "TRANSITIONING" },
    ];
  }
  // 416-520 weeks (8-10 years)
  return [
    { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, phrase: "Body changing", status: "TRANSITIONING" },
    { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, phrase: "Complex skills", status: "STEADY" },
    { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, phrase: "Abstract language", status: "STEADY" },
    { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, phrase: "Identity forming", status: "TRANSITIONING" },
    { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, phrase: "Independent learner", status: "STEADY" },
    { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, phrase: "Navigating complexity", status: "CHALLENGING" },
  ];
};

const getStatusStyle = (status: string): string => {
  switch (status) {
    case "EMERGING": return "text-muted-foreground/60";
    case "GROWING": return "text-primary/80";
    case "STEADY": return "text-foreground/70";
    case "TRANSITIONING": return "text-amber-500/80 dark:text-amber-400/80";
    case "CHALLENGING": return "text-rose-500/70 dark:text-rose-400/70";
    default: return "text-muted-foreground";
  }
};

export const DevelopmentTable = ({ ageInWeeks, birthday, babyName }: DevelopmentTableProps) => {
  const domains = getDomainData(ageInWeeks);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const selectedDomainData = selectedDomain 
    ? domains.find(d => d.id === selectedDomain) 
    : null;

  return (
    <>
      <div className="mx-4 mt-8">
        {/* Section header */}
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] mb-4 text-center font-light">
          {babyName ? `${babyName}'s Chart` : "Today's Chart"}
        </p>

        {/* Table container with Co-Star style */}
        <div className="relative">
          {/* Vertical DOMAINS label on left */}
          <div className="absolute -left-4 top-0 bottom-0 w-4 flex items-center justify-center">
            <span 
              className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/40 font-light"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Domains
            </span>
          </div>

          {/* Vertical PHASE label on right */}
          <div className="absolute -right-4 top-0 bottom-0 w-4 flex items-center justify-center">
            <span 
              className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/40 font-light"
              style={{ writingMode: 'vertical-rl' }}
            >
              Phase
            </span>
          </div>

          {/* Main table grid */}
          <div className="border-t border-l border-border/30">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className="w-full flex items-stretch border-b border-border/30 transition-colors hover:bg-muted/20 active:bg-muted/30"
              >
                {/* Column 1: Domain phrase (left aligned) */}
                <div className="flex-1 flex items-center py-4 px-4 border-r border-border/30 min-h-[52px]">
                  <span className="text-[15px] font-normal text-foreground tracking-wide">
                    {domain.phrase}
                  </span>
                </div>

                {/* Column 2: Icon + Domain label (center) */}
                <div className="w-32 flex items-center justify-start gap-2 py-4 px-3 border-r border-border/30">
                  <span className="text-muted-foreground/60">{domain.icon}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/80 font-normal">
                    {domain.label}
                  </span>
                </div>

                {/* Column 3: Status (right aligned) */}
                <div className="w-16 flex items-center justify-end py-4 pr-3 border-r border-border/30">
                  <span className={`text-[13px] font-light tracking-wide ${getStatusStyle(domain.status)}`}>
                    {getStatusNumber(domain.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Detail Modal */}
      <DomainDetailModal
        isOpen={!!selectedDomain}
        onClose={() => setSelectedDomain(null)}
        domain={selectedDomainData}
        ageInWeeks={ageInWeeks}
        birthday={birthday}
        allDomains={domains}
        onNavigate={(id) => setSelectedDomain(id)}
      />
    </>
  );
};

// Convert status to numeric representation like Co-Star
const getStatusNumber = (status: string): string => {
  switch (status) {
    case "EMERGING": return "1";
    case "GROWING": return "2";
    case "STEADY": return "3";
    case "TRANSITIONING": return "4";
    case "CHALLENGING": return "5";
    default: return "—";
  }
};