import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputWithStatus } from "@/components/ui/input-with-status";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, Users, ChevronRight, ChevronLeft, Baby, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { SimpleInviteCollaborator } from "@/components/SimpleInviteCollaborator";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
}

const steps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Your Profile",
    description: "Tell us a bit about yourself",
    icon: User,
    required: true
  },
  {
    id: "baby",
    title: "Baby Information",
    description: "Add your little one's details", 
    icon: Baby,
    required: true
  },
  {
    id: "collaboration",
    title: "Share Access",
    description: "Invite others to help track activities",
    icon: Users,
    required: false
  }
];

interface MultiStepOnboardingProps {
  onComplete: () => void;
}

export const MultiStepOnboarding = ({ onComplete }: MultiStepOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { createHousehold } = useHousehold();
  const { createUserProfile, updateUserProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile step state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [userRole, setUserRole] = useState<"parent" | "nanny">("parent");
  const [profileSaveStatus, setProfileSaveStatus] = useState<"unsaved" | "saving" | "saved" | "error">("unsaved");

  // Baby step state
  const [babyName, setBabyName] = useState("");
  const [babyBirthday, setBabyBirthday] = useState<Date | undefined>();
  const [babySaveStatus, setBabySaveStatus] = useState<"unsaved" | "saving" | "saved" | "error">("unsaved");

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 0) {
      // Save profile
      await handleProfileSave();
    } else if (currentStep === 1) {
      // Save baby profile
      await handleBabySave();
    } else if (currentStep === 2) {
      // Complete onboarding
      onComplete();
    }
  };

  const handleProfileSave = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name to continue.",
        variant: "destructive"
      });
      return;
    }

    setProfileSaveStatus("saving");
    try {
      await updateUserProfile({
        full_name: fullName.trim(),
        role: userRole
      });
      setProfileSaveStatus("saved");
      setCurrentStep(1);
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileSaveStatus("error");
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBabySave = async () => {
    if (!babyName.trim()) {
      toast({
        title: "Baby name required",
        description: "Please enter your baby's name to continue.",
        variant: "destructive"
      });
      return;
    }

    setBabySaveStatus("saving");
    try {
      await createHousehold(
        babyName.trim(),
        babyBirthday ? format(babyBirthday, "yyyy-MM-dd") : undefined
      );
      setBabySaveStatus("saved");
      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving baby profile:', error);
      setBabySaveStatus("error");
      toast({
        title: "Error saving household",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStepData.required) return;
    
    if (currentStep === 2) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return fullName.trim().length > 0;
      case 1:
        return babyName.trim().length > 0;
      case 2:
        return true; // Collaboration is optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <InputWithStatus
                id="fullName"
                placeholder="Your full name"
                value={fullName}
                onValueChange={setFullName}
                saveStatus={profileSaveStatus}
                errorMessage="Failed to save profile"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Your Role</Label>
              <UserRoleSelector
                value={userRole}
                onChange={setUserRole}
              />
              <p className="text-sm text-muted-foreground">
                This helps us customize the experience for you
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="babyName">Baby's Name</Label>
              <InputWithStatus
                id="babyName"
                placeholder="Your little one's name"
                value={babyName}
                onValueChange={setBabyName}
                saveStatus={babySaveStatus}
                errorMessage="Failed to save baby profile"
              />
            </div>

            <div className="space-y-2">
              <Label>Birthday (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !babyBirthday && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {babyBirthday ? format(babyBirthday, "PPP") : <span>Select birthday</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={babyBirthday}
                    onSelect={setBabyBirthday}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Helps us provide age-appropriate insights and guidance
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Share the journey</h3>
              <p className="text-muted-foreground">
                Invite your partner, family, or caregivers to help track activities together
              </p>
            </div>

            <SimpleInviteCollaborator />

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" />
                Benefits of sharing
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time activity updates for all caregivers</li>
                <li>• Better coordination and communication</li>
                <li>• Complete picture of your baby's day</li>
                <li>• Peace of mind when others are caring for your baby</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    index < currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : index === currentStep
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step Header */}
          <div className="space-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <currentStepData.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-base">
              {currentStepData.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <div>
              {currentStep > 0 && (
                <Button variant="ghost" onClick={handlePrevious}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {!currentStepData.required && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  "Saving..."
                ) : currentStep === steps.length - 1 ? (
                  "Complete Setup"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};