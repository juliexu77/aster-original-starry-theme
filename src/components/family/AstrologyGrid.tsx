import { ZodiacSign, ZODIAC_DATA, getZodiacName } from "@/lib/zodiac";
import { getAstrologyGridData, RISING_MODIFIERS } from "@/lib/astrology-traits";

interface AstrologyGridProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
}

const GridCard = ({ 
  title, 
  symbol, 
  children 
}: { 
  title: string; 
  symbol: string; 
  children: React.ReactNode;
}) => (
  <div className="bg-foreground/[0.02] border border-foreground/[0.06] rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] text-foreground/30 uppercase tracking-[0.15em]">
        {title}
      </span>
      <span className="text-foreground/20 text-sm">{symbol}</span>
    </div>
    {children}
  </div>
);

export const AstrologyGrid = ({ sunSign, moonSign, risingSign }: AstrologyGridProps) => {
  const data = getAstrologyGridData(sunSign, moonSign, risingSign);
  const sunSymbol = ZODIAC_DATA[sunSign].symbol;
  const moonSymbol = moonSign ? ZODIAC_DATA[moonSign].symbol : '';

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Core - Sun + Rising */}
      <GridCard title="Core" symbol={sunSymbol}>
        <div className="space-y-1">
          {data.core.traits.map((trait, i) => (
            <p key={i} className="text-[13px] text-foreground/60">
              {trait}
            </p>
          ))}
          {data.core.risingModifier && risingSign && (
            <p className="text-[11px] text-foreground/40 mt-2 pt-2 border-t border-foreground/5">
              Expressed with {getZodiacName(risingSign)} Rising {data.core.risingModifier}
            </p>
          )}
        </div>
      </GridCard>

      {/* Emotional - Moon */}
      <GridCard title="Emotional" symbol={moonSymbol || sunSymbol}>
        <div className="space-y-1">
          {data.emotional.traits.map((trait, i) => (
            <p key={i} className="text-[13px] text-foreground/60">
              {trait}
            </p>
          ))}
        </div>
      </GridCard>

      {/* Strengths */}
      <GridCard title="Strengths" symbol="✦">
        <div className="space-y-1">
          {data.strengths.map((strength, i) => (
            <p key={i} className="text-[13px] text-foreground/60">
              {strength}
            </p>
          ))}
        </div>
      </GridCard>

      {/* Growth Edges */}
      <GridCard title="Growth Edges" symbol="◇">
        <div className="space-y-1">
          {data.growthEdges.map((edge, i) => (
            <p key={i} className="text-[13px] text-foreground/60">
              {edge}
            </p>
          ))}
        </div>
      </GridCard>
    </div>
  );
};
