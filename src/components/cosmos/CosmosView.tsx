import { useState, useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { CosmosIntakeSelection } from "./CosmosIntakeSelection";
import { CosmosQuestionsFlow } from "./CosmosQuestionsFlow";
import { CosmosVoiceRecorder } from "./CosmosVoiceRecorder";
import { CosmosOptionsStep } from "./CosmosOptionsStep";
import { CosmosLoading } from "./CosmosLoading";
import { CosmosReadingDisplay } from "./CosmosReadingDisplay";
import { FamilyMember, IntakeResponses, VoiceIntakeData, ReadingOptions } from "./types";
import { useCosmosReading } from "@/hooks/useCosmosReading";
import { 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime, 
  getRisingSign,
  getZodiacName 
} from "@/lib/zodiac";
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

  // Build all family members list
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
    
    // Add parent (user) - only if they have a birthday set
    if (userProfile?.birthday) {
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
    const rising = getRisingSign(
      selectedMember.birthday, 
      selectedMember.birth_time, 
      selectedMember.birth_location
    );
    
    return { sun, moon, rising };
  }, [selectedMember]);

  // Fetch reading for selected member
  const { 
    reading, 
    loading: readingLoading, 
    generating,
    generateReading,
    hasReading 
  } = useCosmosReading(selectedMember?.id || null);

  // Determine initial state based on whether we have a reading
  const showIntake = !hasReading && !readingLoading && flowState === 'reading';

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
        birth_location: selectedMember.birth_location
      }, options);
      pendingIntakeRef.current = null;
      setFlowState('reading');
    } catch (error) {
      toast.error('Failed to generate reading. Please try again.');
      setFlowState('options');
    }
  };

  const handleSelectQuestions = () => {
    setFlowState('questions');
  };

  const handleSelectVoice = () => {
    setFlowState('voice');
  };

  const handleRefresh = () => {
    pendingIntakeRef.current = null;
    setFlowState('intake-selection');
  };

  // Show empty state if no members
  if (allMembers.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Add a family member with their birthday to receive cosmic guidance.
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

      {/* Content based on state */}
      <AnimatePresence mode="wait">
        {readingLoading || generating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosLoading />
          </motion.div>
        ) : showIntake || flowState === 'intake-selection' ? (
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
        ) : flowState === 'loading' ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosLoading />
          </motion.div>
        ) : reading ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CosmosReadingDisplay
              reading={reading}
              onRefresh={handleRefresh}
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
