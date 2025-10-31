import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface RhythmUnlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName?: string;
  totalLogs: number;
}

export const RhythmUnlockedModal = ({ isOpen, onClose, babyName, totalLogs }: RhythmUnlockedModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const name = babyName?.split(' ')[0] || 'Baby';

  useEffect(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      
      // Trigger confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isAnimating, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-8 text-center border-primary/20">
        <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              ✨ Rhythm unlocked!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on {name}'s last {totalLogs} logs, I've started recognizing their daily rhythm. You'll see more precise predictions as you keep logging.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground italic">
              The more you log, the smarter my predictions get.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
