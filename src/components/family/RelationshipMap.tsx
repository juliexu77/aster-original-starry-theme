import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";

// Import zodiac SVG images (constellation line art, no background)
import ariesImg from "@/assets/zodiac/aries.svg";
import taurusImg from "@/assets/zodiac/taurus.svg";
import geminiImg from "@/assets/zodiac/gemini.svg";
import cancerImg from "@/assets/zodiac/cancer.svg";
import leoImg from "@/assets/zodiac/leo.svg";
import virgoImg from "@/assets/zodiac/virgo.svg";
import libraImg from "@/assets/zodiac/libra.svg";
import scorpioImg from "@/assets/zodiac/scorpio.svg";
import sagittariusImg from "@/assets/zodiac/sagittarius.svg";
import capricornImg from "@/assets/zodiac/capricorn.svg";
import aquariusImg from "@/assets/zodiac/aquarius.svg";
import piscesImg from "@/assets/zodiac/pisces.svg";

const ZODIAC_IMAGES: Record<ZodiacSign, string> = {
  aries: ariesImg,
  taurus: taurusImg,
  gemini: geminiImg,
  cancer: cancerImg,
  leo: leoImg,
  virgo: virgoImg,
  libra: libraImg,
  scorpio: scorpioImg,
  sagittarius: sagittariusImg,
  capricorn: capricornImg,
  aquarius: aquariusImg,
  pisces: piscesImg,
};

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
  birth_time?: string | null;
  birth_location?: string | null;
}

interface RelationshipMapProps {
  members: FamilyMember[];
  constellationSign: ZodiacSign;
  selectedConnection: { from: FamilyMember; to: FamilyMember } | null;
  onConnectionTap: (from: FamilyMember, to: FamilyMember) => void;
  centerId?: string; // Optional: which member is the "focus" - defaults to first child
}

// Asymmetric orbital positions - deliberately uneven, no mirroring
// Angles are in radians, distances are in pixels from center (reduced to keep names from edge)
const ORBITAL_CONFIGS = [
  // For 2 members: center + one orbit
  [
    { angle: 0, distance: 0 }, // Center
    { angle: 0.7, distance: 120 },
  ],
  // For 3 members
  [
    { angle: 0, distance: 0 },
    { angle: 0.5, distance: 110 },
    { angle: 2.8, distance: 130 },
  ],
  // For 4 members
  [
    { angle: 0, distance: 0 },
    { angle: 0.6, distance: 105 },
    { angle: 1.9, distance: 135 },
    { angle: 3.8, distance: 115 },
  ],
  // For 5 members
  [
    { angle: 0, distance: 0 },
    { angle: 0.4, distance: 105 },
    { angle: 1.5, distance: 140 },
    { angle: 2.7, distance: 115 },
    { angle: 4.2, distance: 130 },
  ],
  // For 6 members
  [
    { angle: 0, distance: 0 },
    { angle: 0.5, distance: 100 },
    { angle: 1.3, distance: 135 },
    { angle: 2.4, distance: 110 },
    { angle: 3.5, distance: 145 },
    { angle: 4.8, distance: 120 },
  ],
];

// Get asymmetric orbital positions for members
const getOrbitalPositions = (
  members: FamilyMember[], 
  centerId: string | undefined,
  width: number,
  height: number
) => {
  if (members.length === 0) return [];
  
  const centerX = width * 0.50;
  const centerY = height * 0.50;
  
  // Find center member (first child, or specified centerId)
  let centerMember = members.find(m => m.id === centerId);
  if (!centerMember) {
    // Default: first child, or first member if no children
    centerMember = members.find(m => m.type === 'child') || members[0];
  }
  
  // Arrange others around the center
  const otherMembers = members.filter(m => m.id !== centerMember!.id);
  const configIndex = Math.min(members.length - 1, ORBITAL_CONFIGS.length - 1);
  const config = ORBITAL_CONFIGS[configIndex];
  
  const positions: { member: FamilyMember; x: number; y: number; isCenter: boolean }[] = [];
  
  // Center member
  positions.push({
    member: centerMember,
    x: centerX,
    y: centerY,
    isCenter: true,
  });
  
  // Orbital members
  otherMembers.forEach((member, idx) => {
    const orbital = config[idx + 1]; // +1 because config[0] is center
    if (orbital) {
      // Add slight randomization to break any remaining patterns
      const jitterAngle = (Math.sin(member.id.charCodeAt(0) * 0.5) * 0.15);
      const jitterDist = (Math.cos(member.id.charCodeAt(1) * 0.3) * 10);
      
      const angle = orbital.angle + jitterAngle;
      const distance = orbital.distance + jitterDist;
      
      positions.push({
        member,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        isCenter: false,
      });
    }
  });
  
  return positions;
};

