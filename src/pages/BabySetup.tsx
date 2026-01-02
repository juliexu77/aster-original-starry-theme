import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { CalibrationFlow } from "@/components/calibration/CalibrationFlow";
import { ChartGenerating } from "@/components/calibration/ChartGenerating";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useCalibration, CalibrationData } from "@/hooks/useCalibration";
import { useToast } from "@/hooks/use-toast";

type SetupPhase = 'details' | 'calibration' | 'generating';

interface ChildData {
  name: string;
  birthday: string;
  birthTime: string;
  birthLocation: string;
  babyId?: string;
  calibrated?: boolean;
}

const BabySetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createHousehold, addBabyToHousehold } = useHousehold();
  const { saveCalibration } = useCalibration();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<SetupPhase>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  // Multi-child support
  const [children, setChildren] = useState<ChildData[]>([{
    name: "",
    birthday: "",
    birthTime: "",
    birthLocation: ""
  }]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [calibrationChildIndex, setCalibrationChildIndex] = useState(0);
  
  // Store created household ID
  const [createdHouseholdId, setCreatedHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const updateChild = (index: number, field: keyof ChildData, value: string) => {
    setChildren(prev => prev.map((child, i) => 
      i === index ? { ...child, [field]: value } : child
    ));
  };

  const addAnotherChild = () => {
    setChildren(prev => [...prev, {
      name: "",
      birthday: "",
      birthTime: "",
      birthLocation: ""
    }]);
    setCurrentChildIndex(children.length);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    try {
      // Create household with first child
      const firstChild = children[0];
      const result = await createHousehold(
        firstChild.name, 
        firstChild.birthday || undefined, 
        firstChild.birthTime || undefined, 
        firstChild.birthLocation || undefined
      );
      
      setCreatedHouseholdId(result.household.id);
      
      // Update first child with baby ID
      const updatedChildren = [...children];
      updatedChildren[0] = { ...updatedChildren[0], babyId: result.baby.id };
      
      // Add additional children if any
      for (let i = 1; i < children.length; i++) {
        const child = children[i];
        if (child.name.trim()) {
          const baby = await addBabyToHousehold(
            result.household.id,
            child.name,
            child.birthday || undefined,
            child.birthTime || undefined,
            child.birthLocation || undefined
          );
          updatedChildren[i] = { ...updatedChildren[i], babyId: baby.id };
        }
      }
      
      setChildren(updatedChildren);

      // Check if any child has a birthday (needs calibration)
      const childrenWithBirthday = updatedChildren.filter(c => c.birthday && c.babyId);
      if (childrenWithBirthday.length > 0) {
        setCalibrationChildIndex(0);
        setPhase('calibration');
      } else {
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

  const getChildrenNeedingCalibration = () => {
    return children.filter(c => c.birthday && c.babyId && !c.calibrated);
  };

  const handleCalibrationComplete = async (
    data: CalibrationData, 
    emergingFlags: Record<string, boolean>
  ) => {
    const childrenNeedingCalibration = getChildrenNeedingCalibration();
    const currentCalibrationChild = childrenNeedingCalibration[calibrationChildIndex];
    
    if (currentCalibrationChild?.babyId && createdHouseholdId) {
      try {
        await saveCalibration(currentCalibrationChild.babyId, createdHouseholdId, data, emergingFlags);
        
        // Mark this child as calibrated
        setChildren(prev => prev.map(c => 
          c.babyId === currentCalibrationChild.babyId ? { ...c, calibrated: true } : c
        ));
      } catch (error) {
        console.error("Error saving calibration:", error);
      }
    }
    
    // Check if there are more children to calibrate
    if (calibrationChildIndex < childrenNeedingCalibration.length - 1) {
      setCalibrationChildIndex(prev => prev + 1);
    } else {
      setPhase('generating');
    }
  };

  const handleCalibrationSkip = () => {
    const childrenNeedingCalibration = getChildrenNeedingCalibration();
    
    // Mark current child as calibrated (skipped)
    const currentCalibrationChild = childrenNeedingCalibration[calibrationChildIndex];
    if (currentCalibrationChild) {
      setChildren(prev => prev.map(c => 
        c.babyId === currentCalibrationChild.babyId ? { ...c, calibrated: true } : c
      ));
    }
    
    // Check if there are more children to calibrate
    if (calibrationChildIndex < childrenNeedingCalibration.length - 1) {
      setCalibrationChildIndex(prev => prev + 1);
    } else {
      setPhase('generating');
    }
  };

  const finishSetup = () => {
    const names = children.filter(c => c.name.trim()).map(c => c.name);
    const message = names.length === 1 
      ? `${names[0]}'s chart is set`
      : `Charts set for ${names.join(' & ')}`;
    
    toast({
      title: "Ready",
      description: message,
      duration: 3000,
    });
    navigate("/");
  };

  const currentChild = children[currentChildIndex];
  const childrenNeedingCalibration = getChildrenNeedingCalibration();
  const calibrationChild = childrenNeedingCalibration[calibrationChildIndex];

  // Render calibration phase
  if (phase === 'calibration' && calibrationChild?.birthday) {
    return (
      <CalibrationFlow
        babyName={calibrationChild.name}
        babyBirthday={calibrationChild.birthday}
        onComplete={handleCalibrationComplete}
        onSkip={handleCalibrationSkip}
      />
    );
  }

  if (phase === 'generating') {
    const firstName = children.find(c => c.name.trim())?.name || "Baby";
    return (
      <ChartGenerating
        babyName={firstName}
        onComplete={finishSetup}
      />
    );
  }

  const canContinue = children.every(c => c.name.trim());
  const isFirstChildValid = children[0].name.trim();

  return (
    <NightSkyBackground>
      <div className="min-h-screen flex flex-col">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-12 left-4 z-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-foreground/40 hover:text-foreground/60 transition-colors"
            aria-label="Go back"
          >
            <IconChevronLeft size={24} stroke={1.5} />
          </button>
        </motion.div>

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="px-5 pt-12 pb-2 text-center"
        >
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
            {children.length > 1 ? `Child ${currentChildIndex + 1} of ${children.length}` : 'Add Child'}
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-start justify-center px-5 pt-4 pb-8 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-sm space-y-6"
          >
            
            {/* Intro */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-[13px] text-foreground/50 leading-[1.7]">
                We'll create their birth chart and track<br />
                developmental milestones against it.
              </p>
            </motion.div>

            {/* Child tabs if multiple */}
            {children.length > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 justify-center"
              >
                {children.map((child, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChildIndex(index)}
                    className={`px-3 py-1.5 rounded-full text-[11px] transition-colors ${
                      index === currentChildIndex 
                        ? 'bg-foreground/10 text-foreground/80' 
                        : 'text-foreground/40 hover:text-foreground/60'
                    }`}
                  >
                    {child.name || `Child ${index + 1}`}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentChildIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card/50 rounded-xl p-6"
              >
                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="babyName">Name</Label>
                    <Input
                      id="babyName"
                      type="text"
                      value={currentChild.name}
                      onChange={(e) => updateChild(currentChildIndex, 'name', e.target.value)}
                      placeholder="Emma"
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
                      value={currentChild.birthday}
                      onChange={(e) => updateChild(currentChildIndex, 'birthday', e.target.value)}
                      required
                      disabled={isLoading}
                      className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="babyBirthTime">
                      Birth time <span className="normal-case opacity-60">(for accurate chart)</span>
                    </Label>
                    <Input
                      id="babyBirthTime"
                      type="time"
                      value={currentChild.birthTime}
                      onChange={(e) => updateChild(currentChildIndex, 'birthTime', e.target.value)}
                      disabled={isLoading}
                      className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="babyBirthLocation">
                      Birth location <span className="normal-case opacity-60">(for accurate chart)</span>
                    </Label>
                    <LocationInput
                      id="babyBirthLocation"
                      placeholder="City"
                      value={currentChild.birthLocation}
                      onChange={(val) => updateChild(currentChildIndex, 'birthLocation', val)}
                      disabled={isLoading}
                      className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                    />
                  </div>

                  <p className="text-[11px] text-foreground/40 pt-2 leading-[1.6]">
                    Time and location determine moon sign, rising sign, and house placements. Skip them and you'll only get sun sign insights.
                  </p>

                  <div className="pt-4 space-y-3">
                    {/* Add another child button */}
                    {isFirstChildValid && (
                      <button
                        type="button"
                        onClick={addAnotherChild}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] text-foreground/50 hover:text-foreground/70 transition-colors"
                      >
                        <IconPlus size={16} stroke={1.5} />
                        Add another child
                      </button>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full text-[13px]"
                      disabled={isLoading || !canContinue}
                    >
                      {isLoading ? "..." : "Continue"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </NightSkyBackground>
  );
};

export default BabySetup;
