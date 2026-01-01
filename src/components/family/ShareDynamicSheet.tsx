import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ChildRelationshipInsights {
  currentStrength: string;
  currentFriction: string;
  actionableInsight: string;
  sleepDynamic: string;
  feedingDynamic: string;
  communicationStyle: string;
  whatThisPhaseTeaches: string;
  whatsComingNext: string;
  longTermEvolution: string;
}

interface PartnerInsights {
  currentStrength: string;
  currentFriction: string;
  actionableInsight: string;
  communicationStyle: string;
  emotionalDynamic: string;
  parentingTeamwork: string;
  stressResponse: string;
  intimacyInsight: string;
  longTermEvolution: string;
}

interface SiblingInsights {
  currentDynamic: string;
  whatEachBrings: Array<{ child: string; gifts: string[] }>;
  compatibilityLabel: string;
  compatibilityNote: string;
  earlyChildhood: string;
  schoolYears: string;
  teenYears: string;
}

interface ShareDynamicSheetProps {
  fromName: string;
  toName: string;
  fromSign: ZodiacSign | null;
  toSign: ZodiacSign | null;
  relationshipType: 'parent-child' | 'partner' | 'sibling';
  ageLabel?: string | null;
  childInsights?: ChildRelationshipInsights | null;
  partnerInsights?: PartnerInsights | null;
  siblingInsights?: SiblingInsights | null;
}

export const ShareDynamicSheet = ({ 
  fromName, 
  toName, 
  fromSign, 
  toSign,
  relationshipType,
  ageLabel,
  childInsights,
  partnerInsights,
  siblingInsights
}: ShareDynamicSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImageBlob();
      if (!blob) {
        toast.error("Couldn't generate image");
        setIsGenerating(false);
        return;
      }

      const fileName = `${fromName}-${toName}-dynamic.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${fromName} & ${toName} Dynamic`,
          text: `Check out this relationship dynamic!`,
        });
        toast.success("Shared!");
      } else {
        // Fallback: download the image
        downloadBlob(blob, fileName);
        toast.success("Downloaded!");
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error);
        const blob = await generateImageBlob();
        if (blob) {
          downloadBlob(blob, `${fromName}-${toName}-dynamic.png`);
          toast.success("Downloaded!");
        } else {
          toast.error("Couldn't share");
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
        downloadBlob(blob, `${fromName}-${toName}-dynamic.png`);
        toast.success("Downloaded!");
      } else {
        toast.error("Couldn't generate image");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getRelationshipTypeLabel = (): string => {
    if (relationshipType === 'sibling') return 'Sibling Dynamic';
    if (relationshipType === 'partner') return 'Partnership';
    return 'Parent-Child Dynamic';
  };

  const renderInsightRow = (label: string, content: string | undefined) => {
    if (!content) return null;
    return (
      <div className="bg-white/5 rounded-lg p-3">
        <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[11px] text-white/80 leading-relaxed">{content}</p>
      </div>
    );
  };

  const hasInsights = childInsights || partnerInsights || siblingInsights;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className="p-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
          disabled={!hasInsights}
        >
          <Upload size={14} strokeWidth={1.5} className="text-foreground/40" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-background border-foreground/10">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-foreground/90">
            Share {fromName} & {toName}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-140px)] pb-4">
          {/* Preview Card */}
          <div 
            ref={contentRef}
            className="bg-[#0a0a12] rounded-2xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">
                {getRelationshipTypeLabel()}
              </p>
              
              <div className="flex items-center justify-center gap-3">
                {fromSign && <ZodiacIcon sign={fromSign} size={28} className="text-amber-400/80" />}
                <span className="text-white/30 text-lg">×</span>
                {toSign && <ZodiacIcon sign={toSign} size={28} className="text-blue-300/80" />}
              </div>
              
              <h2 className="text-lg font-light text-white">{fromName} & {toName}</h2>
              
              <p className="text-[11px] text-white/40">
                {fromSign && getZodiacName(fromSign)} • {toSign && getZodiacName(toSign)}
                {ageLabel && ` • ${ageLabel}`}
              </p>
            </div>

            {/* All insights based on relationship type */}
            <div className="space-y-2">
              {/* Parent-Child Insights */}
              {childInsights && (
                <>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-2">Dynamics</p>
                  {renderInsightRow('Right Now', childInsights.currentStrength)}
                  {renderInsightRow('Where You Clash', childInsights.currentFriction)}
                  {renderInsightRow('Try This', childInsights.actionableInsight)}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">Daily Life</p>
                  {renderInsightRow('Sleep Patterns', childInsights.sleepDynamic)}
                  {renderInsightRow('Feeding', childInsights.feedingDynamic)}
                  {renderInsightRow('Communication', childInsights.communicationStyle)}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">Growth</p>
                  {renderInsightRow('This Phase Teaches', childInsights.whatThisPhaseTeaches)}
                  {renderInsightRow("What's Coming", childInsights.whatsComingNext)}
                  {renderInsightRow('Long-Term', childInsights.longTermEvolution)}
                </>
              )}

              {/* Partner Insights */}
              {partnerInsights && (
                <>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-2">Dynamics</p>
                  {renderInsightRow('Your Strength', partnerInsights.currentStrength)}
                  {renderInsightRow('Where You Clash', partnerInsights.currentFriction)}
                  {renderInsightRow('Try This', partnerInsights.actionableInsight)}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">Connection</p>
                  {renderInsightRow('Communication', partnerInsights.communicationStyle)}
                  {renderInsightRow('Emotional Dynamic', partnerInsights.emotionalDynamic)}
                  {renderInsightRow('Under Stress', partnerInsights.stressResponse)}
                  {renderInsightRow('Intimacy', partnerInsights.intimacyInsight)}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">Parenting</p>
                  {renderInsightRow('Teamwork', partnerInsights.parentingTeamwork)}
                  {renderInsightRow('Long-Term', partnerInsights.longTermEvolution)}
                </>
              )}

              {/* Sibling Insights */}
              {siblingInsights && (
                <>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-2">Dynamics</p>
                  {renderInsightRow('How They Connect', siblingInsights.currentDynamic)}
                  {siblingInsights.compatibilityLabel && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Bond Type</p>
                      <p className="text-[13px] text-amber-400/80 font-medium">{siblingInsights.compatibilityLabel}</p>
                      <p className="text-[11px] text-white/60 mt-1">{siblingInsights.compatibilityNote}</p>
                    </div>
                  )}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">What Each Brings</p>
                  {siblingInsights.whatEachBrings?.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">{item.child}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.gifts.map((gift, i) => (
                          <span key={i} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                            {gift}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <p className="text-[9px] text-white/30 uppercase tracking-wider pt-3">Timeline</p>
                  {renderInsightRow('Early Years (0-5)', siblingInsights.earlyChildhood)}
                  {renderInsightRow('School Years (6-12)', siblingInsights.schoolYears)}
                  {renderInsightRow('Teen Years', siblingInsights.teenYears)}
                </>
              )}
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
