import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { differenceInMonths } from "date-fns";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

export interface CalibrationData {
  sleepNaps: string | null;
  feedingSolids: string | null;
  physicalSkills: string[];
  languageSounds: string | null;
  socialSeparation: string | null;
  currentChallenge: string | null;
}

interface CalibrationFlowProps {
  babyName: string;
  babyBirthday: string;
  onComplete: (data: CalibrationData, emergingFlags: Record<string, boolean>) => void;
  onSkip: () => void;
}

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: keyof Omit<CalibrationData, 'physicalSkills'> | 'physicalSkills';
  question: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

const getQuestions = (babyName: string): Question[] => [
  {
    id: 'sleepNaps',
    question: `How many naps does ${babyName} typically take?`,
    options: [
      { value: '3+', label: '3+ naps per day' },
      { value: '2', label: '2 naps per day' },
      { value: '1', label: '1 nap per day' },
      { value: 'irregular', label: 'Sleep is all over the place' },
    ],
  },
  {
    id: 'feedingSolids',
    question: `Where is ${babyName} with solid foods?`,
    options: [
      { value: 'not_started', label: "Hasn't started yet" },
      { value: 'starting', label: 'Just starting to explore' },
      { value: 'regular', label: 'Eating solids regularly' },
      { value: 'confident', label: 'Eating a wide variety confidently' },
    ],
  },
  {
    id: 'physicalSkills',
    question: `Which of these can ${babyName} do?`,
    options: [
      { value: 'sit', label: 'Sit without support' },
      { value: 'crawl', label: 'Crawl or scoot around' },
      { value: 'pull_stand', label: 'Pull to stand' },
      { value: 'stand', label: 'Stand independently' },
      { value: 'cruise', label: 'Take steps while holding on' },
      { value: 'none', label: 'None of these yet' },
    ],
    multiSelect: true,
  },
  {
    id: 'languageSounds',
    question: `What sounds is ${babyName} making?`,
    options: [
      { value: 'coos', label: 'Mostly coos and vowel sounds' },
      { value: 'babbling', label: 'Babbling (ba-ba, da-da) without meaning' },
      { value: 'intentional', label: 'Babbling that seems intentional' },
      { value: 'words_few', label: 'Says 1-2 words with meaning' },
      { value: 'words_many', label: 'Says several words' },
    ],
  },
  {
    id: 'socialSeparation',
    question: `How does ${babyName} respond when you leave the room?`,
    options: [
      { value: 'unaware', label: "Doesn't seem to notice much" },
      { value: 'calm', label: 'Notices but stays calm' },
      { value: 'upset', label: 'Gets upset or cries' },
      { value: 'follows', label: 'Follows me or crawls after me' },
    ],
  },
  {
    id: 'currentChallenge',
    question: `What's been most challenging lately?`,
    options: [
      { value: 'sleep', label: 'Sleep (naps, nights, or both)' },
      { value: 'feeding', label: 'Feeding (starting solids, pickiness)' },
      { value: 'fussiness', label: 'Fussiness or mood' },
      { value: 'milestones', label: 'Developmental milestones' },
      { value: 'none', label: 'Nothing major right now' },
    ],
  },
];

// Compute emerging early flags based on age and responses
function computeEmergingFlags(
  ageInMonths: number,
  data: CalibrationData
): Record<string, boolean> {
  const flags: Record<string, boolean> = {};

  // Sleep: consolidated to 2 naps before 7 months is early
  if (data.sleepNaps === '2' && ageInMonths < 7) {
    flags.sleep = true;
  }
  if (data.sleepNaps === '1' && ageInMonths < 12) {
    flags.sleep = true;
  }

  // Feeding: eating regularly before 7 months is early
  if ((data.feedingSolids === 'regular' || data.feedingSolids === 'confident') && ageInMonths < 7) {
    flags.feeding = true;
  }

  // Physical: pulling to stand before 8 months, standing before 10 months
  if (data.physicalSkills.includes('pull_stand') && ageInMonths < 8) {
    flags.physical = true;
  }
  if (data.physicalSkills.includes('stand') && ageInMonths < 10) {
    flags.physical = true;
  }
  if (data.physicalSkills.includes('cruise') && ageInMonths < 9) {
    flags.physical = true;
  }

  // Language: intentional babbling before 8 months, words before 10 months
  if (data.languageSounds === 'intentional' && ageInMonths < 8) {
    flags.language = true;
  }
  if ((data.languageSounds === 'words_few' || data.languageSounds === 'words_many') && ageInMonths < 10) {
    flags.language = true;
  }

  // Social: separation awareness before 8 months
  if ((data.socialSeparation === 'upset' || data.socialSeparation === 'follows') && ageInMonths < 8) {
    flags.social = true;
  }

  return flags;
}

