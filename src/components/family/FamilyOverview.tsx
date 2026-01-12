import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday, ZODIAC_DATA } from "@/lib/zodiac";

// Helper to get element from sign
const getElement = (sign: ZodiacSign): string => {
  return ZODIAC_DATA[sign]?.element || 'fire';
};

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
}

interface FamilyOverviewProps {
  members: FamilyMember[];
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: "text-orange-400",
  earth: "text-emerald-400",
  air: "text-sky-400",
  water: "text-blue-400",
};

const ELEMENT_BG: Record<string, string> = {
  fire: "bg-orange-500/10 border-orange-500/20",
  earth: "bg-emerald-500/10 border-emerald-500/20",
  air: "bg-sky-500/10 border-sky-500/20",
  water: "bg-blue-500/10 border-blue-500/20",
};

const ELEMENT_DESCRIPTIONS: Record<string, string> = {
  fire: "passion, action & enthusiasm",
  earth: "stability, patience & practicality",
  air: "communication, ideas & flexibility",
  water: "emotion, intuition & sensitivity",
};

const getElementBalance = (elements: Record<string, number>, total: number) => {
  const percentages: { element: string; count: number; percentage: number }[] = [];
  
  for (const [element, count] of Object.entries(elements)) {
    if (count > 0) {
      percentages.push({
        element,
        count,
        percentage: Math.round((count / total) * 100),
      });
    }
  }
  
  return percentages.sort((a, b) => b.count - a.count);
};

const getFamilyDynamicInsight = (elementBalance: ReturnType<typeof getElementBalance>): string => {
  if (elementBalance.length === 0) return "";
  
  const dominant = elementBalance[0];
  const secondary = elementBalance[1];
  
  // Single dominant element
  if (dominant.percentage >= 60) {
    const insights: Record<string, string> = {
      fire: "Your family burns bright together—spontaneous adventures and shared enthusiasm fuel your bond. Channel this energy into creative projects.",
      earth: "Grounded and steady, your family thrives on routine and shared traditions. Your home is a sanctuary of comfort and reliability.",
      air: "Ideas flow freely in your home. Your family connects through conversation, curiosity, and the joy of learning together.",
      water: "Deep emotional currents unite your family. Intuitive understanding and heartfelt connection form your foundation.",
    };
    return insights[dominant.element] || "";
  }
  
  // Two strong elements
  if (secondary && secondary.percentage >= 25) {
    const combo = [dominant.element, secondary.element].sort().join("-");
    const comboInsights: Record<string, string> = {
      "earth-fire": "Passion meets practicality in your household. Fire brings excitement while Earth provides the structure to make dreams real.",
      "air-fire": "A dynamic, high-energy family! Ideas spark quickly and enthusiasm is contagious. Remember to pause and ground occasionally.",
      "fire-water": "Steam rises when fire meets water—intense emotions and passionate bonds. Your family feels deeply and loves fiercely.",
      "air-earth": "Thoughtful and deliberate, your family balances new ideas with proven methods. Communication is your superpower.",
      "earth-water": "Nurturing and stable, your family creates a deeply secure emotional environment. Slow and steady wins the race.",
      "air-water": "Intuition meets intellect. Your family navigates both heart and mind, creating space for feelings and ideas alike.",
    };
    return comboInsights[combo] || `Your family blends ${dominant.element} and ${secondary.element} energies beautifully.`;
  }
  
  // Mixed/balanced
  return "Your family brings together diverse elemental energies, creating a rich tapestry of perspectives and approaches to life.";
};

export const FamilyOverview = ({ members }: FamilyOverviewProps) => {
  const memberSigns = useMemo(() => {
    return members
      .filter(m => m.birthday)
      .map(m => ({
        ...m,
        sign: getZodiacFromBirthday(m.birthday) as ZodiacSign,
      }))
      .filter(m => m.sign);
  }, [members]);

  const elementCounts = useMemo(() => {
    const counts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
    memberSigns.forEach(m => {
      const element = getElement(m.sign);
      if (element) counts[element]++;
    });
    return counts;
  }, [memberSigns]);

  const elementBalance = useMemo(() => 
    getElementBalance(elementCounts, memberSigns.length), 
    [elementCounts, memberSigns.length]
  );

  const familyInsight = useMemo(() => 
    getFamilyDynamicInsight(elementBalance), 
    [elementBalance]
  );

  if (memberSigns.length < 2) return null;

  return (
    <div className="px-5 space-y-4">
      {/* Section Header */}
      <div className="text-center">
        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.2em]">
          Family Elements
        </p>
      </div>

      {/* Member Signs Row */}
      <div className="flex justify-center gap-3 flex-wrap">
        {memberSigns.map(m => (
          <div 
            key={m.id} 
            className="flex flex-col items-center gap-1"
          >
            <div className={`p-2 rounded-full border ${ELEMENT_BG[getElement(m.sign) || 'fire']}`}>
              <ZodiacIcon sign={m.sign} className="w-5 h-5 text-foreground/70" />
            </div>
            <span className="text-[10px] text-foreground/50">{m.name}</span>
          </div>
        ))}
      </div>

      {/* Element Balance */}
      <div className="space-y-2">
        {elementBalance.map(({ element, count, percentage }) => (
          <div key={element} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-[11px] font-medium capitalize ${ELEMENT_COLORS[element]}`}>
                {element}
              </span>
              <span className="text-[10px] text-foreground/40">
                {count} {count === 1 ? 'member' : 'members'}
              </span>
            </div>
            <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  element === 'fire' ? 'bg-orange-400/60' :
                  element === 'earth' ? 'bg-emerald-400/60' :
                  element === 'air' ? 'bg-sky-400/60' :
                  'bg-blue-400/60'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[9px] text-foreground/30 italic">
              {ELEMENT_DESCRIPTIONS[element]}
            </p>
          </div>
        ))}
      </div>

      {/* Family Dynamic Insight */}
      <div className="pt-2 border-t border-foreground/5">
        <p className="text-[11px] text-foreground/50 leading-relaxed text-center">
          {familyInsight}
        </p>
      </div>

      {/* Tap Prompt */}
      <div className="text-center pt-2">
        <p className="text-[9px] text-foreground/25 tracking-wide">
          Tap any connection above for deeper insights
        </p>
      </div>
    </div>
  );
};
