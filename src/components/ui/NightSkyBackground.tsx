import { useMemo, ReactNode } from "react";

interface NightSkyBackgroundProps {
  children: ReactNode;
  starCount?: number;
}

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

export const NightSkyBackground = ({ children, starCount = 400 }: NightSkyBackgroundProps) => {
  const backgroundStars = useMemo(() => generateBackgroundStars(starCount), [starCount]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Single dark background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, hsl(230 20% 6%) 0%, hsl(240 15% 4%) 50%, hsl(250 18% 5%) 100%)',
          zIndex: -3,
        }}
      />
      
      {/* Scattered star dots */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {backgroundStars.map((star, i) => (
            <div key={`night-star-${i}`}>
              {/* Base star - cool white/silver color with celestial glow */}
              <div
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.hasFlare ? '#e8f0ff' : '#d4e0f7',
                  opacity: star.opacity,
                  boxShadow: star.hasFlare 
                    ? `0 0 ${star.size * 5}px ${star.size * 2}px rgba(180,200,255,0.5), 0 0 ${star.size * 10}px ${star.size * 3}px rgba(150,180,255,0.2)` 
                    : star.size > 1 
                      ? `0 0 ${star.size * 3}px ${star.size}px rgba(180,200,255,0.3)`
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(180,200,255,${star.opacity * 0.7}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(180deg, transparent 0%, rgba(180,200,255,${star.opacity * 0.7}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(180,200,255,${star.opacity * 0.4}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(180,200,255,${star.opacity * 0.4}) 50%, transparent 100%)`,
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center',
                    }}
                  />
                </>
              )}
            </div>
          ))}
      </div>
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