export function CalibrationFlow({ babyName, babyBirthday, onComplete, onSkip }: CalibrationFlowProps) {
  const questions = getQuestions(babyName);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<CalibrationData>({
    sleepNaps: null,
    feedingSolids: null,
    physicalSkills: [],
    languageSounds: null,
    socialSeparation: null,
    currentChallenge: null,
  });

  const ageInMonths = differenceInMonths(new Date(), new Date(babyBirthday));
  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleSelect = (value: string) => {
    const questionId = currentQuestion.id;
    
    if (currentQuestion.multiSelect) {
      setAnswers(prev => {
        const currentValues = prev.physicalSkills;
        // If selecting "none", clear all others
        if (value === 'none') {
          return { ...prev, physicalSkills: ['none'] };
        }
        // If selecting something else, remove "none" if present
        const withoutNone = currentValues.filter(v => v !== 'none');
        if (withoutNone.includes(value)) {
          return { ...prev, physicalSkills: withoutNone.filter(v => v !== value) };
        }
        return { ...prev, physicalSkills: [...withoutNone, value] };
      });
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const flags = computeEmergingFlags(ageInMonths, answers);
      onComplete(answers, flags);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCurrentValue = (): string | string[] | null => {
    if (currentQuestion.multiSelect) {
      return answers.physicalSkills;
    }
    return answers[currentQuestion.id as keyof Omit<CalibrationData, 'physicalSkills'>];
  };

  const isSelected = (value: string): boolean => {
    const currentValue = getCurrentValue();
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    return currentValue === value;
  };

  const canProceed = (): boolean => {
    const currentValue = getCurrentValue();
    if (Array.isArray(currentValue)) {
      return currentValue.length > 0;
    }
    return currentValue !== null;
  };

  return (
    <NightSkyBackground forceMidnight>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-5 pt-8 pb-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
            Calibrate
          </p>
          <button
            onClick={onSkip}
            className="text-[11px] text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            Skip
          </button>
        </div>
        {/* Progress */}
        <div className="flex gap-1 mt-4">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors origin-left",
                i <= currentStep ? "bg-foreground/40" : "bg-foreground/10"
              )}
            />
          ))}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-5 pt-6">
        <div className="flex-1 space-y-8">
          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-[18px] font-serif text-foreground/90 leading-[1.4]"
            >
              {currentQuestion.question}
            </motion.h2>
          </AnimatePresence>

          {/* Options */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-3 pointer-events-auto"
            >
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-all pointer-events-auto",
                  "text-[13px] leading-[1.5]",
                  isSelected(option.value)
                    ? "border-foreground/30 bg-foreground/5 text-foreground"
                    : "border-foreground/10 bg-transparent text-foreground/60 hover:border-foreground/20"
                )}
              >
                <span className="flex items-center gap-3">
                  {currentQuestion.multiSelect && (
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center text-[10px]",
                        isSelected(option.value)
                          ? "border-foreground/40 bg-foreground/10"
                          : "border-foreground/20"
                      )}
                    >
                      {isSelected(option.value) && "✓"}
                    </span>
                  )}
                  {option.label}
                </span>
              </button>
            ))}
            </motion.div>
          </AnimatePresence>

          {currentQuestion.multiSelect && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] text-foreground/30"
            >
              Select all that apply
            </motion.p>
          )}
        </div>

        {/* Navigation */}
        <div className="pb-8 pt-6 space-y-3">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full text-[13px]"
          >
            {isLastQuestion ? "Generate Chart" : "Continue"}
          </Button>
          
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="w-full text-[11px] text-foreground/40 hover:text-foreground/60 py-2"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
    </NightSkyBackground>
  );
}
