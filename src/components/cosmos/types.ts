import { ZodiacSign } from "@/lib/zodiac";

export type ReadingPeriod = 'month' | 'year';
export type ZodiacSystem = 'western' | 'eastern' | 'both';

export interface ReadingOptions {
  period: ReadingPeriod;
  zodiacSystem: ZodiacSystem;
}

export interface FamilyMember {
  id: string;
  name: string;
  type: 'child' | 'parent' | 'partner';
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

export interface IntakeResponses {
  q1: string[];
  q2: string[];
  q3: string;
  q4?: string;
}

export interface VoiceIntakeData {
  transcript: string;
  duration: number;
}

export interface ReadingSection {
  title: string;
  content: string;
}

export interface SignificantDate {
  title: string;
  details: string;
}

export interface CosmosReading {
  id: string;
  monthYear: string;
  memberName: string;
  memberType: 'child' | 'parent' | 'partner';
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  chineseZodiac?: string;
  chineseElement?: string;
  astrologicalSeason: string;
  lunarPhase: string;
  opening: string;
  sections: ReadingSection[];
  significantDates: (string | SignificantDate)[];
  generatedAt: string;
  readingPeriod?: ReadingPeriod;
  zodiacSystem?: ZodiacSystem;
}

export interface CosmosReadingDB {
  id: string;
  household_id: string;
  member_id: string;
  member_type: string;
  month_year: string;
  reading_content: CosmosReading;
  intake_type: string;
  intake_responses: IntakeResponses | VoiceIntakeData | null;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

// Child intake questions
export const CHILD_QUESTIONS = {
  q1: {
    question: "What are you focusing on with [CHILD] right now?",
    options: [
      "Sleep challenges",
      "Feeding/eating",
      "Developmental milestones",
      "Behavior/tantrums",
      "Health concerns",
      "Social/emotional growth",
      "Starting daycare/school",
      "New sibling adjustment",
      "Nothing specific/everything's flowing"
    ],
    multiSelect: true,
    required: true
  },
  q2: {
    question: "What have you noticed about their energy lately?",
    options: [
      "More intense/demanding",
      "Unusually calm",
      "Sleep disrupted",
      "Extra clingy",
      "More independent",
      "Big emotions/mood swings",
      "Physical developmental leap",
      "Language changes",
      "Nothing unusual"
    ],
    multiSelect: true,
    required: true
  },
  q3: {
    question: "What do you hope this reading helps with?",
    options: [
      "Understanding my child better",
      "Getting through a rough patch",
      "Timing decisions (sleep training, weaning, etc.)",
      "Managing my own emotions/stress",
      "Validating what I'm experiencing",
      "Just curious about cosmic weather"
    ],
    multiSelect: false,
    required: true
  },
  q4: {
    question: "Anything specific on your mind?",
    placeholder: "Optional: Tell us more...",
    multiSelect: false,
    required: false,
    freeText: true
  }
};

// Adult intake questions
export const ADULT_QUESTIONS = {
  q1: {
    question: "What's demanding your attention right now?",
    options: [
      "Career/work decisions",
      "Relationship dynamics",
      "Identity/sense of self",
      "Health (physical or mental)",
      "Financial stress",
      "Creative pursuits",
      "Feeling stuck",
      "Major life decision",
      "Spiritual questions",
      "Nothing specific/life feels balanced"
    ],
    multiSelect: true,
    required: true
  },
  q2: {
    question: "In parenting, you're feeling...",
    options: [
      "Confident",
      "Overwhelmed",
      "Disconnected",
      "Joyful but depleted",
      "Anxious",
      "Grieving old life",
      "Excited",
      "Touched out",
      "Guilty about balance",
      "Grateful"
    ],
    multiSelect: true,
    required: true
  },
  q3: {
    question: "What do you hope this reading offers?",
    options: [
      "Validation for what I'm feeling",
      "Practical guidance",
      "Permission to make a change",
      "Understanding of timing",
      "Clarity on a decision",
      "Just wanting cosmic perspective"
    ],
    multiSelect: false,
    required: true
  },
  q4: {
    question: "What question would you ask an astrologer?",
    placeholder: "Optional: I'm wondering...",
    multiSelect: false,
    required: false,
    freeText: true
  }
};
