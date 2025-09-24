import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

interface FirstTimeTooltipProps {
  target: HTMLElement | null;
  onDismiss: () => void;
}

export const FirstTimeTooltip = ({ target, onDismiss }: FirstTimeTooltipProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [target]);

  if (!target) return null;

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onDismiss} />
      
      {/* Circular highlight perfectly centered on button */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 animate-pulse shadow-2xl backdrop-blur-sm">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-white/10 to-white/5" />
        </div>
      </div>

      {/* Tooltip card positioned above the highlight */}
      <div
        className="fixed z-50 max-w-xs"
        style={{
          top: position.top - 150,
          left: position.left,
          transform: 'translateX(-50%)'
        }}
      >
        <div className="bg-background rounded-lg border shadow-2xl p-4 animate-in fade-in-50 slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Start tracking!</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Tap the + button to log feeds, naps, diaper changes, and notes.
              </p>
              <Button 
                size="sm" 
                onClick={onDismiss}
                className="text-xs h-7 w-full"
              >
                Got it!
              </Button>
            </div>
          </div>
          
          {/* Arrow pointing down to button */}
          <div 
            className="absolute w-3 h-3 bg-background border-r border-b border-border transform rotate-45"
            style={{
              bottom: -6,
              left: '50%',
              marginLeft: -6,
            }}
          />
        </div>
      </div>
    </>
  );
};