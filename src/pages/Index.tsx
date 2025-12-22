import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { DailyCoach } from "@/components/home/DailyCoach";
import { ChildSwitcher } from "@/components/home/ChildSwitcher";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Guide } from "@/pages/Guide";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  const [activeTab, setActiveTab] = useState("today");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Settings */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="px-5 py-2 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Child Switcher - only show on Today tab */}
      {activeTab === "today" && activeBaby && (
        <ChildSwitcher
          babies={babies}
          activeBaby={activeBaby}
          onSwitch={switchBaby}
          onNext={switchToNextBaby}
          onPrev={switchToPrevBaby}
        />
      )}

      {/* Main Content */}
      <main className="pb-20">
        {activeTab === "today" && activeBaby && (
          <DailyCoach 
            babyName={activeBaby.name} 
            babyBirthday={activeBaby.birthday || undefined} 
          />
        )}
        
        {activeTab === "guide" && (
          <Guide />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
