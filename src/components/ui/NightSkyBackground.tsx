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
      size = 1.8 + Math.random() * 1.2;
      hasFlare = true;
    } else if (sizeRoll > 0.85) {
      size = 1.0 + Math.random() * 0.8;
    } else {
      size = 0.4 + Math.random() * 0.5;
    }
    
    // Varied brightness
    const brightnessRoll = Math.random();
    let opacity: number;
    if (brightnessRoll > 0.9) {
      opacity = 0.30 + Math.random() * 0.20;
    } else if (brightnessRoll > 0.5) {
      opacity = 0.12 + Math.random() * 0.12;
    } else {
      opacity = 0.05 + Math.random() * 0.06;
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

export const NightSkyBackground = ({ children, starCount = 120 }: NightSkyBackgroundProps) => {
  const backgroundStars = useMemo(() => generateBackgroundStars(starCount), [starCount]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Night sky gradient background with cosmic purple/blue tones */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(240 25% 4%) 0%,
            hsl(250 30% 6%) 20%,
            hsl(260 28% 7%) 40%,
            hsl(270 25% 8%) 60%,
            hsl(275 22% 9%) 80%,
            hsl(280 18% 10%) 100%
          )`,
          zIndex: -3,
        }}
      />
      
      {/* Nebula texture overlay using CSS noise */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.08]"
        style={{
          zIndex: -2,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, hsla(280, 60%, 25%, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 75% 70%, hsla(250, 50%, 20%, 0.35) 0%, transparent 45%),
            radial-gradient(ellipse 50% 60% at 50% 50%, hsla(260, 40%, 15%, 0.3) 0%, transparent 55%)
          `,
        }}
      />
      
      {/* Secondary nebula layer for depth */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          zIndex: -2,
          background: `
            radial-gradient(ellipse 100% 80% at 30% 80%, hsla(300, 40%, 20%, 0.5) 0%, transparent 40%),
            radial-gradient(ellipse 70% 90% at 80% 20%, hsla(230, 50%, 18%, 0.4) 0%, transparent 45%)
          `,
        }}
      />
      
      {/* Scattered star dots */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {backgroundStars.map((star, i) => (
          <div key={`night-star-${i}`}>
            {/* Base star */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#ffffff',
                opacity: star.opacity,
                boxShadow: star.hasFlare 
                  ? `0 0 ${star.size * 3}px ${star.size}px rgba(255,255,255,0.3)` 
                  : undefined,
              }}
            />
            {/* Cross flare for featured stars */}
            {star.hasFlare && (
              <>
                <div
                  className="absolute"
                  style={{
                    left: `calc(${star.x}% - ${star.size * 4}px)`,
                    top: `calc(${star.y}% - 0.5px)`,
                    width: `${star.size * 8}px`,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${star.opacity * 0.5}) 50%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    left: `calc(${star.x}% - 0.5px)`,
                    top: `calc(${star.y}% - ${star.size * 4}px)`,
                    width: '1px',
                    height: `${star.size * 8}px`,
                    background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${star.opacity * 0.5}) 50%, transparent 100%)`,
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
