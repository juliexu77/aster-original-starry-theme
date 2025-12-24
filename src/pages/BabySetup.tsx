import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useToast } from "@/hooks/use-toast";

const BabySetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createHousehold } = useHousehold();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [babyBirthday, setBabyBirthday] = useState("");
  const [babyBirthTime, setBabyBirthTime] = useState("");
  const [babyBirthLocation, setBabyBirthLocation] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    try {
      await createHousehold(babyName, babyBirthday || undefined, babyBirthTime || undefined, babyBirthLocation || undefined);

      toast({
        title: "Ready",
        description: `${babyName}'s chart is set`,
      });

      navigate("/");
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
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  <Input
                    id="babyBirthLocation"
                    type="text"
                    placeholder="City"
                    value={babyBirthLocation}
                    onChange={(e) => setBabyBirthLocation(e.target.value)}
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
