import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Star, Sun } from "lucide-react";

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
          className="absolute inset-0 border border-amber-500/10 rounded-full"
        />
        
        {/* Middle orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[25px] border border-purple-500/10 rounded-full"
        >
          <motion.div 
            className="absolute -top-1.5 left-1/2 -translate-x-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-3 h-3 text-amber-300/60" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Inner orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[50px] border border-indigo-500/10 rounded-full"
        >
          <motion.div 
            className="absolute -right-1 top-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Moon className="w-3 h-3 text-purple-300/60" />
          </motion.div>
        </motion.div>

        {/* Center sun */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[75px] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center">
            <Sun className="w-6 h-6 text-amber-300/70" />
          </div>
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
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2"
          >
            <Sparkles className="w-2 h-2 text-amber-300/40" />
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
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400/60"
          />
        ))}
      </div>
    </div>
  );
};
