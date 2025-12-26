import { ZodiacSign } from "@/lib/zodiac";
import { IconSun, IconMoon, IconSparkles } from "@tabler/icons-react";

interface BirthChartDiagramProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  sunDegree?: number;
  moonDegree?: number;
}

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

export const BirthChartDiagram = ({ 
  sunSign, 
  moonSign, 
  risingSign,
}: BirthChartDiagramProps) => {
  const placements = [
    { 
      type: 'sun', 
      label: 'Sun', 
      sign: sunSign, 
      icon: IconSun,
      description: 'Core identity'
    },
    { 
      type: 'moon', 
      label: 'Moon', 
      sign: moonSign, 
      icon: IconMoon,
      description: 'Emotional nature'
    },
    { 
      type: 'rising', 
      label: 'Rising', 
      sign: risingSign, 
      icon: IconSparkles,
      description: 'Outer presence'
    },
  ];

  const formatSign = (sign: ZodiacSign | null) => {
    if (!sign) return null;
    return sign.charAt(0).toUpperCase() + sign.slice(1);
  };

  return (
    <div className="w-full">
      {/* Simple vertical stack - Co-Star style */}
      <div className="space-y-4">
        {placements.map(({ type, label, sign, icon: Icon, description }) => (
          <div 
            key={type}
            className="flex items-center gap-4 py-3 border-b border-foreground/5 last:border-0"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
              <Icon size={20} className="text-foreground/60" />
            </div>
            
            {/* Label and description */}
            <div className="flex-1">
              <p className="text-xs text-foreground/40 uppercase tracking-wider font-sans">
                {label}
              </p>
              <p className="text-[10px] text-foreground/25 font-sans">
                {description}
              </p>
            </div>
            
            {/* Sign display */}
            {sign ? (
              <div className="text-right flex items-center gap-2">
                <span className="text-lg text-foreground/80 font-serif">
                  {formatSign(sign)}
                </span>
                <span className="text-xl text-foreground/40">
                  {ZODIAC_SYMBOLS[sign]}
                </span>
              </div>
            ) : (
              <span className="text-sm text-foreground/20 italic">
                Add birth time
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Minimal footer */}
      <p className="mt-6 text-center text-[10px] text-foreground/20 tracking-wider uppercase">
        The Big Three
      </p>
    </div>
  );
};
