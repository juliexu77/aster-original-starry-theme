import { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { 
  ZodiacSign, 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime,
  getZodiacName 
} from "@/lib/zodiac";

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
  birth_time?: string | null;
  birth_location?: string | null;
}

interface RelationshipInsights {
  currentStrength: string;
  currentFriction: string;
  actionableInsight: string;
  sleepDynamic: string;
  feedingDynamic: string;
  communicationStyle: string;
  whatThisPhaseTeaches: string;
  whatsComingNext: string;
  longTermEvolution: string;
}

interface RelationshipDetailProps {
  from: FamilyMember;
  to: FamilyMember;
  onClose: () => void;
}

type TabType = 'dynamics' | 'daily' | 'growth';

const getAgeLabel = (birthday: string | null): string => {
  if (!birthday) return '';
  const birthDate = new Date(birthday);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                 (today.getMonth() - birthDate.getMonth());
  
  if (months < 1) return 'newborn';
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} old`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) return `${years} year${years === 1 ? '' : 's'} old`;
  return `${years}y ${remainingMonths}m old`;
};

const getAgeMonths = (birthday: string | null): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
         (today.getMonth() - birthDate.getMonth());
};

export const RelationshipDetail = ({ from, to, onClose }: RelationshipDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('dynamics');
  const [insights, setInsights] = useState<RelationshipInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fromSign = getZodiacFromBirthday(from.birthday);
  const toSign = getZodiacFromBirthday(to.birthday);
  const toMoon = getMoonSignFromBirthDateTime(to.birthday, to.birth_time, to.birth_location);
  
  // Determine relationship type
  const isChildRelationship = to.type === 'child';
  const isAdultRelationship = from.type !== 'child' && to.type !== 'child';
  
  const ageLabel = isChildRelationship ? getAgeLabel(to.birthday) : null;
  const ageMonths = isChildRelationship ? getAgeMonths(to.birthday) : 0;
  
  const fetchInsights = async () => {
    if (!fromSign || !toSign) return;
    
    // Skip API call for adult-adult relationships - show static content instead
    if (isAdultRelationship) {
      setInsights({
        currentStrength: `${fromSign && getZodiacName(fromSign)} and ${toSign && getZodiacName(toSign)} share a natural understanding. Your cosmic connection runs deep, with both signs bringing unique strengths to the partnership.`,
        currentFriction: `Different elemental energies can create tension. Finding balance between your approaches takes conscious effort, but leads to growth.`,
        actionableInsight: `Honor each other's rhythms. What feels like friction is often just different timing.`,
        sleepDynamic: `Your rest patterns may differ. One may need more quiet time while the other recharges through connection.`,
        feedingDynamic: `Sharing meals together strengthens your bond. Create rituals around food that honor both your preferences.`,
        communicationStyle: `Learn each other's love languages. What feels like being heard differs between your signs.`,
        whatThisPhaseTeaches: `Partnership reveals parts of yourself you cannot see alone. Your differences are teachers.`,
        whatsComingNext: `The more you understand each other's cosmic makeup, the more patience you'll find naturally.`,
        longTermEvolution: `Long-term, your signs build complementary strengths. What challenges you now becomes your foundation.`
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-relationship-insights`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            parent: {
              name: from.name,
              sunSign: getZodiacName(fromSign),
              moonSign: getMoonSignFromBirthDateTime(from.birthday, from.birth_time, from.birth_location)
                ? getZodiacName(getMoonSignFromBirthDateTime(from.birthday, from.birth_time, from.birth_location)!)
                : null,
            },
            child: {
              name: to.name,
              sunSign: getZodiacName(toSign),
              moonSign: toMoon ? getZodiacName(toMoon) : null,
              ageMonths,
            },
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load insights');
      }
      
      const data = await response.json();
      setInsights(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, [from.id, to.id]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'dynamics', label: 'DYNAMICS' },
    { id: 'daily', label: 'DAILY LIFE' },
    { id: 'growth', label: 'GROWTH' },
  ];

  const renderInsightCard = (header: string, content: string | undefined) => {
    if (!content) return null;
    
    return (
      <div className="bg-[#252525] rounded-lg p-4 border border-[#3a3a3a]/30">
        <p className="text-[9px] text-[#8A8A8A] uppercase tracking-[0.15em] mb-2">
          {header}
        </p>
        <p className="text-[14px] text-foreground/80 leading-[1.6]">
          {content}
        </p>
      </div>
    );
  };

  const renderDynamicsTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Right Now', insights?.currentStrength)}
      {renderInsightCard('Where You Clash', insights?.currentFriction)}
      {renderInsightCard('Try This', insights?.actionableInsight)}
    </div>
  );

  const renderDailyTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Sleep Patterns', insights?.sleepDynamic)}
      {renderInsightCard('Feeding Dynamics', insights?.feedingDynamic)}
      {renderInsightCard('Communication', insights?.communicationStyle)}
    </div>
  );

  const renderGrowthTab = () => (
    <div className="space-y-3">
      {renderInsightCard('What This Phase Teaches You', insights?.whatThisPhaseTeaches)}
      {renderInsightCard("What's Coming", insights?.whatsComingNext)}
      {renderInsightCard('Long-Term Evolution', insights?.longTermEvolution)}
    </div>
  );

  return (
    <div className="mt-6 pt-6 border-t border-foreground/10">
      {/* Header with close button */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {fromSign && <ZodiacIcon sign={fromSign} size={16} className="text-[#C4A574]" />}
            <h2 className="text-[18px] text-foreground/90" style={{ fontFamily: 'Source Serif 4, serif' }}>
              {from.name} → {to.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-foreground/40">
              {fromSign && getZodiacName(fromSign)} → {toSign && getZodiacName(toSign)}
            </p>
            {ageLabel && (
              <span className="text-[10px] text-foreground/25">
                {ageLabel}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 text-foreground/30 hover:text-foreground/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-5 mb-4 border-b border-foreground/10 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[10px] uppercase tracking-[0.12em] pb-1 transition-all ${
              activeTab === tab.id
                ? 'text-foreground/60 border-b border-[#C4A574]'
                : 'text-foreground/25 hover:text-foreground/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-[12px] text-foreground/40 mb-3">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInsights}
            className="text-foreground/40 hover:text-foreground/60"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      ) : insights ? (
        <div className="pb-4">
          {activeTab === 'dynamics' && renderDynamicsTab()}
          {activeTab === 'daily' && renderDailyTab()}
          {activeTab === 'growth' && renderGrowthTab()}
          
          {/* Update indicator - only show age for child relationships */}
          {isChildRelationship && ageLabel && (
            <p className="text-[9px] text-foreground/15 text-center mt-6 tracking-wide">
              Updated for {ageLabel}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[12px] text-foreground/40">
            Add birth dates to see relationship insights.
          </p>
        </div>
      )}
    </div>
  );
};
