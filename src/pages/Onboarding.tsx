import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Plus, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "@/components/ActivityCard";

interface Child {
  name: string;
  birthDate: string;
  gender: string;
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([
    { name: "", birthDate: "", gender: "" }
  ]);
  const [scheduleText, setScheduleText] = useState("");
  const [parsedActivities, setParsedActivities] = useState<Activity[]>([]);
  const [isParsingSchedule, setIsParsingSchedule] = useState(false);

  const addChild = () => {
    if (children.length < 2) {
      setChildren([...children, { name: "", birthDate: "", gender: "" }]);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const parseScheduleWithAI = async () => {
    if (!scheduleText.trim()) return;
    
    setIsParsingSchedule(true);
    try {
      const response = await fetch('/functions/v1/parse-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ scheduleText })
      });

      if (!response.ok) throw new Error('Failed to parse schedule');
      
      const { activities } = await response.json();
      setParsedActivities(activities);
      setStep(3);
    } catch (error) {
      console.error('Error parsing schedule:', error);
      toast({
        title: "Parsing failed",
        description: "Let's set up your schedule manually for now.",
        variant: "destructive",
      });
    } finally {
      setIsParsingSchedule(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save child profiles
      const primaryChild = children[0];
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            baby_name: primaryChild.name,
            baby_birth_date: primaryChild.birthDate,
          });
        
        if (error) throw error;
      }

      // Store activities in localStorage for now (could be saved to database if user is logged in)
      if (parsedActivities.length > 0) {
        localStorage.setItem('initialActivities', JSON.stringify(parsedActivities));
      }

      // Mark onboarding as completed
      localStorage.setItem('onboardingCompleted', 'true');

      toast({
        title: "Welcome to Baby Tracker!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Setup failed",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedStep1 = children[0].name && children[0].birthDate && children[0].gender;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Baby className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-semibold text-foreground">Welcome to Baby Tracker</h1>
          <p className="text-muted-foreground mt-2">Let's get to know your little one</p>
        </div>

        {/* Step 1: Child Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Tell us about your child
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {children.map((child, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Child {index + 1}</h3>
                    {children.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChild(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={child.name}
                        onChange={(e) => updateChild(index, 'name', e.target.value)}
                        placeholder="Enter your child's name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`birthDate-${index}`}>Birth Date</Label>
                      <Input
                        id={`birthDate-${index}`}
                        type="date"
                        value={child.birthDate}
                        onChange={(e) => updateChild(index, 'birthDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`gender-${index}`}>Gender</Label>
                    <Select onValueChange={(value) => updateChild(index, 'gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boy">Boy</SelectItem>
                        <SelectItem value="girl">Girl</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              {children.length < 2 && (
                <Button
                  variant="outline"
                  onClick={addChild}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add another child
                </Button>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule Input */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Tell us about your current routine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Describe your baby's current schedule in your own words. Our AI will help set up your first day!
              </p>
              
              <div>
                <Label htmlFor="schedule">Current Schedule</Label>
                <Textarea
                  id="schedule"
                  value={scheduleText}
                  onChange={(e) => setScheduleText(e.target.value)}
                  placeholder="Example: My baby usually wakes up around 7am and has a bottle. Then around 9am we change diaper and have some playtime. She naps from 10-11:30am, then has another feeding..."
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={parseScheduleWithAI}
                  disabled={!scheduleText.trim() || isParsingSchedule}
                  className="flex-1"
                >
                  {isParsingSchedule ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Parsing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Parse with AI
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Ready to start tracking!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedActivities.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">We've set up these activities for you:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {parsedActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Badge variant="secondary">{activity.type}</Badge>
                        <span className="text-sm">{activity.time}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.details && Object.values(activity.details).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-muted-foreground text-sm">
                You can always add, edit, or remove activities once you start using the app.
              </p>

              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;