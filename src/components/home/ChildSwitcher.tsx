import { useRef, useState } from "react";
import { MapPin, List } from "lucide-react";
import { Baby } from "@/hooks/useBabies";
import { useNavigate } from "react-router-dom";

interface ChildSwitcherProps {
  babies: Baby[];
  activeBaby: Baby | null;
  onSwitch: (babyId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenMenu?: () => void;
}

export const ChildSwitcher = ({ 
  babies, 
  activeBaby, 
  onSwitch,
  onNext, 
  onPrev,
  onOpenMenu
}: ChildSwitcherProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const navigate = useNavigate();

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && babies.length > 1) {
      onNext();
    }
    if (isRightSwipe && babies.length > 1) {
      onPrev();
    }
  };

  if (!activeBaby) return null;

  const currentIndex = babies.findIndex(b => b.id === activeBaby.id);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-40"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Translucent bar like Weather app */}
      <div className="mx-4 mb-4 rounded-full bg-muted/60 backdrop-blur-xl border border-border/30 flex items-center justify-between px-2 py-2">
        {/* Left icon - Map/location style */}
        <button 
          onClick={() => navigate("/settings")}
          className="w-11 h-11 rounded-full bg-muted/80 flex items-center justify-center"
        >
          <MapPin className="w-5 h-5 text-foreground" />
        </button>

        {/* Center - Pagination dots with location indicator */}
        <div className="flex-1 flex justify-center items-center gap-1.5">
          {babies.map((baby, index) => (
            <button
              key={baby.id}
              onClick={() => onSwitch(baby.id)}
              className="flex items-center justify-center"
              aria-label={`Switch to ${baby.name}`}
            >
              {index === currentIndex ? (
                <div className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-foreground fill-foreground" />
                </div>
              ) : (
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right icon - List/menu */}
        <button 
          onClick={onOpenMenu}
          className="w-11 h-11 rounded-full bg-muted/80 flex items-center justify-center"
        >
          <List className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};
