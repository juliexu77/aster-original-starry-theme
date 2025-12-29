import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

const Onboarding = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger content after a brief delay
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const letters = "ASTER".split("");

  return (
    <NightSkyBackground starCount={150} forceMidnight>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Upper Third - ASTER Title */}
        <div className="flex-1 flex items-end justify-center pb-8 pt-20">
          <div className="flex items-center justify-center gap-1">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ 
                  rotateX: 0, 
                  opacity: 1,
                }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="text-[28px] text-foreground/30 uppercase inline-block"
                style={{
                  transformStyle: 'preserve-3d',
                  letterSpacing: '0.2em',
                  textShadow: '0 0 20px rgba(255, 229, 180, 0.3), 0 0 40px rgba(255, 229, 180, 0.15), 0 0 60px rgba(255, 229, 180, 0.08)',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Middle Section - Hero Copy */}
        <div className="flex-1 flex items-center justify-center px-8">
          <AnimatePresence>
            {showContent && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="text-[10px] text-center uppercase tracking-[0.2em] text-foreground/30"
              >
                Your baby's development, guided by the cosmos
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Lower Third - CTA Button */}
        <div className="flex-1 flex items-start justify-center pt-8 pb-32">
          <AnimatePresence>
            {showContent && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                onClick={handleGetStarted}
                className="relative px-8 py-3 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 text-foreground/60"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Glow border effect */}
                <span 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 229, 180, 0.4)',
                    boxShadow: '0 0 20px rgba(255, 229, 180, 0.15), inset 0 0 20px rgba(255, 229, 180, 0.05)',
                  }}
                />
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.span
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 229, 180, 0.1), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
                <span className="relative z-10">Begin Your Journey</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </NightSkyBackground>
  );
};

export default Onboarding;
