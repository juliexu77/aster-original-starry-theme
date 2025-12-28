import { useMemo, ReactNode } from "react";

interface NightSkyBackgroundProps {
  children: ReactNode;
  starCount?: number;
}

// Generate random background stars for night sky effect
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.08 + Math.random() * 0.12, // 8-20% opacity range
    });
  }
  return stars;
};

export const NightSkyBackground = ({ children, starCount = 120 }: NightSkyBackgroundProps) => {
  const backgroundStars = useMemo(() => generateBackgroundStars(starCount), [starCount]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Night sky gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(240 20% 4%) 0%,
            hsl(250 25% 6%) 25%,
            hsl(260 20% 7%) 50%,
            hsl(270 18% 8%) 75%,
            hsl(280 15% 9%) 100%
          )`,
          zIndex: -2,
        }}
      />
      
      {/* Scattered star dots */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {backgroundStars.map((star, i) => (
          <div
            key={`night-star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#ffffff',
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
