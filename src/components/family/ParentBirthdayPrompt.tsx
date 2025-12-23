import { useState } from "react";
import { Calendar, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);
  const { updateUserProfile } = useUserProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!birthday) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ birthday });
      toast({
        title: "Birthday saved",
        description: "Now we can show you compatibility insights!"
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
      <div className="p-5 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        
        <div>
          <h3 className="font-serif text-lg text-foreground mb-1">
            Unlock Family Compatibility
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your birthday to see how your zodiac sign interacts with your children's signs
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="pl-10"
              placeholder="Your birthday"
            />
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={!birthday || saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Birthday"}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground/70">
          This is optional and can be changed in Settings
        </p>
      </div>
    </GlassCard>
  );
};
