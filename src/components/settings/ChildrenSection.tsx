import { useState } from "react";
import { Baby, Plus, Archive } from "lucide-react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ChildrenSectionProps {
  babies: BabyType[];
  onAddBaby: (name: string, birthday?: string) => Promise<void>;
  onUpdateBaby: (babyId: string, updates: { name?: string; birthday?: string }) => Promise<void>;
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedBaby, setSelectedBaby] = useState<BabyType | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setName("");
    setBirthday("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (baby: BabyType) => {
    setSelectedBaby(baby);
    setName(baby.name);
    setBirthday(baby.birthday || "");
    setShowEditModal(true);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await onAddBaby(name.trim(), birthday || undefined);
      toast({ title: `${name} added` });
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
        birthday: birthday || undefined 
      });
      toast({ title: "Updated" });
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
      toast({ title: `${selectedBaby.name} archived` });
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
              <Label htmlFor="addName">Name</Label>
              <Input
                id="addName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Child's name"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addBirthday">Birthday</Label>
              <Input
                id="addBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAdd} 
              disabled={isSaving || !name.trim()}
              className="w-full"
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
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Child's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBirthday">Birthday</Label>
              <Input
                id="editBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              onClick={handleUpdate} 
              disabled={isSaving || !name.trim()}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {babies.length > 1 && (
              <Button 
                variant="ghost" 
                onClick={() => setShowArchiveConfirm(true)}
                className="w-full text-muted-foreground"
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
    </>
  );
};
