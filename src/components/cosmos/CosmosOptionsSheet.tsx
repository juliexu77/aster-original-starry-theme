import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ReadingPeriod, ZodiacSystem } from "./types";
import { Calendar, Globe, Check } from "lucide-react";

interface CosmosOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: ReadingPeriod;
  zodiacSystem: ZodiacSystem;
  onPeriodChange: (period: ReadingPeriod) => void;
  onZodiacSystemChange: (system: ZodiacSystem) => void;
}

export const CosmosOptionsSheet = ({
  open,
  onOpenChange,
  period,
  zodiacSystem,
  onPeriodChange,
  onZodiacSystemChange
}: CosmosOptionsSheetProps) => {
  const periodOptions: { value: ReadingPeriod; label: string; description: string }[] = [
    { value: 'month', label: 'Monthly', description: 'Detailed guidance for this month' },
    { value: 'year', label: 'Yearly', description: 'Overview themes for the full year' }
  ];

  const zodiacOptions: { value: ZodiacSystem; label: string; description: string }[] = [
    { value: 'western', label: 'Western', description: 'Sun, Moon & Rising signs' },
    { value: 'eastern', label: 'Chinese', description: 'Year animal & element' },
    { value: 'both', label: 'Both', description: 'Western + Chinese combined' }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-[#0a0a12] border-t border-purple-500/20 rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground/80 text-center">Reading Options</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-8">
          {/* Period Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Calendar className="w-4 h-4 text-amber-300/60" />
              <span className="text-[11px] text-foreground/40 uppercase tracking-wider">Time Period</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onPeriodChange(option.value)}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    period === option.value
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {period === option.value && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-amber-300" />
                    </div>
                  )}
                  <p className="text-[14px] font-medium text-foreground/80">{option.label}</p>
                  <p className="text-[11px] text-foreground/40 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Zodiac System Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Globe className="w-4 h-4 text-purple-300/60" />
              <span className="text-[11px] text-foreground/40 uppercase tracking-wider">Zodiac System</span>
            </div>
            <div className="space-y-2">
              {zodiacOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onZodiacSystemChange(option.value)}
                  className={`relative w-full p-4 rounded-xl border text-left transition-all ${
                    zodiacSystem === option.value
                      ? 'border-purple-500/40 bg-purple-500/10'
                      : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                  }`}
                >
                  {zodiacSystem === option.value && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4">
                      <Check className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  <p className="text-[14px] font-medium text-foreground/80">{option.label}</p>
                  <p className="text-[11px] text-foreground/40 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
