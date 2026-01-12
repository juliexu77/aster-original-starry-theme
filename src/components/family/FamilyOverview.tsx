import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Heart, Flame, AlertCircle, Lightbulb } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday, ZODIAC_DATA } from "@/lib/zodiac";
import { useFamilyDynamics } from "@/hooks/useFamilyDynamics";
import { useHousehold } from "@/hooks/useHousehold";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { household } = useHousehold();
  const { dynamics, loading, error, generateDynamics } = useFamilyDynamics();

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

  const handleGenerateInsights = async () => {
    if (!household?.id || hasGenerated) {
      setShowAIInsights(!showAIInsights);
      return;
    }

    try {
      await generateDynamics(household.id, members);
      setHasGenerated(true);
      setShowAIInsights(true);
    } catch (err) {
      console.error('Failed to generate insights:', err);
    }
  };

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

      {/* Basic Family Dynamic Insight */}
      <div className="pt-2 border-t border-foreground/5">
        <p className="text-[11px] text-foreground/50 leading-relaxed text-center">
          {familyInsight}
        </p>
      </div>

      {/* AI Insights Toggle */}
      <motion.button
        onClick={handleGenerateInsights}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <LoadingSpinner className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4 text-purple-400" />
        )}
        <span className="text-[11px] font-medium text-purple-300">
          {loading ? 'Consulting the stars...' : hasGenerated ? (showAIInsights ? 'Hide Deep Insights' : 'Show Deep Insights') : 'Generate Deep Insights'}
        </span>
        {!loading && hasGenerated && (
          showAIInsights ? <ChevronUp className="w-3 h-3 text-purple-400" /> : <ChevronDown className="w-3 h-3 text-purple-400" />
        )}
      </motion.button>

      {/* AI-Generated Insights */}
      <AnimatePresence>
        {showAIInsights && dynamics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Headline */}
            <div className="text-center py-3">
              <p className="text-sm font-medium text-foreground/80 italic">
                "{dynamics.headline}"
              </p>
            </div>

            {/* Overview */}
            <div className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5">
              <p className="text-[11px] text-foreground/60 leading-relaxed whitespace-pre-line">
                {dynamics.overview}
              </p>
            </div>

            {/* Strengths */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                  Cosmic Strengths
                </span>
              </div>
              <div className="space-y-2">
                {dynamics.strengths.map((strength, i) => (
                  <div key={i} className="flex gap-2 p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
                    <Flame className="w-3 h-3 text-pink-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-foreground/50 leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tensions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                  Growth Edges
                </span>
              </div>
              <div className="space-y-2">
                {dynamics.tensions.map((tension, i) => (
                  <div key={i} className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-foreground/50 leading-relaxed">{tension}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                  Cosmic Wisdom
                </span>
              </div>
              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
                <p className="text-[10px] text-foreground/50 leading-relaxed whitespace-pre-line">
                  {dynamics.advice}
                </p>
              </div>
            </div>

            {/* Rituals */}
            {dynamics.rituals && dynamics.rituals.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                    Family Rituals
                  </span>
                </div>
                <div className="space-y-2">
                  {dynamics.rituals.map((ritual, i) => (
                    <div key={i} className="flex gap-2 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <Sparkles className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-foreground/50 leading-relaxed">{ritual}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Tap Prompt */}
      <div className="text-center pt-2">
        <p className="text-[9px] text-foreground/25 tracking-wide">
          Tap any connection above for individual insights
        </p>
      </div>
    </div>
  );
};
