import { useMemo, ReactNode, useEffect, useState, useCallback } from "react";

interface NightSkyBackgroundProps {
  children: ReactNode;
  starCount?: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hasFlare: boolean;
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
}

// Generate random background stars for night sky effect
const generateBackgroundStars = (count: number): Star[] => {
  const stars: Star[] = [];
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
    
    // Varied brightness - more prominent overall
    const brightnessRoll = Math.random();
    let opacity: number;
    if (brightnessRoll > 0.88) {
      opacity = 0.75 + Math.random() * 0.25; // Bright stars
    } else if (brightnessRoll > 0.6) {
      opacity = 0.4 + Math.random() * 0.3; // Medium stars
    } else if (brightnessRoll > 0.3) {
      opacity = 0.2 + Math.random() * 0.2; // Dim stars
    } else {
      opacity = 0.08 + Math.random() * 0.1; // Faint stars
    }
    
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      opacity,
      hasFlare,
      twinkleDelay: Math.random() * 5, // Random start delay 0-5s
      twinkleDuration: 1.5 + Math.random() * 2.5, // 1.5-4s twinkle cycle (faster)
    });
  }
  return stars;
};

// Generate a random shooting star
const createShootingStar = (): ShootingStar => ({
  id: Date.now() + Math.random(),
  startX: Math.random() * 80 + 10, // 10-90% from left
  startY: Math.random() * 40, // Top 40% of screen
  angle: 25 + Math.random() * 20, // 25-45 degree angle
  duration: 0.6 + Math.random() * 0.4, // 0.6-1s duration
});

export const NightSkyBackground = ({ children, starCount = 400 }: NightSkyBackgroundProps) => {
  const backgroundStars = useMemo(() => generateBackgroundStars(starCount), [starCount]);
  const [mounted, setMounted] = useState(false);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Delay animation start to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Spawn shooting stars occasionally
  useEffect(() => {
    const spawnShootingStar = () => {
      setShootingStars(prev => [...prev, createShootingStar()]);
      
      // Schedule next shooting star (random interval 4-12 seconds)
      const nextDelay = 4000 + Math.random() * 8000;
      return setTimeout(spawnShootingStar, nextDelay);
    };

    // Initial delay before first shooting star (2-6 seconds)
    const initialDelay = 2000 + Math.random() * 4000;
    const initialTimer = setTimeout(() => {
      const recurringTimer = spawnShootingStar();
      return () => clearTimeout(recurringTimer);
    }, initialDelay);

    return () => clearTimeout(initialTimer);
  }, []);

  // Clean up old shooting stars
  const removeShootingStar = useCallback((id: number) => {
    setShootingStars(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Single dark background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'hsl(25 10% 4%)',
          zIndex: -6,
        }}
      />
      
      {/* Milky Way band - subtle diagonal glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -5,
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              transparent 35%,
              rgba(180, 160, 140, 0.03) 40%,
              rgba(200, 180, 160, 0.05) 45%,
              rgba(220, 200, 180, 0.06) 50%,
              rgba(200, 180, 160, 0.05) 55%,
              rgba(180, 160, 140, 0.03) 60%,
              transparent 65%,
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Cloudy texture overlay - nebula-like patches */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -4,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(160, 140, 120, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 75% 60%, rgba(140, 130, 120, 0.03) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 50% 80%, rgba(150, 135, 120, 0.025) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Vignette - darker edges */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -3,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />
      
      {/* Shooting stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -2 }}>
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: '100px',
              height: '2px',
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,252,240,0.9) 50%, rgba(255,255,255,0.3) 100%)`,
              borderRadius: '2px',
              transform: `rotate(${star.angle}deg)`,
              transformOrigin: 'left center',
              animation: `shootingStar ${star.duration}s ease-out forwards`,
              boxShadow: '0 0 6px 2px rgba(255,252,240,0.4)',
            }}
            onAnimationEnd={() => removeShootingStar(star.id)}
          />
        ))}
      </div>
      
      {/* Scattered star dots with twinkling */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {backgroundStars.map((star, i) => (
            <div key={`night-star-${i}`}>
              {/* Base star - warm white/cream color with twinkling */}
              <div
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.hasFlare ? '#fffef8' : '#f8f6f0',
                  opacity: mounted ? star.opacity : 0,
                  boxShadow: star.hasFlare 
                    ? `0 0 ${star.size * 4}px ${star.size * 1.5}px rgba(255,252,240,0.4), 0 0 ${star.size * 8}px ${star.size * 2}px rgba(255,250,235,0.15)` 
                    : star.size > 1 
                      ? `0 0 ${star.size * 2}px ${star.size * 0.5}px rgba(255,250,240,0.2)`
                      : undefined,
                  animation: mounted ? `twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite` : 'none',
                  transition: 'opacity 0.3s ease-out',
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${star.opacity * 0.6}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(180deg, transparent 0%, rgba(255,252,240,${star.opacity * 0.6}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${star.opacity * 0.3}) 50%, transparent 100%)`,
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,252,240,${star.opacity * 0.3}) 50%, transparent 100%)`,
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
