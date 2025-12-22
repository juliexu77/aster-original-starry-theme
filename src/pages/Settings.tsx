import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Key,
  ChevronLeft
} from "lucide-react";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ChildrenSection } from "@/components/settings/ChildrenSection";
import { Button } from "@/components/ui/button";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { babies, addBaby, updateBaby, archiveBaby } = useBabies();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleAddBaby = async (name: string, birthday?: string) => {
    await addBaby(name, birthday);
  };

  const handleUpdateBaby = async (babyId: string, updates: { name?: string; birthday?: string }) => {
    await updateBaby(babyId, updates);
  };

  const handleArchiveBaby = async (babyId: string) => {
    await archiveBaby(babyId);
  };

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
