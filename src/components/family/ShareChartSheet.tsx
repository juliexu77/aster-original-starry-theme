import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { SUN_MECHANICS, MOON_PATTERNS, RISING_PRESENCE, getChartSynthesis } from "@/lib/astrology-content";
import html2canvas from "html2canvas";
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
  const { strengths, growthEdges } = getChartSynthesis(sunSign, moonSign, risingSign);

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!chartRef.current) return null;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
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

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${firstName}'s Birth Chart`,
          text: `Check out ${firstName}'s astrological birth chart!`,
        });
        toast.success("Shared!");
      } else {
        // Fallback: download the image
        downloadBlob(blob, fileName);
        toast.success("Chart downloaded!");
      }
    } catch (error) {
      // User cancelled share or error occurred
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

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImageBlob();
      if (blob) {
        downloadBlob(blob, `${firstName}-birth-chart.png`);
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
          <Upload size={18} strokeWidth={1.5} className="text-foreground/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">Share {firstName}'s Chart</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-140px)] pb-4">
          {/* Preview Card */}
          <div 
            ref={chartRef}
            className="bg-[#0a0a12] rounded-2xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Birth Chart</p>
              <h2 className="text-xl font-light text-white">{name}</h2>
              <p className="text-[11px] text-white/40">{(() => {
                const [year, month, day] = birthday.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              })()}</p>
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

            {/* Sun Section - Full Content */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">{firstName}'s Sun in {getZodiacName(sunSign)}</p>
              <p className="text-[9px] text-white/30 mb-2">Essential self · Core identity</p>
              <ul className="space-y-2">
                {sunMechanics?.map((trait, i) => (
                  <li key={i} className="text-[11px] text-white/70 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            {/* Moon Section - Full Content */}
            {moonPatterns && moonSign && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">{firstName}'s Moon in {getZodiacName(moonSign)}</p>
                <p className="text-[9px] text-white/30 mb-2">Emotional needs · Inner world</p>
                <ul className="space-y-2">
                  {moonPatterns.map((trait, i) => (
                    <li key={i} className="text-[11px] text-white/70 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rising Section - Full Content */}
            {risingPresence && risingSign && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">{firstName}'s {getZodiacName(risingSign)} Rising</p>
                <p className="text-[9px] text-white/30 mb-2">First impression · Instinctual response</p>
                <p className="text-[11px] text-white/70 leading-relaxed mb-3">{risingPresence.instinct}</p>
                <ul className="space-y-2">
                  {risingPresence.modification.map((trait, i) => (
                    <li key={i} className="text-[11px] text-white/70 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chart Synthesis */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">How {firstName}'s Chart Works Together</p>
              <p className="text-[9px] text-white/30 mb-2">Chart synthesis · Light & shadow</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Natural Gifts</p>
                  <div className="flex flex-wrap gap-1.5">
                    {strengths.map((strength, i) => (
                      <span key={i} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Growth Edges</p>
                  <div className="flex flex-wrap gap-1.5">
                    {growthEdges.map((edge, i) => (
                      <span key={i} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                        {edge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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