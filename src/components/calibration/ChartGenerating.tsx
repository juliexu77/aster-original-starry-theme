import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

interface ChartGeneratingProps {
  babyName: string;
  onComplete?: () => void;
}

export function ChartGenerating({ babyName, onComplete }: ChartGeneratingProps) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => (prev % 3) + 1);
    }, 400);

    // Complete after deliberate delay to feel more custom (only if onComplete provided)
    const timer = onComplete ? setTimeout(() => {
      onComplete();
    }, 8000) : undefined;

    return () => {
      clearInterval(dotInterval);
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <NightSkyBackground>
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          {/* Subtle animated circle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-16 h-16 mx-auto"
          >
            <div className="absolute inset-0 rounded-full border border-foreground/10 animate-pulse" />
            <div 
              className="absolute inset-2 rounded-full border border-foreground/20"
              style={{ animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}
            />
            <div 
              className="absolute inset-4 rounded-full border border-foreground/30"
              style={{ animation: 'pulse 1.5s ease-in-out infinite 0.4s' }}
            />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[14px] text-foreground/60 font-serif"
          >
            Generating {babyName}'s developmental chart{'.'.repeat(dots)}
          </motion.p>
        </motion.div>
      </div>
    </NightSkyBackground>
  );
}
