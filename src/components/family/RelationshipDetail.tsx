import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
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

export const RelationshipDetail = ({ from, to, onBack }: RelationshipDetailProps) => {
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
      <div className="bg-[#252525] rounded-lg p-5 border border-[#3a3a3a]/30">
        <p className="text-[10px] text-[#8A8A8A] uppercase tracking-[0.15em] mb-3">
          {header}
        </p>
        <p className="text-[15px] text-foreground/80 leading-[1.7]">
          {content}
        </p>
      </div>
    );
  };

  const renderDynamicsTab = () => (
    <div className="space-y-4">
      {renderInsightCard('Right Now', insights?.currentStrength)}
      {renderInsightCard('Where You Clash', insights?.currentFriction)}
      {renderInsightCard('Try This', insights?.actionableInsight)}
    </div>
  );

  const renderDailyTab = () => (
    <div className="space-y-4">
      {renderInsightCard('Sleep Patterns', insights?.sleepDynamic)}
      {renderInsightCard('Feeding Dynamics', insights?.feedingDynamic)}
      {renderInsightCard('Communication', insights?.communicationStyle)}
    </div>
  );

  const renderGrowthTab = () => (
    <div className="space-y-4">
      {renderInsightCard('What This Phase Teaches You', insights?.whatThisPhaseTeaches)}
      {renderInsightCard("What's Coming", insights?.whatsComingNext)}
      {renderInsightCard('Long-Term Evolution', insights?.longTermEvolution)}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-foreground/40 hover:text-foreground/60 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[12px] uppercase tracking-wide">Back</span>
      </button>
      
      {/* Hero section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {fromSign && <ZodiacIcon sign={fromSign} size={20} className="text-[#C4A574]" />}
          <h1 className="text-[24px] text-foreground/90" style={{ fontFamily: 'Source Serif 4, serif' }}>
            {from.name} → {to.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-[13px] text-foreground/50">
            {fromSign && getZodiacName(fromSign)} → {toSign && getZodiacName(toSign)}
          </p>
          {ageLabel && (
            <span className="text-[11px] text-foreground/30">
              {ageLabel}
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-foreground/10 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[11px] uppercase tracking-[0.12em] pb-1 transition-all ${
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
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-[13px] text-foreground/40 mb-4">{error}</p>
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
        <div className="pb-8">
          {activeTab === 'dynamics' && renderDynamicsTab()}
          {activeTab === 'daily' && renderDailyTab()}
          {activeTab === 'growth' && renderGrowthTab()}
          
          {/* Update indicator */}
          <p className="text-[10px] text-foreground/20 text-center mt-8 tracking-wide">
            Updated for {ageLabel || 'current age'}
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[13px] text-foreground/40">
            Add birth dates to see relationship insights.
          </p>
        </div>
      )}
    </div>
  );
};
