import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBabyProfile, Collaborator } from "@/hooks/useBabyProfile";
import { UserPlus, Trash2, Mail, Volume2 } from "lucide-react";

interface CaregiverManagementProps {
  onClose: () => void;
}

export function CaregiverManagement({ onClose }: CaregiverManagementProps) {
  const { babyProfile, collaborators, removeCollaborator, generateInviteLink } = useBabyProfile();
  const [isActive, setIsActive] = useState(true);

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-primary text-primary-foreground';
      case 'partner':
        return 'bg-blue-500 text-white';
      case 'caregiver':
        return 'bg-green-500 text-white';
      case 'grandparent':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddCaregiver = async () => {
    try {
      const inviteData = await generateInviteLink();
      await navigator.clipboard.writeText(inviteData.link);
      // Show success toast would be handled by the hook
    } catch (error) {
      console.error('Error generating invite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            ← Back
          </Button>
          <h1 className="text-xl font-medium">{babyProfile?.name || "Baby"}</h1>
          <Button variant="ghost" className="text-muted-foreground">
            Cancel
          </Button>
        </div>

        {/* Baby Info Section */}
        <div className="px-4 pb-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={babyProfile?.photo_url || undefined} />
              <AvatarFallback className="bg-muted text-2xl">
                👶
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-lg font-medium">{babyProfile?.name || "Baby"}</h2>
            </div>
          </div>
        </div>

        {/* Parents / Caregivers Section */}
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Parents / Caregivers</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Each caregiver will be able to view and save entries for {babyProfile?.name || "Baby"}
          </p>

          {/* Collaborators List */}
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-muted text-sm">
                        {getInitials(collaborator.user_id)}
                      </AvatarFallback>
                    </Avatar>
                    <Volume2 className="w-4 h-4 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {collaborator.profiles?.full_name || collaborator.user_id}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {collaborator.user_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getRoleColor(collaborator.role)}>
                    {collaborator.role}
                  </Badge>
                  {collaborator.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaborator(collaborator.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Caregiver Button */}
          <Button 
            onClick={handleAddCaregiver}
            variant="outline" 
            className="w-full h-12 border-dashed border-primary text-primary hover:bg-primary/5"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Parent / Caregiver
          </Button>

          {/* Profile Status Section */}
          <div className="space-y-4 pt-6 border-t">
            <h4 className="font-medium">Profile Status</h4>
            <p className="text-sm text-muted-foreground">
              Inactive profiles are hidden on your homepage
            </p>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="active-profile" className="text-base">
                Active Profile
              </Label>
              <Switch
                id="active-profile"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          {/* Remove Button */}
          <div className="pt-8 pb-8">
            <Button 
              variant="ghost" 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}