import { useState, useRef } from "react";
import { Upload, Loader2, Star, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName } from "@/lib/zodiac";
import { CosmosReading } from "./types";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ShareCosmosSheetProps {
  reading: CosmosReading;
}

export const ShareCosmosSheet = ({ reading }: ShareCosmosSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);

  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!readingRef.current) return null;
    
    try {
      const canvas = await html2canvas(readingRef.current, {
        backgroundColor: '#0a0a12',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImageBlob();
      if (!blob) {
        toast.error("Couldn't generate reading image");
        setIsGenerating(false);
        return;
      }

      const fileName = `${reading.memberName}-cosmos-${reading.monthYear}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${reading.memberName}'s Cosmic Reading`,
          text: `${reading.memberName}'s cosmic guidance for ${formatMonthYear(reading.monthYear)}`,
        });
        toast.success("Shared!");
      } else {
        downloadBlob(blob, fileName);
        toast.success("Reading downloaded!");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        const blob = await generateImageBlob();
        if (blob) {
          downloadBlob(blob, `${reading.memberName}-cosmos-${reading.monthYear}.png`);
          toast.success("Reading downloaded!");
        } else {
          toast.error("Couldn't share reading");
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get first 2 sections for preview
  const previewSections = reading.sections.slice(0, 2);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
          <Upload size={18} strokeWidth={1.5} className="text-foreground/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">Share {reading.memberName}'s Reading</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-140px)] pb-4">
          {/* Preview Card */}
          <div 
            ref={readingRef}
            className="bg-gradient-to-br from-[#0a0a12] via-[#0f0a18] to-[#0a0a12] rounded-2xl p-5 space-y-4"
          >
            {/* Header with cosmic styling */}
            <div className="relative text-center space-y-2 pb-4">
              {/* Decorative stars */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-200 rounded-full"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${10 + Math.random() * 80}%`,
                      opacity: 0.3 + Math.random() * 0.5
                    }}
                  />
                ))}
              </div>

              <p className="text-[10px] text-amber-300/50 uppercase tracking-[0.3em]">
                Cosmic Guidance
              </p>
              <h2 className="text-xl font-serif text-white">{reading.memberName}</h2>
              <p className="text-[13px] text-white/60">{formatMonthYear(reading.monthYear)}</p>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-purple-300/60 pt-1">
                <Moon className="w-3 h-3" />
                {reading.astrologicalSeason} • {reading.lunarPhase}
              </div>

              {/* Signs row */}
              <div className="flex items-center justify-center gap-4 pt-3">
                <div className="flex flex-col items-center">
                  <ZodiacIcon sign={reading.sunSign} size={20} className="text-amber-300/70" />
                  <span className="text-[9px] text-white/40">{getZodiacName(reading.sunSign)}</span>
                </div>
                {reading.moonSign && (
                  <div className="flex flex-col items-center">
                    <ZodiacIcon sign={reading.moonSign} size={20} className="text-purple-300/70" />
                    <span className="text-[9px] text-white/40">{getZodiacName(reading.moonSign)} ☽</span>
                  </div>
                )}
                {reading.risingSign && (
                  <div className="flex flex-col items-center">
                    <ZodiacIcon sign={reading.risingSign} size={20} className="text-indigo-300/70" />
                    <span className="text-[9px] text-white/40">{getZodiacName(reading.risingSign)} ↑</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              <Star className="w-3 h-3 text-amber-300/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            </div>

            {/* Opening */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] text-amber-300/50 uppercase tracking-[0.15em] mb-2">
                This Month
              </p>
              <p className="text-[12px] text-white/80 leading-relaxed font-serif">
                {reading.opening}
              </p>
            </div>

            {/* Key Sections (first 2) */}
            {previewSections.map((section, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4">
                <p className="text-[10px] text-purple-300/60 uppercase tracking-[0.1em] mb-2">
                  {section.title}
                </p>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  {section.content.split('\n\n')[0]}
                </p>
              </div>
            ))}

            {/* Significant Dates Preview */}
            {reading.significantDates.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-[10px] text-amber-300/50 uppercase tracking-[0.1em] mb-2">
                  Key Dates
                </p>
                <ul className="space-y-1.5">
                  {reading.significantDates.slice(0, 3).map((date, i) => (
                    <li key={i} className="text-[10px] text-white/60 flex items-start gap-2">
                      <span className="text-amber-300/40">•</span>
                      {date}
                    </li>
                  ))}
                  {reading.significantDates.length > 3 && (
                    <li className="text-[10px] text-white/40 italic">
                      + {reading.significantDates.length - 3} more dates...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-3 space-y-1">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                Generated with Aster
              </p>
              <p className="text-[9px] text-white/15">
                Full reading available in app
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-foreground/5">
          <Button
            onClick={handleShare}
            disabled={isGenerating}
            className="w-full h-12 gap-2"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Share Reading
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
