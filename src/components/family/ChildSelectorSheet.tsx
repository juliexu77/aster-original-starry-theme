import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { Plus } from "lucide-react";
import { getZodiacFromBirthday, getMoonSignFromBirthDateTime, getRisingSign, getZodiacName, ZodiacSign } from "@/lib/zodiac";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
}

interface ChildSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  babies: Baby[];
  selectedBabyId: string | null;
  onSelectBaby: (babyId: string) => void;
  onAddChild?: () => void;
}

export const ChildSelectorSheet = ({
  open,
  onOpenChange,
  babies,
  selectedBabyId,
  onSelectBaby,
  onAddChild
}: ChildSelectorSheetProps) => {
  const getSignsDisplay = (baby: Baby): string => {
    const sun = getZodiacFromBirthday(baby.birthday);
    const moon = getMoonSignFromBirthDateTime(baby.birthday, baby.birth_time, baby.birth_location);
    const rising = getRisingSign(baby.birthday, baby.birth_time, baby.birth_location);
    
    if (!sun) return '';
    
    const parts = [getZodiacName(sun)];
    if (moon) parts.push(`${getZodiacName(moon)} Moon`);
    if (rising) parts.push(`${getZodiacName(rising)} Rising`);
    
    return parts.join(' • ');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-background border-t border-foreground/10 rounded-t-2xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] font-normal">
            Your Family
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-1 pb-4">
          {babies.map((baby) => {
            const sun = getZodiacFromBirthday(baby.birthday);
            const isSelected = baby.id === selectedBabyId;
            
            return (
              <button
                key={baby.id}
                onClick={() => {
                  onSelectBaby(baby.id);
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
                    <span className="text-[15px] text-foreground/80">{baby.name}</span>
                  </div>
                  <p className="text-[11px] text-foreground/40 mt-0.5">
                    {getSignsDisplay(baby)}
                  </p>
                </div>
              </button>
            );
          })}
          
          {onAddChild && (
            <button
              onClick={() => {
                onAddChild();
                onOpenChange(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-foreground/5 text-foreground/40"
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
