import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useToast } from "@/hooks/use-toast";

interface ChildData {
  name: string;
  birthday: string;
  birthTime: string;
  birthLocation: string;
}

const BabySetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createHousehold, addBabyToHousehold } = useHousehold();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Multi-child support
  const [children, setChildren] = useState<ChildData[]>([{
    name: "",
    birthday: "",
    birthTime: "",
    birthLocation: ""
  }]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

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

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to create a family profile",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      // Create household with first child
      const firstChild = children[0];

      // Trim and validate name
      const trimmedName = firstChild.name.trim();
      if (!trimmedName) {
        throw new Error('Please enter a name for your first child');
      }

      const result = await createHousehold(
        trimmedName,
        firstChild.birthday || undefined,
        firstChild.birthTime || undefined,
        firstChild.birthLocation || undefined
      );

      // Add additional children if any
      for (let i = 1; i < children.length; i++) {
        const child = children[i];
        const childName = child.name.trim();
        if (childName) {
          await addBabyToHousehold(
            result.household.id,
            childName,
            child.birthday || undefined,
            child.birthTime || undefined,
            child.birthLocation || undefined
          );
        }
      }

      // Finish setup
      const names = children.filter(c => c.name.trim()).map(c => c.name.trim());
      const message = names.length === 1
        ? `${names[0]}'s chart is set`
        : `Charts set for ${names.join(' & ')}`;

      toast({
        title: "Ready",
        description: message,
        duration: 3000,
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error creating baby profile:", error);

      // Provide specific error messages
      const errorMessage = error?.message || 'Unknown error';

      if (errorMessage.includes('not authenticated') || errorMessage.includes('not logged in')) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a family profile",
          variant: "destructive",
        });
        navigate('/auth');
      } else if (errorMessage.includes('name')) {
        toast({
          title: "Name required",
          description: "Please enter a name for your child",
          variant: "destructive",
        });
      } else if (errorMessage.includes('birthday')) {
        toast({
          title: "Birthday required",
          description: "Please enter a birthday for your child",
          variant: "destructive",
        });
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        toast({
          title: "Connection error",
          description: "Please check your internet connection and try again",
          variant: "destructive",
        });
      } else if (errorMessage.includes('household')) {
        toast({
          title: "Family setup error",
          description: "Could not create family. Please try again or contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error creating profile",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentChild = children[currentChildIndex];
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
                We'll create their birth chart and show<br />
                their astrological profile.
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
