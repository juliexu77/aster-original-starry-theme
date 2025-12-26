import { useMemo, useState } from "react";
import { ZodiacSign, ZODIAC_DATA } from "@/lib/zodiac";
import { IconSun, IconMoon, IconArrowUp } from "@tabler/icons-react";

interface BirthChartDiagramProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  sunDegree?: number;
  moonDegree?: number;
}

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

const ZODIAC_ABBREV: Record<ZodiacSign, string> = {
  aries: 'ARI', taurus: 'TAU', gemini: 'GEM', cancer: 'CAN',
  leo: 'LEO', virgo: 'VIR', libra: 'LIB', scorpio: 'SCO',
  sagittarius: 'SAG', capricorn: 'CAP', aquarius: 'AQU', pisces: 'PIS'
};

// Warm gold accent color
const ACCENT_COLOR = '#D4A574';
const TEXT_COLOR = '#FFFFFF';
const MUTED_COLOR = '#8A8A8A';
const RING_COLOR = '#4A4A4A';

export const BirthChartDiagram = ({ 
  sunSign, 
  moonSign, 
  risingSign,
  sunDegree = 15,
  moonDegree = 15,
}: BirthChartDiagramProps) => {
  const size = 380;
  const center = size / 2;
  const outerRadius = 170;
  const innerRadius = 130;
  const bigThreeRadius = 70;
  
  // Calculate positions for the zodiac wheel
  const zodiacPositions = useMemo(() => {
    return ZODIAC_ORDER.map((sign, i) => {
      // Each sign occupies 30°, position label at center of segment
      const startAngle = i * 30 - 90; // Start from top
      const midAngle = startAngle + 15;
      const angleRad = midAngle * (Math.PI / 180);
      
      // Position for label (outside the ring)
      const labelRadius = outerRadius + 22;
      
      return {
        sign,
        symbol: ZODIAC_SYMBOLS[sign],
        abbrev: ZODIAC_ABBREV[sign],
        labelX: center + Math.cos(angleRad) * labelRadius,
        labelY: center + Math.sin(angleRad) * labelRadius,
        // Segment arc for highlighting
        startAngle,
        endAngle: startAngle + 30,
        // Is this sign one of the Big 3?
        isSun: sign === sunSign,
        isMoon: sign === moonSign,
        isRising: sign === risingSign,
      };
    });
  }, [sunSign, moonSign, risingSign]);

  // Generate the arc path for a zodiac segment
  const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: center + Math.cos((startAngle * Math.PI) / 180) * radius,
      y: center + Math.sin((startAngle * Math.PI) / 180) * radius,
    };
    const end = {
      x: center + Math.cos((endAngle * Math.PI) / 180) * radius,
      y: center + Math.sin((endAngle * Math.PI) / 180) * radius,
    };
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  // Big 3 positions in center triangle
  const bigThreePositions = useMemo(() => {
    return [
      { type: 'sun', sign: sunSign, x: center, y: center - bigThreeRadius * 0.8, label: 'Sun' },
      { type: 'moon', sign: moonSign, x: center - bigThreeRadius * 0.7, y: center + bigThreeRadius * 0.5, label: 'Moon' },
      { type: 'rising', sign: risingSign, x: center + bigThreeRadius * 0.7, y: center + bigThreeRadius * 0.5, label: 'Rising' },
    ];
  }, [sunSign, moonSign, risingSign, center, bigThreeRadius]);

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto"
      >
        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={RING_COLOR}
          strokeWidth={2}
        />
        
        {/* Inner ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke={RING_COLOR}
          strokeWidth={1}
          opacity={0.6}
        />
        
        {/* Zodiac segment dividers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          return (
            <line
              key={`div-${i}`}
              x1={center + Math.cos(angle) * innerRadius}
              y1={center + Math.sin(angle) * innerRadius}
              x2={center + Math.cos(angle) * outerRadius}
              y2={center + Math.sin(angle) * outerRadius}
              stroke={RING_COLOR}
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}
        
        {/* Highlight arcs for Big 3 signs */}
        {zodiacPositions.filter(z => z.isSun || z.isMoon || z.isRising).map((z, i) => (
          <path
            key={`highlight-${z.sign}`}
            d={getArcPath(z.startAngle, z.endAngle, (outerRadius + innerRadius) / 2)}
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth={outerRadius - innerRadius - 4}
            opacity={0.25}
          />
        ))}
        
        {/* Zodiac labels - HORIZONTAL, outside the ring */}
        {zodiacPositions.map(({ sign, abbrev, labelX, labelY, isSun, isMoon, isRising }) => {
          const isHighlighted = isSun || isMoon || isRising;
          
          return (
            <text
              key={`label-${sign}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isHighlighted ? ACCENT_COLOR : MUTED_COLOR}
              style={{ 
                fontSize: isHighlighted ? '13px' : '11px', 
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: isHighlighted ? 600 : 400,
                letterSpacing: '0.05em',
              }}
            >
              {abbrev}
            </text>
          );
        })}
        
        {/* Subtle connecting lines in center (very faint) */}
        {bigThreePositions[0].sign && bigThreePositions[1].sign && (
          <line
            x1={bigThreePositions[0].x}
            y1={bigThreePositions[0].y + 20}
            x2={bigThreePositions[1].x}
            y2={bigThreePositions[1].y - 20}
            stroke={RING_COLOR}
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray="4,4"
          />
        )}
        {bigThreePositions[0].sign && bigThreePositions[2].sign && (
          <line
            x1={bigThreePositions[0].x}
            y1={bigThreePositions[0].y + 20}
            x2={bigThreePositions[2].x}
            y2={bigThreePositions[2].y - 20}
            stroke={RING_COLOR}
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray="4,4"
          />
        )}
        {bigThreePositions[1].sign && bigThreePositions[2].sign && (
          <line
            x1={bigThreePositions[1].x + 20}
            y1={bigThreePositions[1].y}
            x2={bigThreePositions[2].x - 20}
            y2={bigThreePositions[2].y}
            stroke={RING_COLOR}
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray="4,4"
          />
        )}
        
        {/* Big 3 placements - the main focus */}
        {bigThreePositions.map(({ type, sign, x, y, label }) => {
          if (!sign) {
            // Show placeholder for missing data
            return (
              <g key={type}>
                <circle
                  cx={x}
                  cy={y}
                  r={28}
                  fill="#2A2A2A"
                  stroke={RING_COLOR}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  opacity={0.5}
                />
                <text
                  x={x}
                  y={y - 4}
                  textAnchor="middle"
                  fill={MUTED_COLOR}
                  style={{ fontSize: '10px', fontFamily: 'DM Sans, sans-serif' }}
                  opacity={0.5}
                >
                  {label}
                </text>
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fill={MUTED_COLOR}
                  style={{ fontSize: '8px', fontFamily: 'DM Sans, sans-serif' }}
                  opacity={0.4}
                >
                  Add data
                </text>
              </g>
            );
          }
          
          const symbol = ZODIAC_SYMBOLS[sign];
          const signName = sign.charAt(0).toUpperCase() + sign.slice(1);
          
          return (
            <g key={type}>
              {/* Glow effect */}
              <circle
                cx={x}
                cy={y}
                r={32}
                fill="url(#glowGradient)"
                opacity={0.4}
              />
              
              {/* Main circle */}
              <circle
                cx={x}
                cy={y}
                r={28}
                fill="#252525"
                stroke={ACCENT_COLOR}
                strokeWidth={1.5}
              />
              
              {/* Icon */}
              <foreignObject
                x={x - 12}
                y={y - 18}
                width={24}
                height={24}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {type === 'sun' && <IconSun size={20} className="text-[#D4A574]" />}
                  {type === 'moon' && <IconMoon size={20} className="text-[#D4A574]" />}
                  {type === 'rising' && <IconArrowUp size={20} className="text-[#D4A574]" />}
                </div>
              </foreignObject>
              
              {/* Zodiac symbol */}
              <text
                x={x}
                y={y + 14}
                textAnchor="middle"
                fill={TEXT_COLOR}
                style={{ fontSize: '14px', fontFamily: 'serif' }}
              >
                {symbol}
              </text>
              
              {/* Label below */}
              <text
                x={x}
                y={y + 48}
                textAnchor="middle"
                fill={MUTED_COLOR}
                style={{ 
                  fontSize: '9px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </text>
              
              {/* Sign name below label */}
              <text
                x={x}
                y={y + 60}
                textAnchor="middle"
                fill={TEXT_COLOR}
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'Source Serif 4, serif',
                }}
              >
                {signName}
              </text>
            </g>
          );
        })}
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
            <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Legend / hint */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-foreground/30 tracking-wide">
          Your Big 3 • The core of your chart
        </p>
      </div>
    </div>
  );
};
