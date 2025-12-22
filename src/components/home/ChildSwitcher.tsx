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
      className="relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Content area with swipe transform */}
      <div 
        className="px-5 py-6 text-center transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <h1 className="text-2xl font-serif text-foreground mb-1">
          {activeBaby.name}
        </h1>
        {activeBaby.birthday && (
          <p className="text-sm text-muted-foreground">
            {getAgeLabel(activeBaby.birthday)}
          </p>
        )}
      </div>

      {/* Pagination dots - Apple Weather style, positioned at bottom of header */}
      {showNavigation && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
          {babies.map((baby, index) => (
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
          ))}
        </div>
      )}

      {/* Subtle edge indicators when there are multiple children */}
      {showNavigation && currentIndex > 0 && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-r from-muted-foreground/20 to-transparent rounded-full" />
      )}
      {showNavigation && currentIndex < babies.length - 1 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-l from-muted-foreground/20 to-transparent rounded-full" />
      )}
    </div>
  );
};
