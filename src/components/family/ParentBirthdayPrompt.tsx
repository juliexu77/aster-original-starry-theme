import { useState } from "react";
import { Calendar, Clock, Sparkles, User, Users } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  // Your info
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  
  // Partner info
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthday, setPartnerBirthday] = useState("");
  const [partnerBirthTime, setPartnerBirthTime] = useState("");
  const [partnerBirthLocation, setPartnerBirthLocation] = useState("");
  
  const [saving, setSaving] = useState(false);
  const { updateUserProfile } = useUserProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    // At least one person's birthday is required
    if (!birthday && !partnerBirthday) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ 
        birthday: birthday || undefined,
        birth_time: birthTime || undefined,
        birth_location: birthLocation || undefined,
        partner_name: partnerName || undefined,
        partner_birthday: partnerBirthday || undefined,
        partner_birth_time: partnerBirthTime || undefined,
        partner_birth_location: partnerBirthLocation || undefined
      });
      toast({
        title: "Saved",
        description: "Now we can show you cosmic insights!"
      });
      onSaved?.();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const hasAnyData = birthday || partnerBirthday;

  return (
    <GlassCard className="mx-4">
      <div className="p-5 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        
        <div>
          <h3 className="font-serif text-base text-foreground mb-0.5">
            Unlock Family Dynamics
          </h3>
          <p className="text-xs text-muted-foreground">
            Add your birth info to see how you interact with your children
          </p>
        </div>
        
        {/* Your Info Section */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <User className="w-3.5 h-3.5" />
            Your Info <span className="normal-case opacity-60">(optional)</span>
          </div>
          
          <div className="space-y-3 pl-1">
            <div className="space-y-1.5">
              <Label htmlFor="parentBirthday" className="text-[10px] text-muted-foreground uppercase tracking-wide">Birthday</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="parentBirthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="parentBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="parentBirthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="parentBirthLocation" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Location
                </Label>
                <LocationInput
                  id="parentBirthLocation"
                  value={birthLocation}
                  onChange={setBirthLocation}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-4" />

        {/* Partner Info Section */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Partner's Info <span className="normal-case opacity-60">(optional)</span>
          </div>
          
          <div className="space-y-3 pl-1">
            <div className="space-y-1.5">
              <Label htmlFor="partnerName" className="text-[10px] text-muted-foreground uppercase tracking-wide">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="partnerName"
                  type="text"
                  placeholder="Partner's name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="partnerBirthday" className="text-[10px] text-muted-foreground uppercase tracking-wide">Birthday</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="partnerBirthday"
                  type="date"
                  value={partnerBirthday}
                  onChange={(e) => setPartnerBirthday(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="partnerBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="partnerBirthTime"
                    type="time"
                    value={partnerBirthTime}
                    onChange={(e) => setPartnerBirthTime(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="partnerBirthLocation" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Location
                </Label>
                <LocationInput
                  id="partnerBirthLocation"
                  value={partnerBirthLocation}
                  onChange={setPartnerBirthLocation}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={!hasAnyData || saving}
          className="w-full h-10 text-sm mt-2"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        
        <p className="text-[10px] text-muted-foreground/60">
          Time & location help calculate moon signs accurately
        </p>
      </div>
    </GlassCard>
  );
};