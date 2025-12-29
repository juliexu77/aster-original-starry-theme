import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StarNode {
  id: string;
  x: number;
  y: number;
  delay: number;
}

interface StarLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

// Define the constellation points for each letter
// Coordinates are relative percentages within each letter's bounding box
const letterData: Record<string, { stars: { x: number; y: number }[]; lines: [number, number][] }> = {
  A: {
    stars: [
      { x: 50, y: 0 },    // top
      { x: 15, y: 100 },  // bottom left
      { x: 85, y: 100 },  // bottom right
      { x: 32, y: 55 },   // crossbar left
      { x: 68, y: 55 },   // crossbar right
    ],
    lines: [[0, 1], [0, 2], [3, 4]]
  },
  S: {
    stars: [
      { x: 80, y: 10 },   // top right
      { x: 50, y: 0 },    // top center
      { x: 20, y: 20 },   // upper left
      { x: 50, y: 50 },   // middle
      { x: 80, y: 80 },   // lower right
      { x: 50, y: 100 },  // bottom center
      { x: 20, y: 90 },   // bottom left
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
  },
  T: {
    stars: [
      { x: 10, y: 0 },    // top left
      { x: 50, y: 0 },    // top center
      { x: 90, y: 0 },    // top right
      { x: 50, y: 100 },  // bottom center
    ],
    lines: [[0, 1], [1, 2], [1, 3]]
  },
  E: {
    stars: [
      { x: 20, y: 0 },    // top left
      { x: 80, y: 0 },    // top right
      { x: 20, y: 50 },   // middle left
      { x: 65, y: 50 },   // middle right
      { x: 20, y: 100 },  // bottom left
      { x: 80, y: 100 },  // bottom right
    ],
    lines: [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5]]
  },
  R: {
    stars: [
      { x: 20, y: 0 },    // top left
      { x: 70, y: 0 },    // top right
      { x: 80, y: 25 },   // upper curve
      { x: 20, y: 50 },   // middle left
      { x: 60, y: 50 },   // middle right
      { x: 20, y: 100 },  // bottom left
      { x: 85, y: 100 },  // bottom right (leg)
    ],
    lines: [[0, 1], [1, 2], [2, 4], [0, 3], [3, 4], [3, 5], [4, 6]]
  },
};

const letters = ['A', 'S', 'T', 'E', 'R'];
const letterWidth = 60;
const letterSpacing = 12;
const totalWidth = letters.length * letterWidth + (letters.length - 1) * letterSpacing;

export const ConstellationWordmark = ({ onComplete }: { onComplete?: () => void }) => {
  const [phase, setPhase] = useState<'stars' | 'lines' | 'complete'>('stars');
  
  // Generate all stars with their absolute positions
  const allStars: StarNode[] = [];
  const allLines: StarLine[] = [];
  
  letters.forEach((letter, letterIndex) => {
    const letterX = letterIndex * (letterWidth + letterSpacing);
    const data = letterData[letter];
    
    data.stars.forEach((star, starIndex) => {
      allStars.push({
        id: `${letter}-${starIndex}`,
        x: letterX + (star.x / 100) * letterWidth,
        y: (star.y / 100) * 80, // Height of 80
        delay: letterIndex * 0.15 + starIndex * 0.05,
      });
    });
    
    data.lines.forEach((line, lineIndex) => {
      const star1 = data.stars[line[0]];
      const star2 = data.stars[line[1]];
      allLines.push({
        id: `${letter}-line-${lineIndex}`,
        x1: letterX + (star1.x / 100) * letterWidth,
        y1: (star1.y / 100) * 80,
        x2: letterX + (star2.x / 100) * letterWidth,
        y2: (star2.y / 100) * 80,
        delay: letterIndex * 0.12 + lineIndex * 0.06,
      });
    });
  });

  useEffect(() => {
    // Stars appear first
    const starsTimer = setTimeout(() => {
      setPhase('lines');
    }, 800);
    
    // Lines draw after stars
    const linesTimer = setTimeout(() => {
      setPhase('complete');
      onComplete?.();
    }, 2000);
    
    return () => {
      clearTimeout(starsTimer);
      clearTimeout(linesTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full flex justify-center">
      <svg
        viewBox={`-10 -10 ${totalWidth + 20} 100`}
        className="w-full max-w-[320px] h-auto"
        style={{ overflow: 'visible' }}
      >
        {/* Glow filter */}
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines (draw after stars) */}
        {allLines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(245, 245, 240, 0.4)"
            strokeWidth="0.8"
            filter="url(#lineGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase !== 'stars' ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              pathLength: { duration: 0.4, delay: line.delay, ease: "easeOut" },
              opacity: { duration: 0.2, delay: line.delay }
            }}
          />
        ))}
        
        {/* Stars */}
        {allStars.map((star) => (
          <motion.g key={star.id} filter="url(#starGlow)">
            {/* Outer glow */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r="4"
              fill="rgba(255, 229, 180, 0.3)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: star.delay,
                ease: "easeOut"
              }}
            />
            {/* Core star */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r="2"
              fill="#F5F5F0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: [0, 1, 0.8, 1],
              }}
              transition={{
                scale: { duration: 0.3, delay: star.delay, ease: "easeOut" },
                opacity: { 
                  duration: 2, 
                  delay: star.delay, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};
