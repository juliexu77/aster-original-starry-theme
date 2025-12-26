import { useMemo, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { CollapsibleCard } from "./CollapsibleCard";
import { CollapsibleSubsection } from "./CollapsibleSubsection";
import { ParentBirthdayPrompt } from "./ParentBirthdayPrompt";
import { ParentChildCard } from "./ParentChildCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSiblingDynamics } from "@/hooks/useSiblingDynamics";
import { useParentChildDynamics } from "@/hooks/useParentChildDynamics";
import { 
  getZodiacFromBirthday, 
  getMoonSignFromBirthDateTime,
  getZodiacName,
  ZodiacSign 
} from "@/lib/zodiac";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface UserProfile {
  display_name: string | null;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  partner_name: string | null;
  partner_birthday: string | null;
  partner_birth_time: string | null;
  partner_birth_location: string | null;
}

interface FamilyViewProps {
  babies: Baby[];
  userProfile: UserProfile | null;
  onBirthdaySaved: () => void;
}

const getAgeMonths = (birthday?: string | null): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  return Math.max(0, months);
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

const getSiblingPreview = (children: { name: string; sun: ZodiacSign }[]): string => {
  if (children.length < 2) return "";
  const elements = children.map(c => getElement(c.sun));
  
  if (elements[0] === elements[1]) {
    return "Same element. Natural understanding.";
  }
  if ((elements[0] === "fire" && elements[1] === "air") || (elements[0] === "air" && elements[1] === "fire")) {
    return "Fire and air. High energy together.";
  }
  if ((elements[0] === "earth" && elements[1] === "water") || (elements[0] === "water" && elements[1] === "earth")) {
    return "Earth and water. Nurturing bond.";
  }
  return "Different rhythms. Growth through contrast.";
};

export const FamilyView = ({ babies, userProfile, onBirthdaySaved }: FamilyViewProps) => {
  const { dynamics, loading: dynamicsLoading, error: dynamicsError, generateDynamics } = useSiblingDynamics();
  const { getDynamicsForChild, generateDynamics: generateParentChildDynamics } = useParentChildDynamics();

  const parentName = userProfile?.display_name || "You";
  const parentHasBirthday = !!userProfile?.birthday;

  const parentSun = useMemo(() => getZodiacFromBirthday(userProfile?.birthday), [userProfile?.birthday]);
  const parentMoon = useMemo(
    () => getMoonSignFromBirthDateTime(userProfile?.birthday, userProfile?.birth_time, userProfile?.birth_location),
    [userProfile?.birthday, userProfile?.birth_time, userProfile?.birth_location]
  );

  const childrenForDynamics = useMemo(() => {
    return babies
      .filter(b => b.birthday)
      .map(baby => ({
        name: baby.name,
        sunSign: getZodiacName(getZodiacFromBirthday(baby.birthday)!),
        moonSign: baby.birth_time 
          ? getZodiacName(getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time, baby.birth_location)!)
          : null,
        ageMonths: getAgeMonths(baby.birthday)
      }));
  }, [babies]);

  useEffect(() => {
    if (childrenForDynamics.length >= 2 && !dynamics && !dynamicsLoading) {
      generateDynamics(childrenForDynamics);
    }
  }, [childrenForDynamics, dynamics, dynamicsLoading, generateDynamics]);

  // Build family member data for header
  const familyMembers: { name: string; sign: ZodiacSign }[] = [];
  if (parentHasBirthday && parentSun) {
    familyMembers.push({ name: parentName, sign: parentSun });
  }
  babies.forEach(baby => {
    const sign = getZodiacFromBirthday(baby.birthday);
    if (sign) familyMembers.push({ name: baby.name, sign });
  });

  // Prepare sibling data for preview
  const siblingData = babies
    .filter(b => b.birthday)
    .map(b => ({ name: b.name, sun: getZodiacFromBirthday(b.birthday)! }))
    .filter(b => b.sun);

  return (
    <div className="space-y-6">
      {/* Family Constellation Header */}
      <div className="px-5 pt-6 text-center">
        {familyMembers.length > 0 && (
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {familyMembers.map((member, i) => (
              <div key={i} className="flex items-center gap-1.5 text-foreground/50">
                <ZodiacIcon sign={member.sign} size={14} strokeWidth={1.5} className="text-foreground/40" />
                <span className="text-[12px]">{member.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="px-5 space-y-2">
        {/* Parent-Child Cards */}
        {parentSun && babies.filter(b => b.birthday).map((baby) => {
          const childSun = getZodiacFromBirthday(baby.birthday);
          if (!childSun) return null;
          
          const childMoon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time, baby.birth_location);
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
      {!parentHasBirthday && (
        <div className="px-5 pt-2">
          <ParentBirthdayPrompt onSaved={onBirthdaySaved} />
        </div>
      )}
    </div>
  );
};
