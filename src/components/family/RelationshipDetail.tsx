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

// Insights for parent-child relationships
interface ChildRelationshipInsights {
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

// Insights for partner relationships
interface PartnerInsights {
  currentStrength: string;
  currentFriction: string;
  actionableInsight: string;
  communicationStyle: string;
  emotionalDynamic: string;
  parentingTeamwork: string;
  stressResponse: string;
  intimacyInsight: string;
  longTermEvolution: string;
}

interface RelationshipDetailProps {
  from: FamilyMember;
  to: FamilyMember;
  onClose: () => void;
}

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
  const [activeTab, setActiveTab] = useState<string>('dynamics');
  const [childInsights, setChildInsights] = useState<ChildRelationshipInsights | null>(null);
  const [partnerInsights, setPartnerInsights] = useState<PartnerInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fromSign = getZodiacFromBirthday(from.birthday);
  const toSign = getZodiacFromBirthday(to.birthday);
  const fromMoon = getMoonSignFromBirthDateTime(from.birthday, from.birth_time, from.birth_location);
  const toMoon = getMoonSignFromBirthDateTime(to.birthday, to.birth_time, to.birth_location);
  
  // Determine relationship type
  const isChildRelationship = to.type === 'child' || from.type === 'child';
  const isAdultRelationship = from.type !== 'child' && to.type !== 'child';
  
  // For child relationships, identify which is the child
  const child = from.type === 'child' ? from : to;
  const parent = from.type === 'child' ? to : from;
  
  const ageLabel = isChildRelationship ? getAgeLabel(child.birthday) : null;
  const ageMonths = isChildRelationship ? getAgeMonths(child.birthday) : 0;
  
