import { useState, useRef } from "react";
import { Upload, Loader2, Sun, Moon, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getChartSynthesis } from "@/lib/astrology-content";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ShareChartSheetProps {
  name: string;
  birthday: string;
  birthTime?: string | null;
  birthLocation?: string | null;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
}

export const ShareChartSheet = ({ name, birthday, sunSign, moonSign, risingSign }: ShareChartSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  
  const firstName = name.split(' ')[0];
  const { strengths, growthEdges } = getChartSynthesis(sunSign, moonSign, risingSign);

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!storyRef.current) return null;
    
    try {
      const canvas = await html2canvas(storyRef.current, {
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
        toast.error("Couldn't generate chart image");
        setIsGenerating(false);
        return;
      }

      const fileName = `${firstName}-birth-chart.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${firstName}'s Birth Chart`,
          text: `Check out ${firstName}'s astrological birth chart!`,
        });
        toast.success("Shared!");
      } else {
        downloadBlob(blob, fileName);
        toast.success("Chart downloaded!");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        const blob = await generateImageBlob();
        if (blob) {
          downloadBlob(blob, `${firstName}-birth-chart.png`);
          toast.success("Chart downloaded!");
        } else {
          toast.error("Couldn't share chart");
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

  const formatBirthday = (bd: string) => {
    const [year, month, day] = bd.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
          <Upload size={18} strokeWidth={1.5} className="text-foreground/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">Share to Story</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col items-center overflow-y-auto max-h-[calc(90vh-140px)] pb-4">
          {/* Story Card - 9:16 aspect ratio */}
          <div 
            ref={storyRef}
            className="relative overflow-hidden"
            style={{ 
              width: '270px', 
              height: '480px',
              background: 'linear-gradient(160deg, #0a0612 0%, #140a1a 30%, #0a0810 60%, #060408 100%)',
              borderRadius: '12px'
            }}
          >
            {/* Decorative star field */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `${5 + Math.random() * 90}%`,
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    opacity: 0.2 + Math.random() * 0.5
                  }}
                />
              ))}
            </div>

            {/* Gradient overlays */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 70% 40% at 50% 25%, rgba(251, 191, 36, 0.1) 0%, transparent 60%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 75%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-sans mb-1">
                  Birth Chart
                </p>
                <h2 className="text-xl font-serif text-white/90">{name}</h2>
                <p className="text-[10px] text-white/40 mt-1">{formatBirthday(birthday)}</p>
              </div>

              {/* Signs - Visual Display */}
              <div className="flex items-center justify-center gap-3 mb-5">
                {/* Sun */}
                <div className="flex flex-col items-center gap-1 bg-white/5 rounded-xl px-3 py-2">
                  <Sun size={20} className="text-amber-400/80" />
                  <ZodiacIcon sign={sunSign} size={24} className="text-amber-300/90" />
                  <span className="text-[8px] text-white/40 uppercase tracking-wider">Sun</span>
                  <span className="text-[11px] text-white/80">{getZodiacName(sunSign)}</span>
                </div>
                
                {/* Moon */}
                {moonSign && (
                  <div className="flex flex-col items-center gap-1 bg-white/5 rounded-xl px-3 py-2">
                    <Moon size={20} className="text-blue-300/80" />
                    <ZodiacIcon sign={moonSign} size={24} className="text-blue-300/90" />
                    <span className="text-[8px] text-white/40 uppercase tracking-wider">Moon</span>
                    <span className="text-[11px] text-white/80">{getZodiacName(moonSign)}</span>
                  </div>
                )}
                
                {/* Rising */}
                {risingSign && (
                  <div className="flex flex-col items-center gap-1 bg-white/5 rounded-xl px-3 py-2">
                    <Sparkles size={20} className="text-purple-300/80" />
                    <ZodiacIcon sign={risingSign} size={24} className="text-purple-300/90" />
                    <span className="text-[8px] text-white/40 uppercase tracking-wider">Rising</span>
                    <span className="text-[11px] text-white/80">{getZodiacName(risingSign)}</span>
                  </div>
                )}
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <p className="text-[9px] text-amber-300/60 uppercase tracking-[0.15em] mb-2 font-sans">
                  Strengths
                </p>
                <div className="space-y-1.5">
                  {strengths.slice(0, 3).map((s, i) => (
                    <div key={i} className="text-[10px] text-white/70 bg-white/5 px-3 py-1.5 rounded-lg">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="flex-1">
                <p className="text-[9px] text-purple-300/60 uppercase tracking-[0.15em] mb-2 font-sans">
                  Growth Areas
                </p>
                <div className="space-y-1.5">
                  {growthEdges.slice(0, 2).map((e, i) => (
                    <div key={i} className="text-[10px] text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 text-center">
                <p className="text-[8px] text-white/25 uppercase tracking-[0.25em]">
                  ✦ Aster ✦
                </p>
              </div>
            </div>
          </div>

          {/* Preview label */}
          <p className="text-[11px] text-foreground/40 mt-4">
            Optimized for Instagram & TikTok Stories
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-foreground/5">
          <Button
            onClick={handleShare}
            disabled={isGenerating}
            className="w-full h-12 gap-2"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Share to Story
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
