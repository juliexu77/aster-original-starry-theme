import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MultiStepOnboarding } from "@/components/MultiStepOnboarding";
import { useBabyProfile } from "@/hooks/useBabyProfile";
import { useAuth } from "@/hooks/useAuth";

const BabySetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { babyProfile, loading: profileLoading } = useBabyProfile();

  // Check if user already has baby profile, skip setup
  useEffect(() => {
    if (authLoading || profileLoading) return;

    // Require authentication - redirect to auth if not logged in
    if (!user) {
      navigate("/auth");
      return;
    }

    // If user has a database profile, redirect to main app
    if (babyProfile) {
      navigate("/app");
      return;
    }

    // Otherwise show baby setup
  }, [user, babyProfile, authLoading, profileLoading, navigate]);

  const handleOnboardingComplete = () => {
    // Navigate to main app after completion
    navigate("/app");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MultiStepOnboarding onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default BabySetup;
