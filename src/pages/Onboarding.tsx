import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { ConstellationWordmark } from "@/components/ui/ConstellationWordmark";

const Onboarding = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <NightSkyBackground starCount={150}>
      <div className="min-h-screen flex flex-col relative">
        {/* Upper Third - Constellation Wordmark */}
        <div className="flex-1 flex items-end justify-center pb-8 pt-20">
          <ConstellationWordmark onComplete={() => setShowContent(true)} />
        </div>

        {/* Middle Section - Hero Copy */}
        <div className="flex-1 flex items-center justify-center px-8">
          <AnimatePresence>
            {showContent && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[28px] leading-[1.4] text-center font-light tracking-wide"
                style={{ color: '#F5F5F0' }}
              >
                Your cosmic guide to baby's first year
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
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                onClick={handleGetStarted}
                className="relative px-10 py-4 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ 
                  color: '#F5F5F0',
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
                  transition={{ delay: 1 }}
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
