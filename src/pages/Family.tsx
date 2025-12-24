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
  if (remaining === 0) return `${yearWords[years]} Year${years > 1 ? "s" : ""}`;
  return `${yearWords[years]}y ${remaining}m`;
};

const getElement = (sign: ZodiacSign): string => {
  const elements: Record<ZodiacSign, string> = {
    aries: "fire", leo: "fire", sagittarius: "fire",
    taurus: "earth", virgo: "earth", capricorn: "earth",
    gemini: "air", libra: "air", aquarius: "air",
    cancer: "water", scorpio: "water", pisces: "water"
  };
  return elements[sign];
};

// Co-Star style declarative previews
const getChildPreview = (sun: ZodiacSign, moon: ZodiacSign | null): string => {
  const traits = SUN_SIGN_CHILD_TRAITS[sun].core.slice(0, 2);
  if (moon) {
    const moonElement = getElement(moon);
    const exteriorInterior: Record<string, string> = {
      fire: "fiery interior",
      earth: "steady interior", 
      air: "restless interior",
      water: "deep interior"
    };
    return `${getZodiacName(sun)} Sun, ${getZodiacName(moon)} Moon. ${traits[0].charAt(0).toUpperCase() + traits[0].slice(1)} exterior, ${exteriorInterior[moonElement]}.`;
  }
  return `${getZodiacName(sun)} Sun. ${traits.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(". ")}.`;
};

const getAgePreview = (sun: ZodiacSign, ageMonths: number): string => {
  const signName = getZodiacName(sun);
  if (ageMonths < 6) return `${signName} at ${ageMonths} months. Temperament emerging. Rhythms forming.`;
  if (ageMonths < 12) return `${signName} at ${ageMonths} months. Physical leaps. Sleep resistance. Mobility.`;
  if (ageMonths < 24) return `${signName} at ${Math.floor(ageMonths / 12)} year. Autonomy drive. Big feelings. Language.`;
  return `${signName} at ${Math.floor(ageMonths / 12)} years. Personality crystallizing. Social awareness.`;
};

