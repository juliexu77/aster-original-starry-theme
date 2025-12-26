import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Users,
  LogOut, 
  Key,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin
} from "lucide-react";
import { LocationInput } from "@/components/ui/LocationInput";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ChildrenSection } from "@/components/settings/ChildrenSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getZodiacFromBirthday, getZodiacName, getMoonSignFromBirthDateTime } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { FamilyNav } from "@/components/family/FamilyNav";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { babies, addBaby, updateBaby, archiveBaby } = useBabies();
  const { userProfile, updateUserProfile, fetchUserProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Your info editing state
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [editingBirthTime, setEditingBirthTime] = useState(false);
  const [editingBirthLocation, setEditingBirthLocation] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState("");
  const [birthTimeInput, setBirthTimeInput] = useState("");
  const [birthLocationInput, setBirthLocationInput] = useState("");
  const [savingBirthday, setSavingBirthday] = useState(false);
  const [savingBirthTime, setSavingBirthTime] = useState(false);
  const [savingBirthLocation, setSavingBirthLocation] = useState(false);
  
  // Partner info editing state
  const [editingPartnerName, setEditingPartnerName] = useState(false);
  const [editingPartnerBirthday, setEditingPartnerBirthday] = useState(false);
  const [editingPartnerBirthTime, setEditingPartnerBirthTime] = useState(false);
  const [editingPartnerBirthLocation, setEditingPartnerBirthLocation] = useState(false);
  const [partnerNameInput, setPartnerNameInput] = useState("");
  const [partnerBirthdayInput, setPartnerBirthdayInput] = useState("");
  const [partnerBirthTimeInput, setPartnerBirthTimeInput] = useState("");
  const [partnerBirthLocationInput, setPartnerBirthLocationInput] = useState("");
  const [savingPartnerName, setSavingPartnerName] = useState(false);
  const [savingPartnerBirthday, setSavingPartnerBirthday] = useState(false);
  const [savingPartnerBirthTime, setSavingPartnerBirthTime] = useState(false);
  const [savingPartnerBirthLocation, setSavingPartnerBirthLocation] = useState(false);

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
      toast({ title: "Birthday saved" });
    } catch (error) {
      console.error('Error saving birthday:', error);
      toast({ title: "Error", description: "Failed to save birthday", variant: "destructive" });
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
      toast({ title: birthTimeInput ? "Birth time saved" : "Birth time cleared" });
    } catch (error) {
      console.error('Error saving birth time:', error);
      toast({ title: "Error", description: "Failed to save birth time", variant: "destructive" });
    } finally {
      setSavingBirthTime(false);
    }
  };

  const handleSaveBirthLocation = async () => {
    setSavingBirthLocation(true);
    try {
      await updateUserProfile({ birth_location: birthLocationInput || null });
      await fetchUserProfile();
      setEditingBirthLocation(false);
      toast({ title: birthLocationInput ? "Birth location saved" : "Birth location cleared" });
    } catch (error) {
      console.error('Error saving birth location:', error);
      toast({ title: "Error", description: "Failed to save birth location", variant: "destructive" });
    } finally {
      setSavingBirthLocation(false);
    }
  };

  const handleSavePartnerName = async () => {
    setSavingPartnerName(true);
    try {
      await updateUserProfile({ partner_name: partnerNameInput || null });
      await fetchUserProfile();
      setEditingPartnerName(false);
      toast({ title: "Partner name saved" });
    } catch (error) {
      console.error('Error saving partner name:', error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSavingPartnerName(false);
    }
  };

  const handleSavePartnerBirthday = async () => {
    if (!partnerBirthdayInput) return;
    
    setSavingPartnerBirthday(true);
    try {
      await updateUserProfile({ partner_birthday: partnerBirthdayInput });
      await fetchUserProfile();
      setEditingPartnerBirthday(false);
      toast({ title: "Partner birthday saved" });
    } catch (error) {
      console.error('Error saving partner birthday:', error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSavingPartnerBirthday(false);
    }
  };

  const handleSavePartnerBirthTime = async () => {
    setSavingPartnerBirthTime(true);
    try {
      await updateUserProfile({ partner_birth_time: partnerBirthTimeInput || null });
      await fetchUserProfile();
      setEditingPartnerBirthTime(false);
      toast({ title: partnerBirthTimeInput ? "Partner birth time saved" : "Partner birth time cleared" });
    } catch (error) {
      console.error('Error saving partner birth time:', error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSavingPartnerBirthTime(false);
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

  const handleStartEditBirthLocation = () => {
    setBirthLocationInput(userProfile?.birth_location || "");
    setEditingBirthLocation(true);
  };

  const handleStartEditPartnerName = () => {
    setPartnerNameInput(userProfile?.partner_name || "");
    setEditingPartnerName(true);
  };

  const handleStartEditPartnerBirthday = () => {
    setPartnerBirthdayInput(userProfile?.partner_birthday || "");
    setEditingPartnerBirthday(true);
  };

  const handleStartEditPartnerBirthTime = () => {
    setPartnerBirthTimeInput(userProfile?.partner_birth_time || "");
    setEditingPartnerBirthTime(true);
  };

  const handleStartEditPartnerBirthLocation = () => {
    setPartnerBirthLocationInput(userProfile?.partner_birth_location || "");
    setEditingPartnerBirthLocation(true);
  };

  const handleSavePartnerBirthLocation = async () => {
    setSavingPartnerBirthLocation(true);
    try {
      await updateUserProfile({ partner_birth_location: partnerBirthLocationInput || null });
      await fetchUserProfile();
      setEditingPartnerBirthLocation(false);
      toast({ title: partnerBirthLocationInput ? "Partner birth location saved" : "Partner birth location cleared" });
    } catch (error) {
      console.error('Error saving partner birth location:', error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSavingPartnerBirthLocation(false);
    }
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
  const partnerSign = getZodiacFromBirthday(userProfile?.partner_birthday);
  const partnerMoon = getMoonSignFromBirthDateTime(userProfile?.partner_birthday, userProfile?.partner_birth_time, userProfile?.partner_birth_location);

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
          <>
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

            {/* Birth Location Row - only show if birth time is set */}
            {userProfile?.birth_time && (
              editingBirthLocation ? (
                <div className="px-4 py-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-foreground/30" />
                  <div className="flex-1 flex items-center gap-2">
                    <LocationInput
                      id="user-birth-location"
                      value={birthLocationInput}
                      onChange={setBirthLocationInput}
                      placeholder="City, Country"
                      className="flex-1 text-[13px]"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSaveBirthLocation}
                      disabled={savingBirthLocation}
                      className="text-[11px]"
                    >
                      {savingBirthLocation ? "..." : "Save"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingBirthLocation(false)}
                      className="text-[11px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <SettingsRow
                  icon={<MapPin className="w-5 h-5" />}
                  title="Birth Location"
                  subtitle={userProfile?.birth_location || "Add for rising sign"}
                  onClick={handleStartEditBirthLocation}
                />
              )
            )}
          </SettingsSection>

          {/* Partner Section */}
          <SettingsSection title="Partner">
            {/* Partner Name Row */}
            {editingPartnerName ? (
              <div className="px-4 py-3 flex items-center gap-3">
                <Users className="w-5 h-5 text-foreground/30" />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="text"
                    value={partnerNameInput}
                    onChange={(e) => setPartnerNameInput(e.target.value)}
                    placeholder="Partner's name"
                    className="flex-1 text-[13px]"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSavePartnerName}
                    disabled={savingPartnerName}
                    className="text-[11px]"
                  >
                    {savingPartnerName ? "..." : "Save"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingPartnerName(false)}
                    className="text-[11px]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <SettingsRow
                icon={<Users className="w-5 h-5" />}
                title="Name"
                subtitle={userProfile?.partner_name || "Add partner's name"}
                onClick={handleStartEditPartnerName}
              />
            )}

            {/* Partner Birthday Row */}
            {editingPartnerBirthday ? (
              <div className="px-4 py-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-foreground/30" />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="date"
                    value={partnerBirthdayInput}
                    onChange={(e) => setPartnerBirthdayInput(e.target.value)}
                    className="flex-1 text-[13px]"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSavePartnerBirthday}
                    disabled={!partnerBirthdayInput || savingPartnerBirthday}
                    className="text-[11px]"
                  >
                    {savingPartnerBirthday ? "..." : "Save"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingPartnerBirthday(false)}
                    className="text-[11px]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <SettingsRow
                icon={partnerSign ? <ZodiacIcon sign={partnerSign} size={18} strokeWidth={1.5} /> : <Calendar className="w-5 h-5" />}
                title="Birthday"
                subtitle={
                  partnerSign 
                    ? getZodiacName(partnerSign)
                    : "Add for zodiac features"
                }
                onClick={handleStartEditPartnerBirthday}
              />
            )}

            {/* Partner Birth Time Row - only show if partner birthday is set */}
            {userProfile?.partner_birthday && (
              editingPartnerBirthTime ? (
                <div className="px-4 py-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-foreground/30" />
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      type="time"
                      value={partnerBirthTimeInput}
                      onChange={(e) => setPartnerBirthTimeInput(e.target.value)}
                      className="flex-1 text-[13px]"
                      placeholder="HH:MM"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSavePartnerBirthTime}
                      disabled={savingPartnerBirthTime}
                      className="text-[11px]"
                    >
                      {savingPartnerBirthTime ? "..." : "Save"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingPartnerBirthTime(false)}
                      className="text-[11px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <SettingsRow
                  icon={partnerMoon ? <ZodiacIcon sign={partnerMoon} size={18} strokeWidth={1.5} /> : <Clock className="w-5 h-5" />}
                  title="Birth Time"
                  subtitle={
                    partnerMoon 
                      ? `${getZodiacName(partnerMoon)} Moon`
                      : "Add for moon sign"
                  }
                  onClick={handleStartEditPartnerBirthTime}
                />
              )
            )}

            {/* Partner Birth Location Row - only show if partner birth time is set */}
            {userProfile?.partner_birth_time && (
              editingPartnerBirthLocation ? (
                <div className="px-4 py-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-foreground/30" />
                  <div className="flex-1 flex items-center gap-2">
                    <LocationInput
                      id="partner-birth-location"
                      value={partnerBirthLocationInput}
                      onChange={setPartnerBirthLocationInput}
                      placeholder="City, Country"
                      className="flex-1 text-[13px]"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSavePartnerBirthLocation}
                      disabled={savingPartnerBirthLocation}
                      className="text-[11px]"
                    >
                      {savingPartnerBirthLocation ? "..." : "Save"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingPartnerBirthLocation(false)}
                      className="text-[11px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <SettingsRow
                  icon={<MapPin className="w-5 h-5" />}
                  title="Birth Location"
                  subtitle={userProfile?.partner_birth_location || "Add for rising sign"}
                  onClick={handleStartEditPartnerBirthLocation}
                />
              )
            )}
          </SettingsSection>
        </>
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

      {/* Bottom Navigation */}
      <FamilyNav />
    </div>
  );
};

export default Settings;
