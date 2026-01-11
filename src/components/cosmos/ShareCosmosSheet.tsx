import { useState, useRef } from "react";
import { Upload, Loader2, Star, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName } from "@/lib/zodiac";
import { CosmosReading } from "./types";
import html2canvas from "html2canvas";
import { toast } from "sonner";

const getChineseZodiacEmoji = (animal: string): string => {
  const emojiMap: Record<string, string> = {
    'Rat': '🐀',
    'Ox': '🐂',
    'Tiger': '🐅',
    'Rabbit': '🐇',
    'Dragon': '🐉',
    'Snake': '🐍',
    'Horse': '🐴',
    'Goat': '🐐',
    'Monkey': '🐒',
    'Rooster': '🐓',
    'Dog': '🐕',
    'Pig': '🐷'
  };
  return emojiMap[animal] || '✨';
};

interface ShareCosmosSheetProps {
  reading: CosmosReading;
}

export const ShareCosmosSheet = ({ reading }: ShareCosmosSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  // Safely access reading properties with defaults
  const sections = reading?.sections || [];
  const memberName = reading?.memberName || '';
  const monthYear = reading?.monthYear || '';
  const sunSign = reading?.sunSign || 'aries';
  const moonSign = reading?.moonSign;
  const risingSign = reading?.risingSign;
  const astrologicalSeason = reading?.astrologicalSeason || '';
  const lunarPhase = reading?.lunarPhase || '';
  const opening = reading?.opening || '';
  const chineseZodiac = reading?.chineseZodiac;
  const chineseElement = reading?.chineseElement;
  const hasChineseZodiac = chineseZodiac && chineseElement;
  const isYearly = reading?.readingPeriod === 'year';

  const formatMonthYear = (my: string) => {
    if (!my || !my.includes('-')) {
      return my || '';
    }
    const [year, month] = my.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Truncate text to fit story format
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

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
        toast.error("Couldn't generate story image");
        setIsGenerating(false);
        return;
      }

      const fileName = `${memberName}-cosmos-${monthYear}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${memberName}'s Cosmic Reading`,
          text: `${memberName}'s cosmic guidance for ${formatMonthYear(monthYear)}`,
        });
        toast.success("Shared!");
      } else {
        downloadBlob(blob, fileName);
        toast.success("Story downloaded!");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        const blob = await generateImageBlob();
        if (blob) {
          downloadBlob(blob, `${memberName}-cosmos-${monthYear}.png`);
          toast.success("Story downloaded!");
        } else {
          toast.error("Couldn't share story");
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

  // Get first meaningful section for the story card
  const firstSection = sections[0];

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
          {/* Story Card - 9:16 aspect ratio for Instagram/TikTok */}
          <div 
            ref={storyRef}
            className="relative overflow-hidden"
            style={{ 
              width: '270px', 
              height: '480px',
              background: 'linear-gradient(160deg, #0f0818 0%, #1a0a24 30%, #0d0614 60%, #080410 100%)',
              borderRadius: '12px'
            }}
          >
            {/* Decorative star field */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `${5 + Math.random() * 90}%`,
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    opacity: 0.2 + Math.random() * 0.6
                  }}
                />
              ))}
            </div>

            {/* Gradient overlays for depth */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Top: Month/Year */}
              <div className="text-center mb-2">
                <p className="text-[9px] text-amber-300/70 uppercase tracking-[0.4em] font-sans">
                  {isYearly ? monthYear : formatMonthYear(monthYear)}
                </p>
              </div>

              {/* Season Title */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-serif text-white/90 leading-tight">
                  {astrologicalSeason}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-purple-300/60">
                  <Moon className="w-3 h-3" />
                  <span>{lunarPhase}</span>
                </div>
              </div>

              {/* Signs Row */}
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="flex flex-col items-center gap-0.5">
                  <ZodiacIcon sign={sunSign} size={22} className="text-amber-300/80" />
                  <span className="text-[8px] text-white/40">{getZodiacName(sunSign)}</span>
                </div>
                {moonSign && (
                  <div className="flex flex-col items-center gap-0.5">
                    <ZodiacIcon sign={moonSign} size={22} className="text-purple-300/80" />
                    <span className="text-[8px] text-white/40">{getZodiacName(moonSign)}</span>
                  </div>
                )}
                {risingSign && (
                  <div className="flex flex-col items-center gap-0.5">
                    <ZodiacIcon sign={risingSign} size={22} className="text-indigo-300/80" />
                    <span className="text-[8px] text-white/40">{getZodiacName(risingSign)}</span>
                  </div>
                )}
                {hasChineseZodiac && (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xl">{getChineseZodiacEmoji(chineseZodiac)}</span>
                    <span className="text-[8px] text-white/40">{chineseElement}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                <Star className="w-2.5 h-2.5 text-amber-300/40" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              </div>

              {/* Name */}
              <p className="text-center text-[10px] text-amber-300/60 uppercase tracking-[0.2em] mb-3 font-sans">
                {memberName}'s {isYearly ? 'Year' : 'Month'}
              </p>

              {/* Opening - Main content */}
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] text-white/75 leading-relaxed font-serif text-center">
                  {truncateText(opening, 280)}
                </p>
              </div>

              {/* Key insight from first section */}
              {firstSection && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[9px] text-purple-300/60 uppercase tracking-[0.15em] mb-1.5 font-sans">
                    {firstSection.title}
                  </p>
                  <p className="text-[10px] text-white/60 leading-relaxed font-serif">
                    {truncateText(firstSection.content?.split('\n\n')[0] || '', 120)}
                  </p>
                </div>
              )}

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
