import { useState, useRef } from "react";
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

  // Swipe handling for child switching
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && babies.length > 1) {
      switchToNextBaby();
    }
    if (isRightSwipe && babies.length > 1) {
      switchToPrevBaby();
    }
  };

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
    <div 
      className="h-screen bg-background flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeBaby && (
          <DailyCoach 
            babyName={activeBaby.name} 
            babyBirthday={activeBaby.birthday || undefined}
            babies={babies}
            activeBabyId={activeBaby.id}
            onSwitchBaby={switchBaby}
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
