import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacFromBirthday, getZodiacName } from "@/lib/zodiac";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ShareChildSheetProps {
  name: string;
  birthday: string;
  ageLabel: string;
  phase: string;
}

const getPhaseDescription = (phase: string): string => {
  const descriptions: Record<string, string> = {
    "Fourth trimester": "Adjusting to the world outside the womb",
    "Awakening": "Beginning to notice and respond to the world",
    "Social smiling": "First smiles and social connections emerging",
    "Reaching out": "Starting to grasp and explore with hands",
    "Rolling days": "Gaining mobility and rolling over",
    "Finding rhythm": "Developing daily patterns and routines",
    "On the move": "Crawling and exploring everything",
    "First steps": "Walking and gaining independence",
    "Exploring all": "Curious about everything around them",
    "Language burst": "Words and communication exploding",
    "Imagination": "Creative play and pretend worlds",
    "Why phase": "Questions about everything",
    "Making friends": "Social connections beyond family",
    "School ready": "Preparing for structured learning",
    "Growing up": "Developing independence and skills",
    "Finding self": "Discovering personal identity",
    "Pre-teen shift": "Navigating changes ahead",
    "Becoming": "Growing into their own person",
  };
  return descriptions[phase] || "Growing and developing beautifully";
};

export const ShareChildSheet = ({ name, birthday, ageLabel, phase }: ShareChildSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const firstName = name.split(' ')[0];
  const zodiacSign = getZodiacFromBirthday(birthday);

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!contentRef.current) return null;
    
    try {
      const canvas = await html2canvas(contentRef.current, {
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

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImageBlob();
      if (!blob) {
        toast.error("Couldn't generate image");
        setIsGenerating(false);
        return;
      }

      const fileName = `${firstName}-profile.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${firstName}'s Profile`,
          text: `Check out ${firstName}'s profile!`,
        });
        toast.success("Shared!");
      } else {
        downloadBlob(blob, fileName);
        toast.success("Downloaded!");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        const blob = await generateImageBlob();
        if (blob) {
          downloadBlob(blob, `${firstName}-profile.png`);
          toast.success("Downloaded!");
        } else {
          toast.error("Couldn't share");
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
          <Upload size={18} strokeWidth={1.5} className="text-foreground/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">Share {firstName}'s Profile</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-140px)] pb-4">
          {/* Preview Card */}
          <div 
            ref={contentRef}
            className="bg-[#0a0a12] rounded-2xl p-6 space-y-5"
          >
            {/* Header with Avatar */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                {zodiacSign ? (
                  <ZodiacIcon sign={zodiacSign} size={32} strokeWidth={1.5} className="text-white/50" />
                ) : (
                  <span className="text-2xl font-serif text-white/50">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-serif text-white">{name}</h2>
                <p className="text-[12px] text-white/40 mt-1">{ageLabel}</p>
              </div>
            </div>

            {/* Zodiac Sign */}
            {zodiacSign && (
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Sun Sign</p>
                <div className="flex items-center justify-center gap-2">
                  <ZodiacIcon sign={zodiacSign} size={20} className="text-amber-400/80" />
                  <span className="text-white/90">{getZodiacName(zodiacSign)}</span>
                </div>
              </div>
            )}

            {/* Current Phase */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Current Phase</p>
              <p className="text-[15px] text-white/90 font-medium">{phase}</p>
              <p className="text-[12px] text-white/50 mt-1">{getPhaseDescription(phase)}</p>
            </div>

            {/* Birthday */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Birthday</p>
              <p className="text-[13px] text-white/80">
                {(() => {
                  const [year, month, day] = birthday.split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                })()}
              </p>
            </div>

            {/* Footer */}
            <p className="text-[11px] text-white/25 text-center pt-2 uppercase tracking-[0.2em]">
              Generated with Aster
            </p>
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
            Share
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
