import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Zodiac glyphs in order
const ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// Planet symbols and their orbital speeds (degrees per second for animation)
const PLANETS = [
  { symbol: '☽', name: 'Moon', speed: 12, orbitRadius: 0.85 },    // Moon fastest
  { symbol: '☿', name: 'Mercury', speed: 8, orbitRadius: 0.75 },
  { symbol: '♀', name: 'Venus', speed: 6, orbitRadius: 0.65 },
  { symbol: '☉', name: 'Sun', speed: 4, orbitRadius: 0.55 },
  { symbol: '♂', name: 'Mars', speed: 2, orbitRadius: 0.45 },     // Mars slowest
];

// Natal planet positions (fixed, dimmer) - positioned around the wheel
const NATAL_POSITIONS = [
  { symbol: '☉', angle: 45 },   // Sun natal
  { symbol: '☽', angle: 130 },  // Moon natal
  { symbol: '☿', angle: 75 },   // Mercury natal
  { symbol: '♀', angle: 200 },  // Venus natal
  { symbol: '♂', angle: 280 },  // Mars natal
  { symbol: '♃', angle: 320 },  // Jupiter natal
  { symbol: '♄', angle: 160 },  // Saturn natal
];

// Aspect angles (major aspects)
const ASPECTS = [
  { angle: 0, name: 'conjunction', orb: 10 },
  { angle: 60, name: 'sextile', orb: 6 },
  { angle: 90, name: 'square', orb: 8 },
  { angle: 120, name: 'trine', orb: 8 },
  { angle: 180, name: 'opposition', orb: 10 },
];

const LOADING_MESSAGES = [
  "Weaving your story with the stars...",
  "Calculating the cosmic weather...",
  "Charting the celestial movements...",
  "Reading the planetary patterns...",
  "Consulting the ephemeris...",
];

interface AspectLine {
  id: string;
  fromAngle: number;
  toAngle: number;
  fromRadius: number;
  toRadius: number;
  createdAt: number;
}

export const CosmosLoading = () => {
  const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length));
  const [planetAngles, setPlanetAngles] = useState<number[]>(() => 
    PLANETS.map((_, i) => (i * 72) % 360) // Evenly distribute starting positions
  );
  const [aspectLines, setAspectLines] = useState<AspectLine[]>([]);
  
  const chartSize = 240;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const outerRadius = chartSize / 2 - 10;
  const zodiacRadius = outerRadius - 15;
  const natalRadius = outerRadius - 40;

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate planet positions
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setPlanetAngles(prev => 
        prev.map((angle, i) => (angle + PLANETS[i].speed * deltaTime) % 360)
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Check for aspects and create aspect lines
  useEffect(() => {
    const checkAspects = () => {
      const now = Date.now();
      const newAspects: AspectLine[] = [];

      planetAngles.forEach((transitAngle, planetIndex) => {
        NATAL_POSITIONS.forEach((natal, natalIndex) => {
          const angleDiff = Math.abs(((transitAngle - natal.angle) + 180) % 360 - 180);
          
          ASPECTS.forEach(aspect => {
            const aspectDiff = Math.abs(angleDiff - aspect.angle);
            if (aspectDiff < aspect.orb) {
              const id = `${planetIndex}-${natalIndex}-${aspect.name}`;
              // Only add if not already active
              if (!aspectLines.some(l => l.id === id)) {
                newAspects.push({
                  id,
                  fromAngle: transitAngle,
                  toAngle: natal.angle,
                  fromRadius: PLANETS[planetIndex].orbitRadius * natalRadius,
                  toRadius: natalRadius,
                  createdAt: now,
                });
              }
            }
          });
        });
      });

      if (newAspects.length > 0) {
        setAspectLines(prev => [...prev, ...newAspects].slice(-6)); // Keep max 6 lines
      }

      // Remove old aspect lines
      setAspectLines(prev => prev.filter(line => now - line.createdAt < 2000));
    };

    const interval = setInterval(checkAspects, 200);
    return () => clearInterval(interval);
  }, [planetAngles, aspectLines]);

  // Calculate position from angle and radius
  const getPosition = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180; // Start from top
    return {
      x: centerX + Math.cos(rad) * radius,
      y: centerY + Math.sin(rad) * radius,
    };
  };

  // Generate starfield
  const stars = useMemo(() => 
    [...Array(30)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    })), []
  );

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-12 relative">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-foreground/40"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
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
      <div className="relative mb-10">
        <svg
          width={chartSize}
          height={chartSize}
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="drop-shadow-lg"
        >
          <defs>
            {/* Silver/muted gradient - matching chart styling */}
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0E0E0" />
              <stop offset="50%" stopColor="#D0D0D0" />
              <stop offset="100%" stopColor="#B0B0B0" />
            </linearGradient>
            
            {/* Glow filter for aspect lines */}
            <filter id="aspectGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle glow for center */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0E0E0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center glow */}
          <circle cx={centerX} cy={centerY} r={40} fill="url(#centerGlow)" />

          {/* Outer zodiac wheel */}
          <circle
            cx={centerX}
            cy={centerY}
            r={outerRadius}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Inner circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={natalRadius - 10}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* Zodiac signs around perimeter */}
          {ZODIAC_GLYPHS.map((glyph, i) => {
            const angle = (i * 30) + 15; // 30 degrees per sign, centered
            const pos = getPosition(angle, zodiacRadius);
            return (
              <text
                key={i}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground/70 text-[10px] font-light select-none"
                style={{ fontFamily: 'serif' }}
              >
                {glyph}
              </text>
            );
          })}

          {/* Division lines between signs */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30;
            const inner = getPosition(angle, natalRadius);
            const outer = getPosition(angle, outerRadius - 5);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#E0E0E0"
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}

          {/* Aspect lines (animated) */}
          <AnimatePresence>
            {aspectLines.map((line) => {
              const from = getPosition(line.fromAngle, line.fromRadius);
              const to = getPosition(line.toAngle, line.toRadius);
              const age = Date.now() - line.createdAt;
              const opacity = age < 300 ? age / 300 : age > 1500 ? (2000 - age) / 500 : 1;
              
              return (
                <motion.line
                  key={line.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: opacity * 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </AnimatePresence>

          {/* Natal planets (fixed, dimmer) */}
          {NATAL_POSITIONS.map((planet, i) => {
            const pos = getPosition(planet.angle, natalRadius);
            return (
              <text
                key={`natal-${i}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground/40 text-[8px] select-none"
                style={{ fontFamily: 'serif' }}
              >
                {planet.symbol}
              </text>
            );
          })}

          {/* Transiting planets (moving, brighter) */}
          {PLANETS.map((planet, i) => {
            const pos = getPosition(planetAngles[i], planet.orbitRadius * natalRadius);
            return (
              <g key={`transit-${i}`}>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground/90 text-[11px] select-none"
                  style={{ 
                    fontFamily: 'serif',
                  }}
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}

          {/* Center decoration - small 8-pointed star */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const isCardinal = angle % 90 === 0;
              const length = isCardinal ? 12 : 8;
              const width = isCardinal ? 3 : 2;
              return (
                <path
                  key={angle}
                  d={`M 0 ${-length} L ${width/2} 0 L 0 ${length * 0.3} L ${-width/2} 0 Z`}
                  fill="url(#chartGradient)"
                  transform={`rotate(${angle})`}
                  opacity="0.8"
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-[14px] text-foreground/60 font-serif text-center tracking-wide"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Subtle loading dots */}
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 rounded-full bg-foreground/40"
          />
        ))}
      </div>
    </div>
  );
};
