import { useMemo, useState } from "react";
import { ZodiacSign, ZODIAC_DATA } from "@/lib/zodiac";
import { calculateBirthChart, getWholeSignHouse, BirthChartData, PlanetPosition } from "@/lib/ephemeris";
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
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

interface BirthChartDiagramProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  // Birth data for ephemeris calculations
  birthday?: string | null;
  birthTime?: string | null;
  birthLocation?: string | null;
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
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '⛢',
  Neptune: '♆',
  Pluto: '♇',
};

// Planet meanings for tooltips
const PLANET_MEANINGS: Record<string, { keyword: string; description: string }> = {
  Sun: { keyword: 'Identity', description: 'Core self, ego, and vitality' },
  Moon: { keyword: 'Emotions', description: 'Inner world, instincts, and needs' },
  Mercury: { keyword: 'Mind', description: 'Communication, thinking, and learning' },
  Venus: { keyword: 'Love', description: 'Values, beauty, and relationships' },
  Mars: { keyword: 'Drive', description: 'Action, energy, and assertion' },
  Jupiter: { keyword: 'Growth', description: 'Expansion, luck, and wisdom' },
  Saturn: { keyword: 'Structure', description: 'Discipline, limits, and lessons' },
  Uranus: { keyword: 'Change', description: 'Innovation, rebellion, and freedom' },
  Neptune: { keyword: 'Dreams', description: 'Intuition, imagination, and spirituality' },
  Pluto: { keyword: 'Power', description: 'Transformation, depth, and rebirth' },
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
const CHART_COLOR = '#E0E0E0';

export const BirthChartDiagram = ({ 
  sunSign, 
  moonSign, 
  risingSign,
  birthday,
  birthTime,
  birthLocation,
}: BirthChartDiagramProps) => {
  const size = 700;
  const center = size / 2;
  const outerRadius = 290;
  const zodiacInnerRadius = 245;
  const planetRing = 232;
  
  // Calculate birth chart using ephemeris when birth data is available
  const birthChart = useMemo((): BirthChartData | null => {
    if (!birthday || !birthTime) {
      return null;
    }
    return calculateBirthChart(birthday, birthTime, birthLocation);
  }, [birthday, birthTime, birthLocation]);
  
  // Calculate ascendant degree
  const ascendantDegree = useMemo(() => {
    // Use ephemeris ascendant if available
    if (birthChart) {
      return birthChart.ascendantDegree;
    }
    // Fallback to sign-based calculation
    if (!risingSign) return 0;
    return ZODIAC_ORDER.indexOf(risingSign) * 30;
  }, [birthChart, risingSign]);

  // Generate background stars
  const stars = useMemo(() => {
    const starList: StarProps[] = [];
    const seed = 12345;
    
    for (let i = 0; i < 40; i++) {
      const angle = ((seed * (i + 1)) % 360) * (Math.PI / 180);
      const distance = 275 + ((seed * (i + 2)) % 25);
      const cx = center + Math.cos(angle) * distance;
      const cy = center + Math.sin(angle) * distance;
      
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
  const [selectedPlanet, setSelectedPlanet] = useState<{ name: string; x: number; y: number } | null>(null);

  // Calculate planet positions using real ephemeris data
  const planets = useMemo(() => {
    const placements: { 
      symbol: string; 
      label: string; 
      angle: number;
      sign: ZodiacSign;
      degree: number;
      house: number;
      isRetrograde: boolean;
    }[] = [];
    
    // Determine ascendant sign for house calculations
    const ascSign = birthChart?.ascendantSign ?? risingSign ?? 'aries';
    
    if (birthChart) {
      // Use real ephemeris data
      const planetList: PlanetPosition[] = [
        birthChart.sun,
        birthChart.moon,
        birthChart.mercury,
        birthChart.venus,
        birthChart.mars,
        birthChart.jupiter,
        birthChart.saturn,
        birthChart.uranus,
        birthChart.neptune,
        birthChart.pluto,
      ];
      
      planetList.forEach((planet) => {
        const chartAngle = degreeToChartAngle(planet.longitude, ascendantDegree);
        const house = getWholeSignHouse(planet.longitude, ascSign);
        
        placements.push({
          symbol: PLANET_SYMBOLS[planet.name] || '?',
          label: planet.name,
          angle: chartAngle,
          sign: planet.sign,
          degree: Math.floor(planet.degreeInSign),
          house,
          isRetrograde: planet.isRetrograde,
        });
      });
    } else {
      // Fallback: Only show Sun and Moon with sign-based positions
      const signToAbsoluteDegree = (sign: ZodiacSign, degree: number): number => {
        const signIndex = ZODIAC_ORDER.indexOf(sign);
        return signIndex * 30 + degree;
      };
      
      // Sun
      const sunAbsDegree = signToAbsoluteDegree(sunSign, 15);
      const sunChartAngle = degreeToChartAngle(sunAbsDegree, ascendantDegree);
      placements.push({
        symbol: PLANET_SYMBOLS.Sun,
        label: 'Sun',
        angle: sunChartAngle,
        sign: sunSign,
        degree: 15,
        house: getWholeSignHouse(sunAbsDegree, ascSign),
        isRetrograde: false,
      });
      
      // Moon (if available)
      if (moonSign) {
        const moonAbsDegree = signToAbsoluteDegree(moonSign, 15);
        const moonChartAngle = degreeToChartAngle(moonAbsDegree, ascendantDegree);
        placements.push({
          symbol: PLANET_SYMBOLS.Moon,
          label: 'Moon',
          angle: moonChartAngle,
          sign: moonSign,
          degree: 15,
          house: getWholeSignHouse(moonAbsDegree, ascSign),
          isRetrograde: false,
        });
      }
    }
    
    return placements;
  }, [birthChart, sunSign, moonSign, risingSign, ascendantDegree]);

  // Calculate aspect lines between planets
  const aspectLines = useMemo(() => {
    const aspects: { 
      x1: number; y1: number; x2: number; y2: number; 
      type: 'trine' | 'square' | 'opposition' | 'sextile';
    }[] = [];
    
    const aspectRadius = planetRing - 30;
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        let angleDiff = Math.abs(planet1.angle - planet2.angle) % 360;
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        
        let aspectType: 'trine' | 'square' | 'opposition' | 'sextile' | null = null;
        
        if (angleDiff >= 112 && angleDiff <= 128) {
          aspectType = 'trine';
        } else if (angleDiff >= 82 && angleDiff <= 98) {
          aspectType = 'square';
        } else if (angleDiff >= 172 && angleDiff <= 188) {
          aspectType = 'opposition';
        } else if (angleDiff >= 52 && angleDiff <= 68) {
          aspectType = 'sextile';
        }
        
        if (aspectType) {
          const angle1Rad = planet1.angle * (Math.PI / 180);
          const angle2Rad = planet2.angle * (Math.PI / 180);
          
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
  }, [planets, center, planetRing]);

  // Generate zodiac sign positions (curved text)
  const zodiacPositions = useMemo(() => {
    return ZODIAC_ORDER.map((sign, i) => {
      const signDegree = i * 30 + 15;
      const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
      const angleRad = chartAngle * (Math.PI / 180);
      const labelRadius = (outerRadius + zodiacInnerRadius) / 2;
      
      const normalizedAngle = ((chartAngle % 360) + 360) % 360;
      const isBottomHalf = normalizedAngle > 0 && normalizedAngle < 180;
      
      const textRotation = isBottomHalf 
        ? chartAngle - 90
        : chartAngle + 90;
      
      return {
        sign,
        labelX: center + Math.cos(angleRad) * labelRadius,
        labelY: center + Math.sin(angleRad) * labelRadius,
        textRotation,
      };
    });
  }, [ascendantDegree, center, outerRadius, zodiacInnerRadius]);

  // Get selected planet details
  const selectedPlanetData = selectedPlanet 
    ? planets.find(p => p.label === selectedPlanet.name) 
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
        
        {/* Inner Circle (inner edge of zodiac ring) */}
        <circle
          cx={center}
          cy={center}
          r={zodiacInnerRadius}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={1}
          opacity={0.7}
        />
        
        {/* Aspect Lines - subtle */}
        {aspectLines.map((aspect, i) => (
          <line
            key={`aspect-${i}`}
            x1={aspect.x1}
            y1={aspect.y1}
            x2={aspect.x2}
            y2={aspect.y2}
            stroke={CHART_COLOR}
            strokeWidth={0.5}
            opacity={0.25}
          />
        ))}
        
        {/* Zodiac Section Divisions */}
        {Array.from({ length: 12 }, (_, i) => {
          const signDegree = i * 30;
          const chartAngle = degreeToChartAngle(signDegree, ascendantDegree);
          const angleRad = chartAngle * (Math.PI / 180);
          
          return (
            <line
              key={`zodiac-div-${i}`}
              x1={center + Math.cos(angleRad) * zodiacInnerRadius}
              y1={center + Math.sin(angleRad) * zodiacInnerRadius}
              x2={center + Math.cos(angleRad) * outerRadius}
              y2={center + Math.sin(angleRad) * outerRadius}
              stroke={CHART_COLOR}
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}
        
        {/* Zodiac Sign Labels */}
        {zodiacPositions.map(({ sign, labelX, labelY, textRotation }) => (
          <text
            key={`label-${sign}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFFFFF"
            opacity={0.95}
            style={{ 
              fontSize: '12px', 
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.1em',
              fontWeight: 500,
            }}
            transform={`rotate(${textRotation}, ${labelX}, ${labelY})`}
          >
            {sign.toUpperCase()}
          </text>
        ))}
        
        {/* Planet Positions */}
        {planets.map((planet, i) => {
          const angleRad = planet.angle * (Math.PI / 180);
          const x = center + Math.cos(angleRad) * planetRing;
          const y = center + Math.sin(angleRad) * planetRing;
          
          const isSelected = selectedPlanet?.name === planet.label;
          
          return (
            <g 
              key={i} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlanet(isSelected ? null : { name: planet.label, x, y });
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Invisible hit area */}
              <circle
                cx={x}
                cy={y}
                r={24}
                fill="transparent"
              />
              
              {/* Planet symbol */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? '#FFFFFF' : '#F0F0F0'}
                style={{ 
                  fontSize: '30px', 
                  fontFamily: 'serif',
                  pointerEvents: 'none',
                  transition: 'fill 0.2s ease',
                }}
              >
                {planet.symbol}
              </text>
              
              {/* Retrograde indicator */}
              {planet.isRetrograde && (
                <text
                  x={x + 14}
                  y={y - 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#F0F0F0"
                  opacity={0.7}
                  style={{ 
                    fontSize: '12px', 
                    fontFamily: 'serif',
                    pointerEvents: 'none',
                  }}
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}
        
        {/* Popup tooltip for selected planet */}
        {selectedPlanet && selectedPlanetData && (() => {
          const tooltipWidth = 200;
          const tooltipHeight = 100;
          const padding = 12;
          
          const meaning = PLANET_MEANINGS[selectedPlanetData.label] || { keyword: '', description: '' };
          
          let tooltipX = selectedPlanet.x - tooltipWidth / 2;
          let tooltipY = selectedPlanet.y - tooltipHeight - padding - 20;
          let pointerAtTop = false;
          
          if (tooltipX < 10) tooltipX = 10;
          if (tooltipX + tooltipWidth > size - 10) tooltipX = size - tooltipWidth - 10;
          if (tooltipY < 10) {
            tooltipY = selectedPlanet.y + padding + 20;
            pointerAtTop = true;
          }
          
          return (
            <g>
              {/* Pointer triangle */}
              {pointerAtTop && (
                <polygon
                  points={`
                    ${selectedPlanet.x - 8},${tooltipY} 
                    ${selectedPlanet.x + 8},${tooltipY} 
                    ${selectedPlanet.x},${tooltipY - 10}
                  `}
                  fill="rgba(20, 20, 25, 0.95)"
                />
              )}
              
              {/* Tooltip background */}
              <rect
                x={tooltipX}
                y={tooltipY}
                width={tooltipWidth}
                height={tooltipHeight}
                rx={10}
                ry={10}
                fill="rgba(20, 20, 25, 0.95)"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth={1}
              />
              
              {!pointerAtTop && (
                <polygon
                  points={`
                    ${selectedPlanet.x - 8},${tooltipY + tooltipHeight} 
                    ${selectedPlanet.x + 8},${tooltipY + tooltipHeight} 
                    ${selectedPlanet.x},${tooltipY + tooltipHeight + 10}
                  `}
                  fill="rgba(20, 20, 25, 0.95)"
                />
              )}
              
              {/* Planet name and keyword */}
              <text
                x={tooltipX + tooltipWidth / 2}
                y={tooltipY + 24}
                textAnchor="middle"
                fill="#FFFFFF"
                style={{ 
                  fontSize: '16px', 
                  fontFamily: 'Source Serif 4, serif',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}
              >
                {selectedPlanetData.label} · {meaning.keyword}
              </text>
              
              {/* Planet description */}
              <text
                x={tooltipX + tooltipWidth / 2}
                y={tooltipY + 46}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.6)"
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'DM Sans, sans-serif',
                  fontStyle: 'italic',
                  letterSpacing: '0.02em'
                }}
              >
                {meaning.description}
              </text>
              
              {/* Divider line */}
              <line
                x1={tooltipX + 16}
                y1={tooltipY + 60}
                x2={tooltipX + tooltipWidth - 16}
                y2={tooltipY + 60}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={1}
              />
              
              {/* Position details */}
              <text
                x={tooltipX + tooltipWidth / 2}
                y={tooltipY + 82}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.85)"
                style={{ 
                  fontSize: '13px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.03em'
                }}
              >
                {selectedPlanetData.degree}° {selectedPlanetData.sign.charAt(0).toUpperCase() + selectedPlanetData.sign.slice(1)}{selectedPlanetData.isRetrograde ? ' ℞' : ''} · {selectedPlanetData.house}{getOrdinalSuffix(selectedPlanetData.house)} House
              </text>
            </g>
          );
        })()}
        
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
    </div>
  );
};

// Helper for ordinal suffix
const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
