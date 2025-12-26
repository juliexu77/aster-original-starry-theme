import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";
import { ChartGenerating } from "@/components/calibration/ChartGenerating";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useCalibration, CalibrationData } from "@/hooks/useCalibration";
import { useToast } from "@/hooks/use-toast";

type SetupPhase = 'details' | 'calibration' | 'generating';

const BabySetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createHousehold } = useHousehold();
  const { saveCalibration } = useCalibration();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<SetupPhase>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthday, setBabyBirthday] = useState("");
  const [babyBirthTime, setBabyBirthTime] = useState("");
  const [babyBirthLocation, setBabyBirthLocation] = useState("");
  
  // Store created baby/household IDs for calibration save
  const [createdBabyId, setCreatedBabyId] = useState<string | null>(null);
  const [createdHouseholdId, setCreatedHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    try {
      const result = await createHousehold(
        babyName, 
        babyBirthday || undefined, 
        babyBirthTime || undefined, 
        babyBirthLocation || undefined
      );
      
      // Store IDs for calibration
      setCreatedBabyId(result.baby.id);
      setCreatedHouseholdId(result.household.id);

      // Move to calibration phase if we have a birthday
      if (babyBirthday) {
        setPhase('calibration');
      } else {
        // Skip calibration if no birthday (can't calculate age-based logic)
        finishSetup();
      }
    } catch (error: any) {
      console.error("Error creating baby profile:", error);
      toast({
        title: "Something went wrong",
        description: "Could not create profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalibrationComplete = async (
    data: CalibrationData, 
    emergingFlags: Record<string, boolean>
  ) => {
    if (createdBabyId && createdHouseholdId) {
      try {
        await saveCalibration(createdBabyId, createdHouseholdId, data, emergingFlags);
      } catch (error) {
        console.error("Error saving calibration:", error);
        // Don't block navigation on calibration save failure
      }
    }
    setPhase('generating');
  };

  const handleCalibrationSkip = () => {
    setPhase('generating');
  };

  const finishSetup = () => {
    toast({
      title: "Ready",
      description: `${babyName}'s chart is set`,
    });
    navigate("/");
  };

  // Render based on phase
  if (phase === 'calibration' && babyBirthday) {
    return (
      <CalibrationFlow
        babyName={babyName}
        babyBirthday={babyBirthday}
        onComplete={handleCalibrationComplete}
        onSkip={handleCalibrationSkip}
      />
    );
  }

  if (phase === 'generating') {
    return (
      <ChartGenerating
        babyName={babyName}
        onComplete={finishSetup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="px-5 pt-8 pb-4 text-center">
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
          Add Child
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-5 pt-8">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Intro */}
          <div className="text-center space-y-3">
            <p className="text-[13px] text-foreground/50 leading-[1.7]">
              We'll create a daily guide based on their age.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card/50 rounded-xl p-6">
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="babyName">Name</Label>
                <Input
                  id="babyName"
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="e.g., Emma"
                  required
                  disabled={isLoading}
                  className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="babyBirthday">Birthday</Label>
                <Input
                  id="babyBirthday"
                  type="date"
                  value={babyBirthday}
                  onChange={(e) => setBabyBirthday(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="babyBirthTime">
                    Birth time <span className="normal-case opacity-60">(optional)</span>
                  </Label>
                  <Input
                    id="babyBirthTime"
                    type="time"
                    value={babyBirthTime}
                    onChange={(e) => setBabyBirthTime(e.target.value)}
                    disabled={isLoading}
                    className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="babyBirthLocation">
                    Birth location <span className="normal-case opacity-60">(optional)</span>
                  </Label>
                  <LocationInput
                    id="babyBirthLocation"
                    placeholder="City"
                    value={babyBirthLocation}
                    onChange={setBabyBirthLocation}
                    disabled={isLoading}
                    className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                  />
                </div>
              </div>

              <p className="text-[10px] text-foreground/30 pt-1">
                Time & location help calculate moon sign accurately
              </p>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  className="w-full text-[13px]"
                  disabled={isLoading || !babyName.trim()}
                >
                  {isLoading ? "..." : "Continue"}
                </Button>
                <p className="text-[10px] text-foreground/30 text-center">
                  Add more children later in Settings
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabySetup;
