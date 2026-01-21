import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useHousehold } from "@/hooks/useHousehold";
import { useToast } from "@/hooks/use-toast";

type Step = 'user' | 'partner' | 'children' | 'complete';

interface ProfileData {
  birthday: string;
  birthTime: string;
  birthLocation: string;
}

interface PartnerData extends ProfileData {
  name: string;
}

interface ChildData extends ProfileData {
  name: string;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile: existingProfile, updateUserProfile } = useUserProfile();
  const { createHousehold, createEmptyHousehold, addBabyToHousehold } = useHousehold();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('user');
  const [isLoading, setIsLoading] = useState(false);

  // User's profile data
  const [userProfile, setUserProfile] = useState<ProfileData>({
    birthday: "",
    birthTime: "",
    birthLocation: ""
  });

  // Partner data (optional)
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);
  const [partnerData, setPartnerData] = useState<PartnerData>({
    name: "",
    birthday: "",
    birthTime: "",
    birthLocation: ""
  });

  // Children data (optional)
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // If user already has a birthday set, they've completed profile setup
    // Redirect them to home instead of showing this wizard again
    if (existingProfile?.birthday) {
      navigate('/');
    }
  }, [user, existingProfile, navigate]);

  const handleUserProfileSubmit = async () => {
    if (!user || !userProfile.birthday) {
      toast({
        title: "Birthday required",
        description: "Please enter your birthday to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        birthday: userProfile.birthday,
        birth_time: userProfile.birthTime || null,
        birth_location: userProfile.birthLocation || null,
      });

      setStep('partner');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerChoice = (wantsPartner: boolean) => {
    setHasPartner(wantsPartner);
    if (!wantsPartner) {
      setStep('children');
    }
  };

  const handlePartnerSubmit = async () => {
    if (hasPartner && partnerData.name.trim() && partnerData.birthday) {
      setIsLoading(true);
      try {
        await updateUserProfile({
          partner_name: partnerData.name.trim(),
          partner_birthday: partnerData.birthday,
          partner_birth_time: partnerData.birthTime || null,
          partner_birth_location: partnerData.birthLocation || null,
        });
      } catch (error) {
        console.error('Error saving partner:', error);
        toast({
          title: "Error saving partner",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    setStep('children');
  };

  const handleChildrenChoice = async (wantsChildren: boolean) => {
    setHasChildren(wantsChildren);
    if (!wantsChildren) {
      // Create household without children
      setIsLoading(true);
      try {
        await createEmptyHousehold();
        completeSetup();
      } catch (error) {
        console.error('Error creating household:', error);
        toast({
          title: "Error creating household",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Add first child form
      setChildren([{
        name: "",
        birthday: "",
        birthTime: "",
        birthLocation: ""
      }]);
    }
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

  const updateChild = (index: number, field: keyof ChildData, value: string) => {
    setChildren(prev => prev.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    ));
  };

  const handleChildrenSubmit = async () => {
    if (!user) return;

    const validChildren = children.filter(c => c.name.trim() && c.birthday);

    if (validChildren.length === 0) {
      toast({
        title: "No children added",
        description: "Please add at least one child or skip this step",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create household with first child
      const firstChild = validChildren[0];
      const result = await createHousehold(
        firstChild.name.trim(),
        firstChild.birthday,
        firstChild.birthTime || undefined,
        firstChild.birthLocation || undefined
      );

      // Add remaining children
      for (let i = 1; i < validChildren.length; i++) {
        const child = validChildren[i];
        await addBabyToHousehold(
          result.household.id,
          child.name.trim(),
          child.birthday,
          child.birthTime || undefined,
          child.birthLocation || undefined
        );
      }

      completeSetup();
    } catch (error) {
      console.error('Error adding children:', error);
      toast({
        title: "Error adding children",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeSetup = () => {
    toast({
      title: "Profile complete",
      description: "Welcome to Aster!",
      duration: 3000,
    });
    navigate("/");
  };

  const currentChild = children[currentChildIndex];

  return (
    <NightSkyBackground>
      <div className="min-h-screen flex flex-col">
        {/* Back Button */}
        {step !== 'user' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-12 left-4 z-10"
          >
            <button
              onClick={() => {
                if (step === 'partner') setStep('user');
                else if (step === 'children') setStep('partner');
              }}
              className="p-2 -ml-2 text-foreground/40 hover:text-foreground/60 transition-colors"
              aria-label="Go back"
            >
              <IconChevronLeft size={24} stroke={1.5} />
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="px-5 pt-12 pb-2 text-center"
        >
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
            {step === 'user' && 'Your Profile'}
            {step === 'partner' && (hasPartner === null ? 'Partner' : hasPartner ? 'Partner Details' : 'Partner')}
            {step === 'children' && (hasChildren === null ? 'Family' : hasChildren ? `Child ${currentChildIndex + 1} of ${children.length}` : 'Family')}
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
            <AnimatePresence mode="wait">
              {/* Step 1: User Profile */}
              {step === 'user' && (
                <motion.div
                  key="user"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-[13px] text-foreground/50 leading-[1.7]">
                      Let's start with your birth information<br />
                      to create your astrological profile.
                    </p>
                  </div>

                  <div className="bg-card/50 rounded-xl p-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="userBirthday">Your Birthday</Label>
                      <Input
                        id="userBirthday"
                        type="date"
                        value={userProfile.birthday}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, birthday: e.target.value }))}
                        required
                        disabled={isLoading}
                        className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userBirthTime">
                        Birth time <span className="normal-case opacity-60">(optional)</span>
                      </Label>
                      <Input
                        id="userBirthTime"
                        type="time"
                        value={userProfile.birthTime}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, birthTime: e.target.value }))}
                        disabled={isLoading}
                        className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userBirthLocation">
                        Birth location <span className="normal-case opacity-60">(optional)</span>
                      </Label>
                      <LocationInput
                        id="userBirthLocation"
                        placeholder="City"
                        value={userProfile.birthLocation}
                        onChange={(val) => setUserProfile(prev => ({ ...prev, birthLocation: val }))}
                        disabled={isLoading}
                        className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                      />
                    </div>

                    <p className="text-[11px] text-foreground/40 pt-2 leading-[1.6]">
                      Time and location give you moon sign, rising sign, and complete birth chart.
                    </p>

                    <Button
                      onClick={handleUserProfileSubmit}
                      className="w-full text-[13px]"
                      disabled={isLoading || !userProfile.birthday}
                    >
                      {isLoading ? "..." : "Continue"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Partner */}
              {step === 'partner' && (
                <motion.div
                  key="partner"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {hasPartner === null ? (
                    <>
                      <div className="text-center">
                        <p className="text-[13px] text-foreground/50 leading-[1.7]">
                          Do you have a partner you'd like<br />
                          to add to your family profile?
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={() => handlePartnerChoice(true)}
                          className="w-full text-[13px]"
                          variant="default"
                        >
                          Yes, add partner
                        </Button>
                        <Button
                          onClick={() => handlePartnerChoice(false)}
                          className="w-full text-[13px]"
                          variant="outline"
                        >
                          Skip for now
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-[13px] text-foreground/50 leading-[1.7]">
                          Add your partner's information<br />
                          for relationship insights.
                        </p>
                      </div>

                      <div className="bg-card/50 rounded-xl p-6 space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="partnerName">Partner's Name</Label>
                          <Input
                            id="partnerName"
                            type="text"
                            value={partnerData.name}
                            onChange={(e) => setPartnerData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Alex"
                            required
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerBirthday">Birthday</Label>
                          <Input
                            id="partnerBirthday"
                            type="date"
                            value={partnerData.birthday}
                            onChange={(e) => setPartnerData(prev => ({ ...prev, birthday: e.target.value }))}
                            required
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerBirthTime">
                            Birth time <span className="normal-case opacity-60">(optional)</span>
                          </Label>
                          <Input
                            id="partnerBirthTime"
                            type="time"
                            value={partnerData.birthTime}
                            onChange={(e) => setPartnerData(prev => ({ ...prev, birthTime: e.target.value }))}
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerBirthLocation">
                            Birth location <span className="normal-case opacity-60">(optional)</span>
                          </Label>
                          <LocationInput
                            id="partnerBirthLocation"
                            placeholder="City"
                            value={partnerData.birthLocation}
                            onChange={(val) => setPartnerData(prev => ({ ...prev, birthLocation: val }))}
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <Button
                          onClick={handlePartnerSubmit}
                          className="w-full text-[13px]"
                          disabled={isLoading || !partnerData.name.trim() || !partnerData.birthday}
                        >
                          {isLoading ? "..." : "Continue"}
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 3: Children */}
              {step === 'children' && (
                <motion.div
                  key="children"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {hasChildren === null ? (
                    <>
                      <div className="text-center">
                        <p className="text-[13px] text-foreground/50 leading-[1.7]">
                          Do you have children you'd like<br />
                          to add to your family profile?
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={() => handleChildrenChoice(true)}
                          className="w-full text-[13px]"
                          variant="default"
                        >
                          Yes, add children
                        </Button>
                        <Button
                          onClick={() => handleChildrenChoice(false)}
                          className="w-full text-[13px]"
                          variant="outline"
                        >
                          Skip for now
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-[13px] text-foreground/50 leading-[1.7]">
                          Add your {children.length > 1 ? 'children' : 'child'}'s information<br />
                          for personalized family insights.
                        </p>
                      </div>

                      {/* Child tabs if multiple */}
                      {children.length > 1 && (
                        <div className="flex gap-2 justify-center flex-wrap">
                          {children.map((child, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentChildIndex(index)}
                              className={`px-3 py-1.5 rounded-full text-[11px] transition-colors ${index === currentChildIndex
                                  ? 'bg-foreground/10 text-foreground/80'
                                  : 'text-foreground/40 hover:text-foreground/60'
                                }`}
                            >
                              {child.name || `Child ${index + 1}`}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="bg-card/50 rounded-xl p-6 space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="childName">Name</Label>
                          <Input
                            id="childName"
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
                          <Label htmlFor="childBirthday">Birthday</Label>
                          <Input
                            id="childBirthday"
                            type="date"
                            value={currentChild.birthday}
                            onChange={(e) => updateChild(currentChildIndex, 'birthday', e.target.value)}
                            required
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="childBirthTime">
                            Birth time <span className="normal-case opacity-60">(optional)</span>
                          </Label>
                          <Input
                            id="childBirthTime"
                            type="time"
                            value={currentChild.birthTime}
                            onChange={(e) => updateChild(currentChildIndex, 'birthTime', e.target.value)}
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="childBirthLocation">
                            Birth location <span className="normal-case opacity-60">(optional)</span>
                          </Label>
                          <LocationInput
                            id="childBirthLocation"
                            placeholder="City"
                            value={currentChild.birthLocation}
                            onChange={(val) => updateChild(currentChildIndex, 'birthLocation', val)}
                            disabled={isLoading}
                            className="text-[13px] bg-transparent border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/40"
                          />
                        </div>

                        <div className="pt-4 space-y-3">
                          {currentChild.name.trim() && currentChild.birthday && (
                            <button
                              type="button"
                              onClick={addAnotherChild}
                              className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] text-foreground/50 hover:text-foreground/70 transition-colors"
                            >
                              <IconChevronRight size={16} stroke={1.5} />
                              Add another child
                            </button>
                          )}

                          <Button
                            onClick={handleChildrenSubmit}
                            className="w-full text-[13px]"
                            disabled={isLoading || !children.some(c => c.name.trim() && c.birthday)}
                          >
                            {isLoading ? "..." : "Complete Setup"}
                          </Button>

                          <button
                            type="button"
                            onClick={() => completeSetup()}
                            className="w-full py-2.5 text-[13px] text-foreground/40 hover:text-foreground/60 transition-colors"
                          >
                            Skip and finish
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </NightSkyBackground>
  );
};

export default ProfileSetup;
