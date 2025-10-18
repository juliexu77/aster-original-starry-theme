import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout } from "lucide-react";

const ReadyScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Optional: Auto-redirect after a few seconds
    const timer = setTimeout(() => {
      navigate("/app");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
        {/* Icon with animation */}
        <div className="flex items-center justify-center">
          <div className="text-6xl animate-fade-in">🌞</div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-heading font-semibold text-foreground leading-tight">
            You're all set.
          </h1>
          <p className="text-base text-muted-foreground font-light leading-relaxed">
            Your baby's rhythm starts today.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/app")}
          size="lg"
          className="w-full h-12 text-base font-bold rounded-full"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default ReadyScreen;
