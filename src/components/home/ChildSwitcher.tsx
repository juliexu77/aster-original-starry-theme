import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const showNavigation = babies.length > 1;

  return (
    <div 
      ref={containerRef}
      className="px-5 py-4 border-b border-border/40"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between">
        {/* Left arrow (invisible placeholder if single child) */}
        <div className="w-8">
          {showNavigation && (
            <button 
              onClick={onPrev}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous child"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Child info - center */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-serif text-foreground">
            {activeBaby.name}
          </h1>
          {activeBaby.birthday && (
            <p className="text-sm text-muted-foreground">
              {getAgeLabel(activeBaby.birthday)}
            </p>
          )}
        </div>

        {/* Right arrow */}
        <div className="w-8">
          {showNavigation && (
            <button 
              onClick={onNext}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next child"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Dots indicator */}
      {showNavigation && (
        <div className="flex justify-center gap-1.5 mt-2">
          {babies.map((baby, index) => (
            <button
              key={baby.id}
              onClick={() => onSwitch(baby.id)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Switch to ${baby.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
