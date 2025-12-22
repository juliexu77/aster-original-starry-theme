import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DailyCoach } from "@/components/home/DailyCoach";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Settings as SettingsPage } from "@/pages/Settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { userProfile } = useUserProfile();
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("home");

  // Show loading while auth is being checked
  if (authLoading || householdLoading) {
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

  // Redirect to baby setup if no household
  if (!household) {
    navigate("/baby-setup");
    return null;
  }

  const babyName = household.baby_name || undefined;
  const babyBirthday = household.baby_birthday || undefined;
  const userName = userProfile?.display_name || userProfile?.full_name || undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-serif text-foreground">
              {babyName ? `${babyName}'s Day` : "Today"}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {activeTab === "home" && (
          <DailyCoach 
            babyName={babyName} 
            babyBirthday={babyBirthday} 
          />
        )}
        
        {activeTab === "history" && (
          <div className="px-5 py-8 text-center text-muted-foreground">
            <p>Sleep history coming soon</p>
          </div>
        )}
        
        {activeTab === "settings" && (
          <SettingsPage />
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
