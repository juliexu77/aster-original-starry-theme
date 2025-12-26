import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ZodiacSign, getZodiacName, ZODIAC_DATA } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BirthChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  sunDegree?: number;
  moonDegree?: number;
}

export const BirthChartModal = ({
  open,
  onOpenChange,
  name,
  sunSign,
  moonSign,
  risingSign,
  sunDegree = 7,
  moonDegree = 15,
}: BirthChartModalProps) => {
  const sunData = ZODIAC_DATA[sunSign];
  const moonData = moonSign ? ZODIAC_DATA[moonSign] : null;
  const risingData = risingSign ? ZODIAC_DATA[risingSign] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-background/95 backdrop-blur-xl border-border/30 p-6">
        <VisuallyHidden>
          <DialogTitle>{name}'s Birth Chart</DialogTitle>
        </VisuallyHidden>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground/90">{name}'s Placements</h3>
          </div>

          {/* Placements Grid */}
          <div className="space-y-4">
            {/* Sun */}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10">
                <span className="text-xl">☉</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/80">Sun</span>
                  <ZodiacIcon sign={sunSign} size={14} className="text-foreground/50" />
                </div>
                <p className="text-[13px] text-foreground/60 mt-0.5">
                  {getZodiacName(sunSign)} — {sunDegree}°
                </p>
                <p className="text-[11px] text-foreground/40 mt-1 leading-relaxed">
                  Core identity and ego. How you express your essential self.
                </p>
              </div>
            </div>

            {/* Moon */}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10">
                <span className="text-xl">☽</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/80">Moon</span>
                  {moonSign && <ZodiacIcon sign={moonSign} size={14} className="text-foreground/50" />}
                </div>
                {moonSign ? (
                  <>
                    <p className="text-[13px] text-foreground/60 mt-0.5">
                      {getZodiacName(moonSign)} — {moonDegree}°
                    </p>
                    <p className="text-[11px] text-foreground/40 mt-1 leading-relaxed">
                      Emotional nature and instincts. How you process feelings.
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] text-foreground/30 mt-0.5 italic">
                    Add birth time to calculate moon sign
                  </p>
                )}
              </div>
            </div>

            {/* Rising */}
            <div className="flex items-start gap-4 p-3 rounded-lg bg-foreground/5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10">
                <span className="text-xl">↑</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/80">Rising</span>
                  {risingSign && <ZodiacIcon sign={risingSign} size={14} className="text-foreground/50" />}
                </div>
                {risingSign ? (
                  <>
                    <p className="text-[13px] text-foreground/60 mt-0.5">
                      {getZodiacName(risingSign)}
                    </p>
                    <p className="text-[11px] text-foreground/40 mt-1 leading-relaxed">
                      How others first perceive you. Your outward demeanor.
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] text-foreground/30 mt-0.5 italic">
                    Add birth location to calculate rising sign
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Element & Modality Summary */}
          {sunData && (
            <div className="pt-4 border-t border-border/20">
              <p className="text-[11px] text-foreground/30 text-center">
                {sunData.element} element • {sunData.modality} modality
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
