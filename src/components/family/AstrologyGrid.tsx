import { ZodiacSign, ZODIAC_DATA, getZodiacName } from "@/lib/zodiac";
import { getAstrologyGridData } from "@/lib/astrology-traits";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { Sun, Moon, Sparkles, TrendingUp } from "lucide-react";

interface AstrologyGridProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
}

interface GridRowProps {
  label: string;
  icon: React.ReactNode;
  traits: string[];
  modifier?: string | null;
  modifierSign?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const GridRow = ({ label, icon, traits, modifier, modifierSign, isFirst, isLast }: GridRowProps) => (
  <div 
    className={`
      flex items-start gap-4 px-4 py-4
      border-b border-foreground/[0.06]
      ${isFirst ? 'rounded-t-xl' : ''}
      ${isLast ? 'border-b-0 rounded-b-xl' : ''}
    `}
  >
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground/30">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[10px] text-foreground/30 uppercase tracking-[0.15em] block mb-1.5">
        {label}
      </span>
      <div className="space-y-0.5">
        {traits.map((trait, i) => (
          <p key={i} className="text-[13px] text-foreground/60">
            {trait}
          </p>
        ))}
        {modifier && modifierSign && (
          <p className="text-[11px] text-foreground/40 mt-1.5 pt-1.5 border-t border-foreground/5">
            Expressed with {modifierSign} Rising {modifier}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const AstrologyGrid = ({ sunSign, moonSign, risingSign }: AstrologyGridProps) => {
  const data = getAstrologyGridData(sunSign, moonSign, risingSign);

  return (
    <div className="bg-foreground/[0.02] border border-foreground/[0.06] rounded-xl overflow-hidden">
      <GridRow
        label="Core"
        icon={<Sun size={18} strokeWidth={1.5} />}
        traits={data.core.traits}
        modifier={data.core.risingModifier}
        modifierSign={risingSign ? getZodiacName(risingSign) : undefined}
        isFirst
      />
      <GridRow
        label="Emotional"
        icon={moonSign ? <ZodiacIcon sign={moonSign} size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
        traits={data.emotional.traits}
      />
      <GridRow
        label="Strengths"
        icon={<Sparkles size={18} strokeWidth={1.5} />}
        traits={data.strengths}
      />
      <GridRow
        label="Growth Edges"
        icon={<TrendingUp size={18} strokeWidth={1.5} />}
        traits={data.growthEdges}
        isLast
      />
    </div>
  );
};
