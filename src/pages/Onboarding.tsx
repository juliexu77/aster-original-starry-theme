import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";


const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  // Redirect returning users with households to main app
  useEffect(() => {
    if (authLoading || householdLoading) return;
    if (user && household) {
      navigate("/", { replace: true });
    }
  }, [user, household, authLoading, householdLoading, navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur opacity-75 animate-pulse"></div>
          <ThemeToggle showText={false} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md mx-auto text-center space-y-10">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-2xl font-heading font-bold text-primary tracking-tight">
              BABYRHYTHM
            </span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-sans font-semibold text-foreground tracking-tight leading-tight">
              Your AI parenting companion
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              Our AI learns your baby's unique patterns and predicts their next feed, nap, and wake window — so you're always one step ahead.
            </p>
            
            {/* AI Features */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-medium text-primary">AI predicts your baby's schedule</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-lg">💬</span>
                <span className="text-sm font-medium text-primary">Chat with your AI night doula 24/7</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start My Rhythm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;