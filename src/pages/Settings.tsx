import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Key,
  Baby
} from "lucide-react";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { household, refetch } = useHousehold();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showBabyEdit, setShowBabyEdit] = useState(false);
  const [babyName, setBabyName] = useState(household?.baby_name || "");
  const [babyBirthday, setBabyBirthday] = useState(household?.baby_birthday || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions"
      });
    } catch (error) {
      console.error('Error sending password change email:', error);
      toast({
        title: "Error sending email",
        description: "Failed to send password reset email",
        variant: "destructive"
      });
    }
  };

  const getUserDisplayName = () => {
    const email = user?.email;
    return email?.split('@')[0] || "User";
  };

  const handleSaveBaby = async () => {
    if (!household) return;
    
    setIsSaving(true);
    try {
      // Update baby record
      const { error } = await supabase
        .from("babies")
        .update({
          name: babyName,
          birthday: babyBirthday,
        })
        .eq("household_id", household.id);

      if (error) throw error;

      toast({
        title: "Baby profile updated",
      });
      setShowBabyEdit(false);
      refetch();
    } catch (error: any) {
      console.error('Error updating baby:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-8 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
            <ThemeToggle showText={false} />
          </div>

          {/* Baby Profile Section */}
          {user && household && (
            <SettingsSection title="Baby Profile">
              <SettingsRow
                icon={<Baby className="w-5 h-5" />}
                title={household.baby_name || "Baby's Name"}
                subtitle={household.baby_birthday ? `Birthday: ${new Date(household.baby_birthday).toLocaleDateString()}` : "Set birthday"}
                onClick={() => {
                  setBabyName(household.baby_name || "");
                  setBabyBirthday(household.baby_birthday || "");
                  setShowBabyEdit(true);
                }}
              />
            </SettingsSection>
          )}

          {/* User Profile Section */}
          {user ? (
            <SettingsSection>
              <SettingsRow
                icon={<User className="w-5 h-5" />}
                title={getUserDisplayName()}
                subtitle={user.email}
                showChevron={false}
              />
            </SettingsSection>
          ) : (
            <SettingsSection>
              <SettingsRow
                icon={<User className="w-5 h-5" />}
                title="Sign In"
                subtitle="Sign in to save your data"
                onClick={() => navigate("/auth")}
              />
            </SettingsSection>
          )}

          {/* Account Section */}
          {user && (
            <SettingsSection title="Account">
              <SettingsRow
                icon={<Key className="w-5 h-5" />}
                title="Change Password"
                onClick={handleChangePassword}
              />
              <SettingsRow
                icon={<LogOut className="w-5 h-5" />}
                title="Sign Out"
                onClick={signOut}
              />
            </SettingsSection>
          )}
        </div>
      </div>

      {/* Baby Edit Modal */}
      <Dialog open={showBabyEdit} onOpenChange={setShowBabyEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Baby Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="babyName">Name</Label>
              <Input
                id="babyName"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="Baby's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="babyBirthday">Birthday</Label>
              <Input
                id="babyBirthday"
                type="date"
                value={babyBirthday}
                onChange={(e) => setBabyBirthday(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSaveBaby} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;
