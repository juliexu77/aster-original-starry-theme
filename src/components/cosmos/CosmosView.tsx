import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { CosmosIntakeSelection } from "./CosmosIntakeSelection";
import { CosmosQuestionsFlow, clearIntakeProgress } from "./CosmosQuestionsFlow";
import { CosmosVoiceRecorder } from "./CosmosVoiceRecorder";
import { CosmosOptionsStep } from "./CosmosOptionsStep";
import { CosmosLoading } from "./CosmosLoading";
import { CosmosReadingDisplay } from "./CosmosReadingDisplay";
import { WeeklyReadingCard } from "./WeeklyReadingCard";
import { FamilyMember, IntakeResponses, VoiceIntakeData, ReadingOptions } from "./types";
import { useCosmosReading } from "@/hooks/useCosmosReading";
import { useWeeklyReading } from "@/hooks/useWeeklyReading";
import { 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime, 
  getZodiacName,
  ZodiacSign
} from "@/lib/zodiac";
import { calculateBirthChart } from "@/lib/ephemeris";
import { ChartSelectorSheet } from "@/components/family/ChartSelectorSheet";
import { toast } from "sonner";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface UserProfile {
  display_name: string | null;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  partner_name: string | null;
  partner_birthday: string | null;
  partner_birth_time: string | null;
  partner_birth_location: string | null;
}

interface CosmosViewProps {
  babies: Baby[];
  userProfile: UserProfile | null;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
}

type FlowState = 'reading' | 'intake-selection' | 'questions' | 'voice' | 'options' | 'loading';

