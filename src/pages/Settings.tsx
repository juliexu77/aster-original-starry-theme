import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  Clock
} from "lucide-react";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ChildrenSection } from "@/components/settings/ChildrenSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getZodiacFromBirthday, getZodiacName, getMoonSignFromBirthDateTime } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { babies, addBaby, updateBaby, archiveBaby } = useBabies();
  const { userProfile, updateUserProfile, fetchUserProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [editingBirthTime, setEditingBirthTime] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState("");
  const [birthTimeInput, setBirthTimeInput] = useState("");
  const [savingBirthday, setSavingBirthday] = useState(false);
  const [savingBirthTime, setSavingBirthTime] = useState(false);

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

  const handleSaveBirthTime = async () => {
    setSavingBirthTime(true);
    try {
      await updateUserProfile({ birth_time: birthTimeInput || null });
      await fetchUserProfile();
      setEditingBirthTime(false);
      toast({
        title: "Birth time saved",
        description: birthTimeInput ? "Your moon sign is now calculated" : "Birth time cleared"
      });
    } catch (error) {
      console.error('Error saving birth time:', error);
      toast({
        title: "Error",
        description: "Failed to save birth time",
        variant: "destructive"
      });
    } finally {
      setSavingBirthTime(false);
    }
  };

  const handleStartEditBirthday = () => {
    setBirthdayInput(userProfile?.birthday || "");
    setEditingBirthday(true);
  };

  const handleStartEditBirthTime = () => {
    setBirthTimeInput(userProfile?.birth_time || "");
    setEditingBirthTime(true);
  };

  const handleAddBaby = async (name: string, birthday?: string) => {
    await addBaby(name, birthday);
  };

  const handleUpdateBaby = async (babyId: string, updates: { name?: string; birthday?: string; birth_time?: string | null }) => {
    await updateBaby(babyId, updates);
  };

  const handleArchiveBaby = async (babyId: string) => {
    await archiveBaby(babyId);
  };

  const parentSign = getZodiacFromBirthday(userProfile?.birthday);
  const parentMoon = getMoonSignFromBirthDateTime(userProfile?.birthday, userProfile?.birth_time, userProfile?.birth_location);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 py-4 space-y-4">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-foreground/40 hover:text-foreground/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
            Settings
          </p>
          <div className="w-10" /> {/* Spacer for alignment */}
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
                <Calendar className="w-5 h-5 text-foreground/30" />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="date"
                    value={birthdayInput}
                    onChange={(e) => setBirthdayInput(e.target.value)}
                    className="flex-1 text-[13px]"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSaveBirthday}
                    disabled={!birthdayInput || savingBirthday}
                    className="text-[11px]"
                  >
                    {savingBirthday ? "..." : "Save"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingBirthday(false)}
                    className="text-[11px]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <SettingsRow
                icon={parentSign ? <ZodiacIcon sign={parentSign} size={18} strokeWidth={1.5} /> : <Calendar className="w-5 h-5" />}
                title="Birthday"
                subtitle={
                  parentSign 
                    ? getZodiacName(parentSign)
                    : "Add for zodiac features"
                }
                onClick={handleStartEditBirthday}
              />
            )}

            {/* Birth Time Row - only show if birthday is set */}
            {userProfile?.birthday && (
              editingBirthTime ? (
                <div className="px-4 py-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-foreground/30" />
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      type="time"
                      value={birthTimeInput}
                      onChange={(e) => setBirthTimeInput(e.target.value)}
                      className="flex-1 text-[13px]"
                      placeholder="HH:MM"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSaveBirthTime}
                      disabled={savingBirthTime}
                      className="text-[11px]"
                    >
                      {savingBirthTime ? "..." : "Save"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingBirthTime(false)}
                      className="text-[11px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <SettingsRow
                  icon={parentMoon ? <ZodiacIcon sign={parentMoon} size={18} strokeWidth={1.5} /> : <Clock className="w-5 h-5" />}
                  title="Birth Time"
                  subtitle={
                    parentMoon 
                      ? `${getZodiacName(parentMoon)} Moon`
                      : "Add for moon sign"
                  }
                  onClick={handleStartEditBirthTime}
                />
              )
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
