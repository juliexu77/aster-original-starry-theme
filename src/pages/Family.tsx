import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Brain, Sparkles, Moon, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimeOfDayBackground } from "@/components/home/TimeOfDayBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { CollapsibleCard } from "@/components/family/CollapsibleCard";
import { CollapsibleSubsection } from "@/components/family/CollapsibleSubsection";
import { ParentBirthdayPrompt } from "@/components/family/ParentBirthdayPrompt";
import { 
  getZodiacFromBirthday, 
  getZodiacSymbol, 
  getZodiacName, 
  ZODIAC_DATA,
  ZodiacSign
} from "@/lib/zodiac";
import {
  SUN_SIGN_CHILD_TRAITS,
  MOON_SIGN_TRAITS,
  getParentChildInsight,
  getSunMoonSynthesis,
  getAgeSignInsight
} from "@/lib/zodiac-content";

const getAgeMonths = (birthday?: string | null): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  return Math.max(0, months);
};

const getAgeLabel = (birthday?: string | null): string => {
  if (!birthday) return "";
  const months = getAgeMonths(birthday);
  if (months < 1) return "newborn";
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years}y`;
  return `${years}y ${remainingMonths}mo`;
};

const Family = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(true);

  const parentSun = useMemo(() => getZodiacFromBirthday(userProfile?.birthday), [userProfile?.birthday]);
  const parentMoon: ZodiacSign | null = null; // Will be calculated when birth_time is available

  const handleBirthdaySaved = () => {
    fetchUserProfile();
    setShowPrompt(false);
  };

  if (authLoading || babiesLoading || profileLoading) {
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

  const parentName = userProfile?.display_name || "You";
  const parentHasBirthday = !!userProfile?.birthday;

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-4 pb-24">
          {/* Header */}
          <div className="px-5 pt-8 pb-2 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Cosmic Connections
            </p>
            <h1 className="font-serif text-2xl text-foreground">
              Family Dynamics
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Zodiac insights for your family
            </p>
          </div>

          {/* Family Constellation */}
          <div className="px-5">
            <div className="flex justify-center flex-wrap gap-4">
              {/* Parent */}
              {userProfile?.birthday && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-1.5">
                    <span className="text-xl">{getZodiacSymbol(userProfile.birthday)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{parentName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>{getZodiacName(parentSun!)} ☉</span>
                  </div>
                </div>
              )}
              
              {/* Children */}
              {babies.map((baby) => {
                const childSun = getZodiacFromBirthday(baby.birthday);
                return (
                  <div key={baby.id} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-1.5">
                      {baby.birthday ? (
                        <span className="text-xl">{getZodiacSymbol(baby.birthday)}</span>
                      ) : (
                        <span className="text-lg font-serif text-primary/60">
                          {baby.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground">{baby.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{getAgeLabel(baby.birthday)}</span>
                      {childSun && <span>• {getZodiacName(childSun)} ☉</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          <div className="px-5 space-y-3">
            {/* Parent-Child Dynamics Cards */}
            {parentSun && babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon: ZodiacSign | null = null;
              const insight = getParentChildInsight(parentSun, parentMoon, childSun, childMoon, baby.name);
              const ageMonths = getAgeMonths(baby.birthday);
              
              return (
                <CollapsibleCard
                  key={`parent-${baby.id}`}
                  icon={<Heart className="w-4 h-4" />}
                  title={`${parentName} + ${baby.name}`}
                  subtitle={`${getZodiacName(parentSun)} parent • ${getZodiacName(childSun)} child`}
                  preview={insight.hook}
                >
                  <p className="text-sm text-foreground mb-4">{insight.hook}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Your {getZodiacName(parentSun)} gives you:
                    </p>
                    <ul className="space-y-1">
                      {insight.parentQualities.slice(0, 5).map((q, i) => (
                        <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CollapsibleSubsection title={`What ${baby.name} needs`}>
                    <ul className="space-y-1">
                      {insight.whatChildNeeds.map((need, i) => (
                        <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                          {need}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Where to watch for friction">
                    <ul className="space-y-1">
                      {insight.friction.map((f, i) => (
                        <li key={i} className="text-sm text-foreground/90 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/50">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleSubsection>
                </CollapsibleCard>
              );
            })}

            {/* Child Understanding Cards */}
            {babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon: ZodiacSign | null = null;
              const traits = SUN_SIGN_CHILD_TRAITS[childSun];
              const synthesis = getSunMoonSynthesis(childSun, childMoon, baby.name);
              
              return (
                <CollapsibleCard
                  key={`understand-${baby.id}`}
                  icon={<Brain className="w-4 h-4" />}
                  title={`Understanding ${baby.name}`}
                  subtitle={`${getZodiacName(childSun)} Sun`}
                  preview={synthesis}
                >
                  <p className="text-sm text-foreground mb-4">{synthesis}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      {getZodiacName(childSun)} Sun traits:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {traits.core.map((trait, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-foreground/80">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <CollapsibleSubsection title="Strengths">
                    <p className="text-sm text-foreground/90">{traits.strengths}</p>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Growth areas">
                    <p className="text-sm text-foreground/90">{traits.challenges}</p>
                  </CollapsibleSubsection>
                </CollapsibleCard>
              );
            })}

            {/* Stage + Sign Cards */}
            {babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon: ZodiacSign | null = null;
              const ageMonths = getAgeMonths(baby.birthday);
              const ageInsight = getAgeSignInsight(childSun, childMoon, ageMonths, baby.name);
              
              return (
                <CollapsibleCard
                  key={`stage-${baby.id}`}
                  icon={<Sparkles className="w-4 h-4" />}
                  title={`${baby.name} Right Now`}
                  subtitle={ageInsight.title}
                  preview={ageInsight.content}
                >
                  <p className="text-sm text-foreground mb-4">{ageInsight.content}</p>
                  
                  <div className="space-y-3">
                    {Object.entries(ageInsight.areas).map(([area, content]) => (
                      <div key={area}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {area}
                        </p>
                        <p className="text-sm text-foreground/90">{content}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleCard>
              );
            })}

            {/* Sibling Dynamics - only if multiple children */}
            {babies.filter(b => b.birthday).length > 1 && (
              <CollapsibleCard
                icon={<Users className="w-4 h-4" />}
                title={babies.map(b => b.name).join(" + ")}
                subtitle="Sibling dynamics"
                preview="How your children interact and complement each other."
              >
                <p className="text-sm text-foreground">
                  Your children bring different energies to the family dynamic. Watch how they learn from each other's differences.
                </p>
              </CollapsibleCard>
            )}
          </div>

          {/* Parent Birthday Prompt */}
          {!parentHasBirthday && showPrompt && (
            <div className="px-5">
              <ParentBirthdayPrompt onSaved={handleBirthdaySaved} />
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 text-center px-5">
            <p className="text-xs text-muted-foreground/70 italic">
              The stars illuminate, but love defines.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>

      <FamilyNav />
    </div>
  );
};

export default Family;
