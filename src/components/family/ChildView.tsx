import { useMemo, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { AstrologyGrid } from "./AstrologyGrid";
import { BirthChartDiagram } from "./BirthChartDiagram";
import { ChartSelectorSheet } from "./ChartSelectorSheet";
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

interface UserProfile {
  display_name: string | null;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  partner_name: string | null;
  partner_birthday: string | null;
  partner_birth_time: string | null;
  partner_birth_location: string | null;
}

interface FamilyMember {
  id: string;
  name: string;
  type: 'child' | 'parent' | 'partner';
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface ChildViewProps {
  babies: Baby[];
  userProfile: UserProfile | null;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
  onAddChild?: () => void;
}

export const ChildView = ({ 
  babies, 
  userProfile,
  selectedMemberId, 
  onSelectMember,
  onAddChild 
}: ChildViewProps) => {
  const [showSelector, setShowSelector] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  
  // Build children list only (no parents in this view)
  const children = useMemo(() => {
    return babies
      .filter(baby => baby.birthday)
      .map(baby => ({
        id: baby.id,
        name: baby.name,
        type: 'child' as const,
        birthday: baby.birthday,
        birth_time: baby.birth_time,
        birth_location: baby.birth_location,
      }));
  }, [babies]);

  const hasMultipleChildren = children.length > 1;
  
  // Show pulse animation on first visit with multiple children
  useEffect(() => {
    if (hasMultipleChildren) {
      const hasSeenPulse = localStorage.getItem('chart-selector-seen');
      if (!hasSeenPulse) {
        setShowPulse(true);
        const timer = setTimeout(() => {
          setShowPulse(false);
          localStorage.setItem('chart-selector-seen', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasMultipleChildren]);

  const selectedChild = useMemo(() => {
    if (selectedMemberId) {
      return children.find(c => c.id === selectedMemberId);
    }
    return children[0];
  }, [children, selectedMemberId]);

  const signs = useMemo(() => {
    if (!selectedChild?.birthday) return null;
    
    const sun = getZodiacFromBirthday(selectedChild.birthday);
    const moon = getMoonSignFromBirthDateTime(
      selectedChild.birthday, 
      selectedChild.birth_time, 
      selectedChild.birth_location
    );
    const rising = getRisingSign(
      selectedChild.birthday, 
      selectedChild.birth_time, 
      selectedChild.birth_location
    );
    
    return { sun, moon, rising };
  }, [selectedChild]);

  const getSignsSubtitle = (): string => {
    if (!signs?.sun) return '';
    
    const parts = [getZodiacName(signs.sun)];
    if (signs.moon) parts.push(`${getZodiacName(signs.moon)} Moon`);
    if (signs.rising) parts.push(`${getZodiacName(signs.rising)} Rising`);
    
    return parts.join(' • ');
  };

  if (!selectedChild || !signs?.sun) {
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
            <span className="text-[18px] text-foreground/80">{selectedChild.name}</span>
            <ChevronDown className="w-4 h-4 text-foreground/30" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-2">
            <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
            <span className="text-[18px] text-foreground/80">{selectedChild.name}</span>
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

      {/* Birth Chart Diagram */}
      <div className="px-5">
        <BirthChartDiagram
          sunSign={signs.sun}
          moonSign={signs.moon}
          risingSign={signs.rising}
        />
      </div>

      {/* Astrology Grid */}
      <div className="px-5">
        <AstrologyGrid 
          sunSign={signs.sun} 
          moonSign={signs.moon} 
          risingSign={signs.rising} 
        />
      </div>

      {/* Child Selector Sheet */}
      <ChartSelectorSheet
        open={showSelector}
        onOpenChange={setShowSelector}
        members={children}
        selectedMemberId={selectedChild.id}
        onSelectMember={onSelectMember}
        onAddChild={onAddChild}
      />
    </div>
  );
};
