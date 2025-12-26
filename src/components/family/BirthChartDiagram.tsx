import { useMemo } from "react";
import { ZodiacSign, ZODIAC_DATA } from "@/lib/zodiac";
import {
  IconZodiacAries,
  IconZodiacTaurus,
  IconZodiacGemini,
  IconZodiacCancer,
  IconZodiacLeo,
  IconZodiacVirgo,
  IconZodiacLibra,
  IconZodiacScorpio,
  IconZodiacSagittarius,
  IconZodiacCapricorn,
  IconZodiacAquarius,
  IconZodiacPisces,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

interface BirthChartDiagramProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  sunDegree?: number;
  moonDegree?: number;
}

// Zodiac icon components map
const ZODIAC_ICONS: Record<ZodiacSign, Icon> = {
  aries: IconZodiacAries,
  taurus: IconZodiacTaurus,
  gemini: IconZodiacGemini,
  cancer: IconZodiacCancer,
  leo: IconZodiacLeo,
  virgo: IconZodiacVirgo,
  libra: IconZodiacLibra,
  scorpio: IconZodiacScorpio,
  sagittarius: IconZodiacSagittarius,
  capricorn: IconZodiacCapricorn,
  aquarius: IconZodiacAquarius,
  pisces: IconZodiacPisces,
};

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// Planet symbols
const PLANET_SYMBOLS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '⛢',
  neptune: '♆',
  pluto: '♇',
};

// Convert sign + degree to absolute degree (0-360)
const signToAbsoluteDegree = (sign: ZodiacSign, degree: number): number => {
  const signIndex = ZODIAC_ORDER.indexOf(sign);
  return signIndex * 30 + degree;
};

// Convert absolute degree to chart angle (0° at AC/left side, counter-clockwise)
const degreeToChartAngle = (degree: number, ascendantDegree: number): number => {
  // Chart starts at Ascendant on the left (180° in SVG terms)
  // Zodiac moves counter-clockwise
  return 180 - (degree - ascendantDegree);
};

interface StarProps {
  cx: number;
  cy: number;
  opacity: number;
}

const BackgroundStar = ({ cx, cy, opacity }: StarProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={0.5}
    fill="currentColor"
    opacity={opacity}
    className="text-foreground/30"
  />
);

// Silver/muted color for chart elements (matches app text styling)
const CHART_COLOR = '#A0A0A0';

