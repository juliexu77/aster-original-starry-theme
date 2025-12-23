import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies, Baby } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimeOfDayBackground } from "@/components/home/TimeOfDayBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { CompatibilityCard } from "@/components/family/CompatibilityCard";
import { ParentBirthdayPrompt } from "@/components/family/ParentBirthdayPrompt";
import { 
  getZodiacFromBirthday, 
  getZodiacSymbol, 
  getZodiacName, 
  getCompatibility,
  ZODIAC_DATA,
  ZodiacSign
} from "@/lib/zodiac";

const getAgeLabel = (birthday?: string | null): string => {
  if (!birthday) return "";
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffDays / 7);
  
  if (ageInWeeks < 4) return `${ageInWeeks}w`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years}y`;
  return `${years}y ${remainingMonths}mo`;
};

interface FamilyMember {
  id: string;
  name: string;
  birthday: string | null;
  type: "parent" | "child";
}

interface CompatibilityPair {
  person1: FamilyMember;
  person2: FamilyMember;
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  relationshipType: "parent-child" | "siblings";
}

const Family = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(true);

  const handleBirthdaySaved = useCallback(() => {
    fetchUserProfile();
    setShowPrompt(false);
  }, [fetchUserProfile]);

  // Build family members list
  const familyMembers = useMemo((): FamilyMember[] => {
    const members: FamilyMember[] = [];
    
    // Add parent if they have a birthday
    if (userProfile?.birthday) {
      members.push({
        id: "parent",
        name: userProfile.display_name || "You",
        birthday: userProfile.birthday,
        type: "parent"
      });
    }
    
    // Add children
    babies.forEach((baby) => {
      members.push({
        id: baby.id,
        name: baby.name,
        birthday: baby.birthday || null,
        type: "child"
      });
    });
    
    return members;
  }, [userProfile, babies]);

  // Generate all compatibility pairs
  const compatibilityPairs = useMemo((): CompatibilityPair[] => {
    const pairs: CompatibilityPair[] = [];
    
    for (let i = 0; i < familyMembers.length; i++) {
      for (let j = i + 1; j < familyMembers.length; j++) {
        const person1 = familyMembers[i];
        const person2 = familyMembers[j];
        
        const sign1 = getZodiacFromBirthday(person1.birthday);
        const sign2 = getZodiacFromBirthday(person2.birthday);
        
        // Skip if either doesn't have a valid sign
        if (!sign1 || !sign2) continue;
        
        // Determine relationship type
        const relationshipType: "parent-child" | "siblings" = 
          (person1.type === "parent" || person2.type === "parent") 
            ? "parent-child" 
            : "siblings";
        
        pairs.push({
          person1,
          person2,
          sign1,
          sign2,
          relationshipType
        });
      }
    }
    
    return pairs;
  }, [familyMembers]);

  const parentHasBirthday = !!userProfile?.birthday;
  const childrenWithBirthdays = babies.filter(b => b.birthday);

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

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-4 pb-24">
          {/* Header */}
          <div className="px-5 pt-8 pb-2 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Family Dynamics
            </p>
            <h1 className="font-serif text-2xl text-foreground">
              Cosmic Connections
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Zodiac insights for your family
            </p>
          </div>

          {/* Family Members Overview */}
          <div className="px-5">
            <div className="flex justify-center flex-wrap gap-3">
              {/* Parent */}
              {userProfile?.birthday && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-1.5">
                    <span className="text-xl">
                      {getZodiacSymbol(userProfile.birthday)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {userProfile.display_name || "You"}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {getZodiacName(getZodiacFromBirthday(userProfile.birthday)!)}
                  </span>
                </div>
              )}
              
              {/* Children */}
              {babies.map((baby) => (
                <div key={baby.id} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center mb-1.5">
                    {baby.birthday ? (
                      <span className="text-xl">
                        {getZodiacSymbol(baby.birthday)}
                      </span>
                    ) : (
                      <span className="text-lg font-serif text-primary/60">
                        {baby.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground">{baby.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>{getAgeLabel(baby.birthday)}</span>
                    {baby.birthday && (
                      <span>• {getZodiacName(getZodiacFromBirthday(baby.birthday)!)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No connections message */}
          {compatibilityPairs.length === 0 && parentHasBirthday && childrenWithBirthdays.length === 0 && (
            <div className="mx-5 p-6 rounded-2xl bg-muted/30 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                Add birthdays to your children in Settings to see connection insights.
              </p>
            </div>
          )}

          {/* Connection Cards */}
          <div className="px-5 space-y-4">
            {compatibilityPairs.map((pair, index) => {
              const compatibility = getCompatibility(pair.sign1, pair.sign2, pair.relationshipType);
              
              return (
                <CompatibilityCard
                  key={`${pair.person1.id}-${pair.person2.id}`}
                  person1Name={pair.person1.name}
                  person1Sign={getZodiacName(pair.sign1)}
                  person1Symbol={ZODIAC_DATA[pair.sign1].symbol}
                  person2Name={pair.person2.name}
                  person2Sign={getZodiacName(pair.sign2)}
                  person2Symbol={ZODIAC_DATA[pair.sign2].symbol}
                  compatibility={compatibility}
                  relationshipType={pair.relationshipType}
                />
              );
            })}
          </div>

          {/* Parent Birthday Prompt - moved below connection cards */}
          {!parentHasBirthday && showPrompt && (
            <ParentBirthdayPrompt onSaved={handleBirthdaySaved} />
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
