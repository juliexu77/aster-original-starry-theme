import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import { ReadingPeriod, ZodiacSystem, ReadingOptions } from "./types";

interface CosmosOptionsStepProps {
  onComplete: (options: ReadingOptions) => void;
  onBack: () => void;
}

export const CosmosOptionsStep = ({
  onComplete,
  onBack
}: CosmosOptionsStepProps) => {
  const [step, setStep] = useState<0 | 1>(0);
  const [period, setPeriod] = useState<ReadingPeriod>('month');
  const [zodiacSystem, setZodiacSystem] = useState<ZodiacSystem>('western');

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onComplete({ period, zodiacSystem });
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep(0);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/50" />
        </button>
        
        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step 
                  ? 'w-6 bg-amber-400/80' 
                  : i < step 
                    ? 'bg-amber-400/40' 
                    : 'bg-foreground/10'
              }`}
            />
          ))}
        </div>
        
        <div className="w-9" />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="period"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-[16px] font-serif text-foreground/90 mb-3">
                  What timeframe feels right?
                </h3>
                <p className="text-[12px] text-foreground/50 max-w-[300px] mx-auto leading-relaxed">
                  A monthly reading offers detailed, actionable guidance for immediate situations. 
                  A yearly reading reveals broader themes and turning points across the seasons.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setPeriod('month')}
                  className={`relative w-full p-5 rounded-xl border text-left transition-all ${
                    period === 'month'
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {period === 'month' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-amber-300" />
                    </div>
                  )}
                  <p className="text-[15px] font-medium text-foreground/85 mb-1">This Month</p>
                  <p className="text-[12px] text-foreground/50 leading-relaxed pr-6">
                    Specific guidance for the weeks ahead—ideal when you're navigating something right now
                  </p>
                </button>

                <button
                  onClick={() => setPeriod('year')}
                  className={`relative w-full p-5 rounded-xl border text-left transition-all ${
                    period === 'year'
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {period === 'year' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-amber-300" />
                    </div>
                  )}
                  <p className="text-[15px] font-medium text-foreground/85 mb-1">This Year</p>
                  <p className="text-[12px] text-foreground/50 leading-relaxed pr-6">
                    The big picture—major themes, growth periods, and cosmic weather patterns for the full year
                  </p>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="zodiac"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-[16px] font-serif text-foreground/90 mb-3">
                  Which cosmic lens?
                </h3>
                <p className="text-[12px] text-foreground/50 max-w-[300px] mx-auto leading-relaxed">
                  Western astrology reads your Sun, Moon & Rising signs. Chinese astrology reveals your birth year animal and element. 
                  Each offers unique insights—or combine them for a richer picture.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setZodiacSystem('western')}
                  className={`relative w-full p-5 rounded-xl border text-left transition-all ${
                    zodiacSystem === 'western'
                      ? 'border-purple-500/40 bg-purple-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {zodiacSystem === 'western' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  <p className="text-[15px] font-medium text-foreground/85 mb-1">Western Astrology</p>
                  <p className="text-[12px] text-foreground/50 leading-relaxed pr-6">
                    Sun sign personality, Moon sign emotions, Rising sign outward energy—based on planetary positions at birth
                  </p>
                </button>

                <button
                  onClick={() => setZodiacSystem('eastern')}
                  className={`relative w-full p-5 rounded-xl border text-left transition-all ${
                    zodiacSystem === 'eastern'
                      ? 'border-purple-500/40 bg-purple-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {zodiacSystem === 'eastern' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  <p className="text-[15px] font-medium text-foreground/85 mb-1">Chinese Astrology</p>
                  <p className="text-[12px] text-foreground/50 leading-relaxed pr-6">
                    Your birth year animal (Dragon, Rabbit, etc.) and element (Wood, Fire, Earth, Metal, Water)
                  </p>
                </button>

                <button
                  onClick={() => setZodiacSystem('both')}
                  className={`relative w-full p-5 rounded-xl border text-left transition-all ${
                    zodiacSystem === 'both'
                      ? 'border-purple-500/40 bg-purple-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {zodiacSystem === 'both' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  <p className="text-[15px] font-medium text-foreground/85 mb-1">Both Systems</p>
                  <p className="text-[12px] text-foreground/50 leading-relaxed pr-6">
                    A blended reading that weaves Western and Chinese insights together for the fullest picture
                  </p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue button - fixed at bottom */}
      <div className="flex-shrink-0 pt-6 pb-2">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white hover:from-amber-500 hover:to-amber-600"
        >
          {step === 1 ? (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Reading
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
