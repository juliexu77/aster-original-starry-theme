import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
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
  // DYNAMICS tab
  currentStrength: string;
  currentFriction: string;
  actionableInsight: string;
  // DAILY LIFE tab
  sleepDynamic: string;
  feedingDynamic: string;
  communicationStyle: string;
  // GROWTH tab
  whatThisPhaseTeaches: string;
  whatsComingNext: string;
  longTermEvolution: string;
}

interface RelationshipDetailProps {
  from: FamilyMember;
  to: FamilyMember;
  onBack: () => void;
  inline?: boolean;
}

type TabType = 'dynamics' | 'daily' | 'growth';

const getAgeLabel = (birthday: string | null): string => {
  if (!birthday) return '';
  const birthDate = new Date(birthday);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                 (today.getMonth() - birthDate.getMonth());
  
  if (months < 1) return 'newborn';
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${remainingMonths}m`;
};

const getAgeMonths = (birthday: string | null): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
         (today.getMonth() - birthDate.getMonth());
};

export const RelationshipDetail = ({ from, to, onBack, inline = false }: RelationshipDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('dynamics');
  const [insights, setInsights] = useState<RelationshipInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fromSign = getZodiacFromBirthday(from.birthday);
  const toSign = getZodiacFromBirthday(to.birthday);
  const toMoon = getMoonSignFromBirthDateTime(to.birthday, to.birth_time, to.birth_location);
  
  const isChildRelationship = to.type === 'child';
  const ageLabel = isChildRelationship ? getAgeLabel(to.birthday) : null;
  const ageMonths = isChildRelationship ? getAgeMonths(to.birthday) : 0;
  
  const fetchInsights = async () => {
    if (!fromSign || !toSign) return;
    
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
      <div className="bg-[#252525]/50 rounded-lg p-4 border border-foreground/5">
        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.15em] mb-2">
          {header}
        </p>
        <p className="text-[14px] text-foreground/70 leading-[1.7]">
          {content}
        </p>
      </div>
    );
  };

  const renderDynamicsTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Right Now', insights?.currentStrength)}
      {renderInsightCard('Friction', insights?.currentFriction)}
      {renderInsightCard('Try This', insights?.actionableInsight)}
    </div>
  );

  const renderDailyTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Sleep', insights?.sleepDynamic)}
      {renderInsightCard('Feeding', insights?.feedingDynamic)}
      {renderInsightCard('Communication', insights?.communicationStyle)}
    </div>
  );

  const renderGrowthTab = () => (
    <div className="space-y-3">
      {renderInsightCard('This Phase Teaches', insights?.whatThisPhaseTeaches)}
      {renderInsightCard("Coming Next", insights?.whatsComingNext)}
      {renderInsightCard('Long-Term', insights?.longTermEvolution)}
    </div>
  );

  return (
    <div>
      {/* Header - simplified for inline view */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {fromSign && <ZodiacIcon sign={fromSign} size={16} className="text-[#C4A574]" />}
          <span className="text-[16px] text-foreground/80" style={{ fontFamily: 'Source Serif 4, serif' }}>
            {from.name} → {to.name}
          </span>
          {ageLabel && (
            <span className="text-[11px] text-foreground/30 ml-auto">
              {ageLabel}
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-foreground/10 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[10px] uppercase tracking-[0.1em] pb-1 transition-all ${
              activeTab === tab.id
                ? 'text-foreground/70 border-b border-[#C4A574]'
                : 'text-foreground/30 hover:text-foreground/50'
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
          
          {/* Update indicator */}
          <p className="text-[9px] text-foreground/20 text-center mt-6 tracking-wide">
            Updated for {ageLabel || 'current age'}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[12px] text-foreground/40">
            Add birth dates to see insights.
          </p>
        </div>
      )}
    </div>
  );
};
