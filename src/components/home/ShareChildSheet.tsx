import { useState, useRef } from "react";
import { Upload, Loader2, Moon, Utensils, Footprints, Hand, MessageCircle, Users, Brain, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacFromBirthday, getZodiacName } from "@/lib/zodiac";
import { getDomainData, DomainData } from "./DevelopmentTable";
import { Calibration } from "@/hooks/useCalibration";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ShareChildSheetProps {
  name: string;
  birthday: string;
  ageLabel: string;
  phase: string;
  ageInWeeks: number;
  calibration?: Calibration | null;
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

const getDomainIcon = (domainId: string) => {
  const iconClass = "w-3 h-3";
  switch (domainId) {
    case "sleep": return <Moon className={iconClass} />;
    case "feeding": return <Utensils className={iconClass} />;
    case "physical": return <Footprints className={iconClass} />;
    case "fine_motor": return <Hand className={iconClass} />;
    case "language": return <MessageCircle className={iconClass} />;
    case "social": return <Users className={iconClass} />;
    case "cognitive": return <Brain className={iconClass} />;
    case "emotional": return <Heart className={iconClass} />;
    default: return null;
  }
};

export const ShareChildSheet = ({ name, birthday, ageLabel, phase, ageInWeeks, calibration }: ShareChildSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const firstName = name.split(' ')[0];
  const zodiacSign = getZodiacFromBirthday(birthday);
  const domains = getDomainData(ageInWeeks, calibration);

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
            className="bg-[#0a0a12] rounded-2xl p-5 space-y-4"
          >
            {/* Header with Avatar and Phase */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                {zodiacSign ? (
                  <ZodiacIcon sign={zodiacSign} size={24} strokeWidth={1.5} className="text-white/50" />
                ) : (
                  <span className="text-xl font-serif text-white/50">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-serif text-white truncate">{name}</h2>
                <p className="text-[11px] text-white/40">{ageLabel}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-white/60 font-medium">{phase}</span>
                  {zodiacSign && (
                    <>
                      <span className="text-white/20">·</span>
                      <div className="flex items-center gap-1">
                        <ZodiacIcon sign={zodiacSign} size={12} className="text-amber-400/70" />
                        <span className="text-[10px] text-white/50">{getZodiacName(zodiacSign)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-[11px] text-white/60 leading-relaxed">{getPhaseDescription(phase)}</p>
            </div>

            {/* Development Table */}
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-2">Development Stages</p>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                {domains.map((domain, idx) => (
                  <div 
                    key={domain.id}
                    className={`flex items-center ${idx !== domains.length - 1 ? 'border-b border-white/10' : ''}`}
                  >
                    {/* Domain icon & label */}
                    <div className="w-20 flex items-center gap-1.5 py-2 px-2 border-r border-white/10">
                      <span className="text-white/40">{getDomainIcon(domain.id)}</span>
                      <span className="text-[8px] uppercase tracking-wide text-white/50">
                        {domain.label}
                      </span>
                    </div>
                    
                    {/* Stage name */}
                    <div className="flex-1 py-2 px-2.5 border-r border-white/10">
                      <span className="text-[11px] text-white/80">{domain.stageName}</span>
                    </div>
                    
                    {/* Stage number */}
                    <div className="w-10 py-2 px-2 text-right">
                      <span className="text-[11px] text-white/50">{domain.currentStage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Summaries */}
            <div className="space-y-2">
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Stage Details</p>
              <div className="grid grid-cols-2 gap-2">
                {domains.map((domain) => (
                  <div key={domain.id} className="bg-white/5 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-white/40">{getDomainIcon(domain.id)}</span>
                      <span className="text-[9px] uppercase tracking-wide text-white/50">{domain.label}</span>
                    </div>
                    <p className="text-[10px] text-white/70 font-medium mb-0.5">{domain.stageName}</p>
                    <p className="text-[9px] text-white/40 leading-snug line-clamp-2">{domain.stageDescription}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-white/20 text-center pt-1 uppercase tracking-[0.15em]">
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
