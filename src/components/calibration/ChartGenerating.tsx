import { useEffect, useState } from "react";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

interface ChartGeneratingProps {
  babyName: string;
  onComplete?: () => void;
}

export function ChartGenerating({ babyName, onComplete }: ChartGeneratingProps) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => (prev % 3) + 1);
    }, 400);

    // Complete after deliberate delay (only if onComplete provided)
    const timer = onComplete ? setTimeout(() => {
      onComplete();
    }, 2500) : undefined;

    return () => {
      clearInterval(dotInterval);
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <NightSkyBackground forceMidnight>
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-6">
          {/* Subtle animated circle */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border border-foreground/10 animate-pulse" />
            <div 
              className="absolute inset-2 rounded-full border border-foreground/20"
              style={{ animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}
            />
            <div 
              className="absolute inset-4 rounded-full border border-foreground/30"
              style={{ animation: 'pulse 1.5s ease-in-out infinite 0.4s' }}
            />
          </div>

          <p className="text-[14px] text-foreground/60 font-serif">
            Generating {babyName}'s developmental chart{'.'.repeat(dots)}
          </p>
        </div>
      </div>
    </NightSkyBackground>
  );
}
