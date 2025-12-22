import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { DailyCoach } from "@/components/home/DailyCoach";
import { ChildSwitcher } from "@/components/home/ChildSwitcher";
import { GuideMenu } from "@/components/GuideMenu";
import { GuideSectionView } from "@/components/GuideSectionView";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    babies, 
    activeBaby, 
    loading: babiesLoading,
    switchBaby,
    switchToNextBaby,
    switchToPrevBaby
  } = useBabies();
  const navigate = useNavigate();
  
  const [guideSection, setGuideSection] = useState<string | null>(null);

  // Show loading while auth is being checked
  if (authLoading || babiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Redirect to baby setup if no babies
  if (babies.length === 0) {
    navigate("/baby-setup");
    return null;
  }

  // Show guide section view if selected
  if (guideSection) {
    return (
      <GuideSectionView 
        sectionId={guideSection} 
        onBack={() => setGuideSection(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Menu */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="px-4 py-2 flex items-center justify-end">
          <GuideMenu onSelectSection={setGuideSection} />
        </div>
      </header>

      {/* Child Switcher */}
      {activeBaby && (
        <ChildSwitcher
          babies={babies}
          activeBaby={activeBaby}
          onSwitch={switchBaby}
          onNext={switchToNextBaby}
          onPrev={switchToPrevBaby}
        />
      )}

      {/* Main Content */}
      <main>
        {activeBaby && (
          <DailyCoach 
            babyName={activeBaby.name} 
            babyBirthday={activeBaby.birthday || undefined} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