// Generate Bezier curve path between two points with gravitational pull toward center
const generateCurvedPath = (
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number,
  centerX: number,
  centerY: number,
  involvesCenter: boolean,
  pairIndex: number
): string => {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  
  // Distance between points
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Perpendicular direction for curve
  const perpX = -dy / dist;
  const perpY = dx / dist;
  
  // Vary curvature based on pair index and whether it involves center
  const baseCurvature = involvesCenter ? 0.12 : 0.22;
  const curvatureVariation = Math.sin(pairIndex * 1.7) * 0.08;
  const curvature = (baseCurvature + curvatureVariation) * dist;
  
  // Pull slightly toward center for gravitational effect
  const pullToCenterX = (centerX - midX) * 0.1;
  const pullToCenterY = (centerY - midY) * 0.1;
  
  // Control point
  const cpX = midX + perpX * curvature + pullToCenterX;
  const cpY = midY + perpY * curvature + pullToCenterY;
  
  return `M ${fromX} ${fromY} Q ${cpX} ${cpY} ${toX} ${toY}`;
};

// Generate random background stars for night sky effect with varied sizes and brightness
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = Math.random();
    let size: number;
    let hasFlare = false;
    
    if (sizeRoll > 0.97) {
      size = 1.8 + Math.random() * 1.2;
      hasFlare = true;
    } else if (sizeRoll > 0.85) {
      size = 1.0 + Math.random() * 0.8;
    } else {
      size = 0.3 + Math.random() * 0.6;
    }
    
    const brightnessRoll = Math.random();
    let opacity: number;
    if (brightnessRoll > 0.9) {
      opacity = 0.35 + Math.random() * 0.25;
    } else if (brightnessRoll > 0.5) {
      opacity = 0.15 + Math.random() * 0.15;
    } else {
      opacity = 0.06 + Math.random() * 0.08;
    }
    
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size,
      opacity,
      hasFlare,
    });
  }
  return stars;
};

