import { useState } from "react";
import { Footprints, Hand, MessageCircle, Users, Brain, Heart, ArrowRight, Moon, Utensils, ArrowUp } from "lucide-react";
import { DomainDetailModal } from "./DomainDetailModal";
import { Calibration } from "@/hooks/useCalibration";

interface DevelopmentTableProps {
  ageInWeeks: number;
  birthday?: string;
  babyName?: string;
  babyId?: string;
  calibration?: Calibration | null;
  onMilestoneConfirm?: (domainId: string, stageNumber: number, date: string) => void;
  shareSheet?: React.ReactNode;
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
  isEmergingEarly: boolean; // New: calibration-based "ahead of typical"
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

const SLEEP_STAGES: StageInfo[] = [
  { stage: 1, name: "Newborn Sleep", ageRangeWeeks: [0, 13], description: "Sleeps 14-17 hours in short bursts, wakes every 2-3 hours to feed, day/night confusion" },
  { stage: 2, name: "Longer Stretches", ageRangeWeeks: [13, 26], description: "Consolidating nighttime sleep, may sleep 6-8 hour stretches, 3-4 naps during day" },
  { stage: 3, name: "Sleep Regression", ageRangeWeeks: [26, 43], description: "Object permanence and separation anxiety disrupt sleep, wakes more frequently, 2-3 naps" },
  { stage: 4, name: "Two Naps", ageRangeWeeks: [43, 65], description: "Drops to two predictable naps (morning and afternoon), sleeps 10-12 hours at night" },
  { stage: 5, name: "One Nap Transition", ageRangeWeeks: [65, 78], description: "Transitioning from two naps to one afternoon nap, schedule can be erratic during shift" },
  { stage: 6, name: "One Nap", ageRangeWeeks: [78, 156], description: "Consistent single afternoon nap (1-3 hours), sleeps 10-12 hours at night" },
  { stage: 7, name: "Dropping Nap", ageRangeWeeks: [156, 208], description: "Some days nap, some days don't, may need quiet time instead" },
  { stage: 8, name: "No Nap", ageRangeWeeks: [208, 260], description: "Most children done napping, quiet rest time instead, sleeps 10-12 hours at night" },
];

const FEEDING_STAGES: StageInfo[] = [
  { stage: 1, name: "Exclusive Milk", ageRangeWeeks: [0, 26], description: "Breast milk or formula only, feeding every 2-4 hours, establishing rhythm" },
  { stage: 2, name: "Starting Solids", ageRangeWeeks: [26, 39], description: "Introduction to purees and soft foods, exploring textures and tastes, milk still primary nutrition" },
  { stage: 3, name: "Finger Foods", ageRangeWeeks: [39, 52], description: "Self-feeding with hands, pincer grasp for small pieces, three meals plus milk feeds" },
  { stage: 4, name: "Table Foods", ageRangeWeeks: [52, 78], description: "Eating modified family meals, using utensils with help, transitioning from bottles" },
  { stage: 5, name: "Self-Feeding", ageRangeWeeks: [78, 104], description: "Uses spoon and fork independently, drinks from open cup, asserting food preferences" },
  { stage: 6, name: "Picky Phase", ageRangeWeeks: [104, 156], description: "Common pickiness or food jags, may refuse previously liked foods, learning about hunger cues" },
  { stage: 7, name: "Expanding Palate", ageRangeWeeks: [156, 208], description: "Trying new foods more willingly, eating larger portions, developing food preferences" },
  { stage: 8, name: "Independent Eater", ageRangeWeeks: [208, 260], description: "Eats variety of foods, manages utensils well, can pour drinks, helps with meal prep" },
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
    case "sleep": return SLEEP_STAGES;
    case "feeding": return FEEDING_STAGES;
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

// Map calibration responses to stage overrides
const getCalibrationOverrides = (calibration?: Calibration | null): Record<string, { stage: number; stageName: string; description: string }> => {
  if (!calibration) return {};
  
  const overrides: Record<string, { stage: number; stageName: string; description: string }> = {};
  
  // Sleep: map nap count to stage
  if (calibration.sleepNaps) {
    switch (calibration.sleepNaps) {
      case '3+':
        overrides.sleep = { stage: 2, stageName: "Longer Stretches", description: "Consolidating nighttime sleep, 3-4 naps during day" };
        break;
      case '2':
        overrides.sleep = { stage: 4, stageName: "Two Naps", description: "Drops to two predictable naps (morning and afternoon)" };
        break;
      case '1':
        overrides.sleep = { stage: 6, stageName: "One Nap", description: "Consistent single afternoon nap (1-3 hours)" };
        break;
      case 'irregular':
        overrides.sleep = { stage: 3, stageName: "Sleep Regression", description: "Sleep patterns are shifting and unpredictable right now" };
        break;
    }
  }
  
  // Feeding: map solids progress to stage
  if (calibration.feedingSolids) {
    switch (calibration.feedingSolids) {
      case 'not_started':
        overrides.feeding = { stage: 1, stageName: "Exclusive Milk", description: "Breast milk or formula only" };
        break;
      case 'starting':
        overrides.feeding = { stage: 2, stageName: "Starting Solids", description: "Introduction to purees and soft foods" };
        break;
      case 'regular':
        overrides.feeding = { stage: 3, stageName: "Finger Foods", description: "Self-feeding with hands, three meals plus milk feeds" };
        break;
      case 'confident':
        overrides.feeding = { stage: 4, stageName: "Table Foods", description: "Eating modified family meals confidently" };
        break;
    }
  }
  
  // Physical: map highest skill to stage
  if (calibration.physicalSkills && calibration.physicalSkills.length > 0) {
    const skills = calibration.physicalSkills;
    if (skills.includes('cruise')) {
      overrides.physical = { stage: 6, stageName: "Cruising", description: "Walks sideways while holding furniture" };
    } else if (skills.includes('stand')) {
      overrides.physical = { stage: 6, stageName: "Cruising", description: "Standing independently, beginning to cruise" };
    } else if (skills.includes('pull_stand')) {
      overrides.physical = { stage: 5, stageName: "Pulling to Stand", description: "Pulls up on furniture, stands while holding on" };
    } else if (skills.includes('crawl')) {
      overrides.physical = { stage: 4, stageName: "Crawling", description: "Moves forward on hands and knees" };
    } else if (skills.includes('sit')) {
      overrides.physical = { stage: 3, stageName: "Sitting", description: "Sits independently without support" };
    }
  }
  
  // Language: map sounds to stage
  if (calibration.languageSounds) {
    switch (calibration.languageSounds) {
      case 'coos':
        overrides.language = { stage: 1, stageName: "Cooing", description: "Makes vowel sounds, responds to voices" };
        break;
      case 'babbling':
        overrides.language = { stage: 3, stageName: "Babbling", description: "Repetitive consonant sounds without meaning" };
        break;
      case 'intentional':
        overrides.language = { stage: 3, stageName: "Babbling", description: "Babbling with intentional intonation" };
        break;
      case 'words_few':
        overrides.language = { stage: 4, stageName: "First Words", description: "1-5 words used with meaning" };
        break;
      case 'words_many':
        overrides.language = { stage: 5, stageName: "Word Explosion", description: "Vocabulary growing rapidly, points and names objects" };
        break;
    }
  }
  
  // Social: map separation response to stage
  if (calibration.socialSeparation) {
    switch (calibration.socialSeparation) {
      case 'unaware':
        overrides.social = { stage: 2, stageName: "Recognizing Caregivers", description: "Shows preference for familiar people" };
        break;
      case 'calm':
        overrides.social = { stage: 2, stageName: "Recognizing Caregivers", description: "Notices caregiver leaving but remains calm" };
        break;
      case 'upset':
        overrides.social = { stage: 4, stageName: "Attachment Behaviors", description: "Strong attachment, separation protest present" };
        break;
      case 'follows':
        overrides.social = { stage: 4, stageName: "Attachment Behaviors", description: "Follows caregivers, strong attachment behaviors" };
        break;
    }
  }
  
  return overrides;
};

// Get the highest confirmed stage for a domain from emerging_early_flags
const getConfirmedStageFromFlags = (domainId: string, emergingFlags: Record<string, boolean>): number | null => {
  let highestConfirmedStage: number | null = null;
  
  // Look for flags like "physical_stage_5", "language_stage_4", etc.
  for (const [key, value] of Object.entries(emergingFlags)) {
    if (value && key.startsWith(`${domainId}_stage_`)) {
      const stageNum = parseInt(key.replace(`${domainId}_stage_`, ''), 10);
      if (!isNaN(stageNum) && (highestConfirmedStage === null || stageNum > highestConfirmedStage)) {
        highestConfirmedStage = stageNum;
      }
    }
  }
  
  return highestConfirmedStage;
};

// Get domain data with stage calculations and calibration overrides
export const getDomainData = (ageInWeeks: number, calibration?: Calibration | null): DomainData[] => {
  const domains = [
    { id: "sleep", label: "SLEEP", icon: <Moon className="w-3.5 h-3.5" />, stages: SLEEP_STAGES },
    { id: "feeding", label: "FEEDING", icon: <Utensils className="w-3.5 h-3.5" />, stages: FEEDING_STAGES },
    { id: "physical", label: "PHYSICAL", icon: <Footprints className="w-3.5 h-3.5" />, stages: PHYSICAL_STAGES },
    { id: "fine_motor", label: "FINE MOTOR", icon: <Hand className="w-3.5 h-3.5" />, stages: FINE_MOTOR_STAGES },
    { id: "language", label: "LANGUAGE", icon: <MessageCircle className="w-3.5 h-3.5" />, stages: LANGUAGE_STAGES },
    { id: "social", label: "SOCIAL", icon: <Users className="w-3.5 h-3.5" />, stages: SOCIAL_STAGES },
    { id: "cognitive", label: "COGNITIVE", icon: <Brain className="w-3.5 h-3.5" />, stages: COGNITIVE_STAGES },
    { id: "emotional", label: "EMOTIONAL", icon: <Heart className="w-3.5 h-3.5" />, stages: EMOTIONAL_STAGES },
  ];

  const overrides = getCalibrationOverrides(calibration);
  const emergingFlags = calibration?.emergingEarlyFlags || {};

  return domains.map(domain => {
    // Check if we have a calibration override for this domain
    const override = overrides[domain.id];
    
    // Check if user has confirmed a milestone stage
    const confirmedStage = getConfirmedStageFromFlags(domain.id, emergingFlags);
    
    // Get base stage info from age or override
    let baseStage: number;
    let baseStageName: string;
    let baseDescription: string;
    let isEmerging = false;
    
    if (override) {
      baseStage = override.stage;
      baseStageName = override.stageName;
      baseDescription = override.description;
    } else {
      const stageInfo = calculateStage(domain.stages, ageInWeeks);
      baseStage = stageInfo.stage;
      baseStageName = stageInfo.stageName;
      baseDescription = stageInfo.description;
      isEmerging = stageInfo.isEmerging;
    }
    
    // If user confirmed a higher stage, use that instead
    if (confirmedStage !== null && confirmedStage > baseStage) {
      const confirmedStageInfo = domain.stages.find(s => s.stage === confirmedStage);
      if (confirmedStageInfo) {
        return {
          id: domain.id,
          label: domain.label,
          icon: domain.icon,
          currentStage: confirmedStage,
          stageName: confirmedStageInfo.name,
          stageDescription: confirmedStageInfo.description,
          isEmerging: false, // Not emerging if confirmed
          isEmergingEarly: true, // Mark as ahead of typical
          totalStages: domain.stages.length,
        };
      }
    }
    
    return {
      id: domain.id,
      label: domain.label,
      icon: domain.icon,
      currentStage: baseStage,
      stageName: baseStageName,
      stageDescription: baseDescription,
      isEmerging,
      isEmergingEarly: !!emergingFlags[domain.id] || (confirmedStage !== null && confirmedStage > baseStage),
      totalStages: domain.stages.length,
    };
  });
};

export const DevelopmentTable = ({ ageInWeeks, birthday, babyName, babyId, calibration, onMilestoneConfirm, shareSheet }: DevelopmentTableProps) => {
  const domains = getDomainData(ageInWeeks, calibration);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const selectedDomainData = selectedDomain 
    ? domains.find(d => d.id === selectedDomain) 
    : null;

  return (
    <>
      <div className="px-4 mt-8">
        {/* Section header with share button */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] font-light">
            {babyName ? `${babyName}'s Development` : "Development"}
          </p>
          {shareSheet}
        </div>
        {/* Table container with side labels */}
        <div className="flex items-stretch">
          {/* Vertical DOMAINS label on left - stacked letters at top */}
          <div className="flex flex-col items-center justify-start w-4 mr-1 pt-1">
            {"DOMAINS".split("").map((letter, i) => (
              <span 
                key={i}
                className="text-[9px] text-foreground/60 font-light leading-[1.2]"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Main table grid */}
          <div className="flex-1 border-t border-l border-border/30">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className="w-full flex items-stretch border-b border-border/30 transition-colors hover:bg-muted/20 active:bg-muted/30"
              >
                {/* Column 1: Icon + Domain label (left) */}
                <div className="w-24 flex items-center gap-1.5 py-3 px-2.5 border-r border-border/30">
                  <span className="text-muted-foreground/50">{domain.icon}</span>
                  <span className="text-[8px] uppercase tracking-[0.08em] text-muted-foreground/70 font-normal">
                    {domain.label}
                  </span>
                </div>

                {/* Column 2: Stage name/description (middle) */}
                <div className="flex-1 flex items-center py-3 px-3 border-r border-border/30 min-h-[44px]">
                  <span className="text-[12px] font-normal text-foreground tracking-wide">
                    {domain.stageName}
                    {domain.isEmerging && (
                      <span className="text-muted-foreground/50 ml-1 text-[10px]">emerging</span>
                    )}
                  </span>
                </div>

                {/* Column 3: Stage number with emerging early indicator (right) */}
                <div className="w-14 flex items-center justify-end gap-1 py-3 pr-2.5 border-r border-border/30">
                  {domain.isEmergingEarly && (
                    <ArrowUp className="w-2.5 h-2.5 text-primary/70" />
                  )}
                  <span className="text-[12px] font-light tracking-wide text-foreground/70">
                    {domain.currentStage}
                  </span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                </div>
              </button>
            ))}
          </div>

          {/* Vertical STAGE label on right - stacked letters at bottom */}
          <div className="flex flex-col items-center justify-end w-4 ml-1 pb-1">
            {"STAGE".split("").map((letter, i) => (
              <span 
                key={i}
                className="text-[9px] text-foreground/60 font-light leading-[1.2]"
              >
                {letter}
              </span>
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
        babyName={babyName}
        babyId={babyId}
        allDomains={domains}
        onNavigate={(id) => setSelectedDomain(id)}
        onMilestoneConfirm={onMilestoneConfirm}
      />
    </>
  );
};
