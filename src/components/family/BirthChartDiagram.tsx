import { useMemo, useState } from "react";
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
const CHART_COLOR = '#E0E0E0'; // Brighter for better readability

export const BirthChartDiagram = ({ 
  sunSign, 
  moonSign, 
  risingSign,
  sunDegree = 7,
  moonDegree = 15,
}: BirthChartDiagramProps) => {
  const size = 700;
  const center = size / 2;
  const outerRadius = 290;      // Larger outer ring
  const innerRadius = 245;      // Inner edge of zodiac ring
  const planetRing = 170;       // Where planets are placed - single radius for all
  
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

  // State for selected planet
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Get sign name from absolute degree
  const getSignFromDegree = (absDegree: number): ZodiacSign => {
    const signIndex = Math.floor(absDegree / 30) % 12;
    return ZODIAC_ORDER[signIndex];
  };

  // Get degree within sign (0-29)
  const getDegreeInSign = (absDegree: number): number => {
    return Math.floor(absDegree % 30);
  };

  // Calculate planet positions with snapped display angles
  const planets = useMemo(() => {
    const placements: { 
      symbol: string; 
      label: string; 
      displayAngle: number; // Snapped to center of sign
      trueAngle: number; // Actual position
      radius: number;
      sign: ZodiacSign;
      degree: number;
      house: number;
    }[] = [];
    
    // Sun position - snap to center of its sign
    const sunAbsDegree = signToAbsoluteDegree(sunSign, sunDegree);
    const sunSignCenter = ZODIAC_ORDER.indexOf(sunSign) * 30 + 15; // Center of sign
    const sunDisplayAngle = degreeToChartAngle(sunSignCenter, ascendantDegree);
    const sunTrueAngle = degreeToChartAngle(sunAbsDegree, ascendantDegree);
    placements.push({
      symbol: PLANET_SYMBOLS.sun,
      label: 'Sun',
      displayAngle: sunDisplayAngle,
      trueAngle: sunTrueAngle,
      radius: planetRing,
      sign: sunSign,
      degree: sunDegree,
      house: Math.floor((sunAbsDegree - ascendantDegree + 360) / 30) % 12 + 1,
    });
    
    // Moon position - snap to center of its sign
    if (moonSign) {
      const moonAbsDegree = signToAbsoluteDegree(moonSign, moonDegree);
      const moonSignCenter = ZODIAC_ORDER.indexOf(moonSign) * 30 + 15;
      const moonDisplayAngle = degreeToChartAngle(moonSignCenter, ascendantDegree);
      const moonTrueAngle = degreeToChartAngle(moonAbsDegree, ascendantDegree);
      placements.push({
        symbol: PLANET_SYMBOLS.moon,
        label: 'Moon',
        displayAngle: moonDisplayAngle,
        trueAngle: moonTrueAngle,
        radius: planetRing,
        sign: moonSign,
        degree: moonDegree,
        house: Math.floor((moonAbsDegree - ascendantDegree + 360) / 30) % 12 + 1,
      });
    }
    
    // Add other planets - also snapped
    const otherPlanets = [
      { symbol: PLANET_SYMBOLS.mercury, label: 'Mercury', offsetFromSun: 15 },
      { symbol: PLANET_SYMBOLS.venus, label: 'Venus', offsetFromSun: 45 },
      { symbol: PLANET_SYMBOLS.mars, label: 'Mars', offsetFromSun: 120 },
      { symbol: PLANET_SYMBOLS.jupiter, label: 'Jupiter', offsetFromSun: 180 },
      { symbol: PLANET_SYMBOLS.saturn, label: 'Saturn', offsetFromSun: 240 },
    ];
    
    otherPlanets.forEach((planet, idx) => {
      const trueAngle = sunTrueAngle + planet.offsetFromSun;
      // Convert angle back to absolute degree to find sign
      const absDeg = (ascendantDegree + (180 - trueAngle) + 360) % 360;
      const planetSign = getSignFromDegree(absDeg);
      const degInSign = getDegreeInSign(absDeg);
      const signCenter = ZODIAC_ORDER.indexOf(planetSign) * 30 + 15;
      const displayAngle = degreeToChartAngle(signCenter, ascendantDegree);
      
      placements.push({
        symbol: planet.symbol,
        label: planet.label,
        displayAngle,
        trueAngle,
        radius: planetRing,
        sign: planetSign,
        degree: degInSign,
        house: Math.floor((absDeg - ascendantDegree + 360) / 30) % 12 + 1,
      });
    });
    
    return placements;
  }, [sunSign, moonSign, sunDegree, moonDegree, ascendantDegree]);

  // Calculate aspect lines between planets
  const aspectLines = useMemo(() => {
    const aspects: { 
      x1: number; y1: number; x2: number; y2: number; 
      type: 'trine' | 'square' | 'opposition' | 'sextile';
    }[] = [];
    
    const aspectRadius = innerRadius - 20; // Draw aspects inside the inner circle
    
    // Check each pair of planets for aspects
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        // Calculate angular difference using true angles for accuracy
        let angleDiff = Math.abs(planet1.trueAngle - planet2.trueAngle) % 360;
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        
        // Determine aspect type with orb tolerance (±8°)
        let aspectType: 'trine' | 'square' | 'opposition' | 'sextile' | null = null;
        
        if (angleDiff >= 112 && angleDiff <= 128) {
          aspectType = 'trine'; // 120° ± 8°
        } else if (angleDiff >= 82 && angleDiff <= 98) {
          aspectType = 'square'; // 90° ± 8°
        } else if (angleDiff >= 172 && angleDiff <= 188) {
          aspectType = 'opposition'; // 180° ± 8°
        } else if (angleDiff >= 52 && angleDiff <= 68) {
          aspectType = 'sextile'; // 60° ± 8°
        }
        
        if (aspectType) {
          // Use display angles for visual positioning
          const angle1Rad = planet1.displayAngle * (Math.PI / 180);
          const angle2Rad = planet2.displayAngle * (Math.PI / 180);
          
          aspects.push({
            x1: center + Math.cos(angle1Rad) * aspectRadius,
            y1: center + Math.sin(angle1Rad) * aspectRadius,
            x2: center + Math.cos(angle2Rad) * aspectRadius,
            y2: center + Math.sin(angle2Rad) * aspectRadius,
            type: aspectType,
          });
        }
      }
    }
    
    return aspects;
  }, [planets, center, innerRadius]);

  // Generate house lines (12 divisions from inner to outer)
  const houseLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Start from top
      return {
        x1: center + Math.cos(angle) * innerRadius,
        y1: center + Math.sin(angle) * innerRadius,
        x2: center + Math.cos(angle) * outerRadius,
        y2: center + Math.sin(angle) * outerRadius,
        house: i + 1,
      };
    });
  }, [center, innerRadius, outerRadius]);

  // Generate zodiac sign positions (labels inside the ring like Co-Star - radial text)
  const zodiacPositions = useMemo(() => {
    return ZODIAC_ORDER.map((sign, i) => {
      // Position in the middle of each 30° segment
      const signDegree = i * 30 + 15;
      const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
      const angleRad = chartAngle * (Math.PI / 180);
      // Labels positioned in the middle of the ring
      const labelRadius = (outerRadius + innerRadius) / 2;
      
      return {
        sign,
        labelX: center + Math.cos(angleRad) * labelRadius,
        labelY: center + Math.sin(angleRad) * labelRadius,
        // Radial rotation - text reads outward from center
        labelRotation: chartAngle + 90,
      };
    });
  }, [ascendantDegree, center, outerRadius, innerRadius]);


  // Get selected planet details
  const selectedPlanetData = selectedPlanet 
    ? planets.find(p => p.label === selectedPlanet) 
    : null;

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="aspect-square w-full" onClick={() => setSelectedPlanet(null)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* Background Stars */}
        {stars.map((star, i) => (
          <BackgroundStar key={i} {...star} />
        ))}
        
        {/* Outer Circle (zodiac ring) */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1.5}
          opacity={0.9}
        />
        
        {/* Inner Circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.7}
        />
        
        {/* Aspect Lines */}
        {aspectLines.map((aspect, i) => {
          // Different styles for different aspect types
          const getAspectStyle = () => {
            switch (aspect.type) {
              case 'trine':
                return { strokeDasharray: 'none', opacity: 0.6 };
              case 'square':
                return { strokeDasharray: '4,4', opacity: 0.5 };
              case 'opposition':
                return { strokeDasharray: '8,4', opacity: 0.6 };
              case 'sextile':
                return { strokeDasharray: '2,2', opacity: 0.45 };
              default:
                return { strokeDasharray: 'none', opacity: 0.4 };
            }
          };
          
          const style = getAspectStyle();
          
          return (
            <line
              key={`aspect-${i}`}
              x1={aspect.x1}
              y1={aspect.y1}
              x2={aspect.x2}
              y2={aspect.y2}
              stroke={CHART_COLOR}
              strokeWidth={0.75}
              strokeDasharray={style.strokeDasharray}
              opacity={style.opacity}
            />
          );
        })}
        
        {/* Zodiac Section Divisions */}
        {Array.from({ length: 12 }, (_, i) => {
          const signDegree = i * 30;
          const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
          const angleRad = chartAngle * (Math.PI / 180);
          
          return (
            <line
              key={`zodiac-div-${i}`}
              x1={center + Math.cos(angleRad) * innerRadius}
              y1={center + Math.sin(angleRad) * innerRadius}
              x2={center + Math.cos(angleRad) * outerRadius}
              y2={center + Math.sin(angleRad) * outerRadius}
              stroke={CHART_COLOR}
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}
        
        {/* Zodiac Sign Labels (inside the ring like Co-Star) */}
        {zodiacPositions.map(({ sign, labelX, labelY, labelRotation }) => {
          // Rotate 180 degrees so text reads correctly from outside looking in
          const adjustedRotation = labelRotation + 180;
          
          return (
            <text
              key={`label-${sign}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={CHART_COLOR}
              opacity={1}
              style={{ 
                fontSize: '10px', 
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.08em',
                fontWeight: 500,
              }}
              transform={`rotate(${adjustedRotation}, ${labelX}, ${labelY})`}
            >
              {sign.toUpperCase()}
            </text>
          );
        })}
        
        {/* Planet Positions */}
        {planets.map((planet, i) => {
          const angleRad = planet.displayAngle * (Math.PI / 180);
          const x = center + Math.cos(angleRad) * planet.radius;
          const y = center + Math.sin(angleRad) * planet.radius;
          
          // Use Tabler icons for Sun and Moon, text symbols for others
          const isSunOrMoon = planet.label === 'Sun' || planet.label === 'Moon';
          const isSelected = selectedPlanet === planet.label;
          
          return (
            <g 
              key={i} 
              onClick={() => setSelectedPlanet(isSelected ? null : planet.label)}
              style={{ cursor: 'pointer' }}
            >
              {/* Planet symbol only - no circular outline */}
              {isSunOrMoon ? (
                <foreignObject
                  x={x - 10}
                  y={y - 10}
                  width={20}
                  height={20}
                >
                  <div 
                    className="flex items-center justify-center w-full h-full" 
                    style={{ 
                      color: CHART_COLOR,
                      opacity: isSelected ? 1 : 0.9 
                    }}
                  >
                    {planet.label === 'Sun' ? (
                      <IconSun size={18} strokeWidth={1.5} />
                    ) : (
                      <IconMoon size={18} strokeWidth={1.5} />
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
                  opacity={isSelected ? 1 : 0.9}
                  style={{ fontSize: '16px', fontFamily: 'serif' }}
                >
                  {planet.symbol}
                </text>
              )}
            </g>
          );
        })}
        
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
      
      {/* Selected Planet Detail */}
      <div 
        className="h-12 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: selectedPlanetData ? 1 : 0 }}
      >
        {selectedPlanetData && (
          <p 
            className="text-center"
            style={{ 
              color: CHART_COLOR, 
              fontFamily: 'Source Serif 4, serif',
              fontSize: '14px',
              letterSpacing: '0.02em'
            }}
          >
            {selectedPlanetData.label} — {selectedPlanetData.degree}° {selectedPlanetData.sign.charAt(0).toUpperCase() + selectedPlanetData.sign.slice(1)} · {selectedPlanetData.house}{getOrdinalSuffix(selectedPlanetData.house)} house
          </p>
        )}
      </div>
    </div>
  );
};

// Helper for ordinal suffix
const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
