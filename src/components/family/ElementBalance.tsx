import { ZodiacSign, ZODIAC_DATA } from "@/lib/zodiac";
import { Flame, Mountain, Wind, Droplets } from "lucide-react";

type Element = 'fire' | 'earth' | 'air' | 'water';
type Modality = 'cardinal' | 'fixed' | 'mutable';

interface ElementBalanceProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  name?: string;
}

const ELEMENT_CONFIG: Record<Element, { icon: React.ElementType; label: string }> = {
  fire: { icon: Flame, label: 'Fire' },
  earth: { icon: Mountain, label: 'Earth' },
  air: { icon: Wind, label: 'Air' },
  water: { icon: Droplets, label: 'Water' },
};

const MODALITY_LABELS: Record<Modality, string> = {
  cardinal: 'Cardinal',
  fixed: 'Fixed',
  mutable: 'Mutable',
};

// Weights for different placements (Sun most important, then Moon, then Rising)
const PLACEMENT_WEIGHTS = {
  sun: 4,
  moon: 3,
  rising: 2,
};

const getElementDistribution = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): Record<Element, number> => {
  const counts: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  
  counts[ZODIAC_DATA[sunSign].element] += PLACEMENT_WEIGHTS.sun;
  if (moonSign) counts[ZODIAC_DATA[moonSign].element] += PLACEMENT_WEIGHTS.moon;
  if (risingSign) counts[ZODIAC_DATA[risingSign].element] += PLACEMENT_WEIGHTS.rising;
  
  return counts;
};

const getModalityDistribution = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): Record<Modality, number> => {
  const counts: Record<Modality, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  
  counts[ZODIAC_DATA[sunSign].modality] += PLACEMENT_WEIGHTS.sun;
  if (moonSign) counts[ZODIAC_DATA[moonSign].modality] += PLACEMENT_WEIGHTS.moon;
  if (risingSign) counts[ZODIAC_DATA[risingSign].modality] += PLACEMENT_WEIGHTS.rising;
  
  return counts;
};

const getElementSynthesis = (
  distribution: Record<Element, number>,
  name: string
): string => {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(distribution)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);
  
  if (sorted.length === 0) return '';
  
  const [dominant, dominantCount] = sorted[0];
  const dominantPercent = Math.round((dominantCount / total) * 100);
  
  const secondary = sorted.length > 1 ? sorted[1][0] : null;
  
  const elementQualities: Record<Element, { verb: string; quality: string }> = {
    fire: { verb: 'action and enthusiasm', quality: 'dynamic, passionate' },
    earth: { verb: 'stability and practicality', quality: 'grounded, sensory' },
    air: { verb: 'ideas and connection', quality: 'intellectual, communicative' },
    water: { verb: 'feeling and intuition', quality: 'emotional, empathetic' },
  };
  
  const { verb, quality } = elementQualities[dominant as Element];
  
  if (dominantPercent >= 60) {
    return `${name} experiences life through ${verb}, with a strongly ${quality} nature that shapes how they engage with the world.`;
  }
  
  if (secondary) {
    const secondaryQuality = elementQualities[secondary as Element];
    return `${name} experiences life through ${verb}, with ${dominant} and ${secondary} energy creating a ${quality} and ${secondaryQuality.quality.split(',')[0]} nature.`;
  }
  
  return `${name} experiences life through ${verb}, with a ${quality} approach to the world.`;
};

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-1.5 bg-foreground/[0.06] rounded-full overflow-hidden flex-1">
      <div 
        className="h-full bg-foreground/30 rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export const ElementBalance = ({ sunSign, moonSign, risingSign, name = 'They' }: ElementBalanceProps) => {
  const elementDist = getElementDistribution(sunSign, moonSign, risingSign);
  const modalityDist = getModalityDistribution(sunSign, moonSign, risingSign);
  
  const elementTotal = Object.values(elementDist).reduce((a, b) => a + b, 0);
  const modalityTotal = Object.values(modalityDist).reduce((a, b) => a + b, 0);
  
  const elementSynthesis = getElementSynthesis(elementDist, name);
  
  return (
    <div className="space-y-6">
      {/* Elemental Nature */}
      <div>
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.15em] mb-3">
          Elemental Nature
        </p>
        <div className="space-y-2.5">
          {(Object.keys(ELEMENT_CONFIG) as Element[]).map((element) => {
            const { icon: Icon, label } = ELEMENT_CONFIG[element];
            const count = elementDist[element];
            const percent = elementTotal > 0 ? Math.round((count / elementTotal) * 100) : 0;
            
            return (
              <div key={element} className="flex items-center gap-3">
                <Icon size={14} strokeWidth={1.5} className="text-foreground/40 flex-shrink-0" />
                <span className="text-[11px] text-foreground/50 w-10">{label}</span>
                <ProgressBar value={count} max={elementTotal} />
                <span className="text-[11px] text-foreground/40 w-8 text-right">{percent}%</span>
              </div>
            );
          })}
        </div>
        <p className="text-[13px] text-foreground/60 leading-relaxed mt-4">
          {elementSynthesis}
        </p>
      </div>

      {/* Modality Balance */}
      <div className="pt-4 border-t border-foreground/[0.04]">
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.15em] mb-3">
          Expression Style
        </p>
        <div className="flex gap-4">
          {(Object.keys(MODALITY_LABELS) as Modality[]).map((modality) => {
            const count = modalityDist[modality];
            const percent = modalityTotal > 0 ? Math.round((count / modalityTotal) * 100) : 0;
            
            return (
              <div key={modality} className="flex-1 text-center">
                <div className="text-[18px] font-light text-foreground/70">{percent}%</div>
                <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-0.5">
                  {MODALITY_LABELS[modality]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
