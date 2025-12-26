import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { Plus, User } from "lucide-react";
import { getZodiacFromBirthday, getMoonSignFromBirthDateTime, getRisingSign, getZodiacName, ZodiacSign } from "@/lib/zodiac";

interface FamilyMember {
  id: string;
  name: string;
  type: 'child' | 'parent' | 'partner';
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface ChartSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
  onAddChild?: () => void;
}

export const ChartSelectorSheet = ({
  open,
  onOpenChange,
  members,
  selectedMemberId,
  onSelectMember,
  onAddChild
}: ChartSelectorSheetProps) => {
  const getSignsDisplay = (member: FamilyMember): string => {
    const sun = getZodiacFromBirthday(member.birthday);
    const moon = getMoonSignFromBirthDateTime(member.birthday, member.birth_time, member.birth_location);
    const rising = getRisingSign(member.birthday, member.birth_time, member.birth_location);
    
    if (!sun) return '';
    
    const parts = [getZodiacName(sun)];
    if (moon) parts.push(`${getZodiacName(moon)} Moon`);
    if (rising) parts.push(`${getZodiacName(rising)} Rising`);
    
    return parts.join(' • ');
  };

  const getTypeLabel = (type: FamilyMember['type']): string => {
    switch (type) {
      case 'parent': return 'You';
      case 'partner': return 'Partner';
      case 'child': return 'Child';
    }
  };

  // Group members by type
  const children = members.filter(m => m.type === 'child');
  const adults = members.filter(m => m.type === 'parent' || m.type === 'partner');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-background border-t border-foreground/10 rounded-t-2xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] font-normal">
            View Chart For
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-1 pb-4">
          {/* Children first */}
          {children.length > 0 && (
            <>
              <p className="text-[9px] text-foreground/30 uppercase tracking-[0.2em] px-3 pt-2 pb-1">
                Children
              </p>
              {children.map((member) => {
                const sun = getZodiacFromBirthday(member.birthday);
                const isSelected = member.id === selectedMemberId;
                
                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member.id);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-foreground/5"
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-foreground bg-foreground' : 'border-foreground/30'} flex items-center justify-center`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {sun && <ZodiacIcon sign={sun} size={14} strokeWidth={1.5} className="text-foreground/50" />}
                        <span className="text-[15px] text-foreground/80">{member.name}</span>
                      </div>
                      <p className="text-[11px] text-foreground/40 mt-0.5">
                        {getSignsDisplay(member)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </>
          )}
          
          {/* Adults (parents/partners) */}
          {adults.length > 0 && (
            <>
              <p className="text-[9px] text-foreground/30 uppercase tracking-[0.2em] px-3 pt-3 pb-1">
                Parents
              </p>
              {adults.map((member) => {
                const sun = getZodiacFromBirthday(member.birthday);
                const isSelected = member.id === selectedMemberId;
                
                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member.id);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-foreground/5"
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-foreground bg-foreground' : 'border-foreground/30'} flex items-center justify-center`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {sun ? (
                          <ZodiacIcon sign={sun} size={14} strokeWidth={1.5} className="text-foreground/50" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-foreground/40" />
                        )}
                        <span className="text-[15px] text-foreground/80">{member.name}</span>
                        <span className="text-[10px] text-foreground/30 uppercase tracking-wide">
                          {getTypeLabel(member.type)}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/40 mt-0.5">
                        {getSignsDisplay(member)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </>
          )}
          
          {onAddChild && (
            <button
              onClick={() => {
                onAddChild();
                onOpenChange(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-foreground/5 text-foreground/40 mt-2"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[13px]">Add another child</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
