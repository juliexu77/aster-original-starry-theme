import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Copy, Check, Sparkles, Heart, AlertCircle, Lightbulb, Flame } from "lucide-react";
import html2canvas from "html2canvas";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday, ZODIAC_DATA } from "@/lib/zodiac";
import { FamilyDynamics, FamilyMemberProfile } from "@/hooks/useFamilyDynamics";

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
}

interface ShareFamilyDynamicsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dynamics: FamilyDynamics;
  members: FamilyMember[];
  generatedAt: string | null;
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#fb923c",
  earth: "#34d399",
  air: "#38bdf8",
  water: "#60a5fa",
};

const getElement = (sign: ZodiacSign): string => {
  return ZODIAC_DATA[sign]?.element || 'fire';
};

export const ShareFamilyDynamicsSheet = ({
  open,
  onOpenChange,
  dynamics,
  members,
  generatedAt,
}: ShareFamilyDynamicsSheetProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const memberSigns = members
    .filter(m => m.birthday)
    .map(m => ({
      ...m,
      sign: getZodiacFromBirthday(m.birthday) as ZodiacSign,
    }))
    .filter(m => m.sign);

  const captureImage = async (): Promise<string | null> => {
    if (!shareCardRef.current) return null;
    
    setIsCapturing(true);
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0a0908',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture image:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'family-dynamics.png';
    link.href = dataUrl;
    link.click();
  };

  const handleCopy = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'family-dynamics.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Our Family Dynamics',
          text: dynamics.headline,
          files: [file],
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-center text-foreground/80">Share Family Dynamics</SheetTitle>
          <SheetDescription className="text-center text-foreground/40">
            Share your cosmic family insights
          </SheetDescription>
        </SheetHeader>

        {/* Preview Card */}
        <div className="flex justify-center mb-6">
          <div 
            ref={shareCardRef}
            className="w-[340px] p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, #0a0908 0%, #12100e 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-2">
                Family Dynamics
              </p>
              <p className="text-sm text-white/80 font-medium italic">
                "{dynamics.headline}"
              </p>
            </div>

            {/* Member Signs */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {memberSigns.map(m => {
                const element = getElement(m.sign);
                const colorClass = element === 'fire' ? 'text-orange-400' :
                                   element === 'earth' ? 'text-emerald-400' :
                                   element === 'air' ? 'text-sky-400' : 'text-blue-400';
                return (
                  <div key={m.id} className="flex flex-col items-center gap-1">
                    <div 
                      className="p-1.5 rounded-full"
                      style={{
                        background: `${ELEMENT_COLORS[element]}15`,
                        border: `1px solid ${ELEMENT_COLORS[element]}30`,
                      }}
                    >
                      <ZodiacIcon 
                        sign={m.sign} 
                        className={`w-4 h-4 ${colorClass}`}
                      />
                    </div>
                    <span className="text-[8px] text-white/40">{m.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Overview */}
            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[10px] text-white/50 leading-relaxed line-clamp-4">
                {dynamics.overview}
              </p>
            </div>

            {/* Key Insights Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Top Strength */}
              {dynamics.strengths[0] && (
                <div className="p-2 rounded-lg" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <Heart className="w-2.5 h-2.5" style={{ color: '#ec4899' }} />
                    <span className="text-[7px] uppercase tracking-wider" style={{ color: '#ec4899' }}>Strength</span>
                  </div>
                  <p className="text-[8px] text-white/40 leading-relaxed line-clamp-3">
                    {dynamics.strengths[0]}
                  </p>
                </div>
              )}

              {/* Top Tension */}
              {dynamics.tensions[0] && (
                <div className="p-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="w-2.5 h-2.5" style={{ color: '#fbbf24' }} />
                    <span className="text-[7px] uppercase tracking-wider" style={{ color: '#fbbf24' }}>Growth</span>
                  </div>
                  <p className="text-[8px] text-white/40 leading-relaxed line-clamp-3">
                    {dynamics.tensions[0]}
                  </p>
                </div>
              )}
            </div>

            {/* Cosmic Wisdom */}
            <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)' }}>
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-2.5 h-2.5" style={{ color: '#38bdf8' }} />
                <span className="text-[7px] uppercase tracking-wider" style={{ color: '#38bdf8' }}>Cosmic Wisdom</span>
              </div>
              <p className="text-[9px] text-white/50 leading-relaxed line-clamp-3">
                {dynamics.advice}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-[8px] text-white/30 tracking-wider">ASTER</span>
              </div>
              {generatedAt && (
                <span className="text-[7px] text-white/20">
                  {new Date(generatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 px-4">
          <Button
            onClick={handleShare}
            disabled={isCapturing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isCapturing ? 'Creating image...' : 'Share'}
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isCapturing}
              className="flex-1 border-foreground/10 hover:bg-foreground/5"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={isCapturing}
              className="flex-1 border-foreground/10 hover:bg-foreground/5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};