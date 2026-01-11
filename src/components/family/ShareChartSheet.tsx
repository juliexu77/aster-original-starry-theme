import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { SUN_MECHANICS, MOON_PATTERNS, RISING_PRESENCE, getChartSynthesis } from "@/lib/astrology-content";
import { BirthChartDiagram } from "./BirthChartDiagram";
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

export const ShareChartSheet = ({ name, birthday, birthTime, birthLocation, sunSign, moonSign, risingSign }: ShareChartSheetProps) => {
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
          {/* Preview Card - Fixed width for consistent share image */}
          <div 
            ref={chartRef}
            className="bg-[#0a0a12] rounded-2xl p-6 space-y-5 mx-auto"
            style={{ width: '380px', minWidth: '380px' }}
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Birth Chart</p>
              <h2 className="text-2xl font-light text-white">{name}</h2>
              <p className="text-[12px] text-white/40">{(() => {
                const [year, month, day] = birthday.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              })()}</p>
            </div>

            {/* Birth Chart Diagram - Larger size */}
            <div className="flex justify-center py-3">
              <div className="w-[300px]">
                <BirthChartDiagram
                  sunSign={sunSign}
                  moonSign={moonSign}
                  risingSign={risingSign}
                  birthday={birthday}
                  birthTime={birthTime}
                  birthLocation={birthLocation}
                />
              </div>
            </div>

            {/* Signs Grid - Below diagram with proper spacing */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {/* Sun */}
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <ZodiacIcon sign={sunSign} size={28} className="mx-auto mb-1.5 text-amber-400/80" />
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Sun</p>
                <p className="text-[14px] text-white/90">{getZodiacName(sunSign)}</p>
              </div>
              
              {/* Moon */}
              {moonSign && (
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <ZodiacIcon sign={moonSign} size={28} className="mx-auto mb-1.5 text-blue-300/80" />
                  <p className="text-[9px] text-white/40 uppercase tracking-wider">Moon</p>
                  <p className="text-[14px] text-white/90">{getZodiacName(moonSign)}</p>
                </div>
              )}
              
              {/* Rising */}
              {risingSign && (
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <ZodiacIcon sign={risingSign} size={28} className="mx-auto mb-1.5 text-purple-300/80" />
                  <p className="text-[9px] text-white/40 uppercase tracking-wider">Rising</p>
                  <p className="text-[14px] text-white/90">{getZodiacName(risingSign)}</p>
                </div>
              )}
            </div>

            {/* Sun Section */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[11px] text-white/50 uppercase tracking-wider mb-1">{firstName}'s Sun in {getZodiacName(sunSign)}</p>
              <p className="text-[9px] text-white/30 mb-3">Essential self · Core identity</p>
              <ul className="space-y-2.5">
                {sunMechanics?.map((trait, i) => (
                  <li key={i} className="text-[12px] text-white/75 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            {/* Moon Section */}
            {moonPatterns && moonSign && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-[11px] text-white/50 uppercase tracking-wider mb-1">{firstName}'s Moon in {getZodiacName(moonSign)}</p>
                <p className="text-[9px] text-white/30 mb-3">Emotional needs · Inner world</p>
                <ul className="space-y-2.5">
                  {moonPatterns.map((trait, i) => (
                    <li key={i} className="text-[12px] text-white/75 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rising Section */}
            {risingPresence && risingSign && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-[11px] text-white/50 uppercase tracking-wider mb-1">{firstName}'s {getZodiacName(risingSign)} Rising</p>
                <p className="text-[9px] text-white/30 mb-3">First impression · Instinctual response</p>
                <p className="text-[12px] text-white/75 leading-relaxed mb-3">{risingPresence.instinct}</p>
                <ul className="space-y-2.5">
                  {risingPresence.modification.map((trait, i) => (
                    <li key={i} className="text-[12px] text-white/75 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-white/30">
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chart Synthesis */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[11px] text-white/50 uppercase tracking-wider mb-1">{firstName}'s Inner Balance</p>
              <p className="text-[9px] text-white/30 mb-3">Strengths & growth areas</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Natural Gifts</p>
                  <div className="space-y-1.5">
                    {strengths.map((strength, i) => (
                      <div key={i} className="text-[11px] bg-white/10 text-white/75 px-3 py-1.5 rounded-lg">
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Growth Edges</p>
                  <div className="space-y-1.5">
                    {growthEdges.map((edge, i) => (
                      <div key={i} className="text-[11px] bg-white/10 text-white/75 px-3 py-1.5 rounded-lg">
                        {edge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-[11px] text-white/25 text-center pt-3 uppercase tracking-[0.2em]">
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