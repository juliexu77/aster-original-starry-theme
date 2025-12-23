import { useState } from "react";
import { Footprints, Hand, MessageCircle, Users, Brain, Heart, ArrowRight } from "lucide-react";
import { DomainDetailModal } from "./DomainDetailModal";

interface DevelopmentTableProps {
  ageInWeeks: number;
  birthday?: string;
  babyName?: string;
}

// Stage data structure
export interface StageInfo {
  stage: number;
  name: string;
  ageRangeWeeks: [number, number]; // [min, max] in weeks
  description: string;
}

export interface DomainData {
  id: string;
  label: string;
  icon: React.ReactNode;
  currentStage: number;
  stageName: string;
  stageDescription: string;
  isEmerging: boolean;
  totalStages: number;
}

// Complete stage progressions (ages 0-5 years)
const PHYSICAL_STAGES: StageInfo[] = [
  { stage: 1, name: "Head Control", ageRangeWeeks: [0, 13], description: "Lifts head during tummy time, beginning to push up on arms, gains neck strength" },
  { stage: 2, name: "Rolling", ageRangeWeeks: [13, 22], description: "Rolls from tummy to back, then back to tummy, pivots in circles" },
  { stage: 3, name: "Sitting", ageRangeWeeks: [22, 30], description: "Sits independently without support, stable and can pivot to reach toys" },
  { stage: 4, name: "Crawling", ageRangeWeeks: [30, 43], description: "Moves forward on hands and knees, may army crawl or scoot first" },
  { stage: 5, name: "Pulling to Stand", ageRangeWeeks: [35, 43], description: "Pulls up on furniture, stands while holding on, bounces" },
  { stage: 6, name: "Cruising", ageRangeWeeks: [39, 52], description: "Walks sideways while holding furniture, gains confidence" },
  { stage: 7, name: "Walking", ageRangeWeeks: [43, 65], description: "Takes independent steps, walks without support, falls often" },
  { stage: 8, name: "Running", ageRangeWeeks: [65, 104], description: "Runs with improving coordination, climbs stairs with support" },
  { stage: 9, name: "Jumping", ageRangeWeeks: [104, 156], description: "Jumps with both feet, kicks ball, rides tricycle" },
  { stage: 10, name: "Coordination", ageRangeWeeks: [156, 208], description: "Hops on one foot, catches ball, increasing agility" },
  { stage: 11, name: "Advanced Movement", ageRangeWeeks: [208, 260], description: "Skips, climbs confidently, complex physical play" },
];

const FINE_MOTOR_STAGES: StageInfo[] = [
  { stage: 1, name: "Reflexive Grasp", ageRangeWeeks: [0, 9], description: "Automatic hand closing when palm is touched, brings hands to mouth" },
  { stage: 2, name: "Reaching", ageRangeWeeks: [9, 17], description: "Swipes at and bats hanging objects, discovers hands" },
  { stage: 3, name: "Palmar Grasp", ageRangeWeeks: [17, 26], description: "Rakes objects into palm using whole hand, holds bottle" },
  { stage: 4, name: "Transferring", ageRangeWeeks: [26, 35], description: "Passes objects from hand to hand, bangs objects together" },
  { stage: 5, name: "Pincer Grasp", ageRangeWeeks: [35, 43], description: "Picks up small objects with thumb and forefinger" },
  { stage: 6, name: "Self-Feeding", ageRangeWeeks: [43, 61], description: "Uses pincer grasp to feed self finger foods, holds spoon" },
  { stage: 7, name: "Stacking", ageRangeWeeks: [52, 78], description: "Places objects on top of each other, scribbles with crayon" },
  { stage: 8, name: "Turning Pages", ageRangeWeeks: [78, 104], description: "Turns pages in books, removes lids, simple puzzles" },
  { stage: 9, name: "Drawing Shapes", ageRangeWeeks: [104, 156], description: "Draws circles and lines, uses scissors, strings beads" },
  { stage: 10, name: "Pre-Writing", ageRangeWeeks: [156, 208], description: "Copies shapes, traces letters, improving pencil control" },
  { stage: 11, name: "Writing Readiness", ageRangeWeeks: [208, 260], description: "Writes some letters and numbers, draws recognizable pictures, colors within lines" },
];

