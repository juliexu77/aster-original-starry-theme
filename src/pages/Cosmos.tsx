import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { CosmosView } from "@/components/cosmos/CosmosView";

// Cosmic fortunes - one is randomly selected each time
const COSMIC_FORTUNES = [
  "Stars illuminate. Love defines.",
  "The cosmos whispers; the heart knows.",
  "Born of stardust, bound by love.",
  "Every chart tells a story of becoming.",
  "The sky holds patterns; you hold meaning.",
  "What the stars begin, love completes.",
  "Ancient light guides new beginnings.",
  "In the dance of planets, find your rhythm.",
  "The universe conspires in your favor.",
  "Between stars, infinite possibility.",
  "Your constellation is unlike any other.",
  "Time bends around love's gravity.",
  "The heavens map what the heart already knows.",
  "In cosmic time, every moment matters.",
  "Stars shift; love endures.",
  "The sky remembers your arrival.",
  "Celestial threads weave earthly bonds.",
  "What burns above, glows within.",
  "The moon knows your tides.",
  "Between darkness and light, you shine.",
];

const Cosmos = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  
  // Pick a random fortune on mount
  const fortune = useMemo(() => {
    return COSMIC_FORTUNES[Math.floor(Math.random() * COSMIC_FORTUNES.length)];
  }, []);
  useEffect(() => {
    if (babies.length === 0) return;
    
    const storedId = localStorage.getItem('cosmos-selected-member-id');
    const isValidBabyId = storedId && babies.some(b => b.id === storedId && b.birthday);
    const isValidParentId = storedId === 'parent' || storedId === 'partner';
    const storedIdIsValid = isValidBabyId || isValidParentId;
    
    if (storedIdIsValid) {
      setSelectedMemberId(storedId);
    } else {
      const firstWithBirthday = babies.find(b => b.birthday);
      if (firstWithBirthday) {
        setSelectedMemberId(firstWithBirthday.id);
        localStorage.setItem('cosmos-selected-member-id', firstWithBirthday.id);
      }
    }
  }, [babies]);

  useEffect(() => {
    if (selectedMemberId) {
      localStorage.setItem('cosmos-selected-member-id', selectedMemberId);
    }
  }, [selectedMemberId]);

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
    <div className="min-h-screen">
      <NightSkyBackground>
        <div className="space-y-3 pb-24">
          {/* Header */}
          <div className="px-5 pt-8 pb-2">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] text-center mb-6">
              Cosmos
            </p>
          </div>

          {/* Cosmos View */}
          <CosmosView
            babies={babies}
            userProfile={userProfile}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
          />

          {/* Minimal Footer */}
          <div className="pt-8 text-center px-5">
            <p className="text-[10px] text-foreground/30 tracking-[0.15em] italic font-serif">
              {fortune}
            </p>
          </div>
        </div>
      </NightSkyBackground>

      <FamilyNav />
    </div>
  );
};

export default Cosmos;