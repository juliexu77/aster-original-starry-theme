import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { FamilyView } from "@/components/family/FamilyView";

const FamilyRelationships = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();

  const handleBirthdaySaved = () => {
    fetchUserProfile();
  };

  // Check if user has any family members beyond themselves
  const hasFamily = babies.length > 0 || userProfile?.partner_birthday;
  const pageTitle = hasFamily ? "Family Dynamics" : "Cosmic Profile";

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
              {pageTitle}
            </p>
          </div>

          {/* Family View Content */}
          <FamilyView
            babies={babies}
            userProfile={userProfile}
            onBirthdaySaved={handleBirthdaySaved}
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

export default FamilyRelationships;
