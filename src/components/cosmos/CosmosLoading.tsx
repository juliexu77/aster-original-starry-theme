import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconZodiacAries,
  IconZodiacTaurus,
  IconZodiacGemini,
  IconZodiacCancer,
  IconZodiacLeo,
  IconZodiacVirgo,
  IconZodiacLibra,
  IconZodiacScorpio,
  IconZodiacSagittarius,
  IconZodiacCapricorn,
  IconZodiacAquarius,
  IconZodiacPisces,
} from "@tabler/icons-react";
import { ZodiacSign } from "@/lib/zodiac";

// Zodiac signs in order with their icons
const ZODIAC_SIGNS: { sign: ZodiacSign; Icon: typeof IconZodiacAries }[] = [
  { sign: 'aries', Icon: IconZodiacAries },
  { sign: 'taurus', Icon: IconZodiacTaurus },
  { sign: 'gemini', Icon: IconZodiacGemini },
  { sign: 'cancer', Icon: IconZodiacCancer },
  { sign: 'leo', Icon: IconZodiacLeo },
  { sign: 'virgo', Icon: IconZodiacVirgo },
  { sign: 'libra', Icon: IconZodiacLibra },
  { sign: 'scorpio', Icon: IconZodiacScorpio },
  { sign: 'sagittarius', Icon: IconZodiacSagittarius },
  { sign: 'capricorn', Icon: IconZodiacCapricorn },
  { sign: 'aquarius', Icon: IconZodiacAquarius },
  { sign: 'pisces', Icon: IconZodiacPisces },
];

// Planet symbols for text rendering
const PLANET_SYMBOLS = {
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  sun: '☉',
  mars: '♂',
};

// Natal planet positions with orbital periods (relative animation speeds)
// Faster orbits = shorter duration, scaled for visual effect
const NATAL_POSITIONS = [
  { symbol: '☉', angle: 45, duration: 60 },    // Sun - baseline
  { symbol: '☽', angle: 130, duration: 12 },   // Moon - fastest (~27 days)
  { symbol: '☿', angle: 75, duration: 20 },    // Mercury (~88 days)
  { symbol: '♀', angle: 200, duration: 35 },   // Venus (~225 days)
  { symbol: '♂', angle: 280, duration: 80 },   // Mars (~687 days)
  { symbol: '♃', angle: 320, duration: 180 },  // Jupiter (~12 years)
  { symbol: '♄', angle: 160, duration: 300 },  // Saturn (~29 years)
];

const LOADING_MESSAGES = [
  "Weaving your story with the stars...",
  "Calculating the cosmic weather...",
  "Charting the celestial movements...",
  "Reading the planetary patterns...",
  "Consulting the ephemeris...",
];

// Silver color matching the birth chart
const CHART_COLOR = '#E0E0E0';

export const CosmosLoading = () => {
  const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length));
  
  const chartSize = 260;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const outerRadius = chartSize / 2 - 10;
  const innerRingRadius = outerRadius - 32;
  const zodiacRadius = outerRadius - 16;
  const natalRadius = innerRingRadius - 20;

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Calculate position from angle and radius
  const getPosition = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + Math.cos(rad) * radius,
      y: centerY + Math.sin(rad) * radius,
    };
  };

  // Generate starfield
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.3,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })), []
  );

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-12 relative">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-foreground/30"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Natal Chart Animation */}
      <motion.div 
        className="relative mb-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <svg
          width={chartSize}
          height={chartSize}
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="drop-shadow-lg"
        >
          <defs>
            {/* Silver gradient */}
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="50%" stopColor="#D8D8D8" />
              <stop offset="100%" stopColor="#C0C0C0" />
            </linearGradient>
            
            {/* Subtle center glow */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={CHART_COLOR} stopOpacity="0.12" />
              <stop offset="100%" stopColor={CHART_COLOR} stopOpacity="0" />
            </radialGradient>

            {/* Outer glow for mystical effect */}
            <filter id="outerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Elegant outer ring - slow rotation */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          >
            <circle
              cx={centerX}
              cy={centerY}
              r={outerRadius}
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="0.75"
              opacity="0.9"
            />
          </motion.g>

          {/* Inner ring - contains zodiac band */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRingRadius}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="0.75"
            opacity="0.7"
          />

          {/* Center glow */}
          <circle cx={centerX} cy={centerY} r={55} fill="url(#centerGlow)" />

          {/* Innermost circle - very slow counter-rotation */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          >
            <circle
              cx={centerX}
              cy={centerY}
              r={natalRadius}
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </motion.g>

          {/* Elegant division lines between signs - thin and complete */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const inner = getPosition(angle, innerRingRadius);
            const outer = getPosition(angle, outerRadius);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={CHART_COLOR}
                strokeWidth="0.5"
                opacity="0.4"
              />
            );
          })}

          {/* Zodiac signs centered in each segment - counter-rotating, dimmer */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          >
            {ZODIAC_SIGNS.map(({ Icon }, i) => {
              const angle = (i * 30) + 15;
              const pos = getPosition(angle, (outerRadius + innerRingRadius) / 2);
              return (
                <motion.g 
                  key={i} 
                  transform={`translate(${pos.x - 7}, ${pos.y - 7})`}
                  animate={{ opacity: [0.25, 0.45, 0.25] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <Icon size={14} strokeWidth={1.25} className="text-foreground/50" />
                </motion.g>
              );
            })}
          </motion.g>

          {/* Orbiting planets around center - each with unique orbital speed */}
          {NATAL_POSITIONS.map((planet, i) => {
            const orbitRadius = 25 + (i * 8);
            const pos = getPosition(planet.angle, orbitRadius);
            return (
              <motion.g
                key={`natal-${i}`}
                animate={{ rotate: 360 }}
                transition={{ duration: planet.duration, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              >
                <motion.text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground select-none"
                  style={{ fontFamily: 'serif', fontSize: '16px', fontWeight: 500 }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                >
                  {planet.symbol}
                </motion.text>
              </motion.g>
            );
          })}

          {/* Floating aspect lines - ethereal connections */}
          {[0, 1, 2].map((i) => {
            const startAngle = (i * 120) + 30;
            const endAngle = startAngle + 60;
            const start = getPosition(startAngle, natalRadius - 20);
            const end = getPosition(endAngle, natalRadius - 20);
            return (
              <motion.line
                key={`aspect-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={CHART_COLOR}
                strokeWidth="0.5"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: [0, 0.2, 0.2, 0],
                  pathLength: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Center dot - understated like a real star */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={3}
            fill="url(#chartGradient)"
            animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[14px] text-foreground/50 font-serif text-center tracking-wide"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Subtle breathing dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.35,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 rounded-full bg-foreground/30"
          />
        ))}
      </div>
    </div>
  );
};
