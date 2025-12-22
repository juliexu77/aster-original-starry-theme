import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies, Baby } from "@/hooks/useBabies";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimeOfDayBackground } from "@/components/home/TimeOfDayBackground";
import { GlassCard } from "@/components/home/GlassCard";
import { FamilyNav } from "@/components/family/FamilyNav";
import { Users, Sparkles, Heart } from "lucide-react";

const getAgeInWeeks = (birthday?: string | null): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getAgeLabel = (birthday?: string | null): string => {
  if (!birthday) return "";
  const ageInWeeks = getAgeInWeeks(birthday);
  if (ageInWeeks < 4) return `${ageInWeeks}w`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years}y`;
  return `${years}y ${remainingMonths}mo`;
};

const getZodiacSign = (birthday?: string | null): string => {
  if (!birthday) return "";
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒";
  return "♓";
};

// Generate family insights based on children
const getFamilyInsights = (babies: Baby[]): string[] => {
  const insights: string[] = [];
  
  if (babies.length === 0) return ["Your family story is just beginning."];
  
  if (babies.length === 1) {
    const age = getAgeInWeeks(babies[0].birthday);
    if (age < 12) {
      insights.push("A season of closeness and discovery.");
      insights.push("The world is new through their eyes.");
    } else if (age < 26) {
      insights.push("Curiosity is blooming.");
      insights.push("Each day brings new expressions.");
    } else if (age < 52) {
      insights.push("Movement and wonder intertwined.");
      insights.push("Connection deepening every week.");
    } else {
      insights.push("Independence emerging gently.");
      insights.push("Personality shining through.");
    }
  } else {
    // Multiple children dynamics
    const ages = babies.map(b => getAgeInWeeks(b.birthday));
    const youngest = Math.min(...ages);
    const oldest = Math.max(...ages);
    const gap = oldest - youngest;
    
    if (gap < 52) {
      insights.push("Close in age, discovering together.");
    } else if (gap < 104) {
      insights.push("Learning flows both ways.");
    } else {
      insights.push("Different chapters, shared story.");
    }
    
    if (babies.length === 2) {
      insights.push("Two rhythms finding harmony.");
    } else {
      insights.push("A chorus of personalities.");
    }
    
    // Energy insights
    const hasInfant = ages.some(a => a < 16);
    const hasToddler = ages.some(a => a >= 52);
    
    if (hasInfant && hasToddler) {
      insights.push("Patience stretched, love multiplied.");
    } else if (hasInfant) {
      insights.push("The house holds tenderness.");
    } else if (hasToddler) {
      insights.push("Energy fills every corner.");
    }
  }
  
  return insights.slice(0, 3);
};

// Generate pairwise dynamics
const getPairwiseDynamics = (babies: Baby[]): { pair: string; insight: string }[] => {
  if (babies.length < 2) return [];
  
  const dynamics: { pair: string; insight: string }[] = [];
  
  for (let i = 0; i < babies.length; i++) {
    for (let j = i + 1; j < babies.length; j++) {
      const older = getAgeInWeeks(babies[i].birthday) >= getAgeInWeeks(babies[j].birthday) ? babies[i] : babies[j];
      const younger = older === babies[i] ? babies[j] : babies[i];
      const gap = Math.abs(getAgeInWeeks(babies[i].birthday) - getAgeInWeeks(babies[j].birthday));
      
      let insight = "";
      if (gap < 52) {
        insight = "Growing side by side, natural playmates.";
      } else if (gap < 104) {
        insight = "One leads, one follows, roles shift daily.";
      } else {
        insight = "Tenderness across the age gap.";
      }
      
      dynamics.push({
        pair: `${older.name} & ${younger.name}`,
        insight
      });
    }
  }
  
  return dynamics.slice(0, 3);
};

const Family = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const navigate = useNavigate();

  const insights = useMemo(() => getFamilyInsights(babies), [babies]);
  const dynamics = useMemo(() => getPairwiseDynamics(babies), [babies]);

  if (authLoading || babiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-4 pb-24">
          {/* Family Identity Header */}
          <div className="px-5 pt-8 pb-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
              Your family
            </p>
            
            {/* Member avatars */}
            <div className="flex justify-center gap-3 mb-4">
              {babies.map((baby) => (
                <div key={baby.id} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-1.5">
                    <span className="text-lg font-serif text-primary/60">
                      {baby.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{baby.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>{getAgeLabel(baby.birthday)}</span>
                    {baby.birthday && (
                      <span className="opacity-60">{getZodiacSign(baby.birthday)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Insights */}
          <GlassCard className="mx-5">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">This season</p>
            </div>
            <div className="p-5 space-y-3">
              {insights.map((insight, i) => (
                <p key={i} className="text-base text-foreground font-light leading-relaxed text-center">
                  {insight}
                </p>
              ))}
            </div>
          </GlassCard>

          {/* Pairwise Dynamics */}
          {dynamics.length > 0 && (
            <GlassCard className="mx-5">
              <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Together</p>
              </div>
              <div className="p-4 space-y-4">
                {dynamics.map((dynamic, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {dynamic.pair}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {dynamic.insight}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Family constellation visual */}
          <GlassCard className="mx-5">
            <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Constellation</p>
            </div>
            <div className="p-6">
              <div className="relative h-32 flex items-center justify-center">
                {/* Simple constellation visualization */}
                {babies.map((baby, index) => {
                  const angle = (index / Math.max(babies.length, 1)) * Math.PI * 2 - Math.PI / 2;
                  const radius = babies.length > 1 ? 40 : 0;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={baby.id}
                      className="absolute w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <span className="text-sm font-serif text-primary/80">
                        {baby.name.charAt(0)}
                      </span>
                    </div>
                  );
                })}
                
                {/* Center point for multiple children */}
                {babies.length > 1 && (
                  <div className="absolute w-2 h-2 rounded-full bg-primary/40" />
                )}
              </div>
            </div>
          </GlassCard>

          {/* Affirming footer */}
          <div className="pt-4 text-center px-5">
            <p className="text-xs text-muted-foreground/70 italic">
              Every family finds its own rhythm.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>

      {/* Family Navigation */}
      <FamilyNav />
    </div>
  );
};

export default Family;
