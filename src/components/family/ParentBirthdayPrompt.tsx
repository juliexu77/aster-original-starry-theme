import { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, User, Users, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  // Control form visibility
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    <GlassCard>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-sm text-foreground">
              Unlock Family Dynamics
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Add birth info to see how you connect with your children
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <Button 
                onClick={() => setIsExpanded(true)}
                variant="outline"
                className="w-full h-10 text-sm gap-2"
              >
                <span>Add Your Details</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5"
            >
              {/* Your Info Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <User className="w-3.5 h-3.5" />
                  Your Info <span className="normal-case opacity-60">(optional)</span>
                </div>
                
                <div className="space-y-3">
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
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="parentBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Time of Birth
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
                      Birth Location
                    </Label>
                    <LocationInput
                      id="parentBirthLocation"
                      value={birthLocation}
                      onChange={setBirthLocation}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Partner Info Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Users className="w-3.5 h-3.5" />
                  Partner's Info <span className="normal-case opacity-60">(optional)</span>
                </div>
                
                <div className="space-y-3">
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
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="partnerBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Time of Birth
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
                      Birth Location
                    </Label>
                    <LocationInput
                      id="partnerBirthLocation"
                      value={partnerBirthLocation}
                      onChange={setPartnerBirthLocation}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={!hasAnyData || saving}
                className="w-full h-10 text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              
              <p className="text-[10px] text-muted-foreground/60 text-center">
                Time & location help calculate moon signs accurately
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};