const getSiblingPreview = (children: { name: string; sun: ZodiacSign }[]): string => {
  if (children.length < 2) return "";
  const elements = children.map(c => getElement(c.sun));
  const first = getZodiacName(children[0].sun);
  const second = getZodiacName(children[1].sun);
  
  if (elements[0] === elements[1]) {
    return `${first} and ${second}. Same element. Natural understanding.`;
  }
  if ((elements[0] === "fire" && elements[1] === "air") || (elements[0] === "air" && elements[1] === "fire")) {
    return `${first} and ${second}. Fire and air. High energy together.`;
  }
  if ((elements[0] === "earth" && elements[1] === "water") || (elements[0] === "water" && elements[1] === "earth")) {
    return `${first} and ${second}. Earth and water. Nurturing bond.`;
  }
  return `${first} and ${second}. Different rhythms. Growth through contrast.`;
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

  // Minimal family line with glyphs
  const familyLine: string[] = [];
  if (parentHasBirthday && parentSun) {
    familyLine.push(`${parentName} ${getZodiacGlyph(parentSun)}`);
  }
  babies.forEach(baby => {
    const sign = getZodiacFromBirthday(baby.birthday);
    if (sign) familyLine.push(`${baby.name} ${getZodiacGlyph(sign)}`);
  });

  // Prepare sibling data for preview
  const siblingData = babies
    .filter(b => b.birthday)
    .map(b => ({ name: b.name, sun: getZodiacFromBirthday(b.birthday)! }))
    .filter(b => b.sun);

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-3 pb-24">
          {/* Minimal Header */}
          <div className="px-5 pt-8 pb-3 text-center">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
              Family
            </p>
            {familyLine.length > 0 && (
              <p className="text-[12px] text-foreground/40 mt-2 tracking-wide">
                {familyLine.join(" · ")}
              </p>
            )}
          </div>

          {/* Cards */}
          <div className="px-5 space-y-2">
            {/* Parent-Child Cards */}
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

            {/* Child Cards */}
            {babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time);
              const traits = SUN_SIGN_CHILD_TRAITS[childSun];
              const moonTraits = childMoon ? MOON_SIGN_TRAITS[childMoon] : null;
              const childGlyph = getZodiacGlyph(childSun);
              
              return (
                <CollapsibleCard
                  key={`child-${baby.id}`}
                  title={baby.name}
                  subtitle={`${getZodiacName(childSun)} ${childGlyph}${childMoon ? ` · ${getZodiacName(childMoon)} ☽` : ""}`}
                  preview={getChildPreview(childSun, childMoon)}
                >
                  <CollapsibleSubsection title="Core" defaultExpanded>
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">
                      {traits.core.slice(0, 3).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(". ")}.
                    </p>
                  </CollapsibleSubsection>

                  {moonTraits && (
                    <CollapsibleSubsection title="Emotional">
                      <p className="text-[13px] text-foreground/50 leading-[1.6]">
                        {moonTraits.needs}
                      </p>
                    </CollapsibleSubsection>
                  )}

                  <CollapsibleSubsection title="Strengths">
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">{traits.strengths}</p>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Growth">
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">{traits.challenges}</p>
                  </CollapsibleSubsection>
                </CollapsibleCard>
              );
            })}

            {/* Age Cards */}
            {babies.filter(b => b.birthday).map((baby) => {
              const childSun = getZodiacFromBirthday(baby.birthday);
              if (!childSun) return null;
              
              const ageMonths = getAgeMonths(baby.birthday);
              const childGlyph = getZodiacGlyph(childSun);
              
              return (
                <CollapsibleCard
                  key={`age-${baby.id}`}
                  title={formatAgeWord(ageMonths)}
                  subtitle={`${getZodiacName(childSun)} ${childGlyph}`}
                  preview={getAgePreview(childSun, ageMonths)}
                >
                  <CollapsibleSubsection title="Physical" defaultExpanded>
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">
                      {ageMonths < 6 ? "Motor patterns emerging. Reaching. Grasping." :
                       ageMonths < 12 ? "Mobility accelerating. Cruising. Object permanence." :
                       ageMonths < 24 ? "Walking. Climbing. Testing limits." :
                       "Running. Jumping. Coordination refining."}
                    </p>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Sleep">
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">
                      {ageMonths < 6 ? "Rhythms forming. Night stretches lengthening." :
                       ageMonths < 12 ? "Regressions possible. Separation awareness." :
                       ageMonths < 24 ? "Nap transitions. Bedtime resistance." :
                       "Single nap. Nighttime fears emerging."}
                    </p>
                  </CollapsibleSubsection>

                  <CollapsibleSubsection title="Feeding">
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">
                      {ageMonths < 6 ? "Milk primary. Hunger cues developing." :
                       ageMonths < 12 ? "Solids beginning. Pincer grasp emerging." :
                       ageMonths < 24 ? "Self-feeding. Preferences forming. Mess." :
                       "Utensil use. Food opinions strong."}
                    </p>
                  </CollapsibleSubsection>
                </CollapsibleCard>
              );
            })}

            {/* Sibling Card */}
            {siblingData.length > 1 && (
              <CollapsibleCard
                title={babies.map(b => b.name).join(" + ")}
                subtitle={dynamics?.compatibilityLabel || "Siblings"}
                preview={dynamics?.compatibilityNote || getSiblingPreview(siblingData)}
              >
                {dynamicsLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <LoadingSpinner />
                    <span className="text-[13px] text-foreground/40">Generating...</span>
                  </div>
                ) : dynamicsError ? (
                  <div className="py-2">
                    <p className="text-[13px] text-foreground/40 mb-2">{dynamicsError}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateDynamics(childrenForDynamics)}
                      className="text-foreground/40 hover:text-foreground/60"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                ) : dynamics ? (
                  <>
                    <p className="text-[13px] text-foreground/50 leading-[1.6]">{dynamics.currentDynamic}</p>
                    
                    <CollapsibleSubsection title="Each Brings">
                      <div className="space-y-1">
                        {dynamics.whatEachBrings.map((item, i) => (
                          <p key={i} className="text-[13px] text-foreground/50">
                            {item.child}: {item.gifts.slice(0, 3).join(", ")}
                          </p>
                        ))}
                      </div>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="Now">
                      <p className="text-[13px] text-foreground/50 leading-[1.6]">{dynamics.earlyChildhood}</p>
                    </CollapsibleSubsection>

                    <CollapsibleSubsection title="Later">
                      <p className="text-[13px] text-foreground/50 leading-[1.6]">{dynamics.teenYears}</p>
                    </CollapsibleSubsection>
                  </>
                ) : null}
              </CollapsibleCard>
            )}
          </div>

          {/* Parent Birthday Prompt */}
          {!parentHasBirthday && showPrompt && (
            <div className="px-5 pt-2">
              <ParentBirthdayPrompt onSaved={handleBirthdaySaved} />
            </div>
          )}

          {/* Minimal Footer */}
          <div className="pt-8 text-center px-5">
            <p className="text-[10px] text-foreground/20 tracking-[0.2em]">
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
