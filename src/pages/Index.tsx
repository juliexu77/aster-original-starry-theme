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
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Main Content */}
      <main className="pb-24">
        {activeBaby && (
          <DailyCoach 
            babyName={activeBaby.name} 
            babyBirthday={activeBaby.birthday || undefined} 
          />
        )}
      </main>

      {/* Child Switcher - fixed at bottom like Weather app */}
      {activeBaby && (
        <ChildSwitcher
          babies={babies}
          activeBaby={activeBaby}
          onSwitch={switchBaby}
          onNext={switchToNextBaby}
          onPrev={switchToPrevBaby}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {/* Guide Menu */}
      <GuideMenu 
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onSelectSection={setGuideSection} 
      />
    </div>
  );
};

export default Index;
