import { useMemo, useState } from "react";
import { ParentBirthdayPrompt } from "./ParentBirthdayPrompt";
import { RelationshipMap } from "./RelationshipMap";
import { RelationshipDetail } from "./RelationshipDetail";
import { getZodiacFromBirthday } from "@/lib/zodiac";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface UserProfile {
  display_name: string | null;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  partner_name: string | null;
  partner_birthday: string | null;
  partner_birth_time: string | null;
  partner_birth_location: string | null;
}

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
  birth_time?: string | null;
  birth_location?: string | null;
}

interface FamilyViewProps {
  babies: Baby[];
  userProfile: UserProfile | null;
  onBirthdaySaved: () => void;
}

export const FamilyView = ({ babies, userProfile, onBirthdaySaved }: FamilyViewProps) => {
  const [selectedConnection, setSelectedConnection] = useState<{
    from: FamilyMember;
    to: FamilyMember;
  } | null>(null);

  const parentName = userProfile?.display_name || "You";
  const parentHasBirthday = !!userProfile?.birthday;

  // Build family members list for constellation
  const familyMembers = useMemo(() => {
    const members: FamilyMember[] = [];
    
    // Add parent
    if (parentHasBirthday) {
      members.push({
        id: 'parent',
        name: parentName,
        type: 'parent',
        birthday: userProfile?.birthday || null,
        birth_time: userProfile?.birth_time,
        birth_location: userProfile?.birth_location,
      });
    }
    
    // Add partner if exists
    if (userProfile?.partner_birthday) {
      members.push({
        id: 'partner',
        name: userProfile.partner_name || 'Partner',
        type: 'partner',
        birthday: userProfile.partner_birthday,
        birth_time: userProfile.partner_birth_time,
        birth_location: userProfile.partner_birth_location,
      });
    }
    
    // Add children
    babies.forEach(baby => {
      if (baby.birthday) {
        members.push({
          id: baby.id,
          name: baby.name,
          type: 'child',
          birthday: baby.birthday,
          birth_time: baby.birth_time,
          birth_location: baby.birth_location,
        });
      }
    });
    
    return members;
  }, [babies, userProfile, parentHasBirthday, parentName]);

  const handleConnectionTap = (from: FamilyMember, to: FamilyMember) => {
    // If same connection tapped again, close it
    if (selectedConnection && 
        ((selectedConnection.from.id === from.id && selectedConnection.to.id === to.id) ||
         (selectedConnection.from.id === to.id && selectedConnection.to.id === from.id))) {
      setSelectedConnection(null);
      return;
    }
    
    // Always put parent/partner first for consistent display
    if (to.type === 'parent' || to.type === 'partner') {
      setSelectedConnection({ from: to, to: from });
    } else {
      setSelectedConnection({ from, to });
    }
  };

  const handleClose = () => {
    setSelectedConnection(null);
  };

  return (
    <div className="space-y-4">
      {/* Constellation Header */}
      <div className="px-5 pt-6 text-center">
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] mb-6">
          Your Constellation
        </p>
      </div>

      {/* Relationship Map */}
      <div className="px-5">
        {familyMembers.length > 0 ? (
          <RelationshipMap
            members={familyMembers}
            selectedConnection={selectedConnection}
            onConnectionTap={handleConnectionTap}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-[13px] text-foreground/40">
              Add your birthday to see your family constellation.
            </p>
          </div>
        )}
      </div>

      {/* Relationship Detail - shown inline below the map */}
      {selectedConnection && (
        <div className="px-5">
          <RelationshipDetail
            from={selectedConnection.from}
            to={selectedConnection.to}
            onClose={handleClose}
          />
        </div>
      )}

      {/* Parent Birthday Prompt */}
      {!parentHasBirthday && (
        <div className="px-5 pt-2">
          <ParentBirthdayPrompt onSaved={onBirthdaySaved} />
        </div>
      )}

      {/* Subtle hint about evolving content */}
      {familyMembers.length > 1 && !selectedConnection && (
        <div className="px-5 pt-2 text-center">
          <p className="text-[10px] text-foreground/20 tracking-wide">
            Insights evolve monthly with your child's growth
          </p>
        </div>
      )}
    </div>
  );
};
