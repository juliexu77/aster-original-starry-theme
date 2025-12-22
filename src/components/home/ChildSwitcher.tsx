import { useRef, useState } from "react";
import { MapPin, Users, Settings } from "lucide-react";
import { Baby } from "@/hooks/useBabies";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  const minSwipeDistance = 50;
  const isHome = location.pathname === "/" || location.pathname === "/app";

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
      <div className="mx-4 mb-4 rounded-full bg-muted/60 backdrop-blur-xl border border-border/30 flex items-center justify-between px-2 py-2">
        {/* Left - Today tab (active) */}
        <button 
          onClick={() => navigate("/")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            isHome ? "bg-muted/80" : ""
          }`}
        >
          <MapPin className="w-4 h-4 text-foreground" />
          <span className="text-xs text-foreground">Today</span>
        </button>

        {/* Center - Child pagination dots */}
        <div className="flex-1 flex justify-center items-center gap-1.5">
          {babies.map((baby, index) => (
            <button
              key={baby.id}
              onClick={() => onSwitch(baby.id)}
              className="flex items-center justify-center"
              aria-label={`Switch to ${baby.name}`}
            >
              {index === currentIndex ? (
                <div className="w-2 h-2 bg-foreground rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right side - Family and Settings */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate("/family")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
          >
            <Users className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};
