import { useMemo, ReactNode } from "react";

interface NightSkyBackgroundProps {
  children: ReactNode;
  starCount?: number;
  forceMidnight?: boolean;
}

type TimeOfDay = "morning" | "day" | "evening" | "night";

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

// Background gradients that transition from warm/light (day) to dark (night)
const getBackgroundGradient = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case "morning":
      return `linear-gradient(
        180deg,
        hsl(35 15% 12%) 0%,
        hsl(30 12% 10%) 30%,
        hsl(28 10% 9%) 60%,
        hsl(30 12% 10%) 85%,
        hsl(35 15% 12%) 100%
      )`;
    case "day":
      return `linear-gradient(
        180deg,
        hsl(38 18% 14%) 0%,
        hsl(35 15% 12%) 30%,
        hsl(32 12% 10%) 60%,
        hsl(35 15% 12%) 85%,
        hsl(38 18% 14%) 100%
      )`;
    case "evening":
      return `linear-gradient(
        180deg,
        hsl(32 12% 8%) 0%,
        hsl(28 10% 6%) 30%,
        hsl(25 10% 5%) 60%,
        hsl(28 10% 6%) 85%,
        hsl(32 12% 8%) 100%
      )`;
    case "night":
    default:
      return `linear-gradient(
        180deg,
        hsl(30 8% 3%) 0%,
        hsl(25 10% 4%) 30%,
        hsl(20 12% 5%) 60%,
        hsl(25 10% 4%) 85%,
        hsl(30 8% 3%) 100%
      )`;
  }
};

// Star opacity multiplier based on time of day
const getStarOpacityMultiplier = (timeOfDay: TimeOfDay): number => {
  switch (timeOfDay) {
    case "morning":
      return 0.4;
    case "day":
      return 0.25;
    case "evening":
      return 0.7;
    case "night":
    default:
      return 1.0;
  }
};

// Generate random background stars for night sky effect
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    // Varied sizes - mostly tiny pinpricks
    const sizeRoll = Math.random();
    let size: number;
    let hasFlare = false;
    
    if (sizeRoll > 0.97) {
      // ~3% are larger featured stars with cross flares
      size = 2.0 + Math.random() * 1.5;
      hasFlare = true;
    } else if (sizeRoll > 0.92) {
      // ~5% are medium-bright stars
      size = 1.2 + Math.random() * 0.8;
    } else if (sizeRoll > 0.75) {
      // ~17% are small visible stars
      size = 0.6 + Math.random() * 0.5;
    } else {
      // ~75% are tiny pinpricks
      size = 0.3 + Math.random() * 0.3;
    }
    
    // Varied brightness - some very dim, some bright
    const brightnessRoll = Math.random();
    let opacity: number;
    if (brightnessRoll > 0.92) {
      opacity = 0.6 + Math.random() * 0.35; // Bright stars
    } else if (brightnessRoll > 0.7) {
      opacity = 0.25 + Math.random() * 0.25; // Medium stars
    } else if (brightnessRoll > 0.4) {
      opacity = 0.10 + Math.random() * 0.12; // Dim stars
    } else {
      opacity = 0.04 + Math.random() * 0.05; // Very faint stars
    }
    
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      opacity,
      hasFlare,
    });
  }
  return stars;
};

