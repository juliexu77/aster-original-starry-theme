import { useMemo, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { AstrologyGrid } from "./AstrologyGrid";
import { ChildSelectorSheet } from "./ChildSelectorSheet";
import { 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime, 
  getRisingSign, 
  getZodiacName,
  ZodiacSign 
} from "@/lib/zodiac";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface ChildViewProps {
  babies: Baby[];
  selectedBabyId: string | null;
  onSelectBaby: (babyId: string) => void;
  onAddChild?: () => void;
}

export const ChildView = ({ 
  babies, 
  selectedBabyId, 
  onSelectBaby,
  onAddChild 
}: ChildViewProps) => {
  const [showSelector, setShowSelector] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  
  const hasMultipleChildren = babies.length > 1;
  
  // Show pulse animation on first visit with multiple children
  useEffect(() => {
    if (hasMultipleChildren) {
      const hasSeenPulse = localStorage.getItem('family-child-selector-seen');
      if (!hasSeenPulse) {
        setShowPulse(true);
        const timer = setTimeout(() => {
          setShowPulse(false);
          localStorage.setItem('family-child-selector-seen', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasMultipleChildren]);

  const selectedBaby = useMemo(() => {
    if (selectedBabyId) {
      return babies.find(b => b.id === selectedBabyId);
    }
    return babies[0];
  }, [babies, selectedBabyId]);

  const signs = useMemo(() => {
    if (!selectedBaby?.birthday) return null;
    
    const sun = getZodiacFromBirthday(selectedBaby.birthday);
    const moon = getMoonSignFromBirthDateTime(
      selectedBaby.birthday, 
      selectedBaby.birth_time, 
      selectedBaby.birth_location
    );
    const rising = getRisingSign(
      selectedBaby.birthday, 
      selectedBaby.birth_time, 
      selectedBaby.birth_location
    );
    
    return { sun, moon, rising };
  }, [selectedBaby]);

  const getSignsSubtitle = (): string => {
    if (!signs?.sun) return '';
    
    const parts = [getZodiacName(signs.sun)];
    if (signs.moon) parts.push(`${getZodiacName(signs.moon)} Moon`);
    if (signs.rising) parts.push(`${getZodiacName(signs.rising)} Rising`);
    
    return parts.join(' • ');
  };

  if (!selectedBaby || !signs?.sun) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Add a child with their birthday to see their astrological profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Child Name */}
      <div className="px-5 pt-6 text-center">
        {hasMultipleChildren ? (
          <button
            onClick={() => setShowSelector(true)}
            className={`inline-flex items-center gap-2 transition-all ${showPulse ? 'animate-pulse' : ''}`}
          >
            <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
            <span className="text-[18px] text-foreground/80">{selectedBaby.name}</span>
            <ChevronDown className="w-4 h-4 text-foreground/30" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-2">
            <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
            <span className="text-[18px] text-foreground/80">{selectedBaby.name}</span>
          </div>
        )}
        
        <p className="text-[11px] text-foreground/40 mt-1">
          {getSignsSubtitle()}
        </p>
        
        {/* Missing data prompts */}
        {!signs.moon && (
          <p className="text-[10px] text-foreground/30 mt-2">
            Add birth time for moon sign
          </p>
        )}
        {signs.moon && !signs.rising && (
          <p className="text-[10px] text-foreground/30 mt-2">
            Add birth location for rising sign
          </p>
        )}
      </div>

      {/* 2x2 Astrology Grid */}
      <div className="px-5">
        <AstrologyGrid 
          sunSign={signs.sun} 
          moonSign={signs.moon} 
          risingSign={signs.rising} 
        />
      </div>

      {/* Child Selector Sheet */}
      <ChildSelectorSheet
        open={showSelector}
        onOpenChange={setShowSelector}
        babies={babies}
        selectedBabyId={selectedBaby.id}
        onSelectBaby={onSelectBaby}
        onAddChild={onAddChild}
      />
    </div>
  );
};
