import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const LOADING_MESSAGES = [
  "Consulting the cosmos...",
  "Reading the celestial patterns...",
  "Weaving your story with the stars...",
  "Charting your cosmic weather...",
  "Listening to what the planets have to say..."
];

export const CosmosLoading = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-12">
      {/* Celestial animation */}
      <div className="relative w-[200px] h-[200px] mb-12">
        {/* Outer orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-foreground/10 rounded-full"
        />
        
        {/* Middle orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[25px] border border-foreground/10 rounded-full"
        >
          <motion.div 
            className="absolute -top-1.5 left-1/2 -translate-x-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-3 h-3 rounded-full bg-foreground/30" />
          </motion.div>
        </motion.div>

        {/* Inner orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[50px] border border-foreground/10 rounded-full"
        >
          <motion.div 
            className="absolute -right-1 top-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-3 h-3 rounded-full bg-foreground/20" />
          </motion.div>
        </motion.div>

        {/* Center - 8-pointed star matching app icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[65px] flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* 8-pointed star */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const isCardinal = angle % 90 === 0;
              const length = isCardinal ? 42 : 30;
              const width = isCardinal ? 12 : 8;
              return (
                <g key={angle} transform={`rotate(${angle} 50 50)`}>
                  {/* Diamond/petal shape */}
                  <path
                    d={`M 50 ${50 - length} 
                        L ${50 + width/2} 50 
                        L 50 ${50 + 8} 
                        L ${50 - width/2} 50 Z`}
                    fill="url(#goldGradient)"
                    className="drop-shadow-sm"
                  />
                </g>
              );
            })}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5C842" />
                <stop offset="50%" stopColor="#E5A832" />
                <stop offset="100%" stopColor="#D49A28" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 180 - 90,
              y: Math.random() * 180 - 90,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * -50 - 20],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2"
          >
            <Sparkles className="w-2 h-2 text-foreground/30" />
          </motion.div>
        ))}
      </div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-[14px] text-foreground/60 font-serif text-center"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Subtle progress indicator */}
      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-1.5 h-1.5 rounded-full bg-foreground/40"
          />
        ))}
      </div>
    </div>
  );
};
