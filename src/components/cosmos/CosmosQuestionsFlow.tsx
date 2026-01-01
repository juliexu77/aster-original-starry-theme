import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { FamilyMember, CHILD_QUESTIONS, ADULT_QUESTIONS, IntakeResponses } from "./types";

interface CosmosQuestionsFlowProps {
  member: FamilyMember;
  onComplete: (responses: IntakeResponses) => void;
  onBack: () => void;
}

export const CosmosQuestionsFlow = ({
  member,
  onComplete,
  onBack
}: CosmosQuestionsFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<IntakeResponses>({
    q1: [],
    q2: [],
    q3: '',
    q4: ''
  });

  const questions = member.type === 'child' ? CHILD_QUESTIONS : ADULT_QUESTIONS;
  const questionKeys = ['q1', 'q2', 'q3', 'q4'] as const;
  const currentKey = questionKeys[currentQuestion];
  const currentQ = questions[currentKey];
  
  // Replace [CHILD] placeholder
  const questionText = currentQ.question.replace('[CHILD]', member.name);

  const handleOptionToggle = (option: string) => {
    if (currentKey === 'q3') {
      // Single select
      setResponses(prev => ({ ...prev, q3: option }));
    } else if (currentKey === 'q1' || currentKey === 'q2') {
      // Multi select
      setResponses(prev => {
        const current = prev[currentKey] as string[];
        if (current.includes(option)) {
          return { ...prev, [currentKey]: current.filter(o => o !== option) };
        } else {
          return { ...prev, [currentKey]: [...current, option] };
        }
      });
    }
  };

  const handleTextChange = (text: string) => {
    setResponses(prev => ({ ...prev, q4: text }));
  };

  const canProceed = () => {
    if (currentKey === 'q4') return true; // Optional
    if (currentKey === 'q3') return responses.q3 !== '';
    return (responses[currentKey] as string[]).length > 0;
  };

  const handleNext = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const isSelected = (option: string) => {
    if (currentKey === 'q3') return responses.q3 === option;
    if (currentKey === 'q1' || currentKey === 'q2') {
      return (responses[currentKey] as string[]).includes(option);
    }
    return false;
  };

  return (
    <div className="min-h-[60vh] flex flex-col px-5 py-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/50" />
        </button>
        
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentQuestion 
                  ? 'w-6 bg-amber-400/80' 
                  : i < currentQuestion 
                    ? 'bg-amber-400/40' 
                    : 'bg-foreground/10'
              }`}
            />
          ))}
        </div>
        
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <h3 className="text-[16px] font-serif text-foreground/90 mb-6 leading-relaxed">
            {questionText}
          </h3>

          {/* Options */}
          {'freeText' in currentQ && currentQ.freeText ? (
            <textarea
              value={responses.q4 || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={currentQ.placeholder}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/80 text-[14px] placeholder:text-foreground/30 focus:outline-none focus:border-amber-500/30 resize-none"
              maxLength={500}
            />
          ) : (
            <div className="space-y-2">
              {'options' in currentQ && currentQ.options?.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleOptionToggle(option)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                    isSelected(option)
                      ? 'border-amber-500/40 bg-amber-500/10 text-foreground/90'
                      : 'border-foreground/10 bg-foreground/5 text-foreground/60 hover:border-foreground/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isSelected(option)
                      ? 'border-amber-400 bg-amber-400'
                      : 'border-foreground/20'
                  }`}>
                    {isSelected(option) && (
                      <Check className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-[13px]">{option}</span>
                </button>
              ))}
            </div>
          )}

          {/* Multi-select hint */}
          {currentQ.multiSelect && (
            <p className="text-[11px] text-foreground/30 mt-3">
              Select all that apply
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <button
          onClick={handleNext}
          disabled={!canProceed() && currentQ.required}
          className={`w-full py-4 rounded-2xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ${
            canProceed() || !currentQ.required
              ? 'bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white hover:from-amber-500 hover:to-amber-600'
              : 'bg-foreground/10 text-foreground/30 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
        
        {!canProceed() && currentQ.required && (
          <p className="text-[11px] text-amber-400/60 text-center mt-2">
            Please select at least one option
          </p>
        )}
      </motion.div>
    </div>
  );
};
