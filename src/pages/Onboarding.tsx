import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="flex items-center justify-center px-5 py-4">
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
          Aster
        </p>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="max-w-sm mx-auto text-center space-y-12">

          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-[13px] text-foreground/50 leading-[1.7]">
              Your daily guide for baby care
            </h1>
            <p className="text-[13px] text-foreground/40 leading-[1.7]">
              What to expect today based on age. Naps. Activities. Milestones. No tracking required.
            </p>
          </div>

          {/* Minimal tagline */}
          <p className="text-[10px] text-foreground/20 tracking-[0.2em] uppercase">
            Open. Know what's next.
          </p>

          {/* CTA */}
          <div className="pt-4">
            <Button
              onClick={handleGetStarted}
              variant="ghost"
              className="text-[11px] text-foreground/40 hover:text-foreground/60 uppercase tracking-wider"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-[10px] text-foreground/15 tracking-[0.15em]">
          Rhythm. Not rules.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
