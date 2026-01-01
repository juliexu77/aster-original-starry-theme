import { useState, useRef } from "react";
import { Share2, Download, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { SUN_MECHANICS, MOON_PATTERNS, RISING_PRESENCE, getChartSynthesis } from "@/lib/astrology-content";
import html2canvas from "html2canvas";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { toast } from "sonner";

interface ShareChartSheetProps {
  name: string;
  birthday: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
}

export const ShareChartSheet = ({ name, birthday, sunSign, moonSign, risingSign }: ShareChartSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const firstName = name.split(' ')[0];
  const sunMechanics = SUN_MECHANICS[sunSign];
  const moonPatterns = moonSign ? MOON_PATTERNS[moonSign] : null;
  const risingPresence = risingSign ? RISING_PRESENCE[risingSign] : null;
  const { strengths } = getChartSynthesis(sunSign, moonSign, risingSign);

  const generateImage = async (): Promise<string | null> => {
    if (!chartRef.current) return null;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a12',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const imageData = await generateImage();
      if (!imageData) {
        toast.error("Couldn't generate chart image");
        return;
      }

      // Check if native share is available (Capacitor)
      const canShare = await Share.canShare();
      
      if (canShare.value) {
        // Save to temp file for native share
        const base64Data = imageData.replace('data:image/png;base64,', '');
        const fileName = `${firstName}-birth-chart.png`;
        
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
        });
        
        const fileUri = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Cache,
        });

        await Share.share({
          title: `${firstName}'s Birth Chart`,
          text: `Check out ${firstName}'s astrological birth chart!`,
          url: fileUri.uri,
          dialogTitle: 'Share Birth Chart',
        });
      } else {
        // Fallback: download the image
        downloadImage(imageData);
      }
      
      toast.success("Chart ready to share!");
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to download on any error
      const imageData = await generateImage();
      if (imageData) {
        downloadImage(imageData);
        toast.success("Chart downloaded!");
      } else {
        toast.error("Couldn't share chart");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `${firstName}-birth-chart.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const imageData = await generateImage();
      if (imageData) {
        downloadImage(imageData);
        toast.success("Chart downloaded!");
      } else {
        toast.error("Couldn't generate chart");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
          <Share2 size={18} strokeWidth={1.5} className="text-foreground/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">Share {firstName}'s Chart</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-140px)] pb-4">
          {/* Preview Card */}
          <div 
            ref={chartRef}
            className="bg-[#0a0a12] rounded-2xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Birth Chart</p>
              <h2 className="text-xl font-light text-white">{name}</h2>
              <p className="text-[11px] text-white/40">{new Date(birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            {/* Signs Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Sun */}
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <ZodiacIcon sign={sunSign} size={24} className="mx-auto mb-1 text-amber-400/80" />
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Sun</p>
                <p className="text-[13px] text-white/90">{getZodiacName(sunSign)}</p>
              </div>
              
              {/* Moon */}
              {moonSign && (
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <ZodiacIcon sign={moonSign} size={24} className="mx-auto mb-1 text-blue-300/80" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Moon</p>
                  <p className="text-[13px] text-white/90">{getZodiacName(moonSign)}</p>
                </div>
              )}
              
              {/* Rising */}
              {risingSign && (
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <ZodiacIcon sign={risingSign} size={24} className="mx-auto mb-1 text-purple-300/80" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Rising</p>
                  <p className="text-[13px] text-white/90">{getZodiacName(risingSign)}</p>
                </div>
              )}
            </div>

            {/* Key Traits - use first item from each array */}
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Core Identity</p>
                <p className="text-[12px] text-white/70 leading-relaxed">{sunMechanics?.[0]}</p>
              </div>
              
              {moonPatterns && (
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Emotional World</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">{moonPatterns[0]}</p>
                </div>
              )}
              
              {risingPresence && (
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">First Impression</p>
                  <p className="text-[12px] text-white/70 leading-relaxed">{risingPresence.instinct}</p>
                </div>
              )}
            </div>

            {/* Strengths */}
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Natural Gifts</p>
              <div className="flex flex-wrap gap-1.5">
                {strengths.slice(0, 4).map((strength, i) => (
                  <span key={i} className="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-[9px] text-white/20 text-center pt-2">Generated with BabyGuide</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-foreground/5">
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            variant="outline"
            className="flex-1 h-12 gap-2"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download
          </Button>
          <Button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex-1 h-12 gap-2"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
            Share
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};