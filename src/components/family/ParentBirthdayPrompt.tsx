import { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const { updateUserProfile } = useUserProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!birthday) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ 
        birthday,
        birth_time: birthTime || undefined,
        birth_location: birthLocation || undefined
      });
      toast({
        title: "Birthday saved",
        description: "Now we can show you cosmic insights!"
      });
      onSaved?.();
    } catch (error) {
      console.error("Error saving birthday:", error);
      toast({
        title: "Error",
        description: "Failed to save birthday",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard className="mx-5">
      <div className="p-4 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        
        <div>
          <h3 className="font-serif text-base text-foreground mb-0.5">
            Unlock Family Dynamics
          </h3>
          <p className="text-xs text-muted-foreground">
            Add your birthday to see how you interact with your children
          </p>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="parentBirthday" className="text-[10px] text-muted-foreground uppercase tracking-wide">Birthday</Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="parentBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="parentBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Time <span className="normal-case opacity-60">(optional)</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="parentBirthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="parentBirthLocation" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Location <span className="normal-case opacity-60">(optional)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="parentBirthLocation"
                  type="text"
                  placeholder="City"
                  value={birthLocation}
                  onChange={(e) => setBirthLocation(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={!birthday || saving}
            className="w-full h-9 text-sm"
          >
            {saving ? "Saving..." : "Save Birthday"}
          </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground/60">
          Time & location help calculate your moon sign accurately
        </p>
      </div>
    </GlassCard>
  );
};
