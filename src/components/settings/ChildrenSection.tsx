import { useState } from "react";
import { Baby, Plus, Archive, RefreshCw } from "lucide-react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/LocationInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Baby as BabyType } from "@/hooks/useBabies";
import { RecalibrationSheet } from "@/components/calibration/RecalibrationSheet";
import { useCalibration } from "@/hooks/useCalibration";
import { useHousehold } from "@/hooks/useHousehold";
import { formatLastCalibrated } from "@/hooks/useCalibrationPrompt";
import { CalibrationData } from "@/components/calibration/CalibrationFlow";

interface ChildrenSectionProps {
  babies: BabyType[];
  onAddBaby: (name: string, birthday?: string) => Promise<void>;
  onUpdateBaby: (babyId: string, updates: { name?: string; birthday?: string; birth_time?: string | null; birth_location?: string | null }) => Promise<void>;
  onArchiveBaby: (babyId: string) => Promise<void>;
}

const getAgeLabel = (birthday: string | null): string => {
  if (!birthday) return "No birthday set";
  
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffDays / 7);
  
  if (ageInWeeks < 4) return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''} old`;
  const months = Math.floor(ageInWeeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} old`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''} old`;
  return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`;
};

export const ChildrenSection = ({ 
  babies, 
  onAddBaby, 
  onUpdateBaby, 
  onArchiveBaby 
}: ChildrenSectionProps) => {
  const { toast } = useToast();
  const { household } = useHousehold();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showRecalibration, setShowRecalibration] = useState(false);
  const [selectedBaby, setSelectedBaby] = useState<BabyType | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Calibration hook for selected baby
  const { calibration, saveCalibration, refetch } = useCalibration(selectedBaby?.id);

  const handleOpenAdd = () => {
    setName("");
    setBirthday("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (baby: BabyType) => {
    setSelectedBaby(baby);
    setName(baby.name);
    setBirthday(baby.birthday || "");
    setBirthTime(baby.birth_time || "");
    setBirthLocation(baby.birth_location || "");
    setShowEditModal(true);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await onAddBaby(name.trim(), birthday || undefined);
      toast({ title: `${name} added`, duration: 3000 });
      setShowAddModal(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add child",
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedBaby || !name.trim()) return;
    
    setIsSaving(true);
    try {
      await onUpdateBaby(selectedBaby.id, { 
        name: name.trim(), 
        birthday: birthday || undefined,
        birth_time: birthTime || null,
        birth_location: birthLocation || null
      });
      toast({ title: "Updated", duration: 3000 });
      setShowEditModal(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update",
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!selectedBaby) return;
    
    try {
      await onArchiveBaby(selectedBaby.id);
      toast({ title: `${selectedBaby.name} archived`, duration: 3000 });
      setShowArchiveConfirm(false);
      setShowEditModal(false);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to archive",
        variant: "destructive" 
      });
    }
  };

  return (
    <>
      <SettingsSection title="Children">
        {babies.map((baby) => (
          <SettingsRow
            key={baby.id}
            icon={<Baby className="w-5 h-5" />}
            title={baby.name}
            subtitle={getAgeLabel(baby.birthday)}
            onClick={() => handleOpenEdit(baby)}
          />
        ))}
        <SettingsRow
          icon={<Plus className="w-5 h-5" />}
          title="Add another child"
          onClick={handleOpenAdd}
        />
      </SettingsSection>

      {/* Add Child Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addName" className="text-[11px] text-foreground/40 uppercase tracking-wider">Name</Label>
              <Input
                id="addName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Child's name"
                autoFocus
                className="text-[13px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addBirthday" className="text-[11px] text-foreground/40 uppercase tracking-wider">Birthday</Label>
              <Input
                id="addBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="text-[13px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAdd} 
              disabled={isSaving || !name.trim()}
              className="w-full text-[13px]"
            >
              {isSaving ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Child Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName" className="text-[11px] text-foreground/40 uppercase tracking-wider">Name</Label>
              <Input
                id="editName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Child's name"
                className="text-[13px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBirthday" className="text-[11px] text-foreground/40 uppercase tracking-wider">Birthday</Label>
              <Input
                id="editBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="text-[13px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="editBirthTime" className="text-[11px] text-foreground/40 uppercase tracking-wider">Birth Time</Label>
                <Input
                  id="editBirthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="text-[13px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBirthLocation" className="text-[11px] text-foreground/40 uppercase tracking-wider">Birth Location</Label>
                <LocationInput
                  id="editBirthLocation"
                  value={birthLocation}
                  onChange={setBirthLocation}
                  placeholder="Start typing a city..."
                  className="text-[13px]"
                />
              </div>
            </div>
            <p className="text-[10px] text-foreground/30">
              Time & location help calculate moon sign accurately
            </p>
            
            {/* Developmental Baseline */}
            <div className="pt-2 border-t border-foreground/5">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowRecalibration(true);
                }}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <div>
                  <p className="text-[13px] text-foreground/80">Update developmental baseline</p>
                  <p className="text-[11px] text-foreground/40">
                    Last updated: {formatLastCalibrated(calibration)}
                  </p>
                </div>
                <RefreshCw className="w-4 h-4 text-foreground/30" />
              </button>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              onClick={handleUpdate} 
              disabled={isSaving || !name.trim()}
              className="w-full text-[13px]"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {babies.length > 1 && (
              <Button 
                variant="ghost" 
                onClick={() => setShowArchiveConfirm(true)}
                className="w-full text-foreground/40 text-[13px]"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation */}
      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedBaby?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedBaby?.name} from your daily view. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recalibration Sheet */}
      {selectedBaby?.birthday && (
        <RecalibrationSheet
          open={showRecalibration}
          onOpenChange={setShowRecalibration}
          babyName={selectedBaby.name}
          babyBirthday={selectedBaby.birthday}
          calibration={calibration}
          onComplete={async (data: CalibrationData, emergingFlags: Record<string, boolean>) => {
            if (!selectedBaby?.id || !household?.id) return;
            await saveCalibration(selectedBaby.id, household.id, data, emergingFlags);
            await refetch();
          }}
        />
      )}
    </>
  );
};
