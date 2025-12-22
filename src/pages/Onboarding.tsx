import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle showText={false} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md mx-auto text-center space-y-10">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-2xl font-sans font-bold text-primary tracking-tight">
              BABYRHYTHM
            </span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-8">
            <h1 className="text-[22px] md:text-[36px] font-serif font-medium tracking-tight text-foreground" style={{ lineHeight: '1.25' }}>
              Your daily guide for baby care
            </h1>
            <p className="text-[15px] md:text-[16px] leading-[1.6] font-normal mt-8 text-foreground/80">
              BabyRhythm tells you what to do today based on your baby's age — nap timing, activity suggestions, and developmental milestones.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.6] font-normal text-foreground/80">
              No tracking required. Just open the app and know what's next.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-6">
            <Button
              onClick={handleGetStarted}
              className="w-full rounded-full py-[14px] px-8 text-base font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
