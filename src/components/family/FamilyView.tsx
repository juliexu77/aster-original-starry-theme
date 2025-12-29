import { useMemo, useState } from "react";
import { ParentBirthdayPrompt } from "./ParentBirthdayPrompt";
import { RelationshipMap } from "./RelationshipMap";
import { RelationshipDetail } from "./RelationshipDetail";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";

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

  const parentName = userProfile?.display_name?.split(' ')[0] || "You";
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

  // Determine which constellation to use: parent's sign first, then first child's sign
  const constellationSign: ZodiacSign = useMemo(() => {
    // Try parent's sign first
    if (userProfile?.birthday) {
      const parentSign = getZodiacFromBirthday(userProfile.birthday);
      if (parentSign) return parentSign;
    }
    
    // Fall back to first child's sign
    const firstChildWithBirthday = babies.find(b => b.birthday);
    if (firstChildWithBirthday?.birthday) {
      const childSign = getZodiacFromBirthday(firstChildWithBirthday.birthday);
      if (childSign) return childSign;
    }
    
    // Default fallback
    return 'sagittarius';
  }, [userProfile?.birthday, babies]);

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
    <div className="space-y-6">
      {/* Constellation Header */}
      <div className="px-5 pt-6 text-center">
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
          Your Constellation
        </p>
      </div>

      {/* Relationship Map - only show with 2+ members */}
      <div className="px-5">
        {familyMembers.length >= 2 ? (
          <RelationshipMap
            members={familyMembers}
            constellationSign={constellationSign}
            selectedConnection={selectedConnection}
            onConnectionTap={handleConnectionTap}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-[13px] text-foreground/40">
              Add at least two family members to see your constellation.
            </p>
            <p className="text-[11px] text-foreground/30 mt-2">
              Add your birthday and a partner or child to get started.
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
        <div className="px-5">
          <ParentBirthdayPrompt onSaved={onBirthdaySaved} />
        </div>
      )}

      {/* Subtle hint about evolving content */}
      {familyMembers.length >= 2 && !selectedConnection && (
        <div className="px-5 text-center">
          <p className="text-[10px] text-foreground/20 tracking-wide">
            Insights evolve monthly with your child's growth
          </p>
        </div>
      )}
    </div>
  );
};