export const RelationshipMap = ({ 
  members, 
  constellationSign, 
  selectedConnection, 
  onConnectionTap,
  centerId 
}: RelationshipMapProps) => {
  const width = 400;
  const height = 400;
  const centerX = width * 0.50;
  const centerY = height * 0.50;
  
  const memberPositions = useMemo(
    () => getOrbitalPositions(members, centerId, width, height), 
    [members, centerId, width, height]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(80), []);
  
  // Build connections - every member connects to every other member (curved)
  const connections = useMemo(() => {
    const conns: { 
      from: typeof memberPositions[0]; 
      to: typeof memberPositions[0];
      involvesCenter: boolean;
      pairIndex: number;
    }[] = [];
    
    let pairIdx = 0;
    for (let i = 0; i < memberPositions.length; i++) {
      for (let j = i + 1; j < memberPositions.length; j++) {
        const involvesCenter = memberPositions[i].isCenter || memberPositions[j].isCenter;
        conns.push({ 
          from: memberPositions[i], 
          to: memberPositions[j],
          involvesCenter,
          pairIndex: pairIdx++,
        });
      }
    }
    
    return conns;
  }, [memberPositions]);

  const getMemberSign = (member: FamilyMember): ZodiacSign | null => {
    return getZodiacFromBirthday(member.birthday);
  };

  const isConnectionSelected = (from: FamilyMember, to: FamilyMember) => {
    if (!selectedConnection) return false;
    return (
      (selectedConnection.from.id === from.id && selectedConnection.to.id === to.id) ||
      (selectedConnection.from.id === to.id && selectedConnection.to.id === from.id)
    );
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[13px] text-foreground/40">
          Add family members to see your constellation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {/* Instruction text */}
      <p className="text-center text-[11px] text-foreground/40 tracking-wider mb-2">
        Tap a connection to explore
      </p>
      
      <div className="aspect-square w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          {/* Enhanced glow filter for member nodes with halo */}
          <filter id="memberGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="innerBlur" />
            <feGaussianBlur stdDeviation="12" result="outerBlur" />
            <feGaussianBlur stdDeviation="25" result="haloBlur" />
            <feMerge>
              <feMergeNode in="haloBlur" />
              <feMergeNode in="outerBlur" />
              <feMergeNode in="innerBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Primary node halo (center/focus) - brighter */}
          <radialGradient id="primaryNodeHalo">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#D4A574" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Secondary node halo */}
          <radialGradient id="nodeHalo">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#D4A574" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Star glow */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#D4A574" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Primary star glow - brighter for center */}
          <radialGradient id="primaryStarGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#D4A574" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Lens flare filter */}
          <filter id="starFlare" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur1" />
            <feGaussianBlur stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Glow for connection lines */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
        </defs>
        
        {/* SVG is transparent - background handled by parent container */}
        
        {/* Background stars */}
        {backgroundStars.map((star, i) => (
          <g key={`bg-star-${i}`}>
            <circle
              cx={star.x * width}
              cy={star.y * height}
              r={star.size}
              fill="#fff"
              opacity={star.opacity}
              filter={star.hasFlare ? "url(#starFlare)" : undefined}
            />
            {star.hasFlare && (
              <>
                <rect
                  x={star.x * width - star.size * 6}
                  y={star.y * height - star.size * 0.15}
                  width={star.size * 12}
                  height={star.size * 0.3}
                  fill="#fff"
                  opacity={star.opacity * 0.4}
                  rx={star.size * 0.15}
                />
                <rect
                  x={star.x * width - star.size * 0.15}
                  y={star.y * height - star.size * 6}
                  width={star.size * 0.3}
                  height={star.size * 12}
                  fill="#fff"
                  opacity={star.opacity * 0.4}
                  rx={star.size * 0.15}
                />
              </>
            )}
          </g>
        ))}
        
        {/* LAYER 2: Zodiac watermark - subtle ethereal texture */}
        {(() => {
          const imageWidth = width * 1.0;
          const imageHeight = height * 1.0;
          const imageX = (width - imageWidth) / 2;
          const imageY = (height - imageHeight) / 2;
          
          return (
            <>
              <defs>
                <filter id="zodiacGhostFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0.18
                            0 0 0 0 0.15
                            0 0 0 0 0.22
                            0 0 0 0.15 0"
                    result="colorized"
                  />
                </filter>
              </defs>
              <image
                href={ZODIAC_IMAGES[constellationSign]}
                x={imageX}
                y={imageY}
                width={imageWidth}
                height={imageHeight}
                filter="url(#zodiacGhostFilter)"
                preserveAspectRatio="xMidYMid meet"
                style={{ mixBlendMode: 'screen' }}
              />
            </>
          );
        })()}
        
        {/* Connection lines - curved Bezier arcs */}
        {connections.map((conn, connIdx) => {
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          const { involvesCenter, pairIndex } = conn;
          
          // Generate curved path
          const pathD = generateCurvedPath(
            conn.from.x,
            conn.from.y,
            conn.to.x,
            conn.to.y,
            centerX,
            centerY,
            involvesCenter,
            pairIndex
          );
          
          // Line styling based on connection type
          const baseStrokeWidth = involvesCenter ? 1.2 : 0.6;
          const baseOpacity = involvesCenter ? 0.55 : 0.35;
          const glowStrokeWidth = involvesCenter ? 4 : 2.5;
          const glowOpacity = involvesCenter ? 0.20 : 0.10;
          
          return (
            <g key={`conn-${connIdx}`}>
              {/* Invisible hit area */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth={30}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Glow layer */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#888"}
                strokeWidth={isSelected ? 5 : glowStrokeWidth}
                opacity={isSelected ? 0.35 : glowOpacity}
                fill="none"
                strokeLinecap="round"
                filter="url(#lineGlow)"
                className="pointer-events-none"
              />
              {/* Visible line */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#aaa"}
                strokeWidth={isSelected ? 1.8 : baseStrokeWidth}
                opacity={isSelected ? 0.95 : baseOpacity}
                fill="none"
                strokeLinecap="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes */}
        {memberPositions.map(({ member, x, y, isCenter }, idx) => {
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          // Size multipliers: center node is 15% larger, 20% brighter
          const sizeMultiplier = isCenter ? 1.15 : 1.0;
          const brightnessMultiplier = isCenter ? 1.2 : 1.0;
          
          const animDelay = idx * 0.15;
          
          // Node sizes
          const haloRadius = (isInSelected ? 34 : 28) * sizeMultiplier;
          const glowRadius = (isInSelected ? 20 : 15) * sizeMultiplier;
          const coreRadius = (isInSelected ? 6.5 : 5.5) * sizeMultiplier;
          const innerRadius = (isInSelected ? 3.2 : 2.8) * sizeMultiplier;
          
          return (
            <g key={member.id}>
              {/* Outer soft white halo */}
              <circle
                cx={x}
                cy={y}
                r={haloRadius}
                fill={isCenter ? "url(#primaryNodeHalo)" : "url(#nodeHalo)"}
                opacity={(isInSelected ? 1 : 0.7) * brightnessMultiplier}
                className="animate-node-pulse"
                style={{ animationDelay: `${animDelay}s` }}
              />
              
              {/* Secondary glow ring */}
              <circle
                cx={x}
                cy={y}
                r={glowRadius}
                fill={isCenter ? "url(#primaryStarGlow)" : "url(#starGlow)"}
                opacity={(isInSelected ? 0.95 : 0.6) * brightnessMultiplier}
              />
              
              {/* Main member dot */}
              <circle
                cx={x}
                cy={y}
                r={coreRadius}
                fill={isInSelected || isCenter ? "#fff" : "#e8e8e8"}
                filter="url(#memberGlow)"
                className="transition-all duration-300"
              />
              
              {/* Inner brilliant core */}
              <circle
                cx={x}
                cy={y}
                r={innerRadius}
                fill="#fff"
                opacity={Math.min(1, (isInSelected ? 1 : 0.9) * brightnessMultiplier)}
                className="transition-all duration-300"
              />
              
              {/* Name label - split into multiple lines if needed */}
              {(() => {
                const nameParts = member.name.split(' ');
                const maxCharsPerLine = 10;
                let lines: string[] = [];
                
                if (member.name.length <= maxCharsPerLine) {
                  lines = [member.name];
                } else if (nameParts.length >= 2) {
                  // Split by words
                  lines = [nameParts[0], nameParts.slice(1).join(' ')];
                } else {
                  // Single long word - just use it
                  lines = [member.name];
                }
                
                return lines.map((line, lineIndex) => (
                  <text
                    key={lineIndex}
                    x={x}
                    y={y + 26 * sizeMultiplier + (lineIndex * 12)}
                    textAnchor="middle"
                    fill={isInSelected ? "#D4A574" : isCenter ? "#c8c8c8" : "#aaa"}
                    style={{ 
                      fontSize: '11px', 
                      fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 500
                    }}
                    className="transition-all duration-300"
                  >
                    {line}
                  </text>
                ));
              })()}
            </g>
          );
        })}
      </svg>
      </div>
      
      {/* Tap hint */}
      {!selectedConnection && (
        <p className="text-[11px] text-foreground/25 text-center mt-3 tracking-wide">
          Tap a connection to explore
        </p>
      )}
    </div>
  );
};
