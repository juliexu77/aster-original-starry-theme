import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Brain, Sparkles, Users, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSiblingDynamics } from "@/hooks/useSiblingDynamics";
import { useParentChildDynamics } from "@/hooks/useParentChildDynamics";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimeOfDayBackground } from "@/components/home/TimeOfDayBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { CollapsibleCard } from "@/components/family/CollapsibleCard";
import { CollapsibleSubsection } from "@/components/family/CollapsibleSubsection";
import { ParentBirthdayPrompt } from "@/components/family/ParentBirthdayPrompt";
import { ParentChildCard } from "@/components/family/ParentChildCard";
import { Button } from "@/components/ui/button";
import { 
  getZodiacFromBirthday, 
  getZodiacSymbol, 
  getZodiacName, 
  getMoonSignFromBirthDateTime,
  ZodiacSign
} from "@/lib/zodiac";
import {
  SUN_SIGN_CHILD_TRAITS,
  MOON_SIGN_TRAITS,
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
  const { dynamics, loading: dynamicsLoading, error: dynamicsError, generateDynamics } = useSiblingDynamics();
  const { getDynamicsForChild, generateDynamics: generateParentChildDynamics } = useParentChildDynamics();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(true);

  const parentSun = useMemo(() => getZodiacFromBirthday(userProfile?.birthday), [userProfile?.birthday]);
  const parentMoon = useMemo(
    () => getMoonSignFromBirthDateTime(userProfile?.birthday, userProfile?.birth_time),
    [userProfile?.birthday, userProfile?.birth_time]
  );

  // Prepare children data for sibling dynamics
  const childrenForDynamics = useMemo(() => {
    return babies
      .filter(b => b.birthday)
      .map(baby => ({
        name: baby.name,
        sunSign: getZodiacName(getZodiacFromBirthday(baby.birthday)!),
        moonSign: baby.birth_time 
          ? getZodiacName(getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time)!)
          : null,
        ageMonths: getAgeMonths(baby.birthday)
      }));
  }, [babies]);

  // Generate sibling dynamics when there are 2+ children
  useEffect(() => {
    if (childrenForDynamics.length >= 2 && !dynamics && !dynamicsLoading) {
      generateDynamics(childrenForDynamics);
    }
  }, [childrenForDynamics, dynamics, dynamicsLoading, generateDynamics]);

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
                    {parentMoon && <span>• {getZodiacName(parentMoon)} ☽</span>}
                  </div>
                </div>
              )}
              
              {/* Children */}
              {babies.map((baby) => {
                const childSun = getZodiacFromBirthday(baby.birthday);
                const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time);
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
                      {childMoon && <span>{getZodiacName(childMoon)} ☽</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          <div className="px-5 space-y-3">
            {/* Parent-Child Dynamics Cards - AI Generated */}
            {parentSun && babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time);
              const ageMonths = getAgeMonths(baby.birthday);
              const { dynamics: pcDynamics, loading: pcLoading, error: pcError } = getDynamicsForChild(baby.id);
              
              return (
                <ParentChildCard
                  key={`parent-${baby.id}`}
                  babyId={baby.id}
                  babyName={baby.name}
                  parentName={parentName}
                  parentSun={parentSun}
                  parentMoon={parentMoon}
                  childSun={childSun}
                  childMoon={childMoon}
                  ageMonths={ageMonths}
                  dynamics={pcDynamics}
                  loading={pcLoading}
                  error={pcError}
                  onGenerate={() => generateParentChildDynamics(
                    baby.id,
                    {
                      name: parentName,
                      sunSign: getZodiacName(parentSun),
                      moonSign: parentMoon ? getZodiacName(parentMoon) : null,
                    },
                    {
                      name: baby.name,
                      sunSign: getZodiacName(childSun),
                      moonSign: childMoon ? getZodiacName(childMoon) : null,
                      ageMonths,
                    }
                  )}
                />
              );
            })}

            {/* Child Understanding Cards */}
            {babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time);
              const traits = SUN_SIGN_CHILD_TRAITS[childSun];
              const moonTraits = childMoon ? MOON_SIGN_TRAITS[childMoon] : null;
              const synthesis = getSunMoonSynthesis(childSun, childMoon, baby.name);
              
              return (
                <CollapsibleCard
                  key={`understand-${baby.id}`}
                  icon={<Brain className="w-4 h-4" />}
                  title={`Understanding ${baby.name}`}
                  subtitle={`${getZodiacName(childSun)} Sun${childMoon ? ` • ${getZodiacName(childMoon)} Moon` : ''}`}
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

                  {childMoon && moonTraits && (
                    <CollapsibleSubsection title={`${getZodiacName(childMoon)} Moon`}>
                      <p className="text-sm text-foreground/90 mb-2">{moonTraits.emotional}</p>
                      <div className="flex flex-wrap gap-2">
                        {moonTraits.traits.map((trait, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-foreground/70">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </CollapsibleSubsection>
                  )}

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
              
              const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time);
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

            {/* Sibling Dynamics - AI Generated */}
            {babies.filter(b => b.birthday).length > 1 && (
              <CollapsibleCard
                icon={<Users className="w-4 h-4" />}
                title={babies.map(b => b.name).join(" + ")}
                subtitle={dynamics?.compatibilityLabel || "Sibling dynamics"}
                preview={dynamics?.compatibilityNote || "Tap to discover how your children interact."}
              >
                {dynamicsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner />
                    <span className="ml-2 text-sm text-muted-foreground">Generating insights...</span>
                  </div>
                ) : dynamicsError ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">{dynamicsError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateDynamics(childrenForDynamics)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Try again
                    </Button>
                  </div>
                ) : dynamics ? (
                  <>
                    <p className="text-sm text-foreground mb-4">{dynamics.currentDynamic}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        What each brings:
                      </p>
                      <div className="space-y-2">
                        {dynamics.whatEachBrings.map((item, i) => (
                          <div key={i}>
                            <span className="text-sm font-medium text-foreground">{item.child}: </span>
                            <span className="text-sm text-foreground/80">{item.gifts.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <CollapsibleSubsection title="Early childhood (now → 5)">
                      <p className="text-sm text-foreground/90">{dynamics.earlyChildhood}</p>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="School years (6-12)">
                      <p className="text-sm text-foreground/90">{dynamics.schoolYears}</p>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="Teen years">
                      <p className="text-sm text-foreground/90">{dynamics.teenYears}</p>
                    </CollapsibleSubsection>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading insights...</p>
                )}
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
