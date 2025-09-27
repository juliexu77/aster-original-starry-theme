import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BabyProfileSetup } from "@/components/BabyProfileSetup";
import { useBabyProfile } from "@/hooks/useBabyProfile";
import { useAuth } from "@/hooks/useAuth";

const BabySetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { babyProfile, loading: profileLoading } = useBabyProfile();

  // Check if user already has baby profile, skip setup
  useEffect(() => {
    if (authLoading || profileLoading) return;

    const isGuest = localStorage.getItem('skipOnboarding') === 'true';
    const hasLocalProfile = localStorage.getItem('babyProfile');
    const profileCompleted = localStorage.getItem('babyProfileCompleted');

    // If authenticated user has a DB profile, go to app
    if (user && babyProfile) {
      navigate("/app");
      return;
    }

    // If guest has completed local profile, go to app
    if (isGuest && hasLocalProfile && profileCompleted) {
      navigate("/app");
      return;
    }

    // Otherwise show baby setup
  }, [user, babyProfile, authLoading, profileLoading, navigate]);

  const handleProfileComplete = (profile: { name: string; birthday?: string }) => {
    // Store baby profile locally
    localStorage.setItem("babyProfile", JSON.stringify(profile));
    localStorage.setItem("babyProfileCompleted", "true");
    
    // Navigate to main app
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BabyProfileSetup onComplete={handleProfileComplete} />
      </div>
    </div>
  );
};

export default BabySetup;