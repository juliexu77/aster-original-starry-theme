import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Key,
  ChevronLeft,
  Calendar,
  Sparkles
} from "lucide-react";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ChildrenSection } from "@/components/settings/ChildrenSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getZodiacFromBirthday, getZodiacSymbol, getZodiacName } from "@/lib/zodiac";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { babies, addBaby, updateBaby, archiveBaby } = useBabies();
  const { userProfile, updateUserProfile, fetchUserProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState("");
  const [savingBirthday, setSavingBirthday] = useState(false);

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
    return userProfile?.display_name || user?.email?.split('@')[0] || "User";
  };

  const handleSaveBirthday = async () => {
    if (!birthdayInput) return;
    
    setSavingBirthday(true);
    try {
      await updateUserProfile({ birthday: birthdayInput });
      await fetchUserProfile();
      setEditingBirthday(false);
      toast({
        title: "Birthday saved",
        description: "Your zodiac sign is now visible in Family"
      });
    } catch (error) {
      console.error('Error saving birthday:', error);
      toast({
        title: "Error",
        description: "Failed to save birthday",
        variant: "destructive"
      });
    } finally {
      setSavingBirthday(false);
    }
  };

  const handleStartEditBirthday = () => {
    setBirthdayInput(userProfile?.birthday || "");
    setEditingBirthday(true);
  };

  const handleAddBaby = async (name: string, birthday?: string) => {
    await addBaby(name, birthday);
  };

  const handleUpdateBaby = async (babyId: string, updates: { name?: string; birthday?: string }) => {
    await updateBaby(babyId, updates);
  };

  const handleArchiveBaby = async (babyId: string) => {
    await archiveBaby(babyId);
  };

  const parentSign = getZodiacFromBirthday(userProfile?.birthday);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-serif font-semibold text-foreground flex-1">Settings</h1>
          <ThemeToggle showText={false} />
        </div>

        {/* Children Section */}
        {user && (
          <ChildrenSection
            babies={babies}
            onAddBaby={handleAddBaby}
            onUpdateBaby={handleUpdateBaby}
            onArchiveBaby={handleArchiveBaby}
          />
        )}

        {/* User Profile Section */}
        {user ? (
          <SettingsSection title="Profile">
            <SettingsRow
              icon={<User className="w-5 h-5" />}
              title={getUserDisplayName()}
              subtitle={user.email}
              showChevron={false}
            />
            
            {/* Birthday Row */}
            {editingBirthday ? (
              <div className="px-4 py-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="date"
                    value={birthdayInput}
                    onChange={(e) => setBirthdayInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSaveBirthday}
                    disabled={!birthdayInput || savingBirthday}
                  >
                    {savingBirthday ? "..." : "Save"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingBirthday(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <SettingsRow
                icon={<Calendar className="w-5 h-5" />}
                title="Your Birthday"
                subtitle={
                  parentSign 
                    ? `${getZodiacSymbol(userProfile?.birthday)} ${getZodiacName(parentSign)}`
                    : "Add for zodiac compatibility"
                }
                onClick={handleStartEditBirthday}
              />
            )}
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
  );
};

export default Settings;