const LANGUAGE_STAGES: StageInfo[] = [
  { stage: 1, name: "Cooing", ageRangeWeeks: [0, 13], description: "Makes vowel sounds: 'ooh,' 'aah,' responds to voices" },
  { stage: 2, name: "Laughing", ageRangeWeeks: [13, 22], description: "Social laughter, vocal play, squealing, experimenting with sounds" },
  { stage: 3, name: "Babbling", ageRangeWeeks: [26, 39], description: "Repetitive consonant sounds: 'ba-ba,' 'da-da' (no meaning yet), intonation changes" },
  { stage: 4, name: "First Words", ageRangeWeeks: [39, 61], description: "'Mama,' 'dada' used with meaning, 1-5 words, understands simple commands" },
  { stage: 5, name: "Word Explosion", ageRangeWeeks: [52, 78], description: "Vocabulary grows to 10-50 words, points and names objects, simple gestures" },
  { stage: 6, name: "Two-Word Phrases", ageRangeWeeks: [78, 104], description: "Combines words: 'more milk,' 'bye-bye dog,' 50-200 words" },
  { stage: 7, name: "Simple Sentences", ageRangeWeeks: [104, 156], description: "3-4 word sentences, asks questions, 200-1000 words" },
  { stage: 8, name: "Complex Sentences", ageRangeWeeks: [156, 208], description: "Tells stories, uses pronouns correctly, asks 'why' constantly" },
  { stage: 9, name: "Conversational", ageRangeWeeks: [208, 260], description: "Clear speech, complex grammar, vocabulary 1500+ words, sustained conversations" },
];

const SOCIAL_STAGES: StageInfo[] = [
  { stage: 1, name: "Social Smile", ageRangeWeeks: [0, 13], description: "Smiles in response to faces and voices, beginning social engagement" },
  { stage: 2, name: "Recognizing Caregivers", ageRangeWeeks: [13, 26], description: "Shows preference for familiar people, excited to see parents" },
  { stage: 3, name: "Stranger Awareness", ageRangeWeeks: [26, 39], description: "Becomes wary of unfamiliar people, clings to caregivers" },
  { stage: 4, name: "Attachment Behaviors", ageRangeWeeks: [30, 52], description: "Strong attachment to primary caregivers, separation protest, social referencing" },
  { stage: 5, name: "Joint Attention", ageRangeWeeks: [43, 61], description: "Points to show things, follows others' gaze, shares interests" },
  { stage: 6, name: "Parallel Play", ageRangeWeeks: [52, 78], description: "Plays alongside other children without direct interaction, observes peers" },
  { stage: 7, name: "Imitation", ageRangeWeeks: [78, 104], description: "Copies others' actions, helps with simple tasks, beginning empathy" },
  { stage: 8, name: "Interactive Play", ageRangeWeeks: [104, 156], description: "Plays with other children, shares toys (sometimes), turn-taking emerging" },
  { stage: 9, name: "Cooperative Play", ageRangeWeeks: [156, 208], description: "Plays games with rules, has friends, role-playing" },
  { stage: 10, name: "Friendship", ageRangeWeeks: [208, 260], description: "Forms friendships, understands social rules, negotiates with peers" },
];

const COGNITIVE_STAGES: StageInfo[] = [
  { stage: 1, name: "Tracking", ageRangeWeeks: [0, 13], description: "Follows moving objects with eyes, focuses on faces" },
  { stage: 2, name: "Cause & Effect", ageRangeWeeks: [13, 26], description: "Repeats actions to make things happen (shaking rattle), explores with mouth" },
  { stage: 3, name: "Object Permanence", ageRangeWeeks: [26, 43], description: "Understands objects exist when out of sight, searches for hidden toys" },
  { stage: 4, name: "Problem Solving", ageRangeWeeks: [39, 61], description: "Figures out how to overcome obstacles to reach goals, experiments" },
  { stage: 5, name: "Tool Use", ageRangeWeeks: [52, 78], description: "Uses objects as tools (pulls blanket to get toy), understands container concepts" },
  { stage: 6, name: "Symbolic Thinking", ageRangeWeeks: [78, 104], description: "Pretend play begins, understands one thing can represent another" },
  { stage: 7, name: "Sorting & Matching", ageRangeWeeks: [104, 156], description: "Categorizes objects by color/shape, completes puzzles, understands 'big' and 'small'" },
  { stage: 8, name: "Counting & Numbers", ageRangeWeeks: [156, 208], description: "Counts to 10, understands quantity, recognizes colors consistently" },
  { stage: 9, name: "Pre-Academic", ageRangeWeeks: [208, 260], description: "Recognizes letters, counts to 20+, understands time concepts, logical reasoning" },
];

