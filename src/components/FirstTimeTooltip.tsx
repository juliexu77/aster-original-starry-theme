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
    if (target) {
      const rect = target.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2
      });
    }
  }, [target]);

  if (!target) return null;

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onDismiss} />
      
      {/* Circular highlight around the + button */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 animate-pulse flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Tooltip card positioned above */}
      <Card 
        className="fixed z-50 p-4 max-w-xs bg-background border shadow-xl animate-in fade-in-50 slide-in-from-bottom-2"
        style={{
          top: position.top - 140,
          left: position.left,
          transform: 'translateX(-50%)'
        }}
      >
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
          className="absolute w-3 h-3 bg-background border-r border-b transform rotate-45 -bottom-1.5"
          style={{
            left: '50%',
            marginLeft: -6,
          }}
        />
      </Card>
    </>
  );
};