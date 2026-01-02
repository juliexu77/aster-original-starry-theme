import { useMemo, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { AstrologyProfile } from "./AstrologyProfile";
import { BirthChartDiagram } from "./BirthChartDiagram";
import { ChartSelectorSheet } from "./ChartSelectorSheet";
import { ChartIntroOverlay } from "./ChartIntroOverlay";
import { ShareChartSheet } from "./ShareChartSheet";
import { 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime, 
  getZodiacName,
  ZodiacSign 
} from "@/lib/zodiac";
import { calculateBirthChart } from "@/lib/ephemeris";

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
  created_at?: string;
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
  const [showIntro, setShowIntro] = useState(false);
  
  // Build all family members list (children + parents)
  const allMembers = useMemo(() => {
    const members: FamilyMember[] = [];
    
    // Add children with birthdays
    babies.forEach(baby => {
      console.log('[ChildView] Processing baby:', baby.name, 'birthday:', baby.birthday);
      if (baby.birthday) {
        members.push({
          id: baby.id,
          name: baby.name,
          type: 'child' as const,
          birthday: baby.birthday,
          birth_time: baby.birth_time,
          birth_location: baby.birth_location,
        });
      }
    });
    
    // Add parent (user)
    if (userProfile?.birthday) {
      members.push({
        id: 'parent',
        name: userProfile.display_name?.split(' ')[0] || 'You',
        type: 'parent' as const,
        birthday: userProfile.birthday,
        birth_time: userProfile.birth_time,
        birth_location: userProfile.birth_location,
      });
    }
    
    // Add partner
    if (userProfile?.partner_birthday) {
      members.push({
        id: 'partner',
        name: userProfile.partner_name || 'Partner',
        type: 'partner' as const,
        birthday: userProfile.partner_birthday,
        birth_time: userProfile.partner_birth_time,
        birth_location: userProfile.partner_birth_location,
      });
    }
    
    console.log('[ChildView] allMembers result:', members.length, members.map(m => m.name));
    return members;
  }, [babies, userProfile]);

  const hasMultipleMembers = allMembers.length > 1;
  
  // Show intro overlay - either for new users or when manually reset via settings
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('chart-intro-seen');
    if (hasSeenIntro || allMembers.length === 0) return;
    
    // Check if user manually reset the intro (via Settings)
    const introReset = localStorage.getItem('chart-intro-reset');
    if (introReset) {
      // User manually reset - show the intro and clear the reset flag
      localStorage.removeItem('chart-intro-reset');
      const timer = setTimeout(() => {
        setShowIntro(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Check if this is a truly new user by looking at profile creation time
    const isNewUser = userProfile?.created_at 
      ? (Date.now() - new Date(userProfile.created_at).getTime()) < 5 * 60 * 1000 // 5 minutes
      : false;
    
    if (!isNewUser) {
      // Returning user on new device - mark as seen and don't show intro
      localStorage.setItem('chart-intro-seen', 'true');
      return;
    }
    
    // Small delay to let the page render first
    const timer = setTimeout(() => {
      setShowIntro(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [allMembers.length, userProfile?.created_at]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('chart-intro-seen', 'true');
  };

  // Show pulse animation on first visit with multiple members (after intro)
  useEffect(() => {
    if (hasMultipleMembers && !showIntro) {
      const hasSeenPulse = localStorage.getItem('chart-selector-seen');
      const hasSeenIntro = localStorage.getItem('chart-intro-seen');
      if (!hasSeenPulse && hasSeenIntro) {
        setShowPulse(true);
        const timer = setTimeout(() => {
          setShowPulse(false);
          localStorage.setItem('chart-selector-seen', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasMultipleMembers, showIntro]);

  // Find the selected member - fallback to first member if selectedMemberId is null or not found
  const selectedMember = useMemo(() => {
    console.log('[ChildView] Finding selectedMember. selectedMemberId:', selectedMemberId, 'allMembers:', allMembers.length);
    
    if (selectedMemberId) {
      const found = allMembers.find(m => m.id === selectedMemberId);
      if (found) {
        console.log('[ChildView] Found selected member:', found.name);
        return found;
      }
      console.log('[ChildView] selectedMemberId not found in allMembers, falling back to first');
    }
    
    // Fallback to first member
    if (allMembers.length > 0) {
      console.log('[ChildView] Using first member as fallback:', allMembers[0].name);
      return allMembers[0];
    }
    
    console.log('[ChildView] No members available');
    return undefined;
  }, [allMembers, selectedMemberId]);

  const signs = useMemo(() => {
    if (!selectedMember?.birthday) {
      console.log('[ChildView] No selectedMember or birthday for signs calculation');
      return null;
    }
    
    const sun = getZodiacFromBirthday(selectedMember.birthday);
    const moon = getMoonSignFromBirthDateTime(
      selectedMember.birthday, 
      selectedMember.birth_time, 
      selectedMember.birth_location
    );
    
    // Use ephemeris calculation for rising sign (more accurate)
    let rising: ZodiacSign | null = null;
    if (selectedMember.birth_time && selectedMember.birth_location) {
      const birthChart = calculateBirthChart(
        selectedMember.birthday,
        selectedMember.birth_time,
        selectedMember.birth_location
      );
      rising = birthChart?.ascendantSign ?? null;
    }
    
    console.log('[ChildView] Calculated signs for', selectedMember.name, ':', { sun, moon, rising });
    return { sun, moon, rising };
  }, [selectedMember]);

  const getSignsSubtitle = (): string => {
    if (!signs?.sun) return '';
    
    const parts = [getZodiacName(signs.sun)];
    if (signs.moon) parts.push(`${getZodiacName(signs.moon)} Moon`);
    if (signs.rising) parts.push(`${getZodiacName(signs.rising)} Rising`);
    
    return parts.join(' • ');
  };

  // Show empty state only if there are truly no members with birthdays
  if (allMembers.length === 0) {
    console.log('[ChildView] Showing empty state - no members with birthdays');
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Add a family member with their birthday to see their astrological profile.
        </p>
      </div>
    );
  }

  // If we have members but no selected member or signs, there's a bug - log it
  if (!selectedMember || !signs?.sun) {
    console.error('[ChildView] Bug: Have members but no selectedMember or signs', {
      allMembersCount: allMembers.length,
      selectedMember,
      signs,
      selectedMemberId
    });
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-[13px] text-foreground/40">
          Loading chart...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Intro Overlay */}
      {showIntro && signs && (
        <ChartIntroOverlay
          name={selectedMember.name}
          sunSign={signs.sun}
          moonSign={signs.moon}
          risingSign={signs.rising}
          onComplete={handleIntroComplete}
        />
      )}

      <div className="space-y-6">
        {/* Header with Member Name */}
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between">
            {/* Left spacer for centering */}
            <div className="w-9" />
            
            {/* Center: Name and selector */}
            <div className="text-center flex-1">
              {hasMultipleMembers ? (
                <button
                  onClick={() => setShowSelector(true)}
                  className={`inline-flex items-center gap-2 transition-all ${showPulse ? 'animate-pulse' : ''}`}
                >
                  <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
                  <span className="text-[18px] text-foreground/80">{selectedMember.name}</span>
                  <ChevronDown className="w-4 h-4 text-foreground/30" />
                </button>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <ZodiacIcon sign={signs.sun} size={18} strokeWidth={1.5} className="text-foreground/50" />
                  <span className="text-[18px] text-foreground/80">{selectedMember.name}</span>
                </div>
              )}
            </div>
            
            {/* Right: Share button */}
            <ShareChartSheet
              name={selectedMember.name}
              birthday={selectedMember.birthday!}
              birthTime={selectedMember.birth_time}
              birthLocation={selectedMember.birth_location}
              sunSign={signs.sun}
              moonSign={signs.moon}
              risingSign={signs.rising}
            />
          </div>
          
          <p className="text-[11px] text-foreground/40 mt-1 text-center">
            {getSignsSubtitle()}
          </p>
          
          {/* Missing data prompts */}
          {!signs.moon && (
            <p className="text-[10px] text-foreground/30 mt-2 text-center">
              Add birth time for moon sign
            </p>
          )}
          {signs.moon && !signs.rising && (
            <p className="text-[10px] text-foreground/30 mt-2 text-center">
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
            birthday={selectedMember.birthday}
            birthTime={selectedMember.birth_time}
            birthLocation={selectedMember.birth_location}
          />
        </div>

        {/* Astrology Profile */}
        <div className="px-5">
          <AstrologyProfile 
            sunSign={signs.sun} 
            moonSign={signs.moon} 
            risingSign={signs.rising}
            name={selectedMember.name}
            birthday={selectedMember.birthday}
          />
        </div>

        {/* Member Selector Sheet */}
        <ChartSelectorSheet
          open={showSelector}
          onOpenChange={setShowSelector}
          members={allMembers}
          selectedMemberId={selectedMember.id}
          onSelectMember={onSelectMember}
          onAddChild={onAddChild}
        />
      </div>
    </>
  );
};
