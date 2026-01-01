import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName, ZodiacSign } from "@/lib/zodiac";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface ChartIntroOverlayProps {
  name: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  onComplete: () => void;
}

interface SignInfo {
  type: 'sun' | 'moon' | 'rising';
  sign: ZodiacSign;
  title: string;
  description: string;
}

export const ChartIntroOverlay = ({ 
  name, 
  sunSign, 
  moonSign, 
  risingSign, 
  onComplete 
}: ChartIntroOverlayProps) => {
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const signs: SignInfo[] = [
    {
      type: 'sun',
      sign: sunSign,
      title: `${getZodiacName(sunSign)} Sun`,
      description: `${name}'s core identity and essence`,
    },
    ...(moonSign ? [{
      type: 'moon' as const,
      sign: moonSign,
      title: `${getZodiacName(moonSign)} Moon`,
      description: `${name}'s emotional world and inner needs`,
    }] : []),
    ...(risingSign ? [{
      type: 'rising' as const,
      sign: risingSign,
      title: `${getZodiacName(risingSign)} Rising`,
      description: `How ${name} appears to others`,
    }] : []),
  ];

  // Add family chart info slide at the end
  const showFamilySlide = signs.length > 0;
  const totalSlides = signs.length + (showFamilySlide ? 1 : 0);
  const isOnFamilySlide = currentIndex >= signs.length;

  // Initial delay before showing overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
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

  const currentSign = !isOnFamilySlide ? signs[currentIndex] : null;

  if (!isReady) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
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
                {isOnFamilySlide ? (
                  <>
                    {/* Family Chart Slide */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="relative w-24 h-24 mx-auto mb-6"
                    >
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users size={48} strokeWidth={1} className="text-foreground/70" />
                      </div>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] mb-2"
                    >
                      Family Dynamics
                    </motion.p>

                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-[24px] font-serif text-foreground/90 mb-3"
                    >
                      Family Chart
                    </motion.h2>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[13px] text-foreground/50 max-w-[280px] mx-auto leading-relaxed"
                    >
                      Explore how {name}'s chart interacts with yours and your family. Insights evolve as {name} grows.
                    </motion.p>
                  </>
                ) : currentSign && (
                  <>
                    {/* Sign Slides */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="relative w-24 h-24 mx-auto mb-6"
                    >
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ZodiacIcon 
                          sign={currentSign.sign} 
                          size={48} 
                          strokeWidth={1} 
                          className="text-foreground/70"
                        />
                      </div>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] mb-2"
                    >
                      {currentSign.type === 'sun' ? 'Sun Sign' : 
                       currentSign.type === 'moon' ? 'Moon Sign' : 'Rising Sign'}
                    </motion.p>

                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-[24px] font-serif text-foreground/90 mb-3"
                    >
                      {currentSign.title}
                    </motion.h2>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[13px] text-foreground/50 max-w-[240px] mx-auto"
                    >
                      {currentSign.description}
                    </motion.p>
                  </>
                )}

                {/* Progress dots */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-2 mt-8"
                >
                  {Array.from({ length: totalSlides }).map((_, i) => (
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

          {/* Navigation buttons - above nav bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between w-full px-8 pb-[calc(env(safe-area-inset-bottom)+5rem)]"
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
              {currentIndex === totalSlides - 1 ? 'Done' : 'Next'}
              {currentIndex < totalSlides - 1 && <ChevronRight size={16} />}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};