export const CosmosView = ({
  babies,
  userProfile,
  selectedMemberId,
  onSelectMember
}: CosmosViewProps) => {
  const [flowState, setFlowState] = useState<FlowState>('reading');
  const [showSelector, setShowSelector] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ReadingOptions>({ period: 'month', zodiacSystem: 'western' });
  
  // Store pending intake data when moving to options step
  const pendingIntakeRef = useRef<{ type: 'questions' | 'voice'; data: IntakeResponses | VoiceIntakeData } | null>(null);

  // Build all family members list - include parent even without birthday
  const allMembers = useMemo(() => {
    const members: FamilyMember[] = [];
    
    // Add children with birthdays
    babies.forEach(baby => {
      if (baby.birthday) {
        members.push({
          id: baby.id,
          name: baby.name,
          type: 'child' as const,
          birthday: baby.birthday,
          birth_time: baby.birth_time,
          birth_location: baby.birth_location,
        });
      }
    });
    
    // Always add parent (user) - they can add birthday later
    if (userProfile) {
      members.push({
        id: 'parent',
        name: userProfile.display_name?.split(' ')[0] || 'You',
        type: 'parent' as const,
        birthday: userProfile.birthday,
        birth_time: userProfile.birth_time,
        birth_location: userProfile.birth_location,
      });
    }
    
    // Add partner - only if they have a birthday set
    if (userProfile?.partner_birthday) {
      members.push({
        id: 'partner',
        name: userProfile.partner_name || 'Partner',
        type: 'partner' as const,
        birthday: userProfile.partner_birthday,
        birth_time: userProfile.partner_birth_time,
        birth_location: userProfile.partner_birth_location,
      });
    }
    
    return members;
  }, [babies, userProfile]);

  // Find selected member - fallback to first member if selectedMemberId doesn't match
  const selectedMember = useMemo(() => {
    if (selectedMemberId) {
      const found = allMembers.find(m => m.id === selectedMemberId);
      if (found) return found;
    }
    // Default to first member
    return allMembers[0] || null;
  }, [allMembers, selectedMemberId]);

  // Get signs for selected member
  const signs = useMemo(() => {
    if (!selectedMember?.birthday) return null;
    
    const sun = getZodiacFromBirthday(selectedMember.birthday);
    const moon = getMoonSignFromBirthDateTime(
      selectedMember.birthday, 
      selectedMember.birth_time, 
      selectedMember.birth_location
    );
    
    // Use ephemeris calculation for rising sign (more accurate)
    let rising: ZodiacSign | null = null;
    if (selectedMember.birth_time && selectedMember.birth_location) {
      const birthChart = calculateBirthChart(
        selectedMember.birthday,
        selectedMember.birth_time,
        selectedMember.birth_location
      );
      rising = birthChart?.ascendantSign ?? null;
    }
    
    return { sun, moon, rising };
  }, [selectedMember]);

  // Fetch reading for selected member
  const {
    reading,
    loading: readingLoading,
    generating,
    error: readingError,
    generateReading,
    deleteReading,
    hasReading
  } = useCosmosReading(selectedMember?.id || null);

  // Fetch weekly auto-reading for selected member
  const memberDataForWeekly = useMemo(() => {
    if (!selectedMember?.birthday) return null;
    return {
      name: selectedMember.name,
      type: selectedMember.type,
      birthday: selectedMember.birthday,
      birth_time: selectedMember.birth_time,
      birth_location: selectedMember.birth_location,
      sunSign: signs?.sun || null,
      moonSign: signs?.moon || null,
      risingSign: signs?.rising || null,
    };
  }, [selectedMember, signs]);

  const {
    reading: weeklyReading,
    loading: weeklyLoading,
  } = useWeeklyReading(selectedMember?.id || null, memberDataForWeekly);

  // Sync flowState with reading status when loading completes
  // This ensures that if a reading exists in the DB (e.g., after screen sleep/wake),
  // we show it instead of resetting to intake
  useEffect(() => {
    if (!readingLoading && !generating) {
      // If we have a reading and we're not in a user-initiated flow, show the reading
      if (hasReading && (flowState === 'intake-selection' || flowState === 'reading')) {
        setFlowState('reading');
      }
    }
  }, [readingLoading, generating, hasReading, flowState]);


  // Called when questions flow completes - store data and show options
  const handleQuestionsComplete = (responses: IntakeResponses) => {
    pendingIntakeRef.current = { type: 'questions', data: responses };
    setFlowState('options');
  };

  // Called when voice flow completes - store data and show options
  const handleVoiceComplete = (data: VoiceIntakeData) => {
    pendingIntakeRef.current = { type: 'voice', data: data };
    setFlowState('options');
  };

  // Called when user skips intake - proceed with empty intake
  const handleSkipIntake = () => {
    pendingIntakeRef.current = { type: 'questions', data: {} as IntakeResponses };
    setFlowState('options');
  };

  // Called when options step completes - generate the reading
  const handleOptionsComplete = async (options: ReadingOptions) => {
    if (!selectedMember?.birthday || !pendingIntakeRef.current) return;

    setCurrentOptions(options);
    setFlowState('loading');

    const { type, data } = pendingIntakeRef.current;

    try {
      await generateReading(type, data, {
        name: selectedMember.name,
        type: selectedMember.type,
        birthday: selectedMember.birthday,
        birth_time: selectedMember.birth_time,
        birth_location: selectedMember.birth_location,
        sunSign: signs?.sun || null,
        moonSign: signs?.moon || null,
        risingSign: signs?.rising || null
      }, options);
      // Clear saved intake progress on successful generation
      clearIntakeProgress(selectedMember.id);
      pendingIntakeRef.current = null;
      setFlowState('reading');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate reading';

      // Show specific error messages based on error type
      if (errorMessage.includes('Rate limit')) {
        toast.error('Too many requests. Please try again in a few minutes.');
      } else if (errorMessage.includes('credits exhausted') || errorMessage.includes('402')) {
        toast.error('AI credits temporarily exhausted. Please try again later.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        toast.error('Request timed out. Please check your connection and try again.');
      } else if (errorMessage.includes('No household')) {
        toast.error('Could not find your family data. Please try logging out and back in.');
      } else {
        toast.error(`Failed to generate reading: ${errorMessage}`);
      }

      setFlowState('options');
    }
  };

  const handleSelectQuestions = () => {
    setFlowState('questions');
  };

  const handleSelectVoice = () => {
    setFlowState('voice');
  };

  const handleGetAnotherReading = async () => {
    try {
      await deleteReading();
    } catch (err) {
      console.error('Failed to delete reading:', err);
    }
    pendingIntakeRef.current = null;
    setFlowState('intake-selection');
  };

  // Show empty state if no members
  if (allMembers.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Add your birthday in Settings to receive cosmic guidance.
        </p>
      </div>
    );
  }

  if (!selectedMember) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Loading...
        </p>
      </div>
    );
  }

  // If member exists but has no birthday, prompt to add one
  if (!selectedMember.birthday || !signs?.sun) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Add {selectedMember.name}'s birthday to receive cosmic guidance.
        </p>
      </div>
    );
  }

  // Check if birth data is incomplete
  const hasIncompleteBirthData = selectedMember?.birthday && (!selectedMember.birth_time || !selectedMember.birth_location);

  return (
    <div className="space-y-4">
      {/* Member Selector Header */}
      <div className="px-5 pt-6">
        <div className="text-center">
          <button
            onClick={() => setShowSelector(true)}
            className="inline-flex items-center gap-2"
          >
            <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
            <span className="text-[18px] text-foreground/80">{selectedMember.name}</span>
            <ChevronDown className="w-4 h-4 text-foreground/30" />
          </button>

          <p className="text-[11px] text-foreground/40 mt-1">
            {getZodiacName(signs.sun)}
            {signs.moon && ` • ${getZodiacName(signs.moon)} Moon`}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {readingError && (
        <div className="px-5">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-200 font-medium">Error loading reading</p>
              <p className="text-xs text-red-300/70 mt-1">{readingError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Birth Data Warning */}
      {hasIncompleteBirthData && (
        <div className="px-5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-200 font-medium">Incomplete birth data</p>
              <p className="text-xs text-amber-300/70 mt-1">
                Add {selectedMember.name}'s birth time and location in Settings for Moon and Rising signs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Auto-Reading Section - Always visible at top */}
      {!weeklyLoading && weeklyReading && (flowState === 'reading' || !hasReading) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <WeeklyReadingCard 
            reading={weeklyReading} 
            memberName={selectedMember.name} 
          />
        </motion.div>
      )}

      {/* Weekly Loading Skeleton */}
      {weeklyLoading && (
        <div className="px-5 space-y-3 animate-pulse">
          <div className="h-32 bg-foreground/5 rounded-2xl" />
          <div className="h-16 bg-foreground/5 rounded-xl" />
          <div className="h-24 bg-foreground/5 rounded-xl" />
        </div>
      )}

      {/* Divider between weekly and generated readings */}
      {weeklyReading && !weeklyLoading && (
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            <Sparkles className="w-3 h-3 text-foreground/20" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        </div>
      )}

      {/* Generated Readings Section */}
      <AnimatePresence mode="wait">
        {readingLoading ? (
          // Show loading while fetching - prevents flash of intake screen
          <motion.div
            key="initial-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosLoading />
          </motion.div>
        ) : generating || flowState === 'loading' ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosLoading />
          </motion.div>
        ) : hasReading && flowState === 'reading' ? (
          // Priority: Show existing reading if we have one and user hasn't started refresh flow
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosReadingDisplay
              reading={reading!}
              onGetAnotherReading={handleGetAnotherReading}
            />
          </motion.div>
        ) : flowState === 'intake-selection' || (!hasReading && flowState === 'reading') ? (
          // Show intake: either user tapped refresh OR no reading exists yet (confirmed after fetch)
          <motion.div
            key="intake-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosIntakeSelection
              member={selectedMember}
              onSelectQuestions={handleSelectQuestions}
              onSelectVoice={handleSelectVoice}
              onSkip={handleSkipIntake}
            />
          </motion.div>
        ) : flowState === 'questions' ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosQuestionsFlow
              member={selectedMember}
              onComplete={handleQuestionsComplete}
              onBack={() => setFlowState('intake-selection')}
            />
          </motion.div>
        ) : flowState === 'voice' ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosVoiceRecorder
              member={selectedMember}
              onComplete={handleVoiceComplete}
              onBack={() => setFlowState('intake-selection')}
            />
          </motion.div>
        ) : flowState === 'options' ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosOptionsStep
              onComplete={handleOptionsComplete}
              onBack={() => setFlowState(pendingIntakeRef.current?.type === 'voice' ? 'voice' : 'questions')}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Member Selector Sheet */}
      <ChartSelectorSheet
        open={showSelector}
        onOpenChange={setShowSelector}
        members={allMembers}
        selectedMemberId={selectedMember.id}
        onSelectMember={(id) => {
          onSelectMember(id);
          setFlowState('reading');
        }}
      />
    </div>
  );
};
