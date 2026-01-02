import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { CosmosView } from "@/components/cosmos/CosmosView";

const Cosmos = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
            <p className="text-[10px] text-foreground/20 tracking-[0.2em]">
              Stars illuminate. Love defines.
            </p>
          </div>
        </div>
      </NightSkyBackground>

      <FamilyNav />
    </div>
  );
};

export default Cosmos;