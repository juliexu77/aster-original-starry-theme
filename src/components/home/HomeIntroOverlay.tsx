import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footprints, Brain, ArrowUp, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

interface HomeIntroOverlayProps {
  babyName: string;
  onComplete: () => void;
}

interface StepInfo {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}

export const HomeIntroOverlay = ({ 
  babyName, 
  onComplete 
}: HomeIntroOverlayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const steps: StepInfo[] = [
    {
      icon: <Footprints className="w-12 h-12" strokeWidth={1} />,
      label: "Domains",
      title: "6 Areas of Growth",
      description: `Track ${babyName}'s development across physical, cognitive, language, social, emotional, sleep, and feeding`,
    },
    {
      icon: <ArrowUp className="w-12 h-12" strokeWidth={1} />,
      label: "Stages",
      title: "Natural Progression",
      description: "Each domain has stages that unfold as your child grows—see what's current and what's emerging",
    },
    {
      icon: <CheckCircle2 className="w-12 h-12" strokeWidth={1} />,
      label: "Milestones",
      title: "Celebrate Progress",
      description: "Tap the checkmark when you notice a new skill—it helps personalize the experience",
    },
    {
      icon: <Brain className="w-12 h-12" strokeWidth={1} />,
      label: "Focus",
      title: "This Month's Focus",
      description: "Scroll down for curated activities and insights tailored to the current stage",
    },
  ];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsExiting(true);
      setTimeout(onComplete, 600);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentStep = steps[currentIndex];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center px-8"
              >
                {/* Glowing icon container */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  {/* Outer glow rings */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle, hsl(var(--foreground) / 0.3) 0%, transparent 70%)`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-full border border-foreground/10"
                    style={{ animation: 'pulse 2s ease-in-out infinite 0.3s' }}
                  />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/70">
                    {currentStep.icon}
                  </div>
                </motion.div>

                {/* Step label */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] mb-2"
                >
                  {currentStep.label}
                </motion.p>

                {/* Title */}
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[24px] font-serif text-foreground/90 mb-3"
                >
                  {currentStep.title}
                </motion.h2>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[13px] text-foreground/50 max-w-[280px] mx-auto leading-relaxed"
                >
                  {currentStep.description}
                </motion.p>

                {/* Progress dots */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-2 mt-8"
                >
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex 
                          ? 'bg-foreground/50 scale-125' 
                          : i < currentIndex 
                            ? 'bg-foreground/30' 
                            : 'bg-foreground/10'
                      }`}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between w-full px-8 pb-12"
          >
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 text-[13px] transition-opacity ${
                currentIndex === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-foreground/50 hover:text-foreground/70'
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-[13px] text-foreground/70 hover:text-foreground/90 transition-opacity"
            >
              {currentIndex === steps.length - 1 ? 'Done' : 'Next'}
              {currentIndex < steps.length - 1 && <ChevronRight size={16} />}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};