export const BirthChartDiagram = ({ 
  sunSign, 
  moonSign, 
  risingSign,
  sunDegree = 7,
  moonDegree = 15,
}: BirthChartDiagramProps) => {
  const size = 600;
  const center = size / 2;
  const outerRadius = 270;
  const zodiacRingOuter = 240;
  const zodiacRingInner = 200;
  const innerCircle = 160;
  const planetRing = 130;
  
  // Calculate ascendant degree (start of rising sign)
  const ascendantDegree = useMemo(() => {
    if (!risingSign) return 0;
    return ZODIAC_ORDER.indexOf(risingSign) * 30;
  }, [risingSign]);

  // Generate background stars
  const stars = useMemo(() => {
    const starList: StarProps[] = [];
    const seed = 12345; // Fixed seed for consistency
    
    for (let i = 0; i < 40; i++) {
      const angle = ((seed * (i + 1)) % 360) * (Math.PI / 180);
      const distance = 275 + ((seed * (i + 2)) % 25);
      const cx = center + Math.cos(angle) * distance;
      const cy = center + Math.sin(angle) * distance;
      
      // Only include stars within bounds
      if (cx > 10 && cx < size - 10 && cy > 10 && cy < size - 10) {
        starList.push({
          cx,
          cy,
          opacity: 0.1 + ((seed * (i + 3)) % 20) / 100,
        });
      }
    }
    return starList;
  }, [center, size]);

  // Calculate planet positions
  const planets = useMemo(() => {
    const placements: { symbol: string; label: string; angle: number; radius: number }[] = [];
    
    // Sun position
    const sunAbsDegree = signToAbsoluteDegree(sunSign, sunDegree);
    const sunAngle = degreeToChartAngle(sunAbsDegree, ascendantDegree);
    placements.push({
      symbol: PLANET_SYMBOLS.sun,
      label: 'Sun',
      angle: sunAngle,
      radius: planetRing,
    });
    
    // Moon position
    if (moonSign) {
      const moonAbsDegree = signToAbsoluteDegree(moonSign, moonDegree);
      const moonAngle = degreeToChartAngle(moonAbsDegree, ascendantDegree);
      placements.push({
        symbol: PLANET_SYMBOLS.moon,
        label: 'Moon',
        angle: moonAngle,
        radius: planetRing - 25,
      });
    }
    
    // Add other planets in balanced positions
    const otherPlanets = [
      { symbol: PLANET_SYMBOLS.mercury, label: 'Mercury', offsetFromSun: 15 },
      { symbol: PLANET_SYMBOLS.venus, label: 'Venus', offsetFromSun: 45 },
      { symbol: PLANET_SYMBOLS.mars, label: 'Mars', offsetFromSun: 120 },
      { symbol: PLANET_SYMBOLS.jupiter, label: 'Jupiter', offsetFromSun: 180 },
      { symbol: PLANET_SYMBOLS.saturn, label: 'Saturn', offsetFromSun: 240 },
    ];
    
    otherPlanets.forEach((planet, idx) => {
      const angle = sunAngle + planet.offsetFromSun;
      placements.push({
        symbol: planet.symbol,
        label: planet.label,
        angle,
        radius: planetRing + (idx % 2 === 0 ? 0 : -20),
      });
    });
    
    return placements;
  }, [sunSign, moonSign, sunDegree, moonDegree, ascendantDegree]);

  // Generate house lines (12 divisions)
  const houseLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Start from top
      return {
        x1: center + Math.cos(angle) * innerCircle,
        y1: center + Math.sin(angle) * innerCircle,
        x2: center + Math.cos(angle) * outerRadius,
        y2: center + Math.sin(angle) * outerRadius,
        house: i + 1,
      };
    });
  }, [center, innerCircle, outerRadius]);

  // Generate zodiac sign positions (for icons in the ring)
  const zodiacPositions = useMemo(() => {
    return ZODIAC_ORDER.map((sign, i) => {
      // Position in the middle of each 30° segment
      const signDegree = i * 30 + 15;
      const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
      const angleRad = chartAngle * (Math.PI / 180);
      const iconRadius = (zodiacRingOuter + zodiacRingInner) / 2;
      const labelRadius = outerRadius + 28; // Outside the outer circle
      
      return {
        sign,
        IconComponent: ZODIAC_ICONS[sign],
        iconX: center + Math.cos(angleRad) * iconRadius,
        iconY: center + Math.sin(angleRad) * iconRadius,
        labelX: center + Math.cos(angleRad) * labelRadius,
        labelY: center + Math.sin(angleRad) * labelRadius,
        rotation: chartAngle + 90,
        labelRotation: chartAngle,
      };
    });
  }, [ascendantDegree, center, zodiacRingOuter, zodiacRingInner, outerRadius]);

  // Calculate AC and MC positions
  const acPosition = useMemo(() => {
    const angle = 180 * (Math.PI / 180); // Left side
    return {
      x: center + Math.cos(angle) * (outerRadius + 20),
      y: center + Math.sin(angle) * (outerRadius + 20),
    };
  }, [center, outerRadius]);

  const mcPosition = useMemo(() => {
    const angle = -90 * (Math.PI / 180); // Top
    return {
      x: center + Math.cos(angle) * (outerRadius + 20),
      y: center + Math.sin(angle) * (outerRadius + 20),
    };
  }, [center, outerRadius]);

  return (
    <div className="w-full aspect-square max-w-[600px] mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* Background Stars */}
        {stars.map((star, i) => (
          <BackgroundStar key={i} {...star} />
        ))}
        
        {/* Outer Circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.5}
        />
        
        {/* Zodiac Ring Outer */}
        <circle
          cx={center}
          cy={center}
          r={zodiacRingOuter}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.6}
        />
        
        {/* Zodiac Ring Inner */}
        <circle
          cx={center}
          cy={center}
          r={zodiacRingInner}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.6}
        />
        
        {/* Inner Circle */}
        <circle
          cx={center}
          cy={center}
          r={innerCircle}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.4}
        />
        
        {/* House Division Lines */}
        {houseLines.map((line, i) => (
          <g key={i}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={CHART_COLOR}
              strokeWidth={0.5}
              opacity={0.35}
            />
          </g>
        ))}
        
        {/* Zodiac Ring Divisions */}
        {Array.from({ length: 12 }, (_, i) => {
          const signDegree = i * 30;
          const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
          const angleRad = chartAngle * (Math.PI / 180);
          
          return (
            <line
              key={`zodiac-div-${i}`}
              x1={center + Math.cos(angleRad) * zodiacRingInner}
              y1={center + Math.sin(angleRad) * zodiacRingInner}
              x2={center + Math.cos(angleRad) * zodiacRingOuter}
              y2={center + Math.sin(angleRad) * zodiacRingOuter}
              stroke={CHART_COLOR}
              strokeWidth={0.75}
              opacity={0.5}
            />
          );
        })}
        
        {/* Zodiac Sign Labels (outer edge) */}
        {zodiacPositions.map(({ sign, labelX, labelY, labelRotation }) => {
          // Adjust rotation so text reads correctly (flip for bottom half)
          const adjustedRotation = labelRotation > 90 || labelRotation < -90 
            ? labelRotation + 180 
            : labelRotation;
          
          return (
            <text
              key={`label-${sign}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={CHART_COLOR}
              opacity={0.7}
              style={{ 
                fontSize: '9px', 
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
              transform={`rotate(${adjustedRotation}, ${labelX}, ${labelY})`}
            >
              {sign.toUpperCase()}
            </text>
          );
        })}
        
        {/* Zodiac Icons (in the ring) */}
        {zodiacPositions.map(({ sign, IconComponent, iconX, iconY }) => (
          <foreignObject
            key={sign}
            x={iconX - 10}
            y={iconY - 10}
            width={20}
            height={20}
          >
            <div className="flex items-center justify-center w-full h-full" style={{ color: CHART_COLOR, opacity: 0.9 }}>
              <IconComponent size={16} strokeWidth={1.5} />
            </div>
          </foreignObject>
        ))}
        
        {/* Planet Positions */}
        {planets.map((planet, i) => {
          const angleRad = planet.angle * (Math.PI / 180);
          const x = center + Math.cos(angleRad) * planet.radius;
          const y = center + Math.sin(angleRad) * planet.radius;
          
          // Use Tabler icons for Sun and Moon, text symbols for others
          const isSunOrMoon = planet.label === 'Sun' || planet.label === 'Moon';
          
          return (
            <g key={i}>
              {/* Planet marker dot */}
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="hsl(var(--background))"
              />
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="none"
                stroke={CHART_COLOR}
                strokeWidth={1}
                opacity={0.7}
              />
              {/* Planet icon or symbol */}
              {isSunOrMoon ? (
                <foreignObject
                  x={x - 8}
                  y={y - 8}
                  width={16}
                  height={16}
                >
                  <div className="flex items-center justify-center w-full h-full" style={{ color: CHART_COLOR }}>
                    {planet.label === 'Sun' ? (
                      <IconSun size={14} strokeWidth={1.5} />
                    ) : (
                      <IconMoon size={14} strokeWidth={1.5} />
                    )}
                  </div>
                </foreignObject>
              ) : (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={CHART_COLOR}
                  style={{ fontSize: '12px', fontFamily: 'serif' }}
                >
                  {planet.symbol}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Ascendant (AC) Marker */}
        <g>
          <line
            x1={center - innerCircle}
            y1={center}
            x2={center - outerRadius - 8}
            y2={center}
            stroke={CHART_COLOR}
            strokeWidth={1.5}
            opacity={0.8}
          />
          <text
            x={acPosition.x - 5}
            y={acPosition.y}
            textAnchor="end"
            dominantBaseline="central"
            fill={CHART_COLOR}
            style={{ 
              fontSize: '11px', 
              fontFamily: 'Source Serif 4, serif',
              letterSpacing: '0.05em'
            }}
          >
            AC
          </text>
        </g>
        
        {/* Midheaven (MC) Marker */}
        <g>
          <line
            x1={center}
            y1={center - innerCircle}
            x2={center}
            y2={center - outerRadius - 8}
            stroke={CHART_COLOR}
            strokeWidth={1.5}
            opacity={0.8}
          />
          <text
            x={mcPosition.x}
            y={mcPosition.y - 5}
            textAnchor="middle"
            dominantBaseline="auto"
            fill={CHART_COLOR}
            style={{ 
              fontSize: '11px', 
              fontFamily: 'Source Serif 4, serif',
              letterSpacing: '0.05em'
            }}
          >
            MC
          </text>
        </g>
        
        {/* Descendant (DC) marker - right side */}
        <text
          x={center + outerRadius + 15}
          y={center}
          textAnchor="start"
          dominantBaseline="central"
          fill={CHART_COLOR}
          opacity={0.6}
          style={{ 
            fontSize: '9px', 
            fontFamily: 'Source Serif 4, serif',
            letterSpacing: '0.05em'
          }}
        >
          DC
        </text>
        
        {/* Imum Coeli (IC) marker - bottom */}
        <text
          x={center}
          y={center + outerRadius + 18}
          textAnchor="middle"
          dominantBaseline="hanging"
          fill={CHART_COLOR}
          opacity={0.6}
          style={{ 
            fontSize: '9px', 
            fontFamily: 'Source Serif 4, serif',
            letterSpacing: '0.05em'
          }}
        >
          IC
        </text>
        
        {/* Center Point */}
        <circle
          cx={center}
          cy={center}
          r={3}
          fill={CHART_COLOR}
          opacity={0.6}
        />
      </svg>
    </div>
  );
};