const EMOTIONAL_STAGES: StageInfo[] = [
  { stage: 1, name: "Basic Emotions", ageRangeWeeks: [0, 13], description: "Shows contentment, distress, interest through facial expressions and crying" },
  { stage: 2, name: "Social Emotions", ageRangeWeeks: [13, 26], description: "Expresses joy, surprise, frustration clearly, laughs and squeals" },
  { stage: 3, name: "Separation Awareness", ageRangeWeeks: [26, 43], description: "Anxiety when separated from caregivers, distressed by unfamiliar situations" },
  { stage: 4, name: "Emotional Communication", ageRangeWeeks: [39, 61], description: "Shows emotions clearly, seeks comfort when distressed, social referencing" },
  { stage: 5, name: "Self-Soothing Beginning", ageRangeWeeks: [52, 78], description: "Starting to regulate emotions, finds comfort objects, can sometimes calm down" },
  { stage: 6, name: "Tantrums", ageRangeWeeks: [78, 104], description: "Big emotions with limited regulation, frustration at inability to communicate or do things independently" },
  { stage: 7, name: "Emotional Expression", ageRangeWeeks: [104, 156], description: "Names basic emotions ('happy,' 'sad'), expresses feelings with words, empathy emerging" },
  { stage: 8, name: "Self-Regulation", ageRangeWeeks: [156, 208], description: "Better emotional control, uses strategies to calm down, understands others' feelings" },
  { stage: 9, name: "Complex Emotions", ageRangeWeeks: [208, 260], description: "Shows embarrassment, pride, shame, guilt, negotiates and compromises, emotional awareness" },
];

// Get stages for a domain
export const getStagesForDomain = (domainId: string): StageInfo[] => {
  switch (domainId) {
    case "physical": return PHYSICAL_STAGES;
    case "fine_motor": return FINE_MOTOR_STAGES;
    case "language": return LANGUAGE_STAGES;
    case "social": return SOCIAL_STAGES;
    case "cognitive": return COGNITIVE_STAGES;
    case "emotional": return EMOTIONAL_STAGES;
    default: return [];
  }
};

// Calculate current stage based on age
const calculateStage = (stages: StageInfo[], ageInWeeks: number): { stage: number; stageName: string; description: string; isEmerging: boolean } => {
  // Find the current or most recent stage
  for (let i = stages.length - 1; i >= 0; i--) {
    const stage = stages[i];
    const [minAge, maxAge] = stage.ageRangeWeeks;
    
    // If age is within range or past it
    if (ageInWeeks >= minAge) {
      // Check if they're in the transition to next stage
      const isEmerging = i < stages.length - 1 && ageInWeeks >= maxAge - 4;
      
      return {
        stage: stage.stage,
        stageName: stage.name,
        description: stage.description,
        isEmerging,
      };
    }
  }
  
  // Default to first stage
  return {
    stage: 1,
    stageName: stages[0].name,
    description: stages[0].description,
    isEmerging: false,
  };
};

// Get domain data with stage calculations
export const getDomainData = (ageInWeeks: number): DomainData[] => {
  const domains = [
    { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-4 h-4" />, stages: PHYSICAL_STAGES },
    { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-4 h-4" />, stages: FINE_MOTOR_STAGES },
    { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-4 h-4" />, stages: LANGUAGE_STAGES },
    { id: "social", label: "SOCIAL", icon: <Users className="w-4 h-4" />, stages: SOCIAL_STAGES },
    { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-4 h-4" />, stages: COGNITIVE_STAGES },
    { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-4 h-4" />, stages: EMOTIONAL_STAGES },
  ];

  return domains.map(domain => {
    const stageInfo = calculateStage(domain.stages, ageInWeeks);
    return {
      id: domain.id,
      label: domain.label,
      icon: domain.icon,
      currentStage: stageInfo.stage,
      stageName: stageInfo.stageName,
      stageDescription: stageInfo.description,
      isEmerging: stageInfo.isEmerging,
      totalStages: domain.stages.length,
    };
  });
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
          {babyName ? `${babyName}'s Development` : "Development"}
        </p>

        {/* Table container */}
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

          {/* Vertical STAGE label on right */}
          <div className="absolute -right-4 top-0 bottom-0 w-4 flex items-center justify-center">
            <span 
              className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/40 font-light"
              style={{ writingMode: 'vertical-rl' }}
            >
              Stage
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
                {/* Column 1: Icon + Domain label (left) */}
                <div className="w-28 flex items-center gap-2 py-4 px-3 border-r border-border/30">
                  <span className="text-muted-foreground/60">{domain.icon}</span>
                  <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/80 font-normal">
                    {domain.label}
                  </span>
                </div>

                {/* Column 2: Stage name/description (middle) */}
                <div className="flex-1 flex items-center py-4 px-4 border-r border-border/30 min-h-[52px]">
                  <span className="text-[14px] font-normal text-foreground tracking-wide">
                    {domain.stageName}
                    {domain.isEmerging && (
                      <span className="text-muted-foreground/60 ml-1 text-[12px]">emerging</span>
                    )}
                  </span>
                </div>

                {/* Column 3: Stage number with arrow (right) */}
                <div className="w-16 flex items-center justify-end gap-1.5 py-4 pr-3 border-r border-border/30">
                  <span className="text-[14px] font-light tracking-wide text-foreground/80">
                    {domain.currentStage}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
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