export const NightSkyBackground = ({ children, starCount = 400, forceMidnight = false }: NightSkyBackgroundProps) => {
  const timeOfDay = useMemo(() => forceMidnight ? "night" as TimeOfDay : getTimeOfDay(), [forceMidnight]);
  const backgroundGradient = useMemo(() => getBackgroundGradient(timeOfDay), [timeOfDay]);
  const starOpacityMultiplier = useMemo(() => getStarOpacityMultiplier(timeOfDay), [timeOfDay]);
  const backgroundStars = useMemo(() => generateBackgroundStars(starCount), [starCount]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic background based on time of day */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: backgroundGradient,
          zIndex: -3,
        }}
      />
      
      {/* Subtle warm vignette */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          background: `radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, hsla(25, 15%, 2%, 0.6) 100%)`,
        }}
      />
      
      {/* Milky Way band - diagonal ethereal glow */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          opacity: 0.12 * starOpacityMultiplier,
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              transparent 25%,
              hsla(35, 15%, 35%, 0.3) 35%,
              hsla(30, 20%, 45%, 0.5) 42%,
              hsla(35, 25%, 55%, 0.6) 48%,
              hsla(40, 20%, 50%, 0.55) 52%,
              hsla(35, 20%, 45%, 0.5) 58%,
              hsla(30, 15%, 35%, 0.3) 65%,
              transparent 75%,
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Milky Way cloudy texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          opacity: 0.08 * starOpacityMultiplier,
          background: `
            radial-gradient(ellipse 25% 15% at 30% 45%, hsla(35, 25%, 60%, 0.6) 0%, transparent 70%),
            radial-gradient(ellipse 20% 12% at 45% 40%, hsla(40, 20%, 55%, 0.5) 0%, transparent 65%),
            radial-gradient(ellipse 18% 10% at 55% 48%, hsla(30, 30%, 50%, 0.55) 0%, transparent 60%),
            radial-gradient(ellipse 22% 14% at 65% 42%, hsla(35, 25%, 55%, 0.5) 0%, transparent 70%),
            radial-gradient(ellipse 15% 8% at 38% 52%, hsla(40, 20%, 60%, 0.4) 0%, transparent 55%),
            radial-gradient(ellipse 20% 10% at 58% 38%, hsla(30, 25%, 50%, 0.45) 0%, transparent 60%)
          `,
        }}
      />
      
      {/* Very subtle dust/grain texture via noise-like gradient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          zIndex: -2,
          background: `
            radial-gradient(ellipse 50% 40% at 30% 35%, hsla(35, 30%, 20%, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 70% 65%, hsla(30, 25%, 15%, 0.3) 0%, transparent 45%)
          `,
        }}
      />
      
      {/* Scattered star dots - opacity adjusted by time of day */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000" style={{ zIndex: -1 }}>
        {backgroundStars.map((star, i) => {
          const adjustedOpacity = star.opacity * starOpacityMultiplier;
          
          return (
            <div key={`night-star-${i}`}>
              {/* Base star - warm white/cream color */}
              <div
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.hasFlare ? '#fffef8' : '#f8f6f0',
                  opacity: adjustedOpacity,
                  boxShadow: star.hasFlare 
                    ? `0 0 ${star.size * 4}px ${star.size * 1.5}px rgba(255,252,240,${0.4 * starOpacityMultiplier}), 0 0 ${star.size * 8}px ${star.size * 2}px rgba(255,250,235,${0.15 * starOpacityMultiplier})` 
                    : star.size > 1 
                      ? `0 0 ${star.size * 2}px ${star.size * 0.5}px rgba(255,250,240,${0.2 * starOpacityMultiplier})`
                      : undefined,
                }}
              />
              {/* Cross flare for featured stars */}
              {star.hasFlare && (
                <>
                  {/* Horizontal flare */}
                  <div
                    className="absolute"
                    style={{
                      left: `calc(${star.x}% - ${star.size * 6}px)`,
                      top: `calc(${star.y}% - 0.5px)`,
                      width: `${star.size * 12}px`,
                      height: '1px',
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${adjustedOpacity * 0.6}) 50%, transparent 100%)`,
                    }}
                  />
                  {/* Vertical flare */}
                  <div
                    className="absolute"
                    style={{
                      left: `calc(${star.x}% - 0.5px)`,
                      top: `calc(${star.y}% - ${star.size * 6}px)`,
                      width: '1px',
                      height: `${star.size * 12}px`,
                      background: `linear-gradient(180deg, transparent 0%, rgba(255,252,240,${adjustedOpacity * 0.6}) 50%, transparent 100%)`,
                    }}
                  />
                  {/* Diagonal flares for more prominent stars */}
                  <div
                    className="absolute"
                    style={{
                      left: `calc(${star.x}% - ${star.size * 3}px)`,
                      top: `calc(${star.y}% - ${star.size * 3}px)`,
                      width: `${star.size * 6}px`,
                      height: '1px',
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${adjustedOpacity * 0.3}) 50%, transparent 100%)`,
                      transform: 'rotate(45deg)',
                      transformOrigin: 'center',
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: `calc(${star.x}% - ${star.size * 3}px)`,
                      top: `calc(${star.y}% + ${star.size * 3}px)`,
                      width: `${star.size * 6}px`,
                      height: '1px',
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${adjustedOpacity * 0.3}) 50%, transparent 100%)`,
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center',
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
