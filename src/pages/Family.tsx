import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
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
  getZodiacGlyph, 
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

const formatAgeWord = (months: number): string => {
  if (months < 1) return "Newborn";
  if (months === 1) return "One Month";
  if (months < 12) {
    const words = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven"];
    return `${words[months]} Months`;
  }
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const yearWords = ["", "One", "Two", "Three", "Four", "Five"];
  if (remaining === 0) return `${yearWords[years]} Year${years > 1 ? 's' : ''}`;
  return `${yearWords[years]} Year${years > 1 ? 's' : ''}, ${remaining} Month${remaining > 1 ? 's' : ''}`;
};

// Co-Star style preview generators
const getCoStarPreview = (sun: ZodiacSign, moon: ZodiacSign | null): string => {
  const sunTraits = SUN_SIGN_CHILD_TRAITS[sun];
  const coreTraits = sunTraits.core.slice(0, 3).join(". ") + ".";
  if (moon) {
    const moonNeed = MOON_SIGN_TRAITS[moon].needs.split(",")[0].trim();
    return `${coreTraits} Needs ${moonNeed.toLowerCase()}.`;
  }
  return coreTraits;
};

const getCoStarAgePreview = (sun: ZodiacSign, ageMonths: number): string => {
  const element = getElement(sun);
  const elementDescriptors: Record<string, string> = {
    fire: "Active. Physical. Learning through movement.",
    earth: "Steady. Sensory. Building foundations.",
    air: "Curious. Verbal. Processing through talk.",
    water: "Feeling. Intuitive. Absorbing everything."
  };
  return elementDescriptors[element] || "";
};

const getElement = (sign: ZodiacSign): string => {
  const elements: Record<ZodiacSign, string> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water'
  };
  return elements[sign];
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

  // Build minimal family line
  const familyMembers: string[] = [];
  if (parentHasBirthday && parentSun) {
    familyMembers.push(`${parentName} ${getZodiacGlyph(parentSun)}`);
  }
  babies.forEach(baby => {
    const sign = getZodiacFromBirthday(baby.birthday);
    if (sign) {
      familyMembers.push(`${baby.name} ${getZodiacGlyph(sign)}`);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-4 pb-24">
          {/* Minimal Header */}
          <div className="px-5 pt-8 pb-2 text-center">
            <p className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.25em]">
              Family
            </p>
            {familyMembers.length > 0 && (
              <p className="text-[13px] text-foreground/60 mt-3 tracking-wide">
                {familyMembers.join(" · ")}
              </p>
            )}
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
              const childGlyph = getZodiacGlyph(childSun);
              const moonGlyph = childMoon ? getZodiacGlyph(childMoon) : null;
              
              return (
                <CollapsibleCard
                  key={`understand-${baby.id}`}
                  title={baby.name}
                  subtitle={`${getZodiacName(childSun)} ${childGlyph}${childMoon ? ` · ${getZodiacName(childMoon)} ☽` : ''}`}
                  preview={getCoStarPreview(childSun, childMoon)}
                >
                  <p className="text-[14px] text-foreground/70 mb-4 leading-[1.5]">
                    {traits.core.slice(0, 4).join(". ")}. {childMoon ? MOON_SIGN_TRAITS[childMoon].needs.split(",")[0].trim() + " emotionally." : ""}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-[12px] text-muted-foreground/50 uppercase tracking-wide mb-2">
                      {getZodiacName(childSun)} ☉
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {traits.core.map((trait, i) => (
                        <span key={i} className="text-[13px] px-2 py-1 rounded-full bg-foreground/5 text-foreground/60">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {childMoon && moonTraits && (
                    <CollapsibleSubsection title={`${getZodiacName(childMoon)} ☽`}>
                      <p className="text-[14px] text-foreground/60 mb-2">{moonTraits.needs}</p>
                      <div className="flex flex-wrap gap-2">
                        {moonTraits.traits.map((trait, i) => (
                          <span key={i} className="text-[13px] px-2 py-1 rounded-full bg-foreground/5 text-foreground/50">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </CollapsibleSubsection>
                  )}

                  <CollapsibleSubsection title="Strengths">
                    <p className="text-[14px] text-foreground/60">{traits.strengths}</p>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Growth">
                    <p className="text-[14px] text-foreground/60">{traits.challenges}</p>
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
              const childGlyph = getZodiacGlyph(childSun);
              
              return (
                <CollapsibleCard
                  key={`stage-${baby.id}`}
                  title={`${baby.name} · ${formatAgeWord(ageMonths)}`}
                  subtitle={`${getZodiacName(childSun)} ${childGlyph}`}
                  preview={getCoStarAgePreview(childSun, ageMonths)}
                >
                  <p className="text-[14px] text-foreground/70 mb-4 leading-[1.5]">{ageInsight.content}</p>
                  
                  <div className="space-y-3">
                    {Object.entries(ageInsight.areas).map(([area, content]) => (
                      <div key={area}>
                        <p className="text-[12px] text-muted-foreground/50 uppercase tracking-wide mb-1">
                          {area}
                        </p>
                        <p className="text-[14px] text-foreground/60">{content}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleCard>
              );
            })}

            {/* Sibling Dynamics - AI Generated */}
            {babies.filter(b => b.birthday).length > 1 && (
              <CollapsibleCard
                title={babies.map(b => b.name).join(" + ")}
                subtitle={dynamics?.compatibilityLabel || "Sibling dynamics"}
                preview={dynamics?.compatibilityNote || "Loading..."}
              >
                {dynamicsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner />
                    <span className="ml-2 text-[14px] text-muted-foreground">Generating...</span>
                  </div>
                ) : dynamicsError ? (
                  <div className="text-center py-4">
                    <p className="text-[14px] text-muted-foreground mb-2">{dynamicsError}</p>
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
                    <p className="text-[14px] text-foreground/70 mb-4 leading-[1.5]">{dynamics.currentDynamic}</p>
                    
                    <div className="mb-4">
                      <p className="text-[12px] text-muted-foreground/50 uppercase tracking-wide mb-2">
                        What each brings
                      </p>
                      <div className="space-y-2">
                        {dynamics.whatEachBrings.map((item, i) => (
                          <div key={i}>
                            <span className="text-[14px] text-foreground/70">{item.child}: </span>
                            <span className="text-[14px] text-foreground/50">{item.gifts.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <CollapsibleSubsection title="Early childhood">
                      <p className="text-[14px] text-foreground/60">{dynamics.earlyChildhood}</p>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="School years">
                      <p className="text-[14px] text-foreground/60">{dynamics.schoolYears}</p>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="Teen years">
                      <p className="text-[14px] text-foreground/60">{dynamics.teenYears}</p>
                    </CollapsibleSubsection>
                  </>
                ) : (
                  <p className="text-[14px] text-muted-foreground">Loading...</p>
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

          {/* Minimal Footer */}
          <div className="pt-6 text-center px-5">
            <p className="text-[11px] text-muted-foreground/40 tracking-wide">
              Stars illuminate. Love defines.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>

      <FamilyNav />
    </div>
  );
};

export default Family;
