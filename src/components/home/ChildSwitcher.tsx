import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Baby } from "@/hooks/useBabies";

interface ChildSwitcherProps {
  babies: Baby[];
  activeBaby: Baby | null;
  onSwitch: (babyId: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const getAgeLabel = (birthday: string | null): string => {
  if (!birthday) return "";
  
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffDays / 7);
  
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''}`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
};

export const ChildSwitcher = ({ 
  babies, 
  activeBaby, 
  onSwitch,
  onNext, 
  onPrev 
}: ChildSwitcherProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const current = e.targetTouches[0].clientX;
    setTouchEnd(current);
    if (touchStart && babies.length > 1) {
      // Calculate offset for visual feedback (capped)
      const diff = current - touchStart;
      setSwipeOffset(Math.max(-30, Math.min(30, diff * 0.3)));
    }
  };

  const onTouchEnd = () => {
    setSwipeOffset(0);
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
  const showNavigation = babies.length > 1;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border/30 safe-area-inset-bottom"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pagination dots - Apple Weather style */}
      <div className="flex justify-center items-center gap-1.5 py-3">
        {showNavigation ? (
          babies.map((baby, index) => (
            <button
              key={baby.id}
              onClick={() => onSwitch(baby.id)}
              className={`transition-all duration-200 ${
                index === currentIndex 
                  ? 'w-2 h-2 bg-foreground rounded-full' 
                  : 'w-1.5 h-1.5 bg-muted-foreground/40 rounded-full hover:bg-muted-foreground/60'
              }`}
              aria-label={`Switch to ${baby.name}`}
            />
          ))
        ) : (
          <div className="w-2 h-2 bg-foreground rounded-full" />
        )}
      </div>
    </div>
  );
};