  const fetchInsights = async () => {
    if (!fromSign || !toSign) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isAdultRelationship) {
        // Use partner insights edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-partner-insights`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              person1: {
                name: from.name,
                sunSign: getZodiacName(fromSign),
                moonSign: fromMoon ? getZodiacName(fromMoon) : null,
              },
              person2: {
                name: to.name,
                sunSign: getZodiacName(toSign),
                moonSign: toMoon ? getZodiacName(toMoon) : null,
              },
            }),
          }
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Try again later.');
          }
          if (response.status === 402) {
            throw new Error('API credits exhausted.');
          }
          throw new Error('Failed to load insights');
        }
        
        const data = await response.json();
        setPartnerInsights(data);
      } else {
        // Use parent-child insights edge function
        const parentSign = getZodiacFromBirthday(parent.birthday);
        const childSign = getZodiacFromBirthday(child.birthday);
        
        if (!parentSign || !childSign) return;
        
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
                name: parent.name,
                sunSign: getZodiacName(parentSign),
                moonSign: getMoonSignFromBirthDateTime(parent.birthday, parent.birth_time, parent.birth_location)
                  ? getZodiacName(getMoonSignFromBirthDateTime(parent.birthday, parent.birth_time, parent.birth_location)!)
                  : null,
              },
              child: {
                name: child.name,
                sunSign: getZodiacName(childSign),
                moonSign: getMoonSignFromBirthDateTime(child.birthday, child.birth_time, child.birth_location)
                  ? getZodiacName(getMoonSignFromBirthDateTime(child.birthday, child.birth_time, child.birth_location)!)
                  : null,
                ageMonths,
              },
            }),
          }
        );
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Try again later.');
          }
          if (response.status === 402) {
            throw new Error('API credits exhausted.');
          }
          throw new Error('Failed to load insights');
        }
        
        const data = await response.json();
        setChildInsights(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, [from.id, to.id]);

  // Different tabs for different relationship types
  const childTabs = [
    { id: 'dynamics', label: 'DYNAMICS' },
    { id: 'daily', label: 'DAILY LIFE' },
    { id: 'growth', label: 'GROWTH' },
  ];
  
  const partnerTabs = [
    { id: 'dynamics', label: 'DYNAMICS' },
    { id: 'connection', label: 'CONNECTION' },
    { id: 'parenting', label: 'PARENTING' },
  ];
  
  const tabs = isAdultRelationship ? partnerTabs : childTabs;

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

  // Child relationship tabs
  const renderChildDynamicsTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Right Now', childInsights?.currentStrength)}
      {renderInsightCard('Where You Clash', childInsights?.currentFriction)}
      {renderInsightCard('Try This', childInsights?.actionableInsight)}
    </div>
  );

  const renderChildDailyTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Sleep Patterns', childInsights?.sleepDynamic)}
      {renderInsightCard('Feeding Dynamics', childInsights?.feedingDynamic)}
      {renderInsightCard('Communication', childInsights?.communicationStyle)}
    </div>
  );

  const renderChildGrowthTab = () => (
    <div className="space-y-3">
      {renderInsightCard('What This Phase Teaches You', childInsights?.whatThisPhaseTeaches)}
      {renderInsightCard("What's Coming", childInsights?.whatsComingNext)}
      {renderInsightCard('Long-Term Evolution', childInsights?.longTermEvolution)}
    </div>
  );

  // Partner relationship tabs
  const renderPartnerDynamicsTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Your Strength', partnerInsights?.currentStrength)}
      {renderInsightCard('Where You Clash', partnerInsights?.currentFriction)}
      {renderInsightCard('Try This', partnerInsights?.actionableInsight)}
    </div>
  );

  const renderPartnerConnectionTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Communication', partnerInsights?.communicationStyle)}
      {renderInsightCard('Emotional Dynamic', partnerInsights?.emotionalDynamic)}
      {renderInsightCard('Under Stress', partnerInsights?.stressResponse)}
      {renderInsightCard('Intimacy', partnerInsights?.intimacyInsight)}
    </div>
  );

  const renderPartnerParentingTab = () => (
    <div className="space-y-3">
      {renderInsightCard('Parenting Teamwork', partnerInsights?.parentingTeamwork)}
      {renderInsightCard('Long-Term Evolution', partnerInsights?.longTermEvolution)}
    </div>
  );

  const hasInsights = isAdultRelationship ? !!partnerInsights : !!childInsights;

  // Get relationship label
  const getRelationshipLabel = (): string => {
    if (isAdultRelationship) {
      return 'Partner Relationship';
    }
    // Identify who is the parent in the display
    const parentDisplay = from.type === 'child' ? to : from;
    const childDisplay = from.type === 'child' ? from : to;
    return `${parentDisplay.name}'s bond with ${childDisplay.name}`;
  };

  return (
    <div className="mt-6 pt-6 border-t border-foreground/10">
      {/* Header with close button */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {/* Relationship type label */}
          <p className="text-[9px] text-foreground/30 uppercase tracking-[0.15em] mb-1.5">
            {isChildRelationship ? 'Parent-Child Dynamic' : 'Partnership'}
          </p>
          
          <div className="flex items-center gap-2 mb-1">
            {fromSign && <ZodiacIcon sign={fromSign} size={16} className="text-[#C4A574]" />}
            <h2 className="text-[18px] text-foreground/90" style={{ fontFamily: 'Source Serif 4, serif' }}>
              {isChildRelationship ? getRelationshipLabel() : `${from.name} & ${to.name}`}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-foreground/40">
              {fromSign && getZodiacName(fromSign)} • {toSign && getZodiacName(toSign)}
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
      ) : hasInsights ? (
        <div className="pb-4">
          {isAdultRelationship ? (
            <>
              {activeTab === 'dynamics' && renderPartnerDynamicsTab()}
              {activeTab === 'connection' && renderPartnerConnectionTab()}
              {activeTab === 'parenting' && renderPartnerParentingTab()}
            </>
          ) : (
            <>
              {activeTab === 'dynamics' && renderChildDynamicsTab()}
              {activeTab === 'daily' && renderChildDailyTab()}
              {activeTab === 'growth' && renderChildGrowthTab()}
            </>
          )}
          
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
