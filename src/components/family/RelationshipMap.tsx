import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";

// Import zodiac SVG images
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

// Geometric position patterns based on family size
// All coordinates are normalized (0-1) and centered in the viewport
const GEOMETRIC_PATTERNS: Record<number, { x: number; y: number }[]> = {
  // 1 person - single point centered
  1: [
    { x: 0.50, y: 0.50 },
  ],
  // 2 people - horizontal line
  2: [
    { x: 0.30, y: 0.50 },
    { x: 0.70, y: 0.50 },
  ],
  // 3 people - Triangle/Bow shape
  3: [
    { x: 0.50, y: 0.35 }, // Top vertex
    { x: 0.25, y: 0.65 }, // Bottom left
    { x: 0.75, y: 0.65 }, // Bottom right
  ],
  // 4 people - Diamond with diagonals
  4: [
    { x: 0.50, y: 0.25 }, // Top
    { x: 0.25, y: 0.50 }, // Left
    { x: 0.75, y: 0.50 }, // Right
    { x: 0.50, y: 0.75 }, // Bottom
  ],
  // 5 people - Five-pointed star (pentagram)
  5: [
    { x: 0.50, y: 0.20 },  // Top
    { x: 0.20, y: 0.42 },  // Upper Left
    { x: 0.80, y: 0.42 },  // Upper Right
    { x: 0.30, y: 0.78 },  // Lower Left
    { x: 0.70, y: 0.78 },  // Lower Right
  ],
  // 6 people - Hexagon with complete internal web
  6: [
    { x: 0.32, y: 0.25 },  // Top Left
    { x: 0.68, y: 0.25 },  // Top Right
    { x: 0.15, y: 0.50 },  // Middle Left
    { x: 0.85, y: 0.50 },  // Middle Right
    { x: 0.32, y: 0.75 },  // Bottom Left
    { x: 0.68, y: 0.75 },  // Bottom Right
  ],
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
}

// Generate positions based on family size using geometric patterns
const getMemberPositions = (members: FamilyMember[]) => {
  const count = Math.min(members.length, 6);
  const pattern = GEOMETRIC_PATTERNS[count] || GEOMETRIC_PATTERNS[6];
  const positions: { member: FamilyMember; x: number; y: number }[] = [];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  sorted.forEach((member, idx) => {
    if (idx < pattern.length) {
      positions.push({
        member,
        x: pattern[idx].x,
        y: pattern[idx].y,
      });
    }
  });
  
  return positions;
};

// Generate random background stars for night sky effect
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 1 + Math.random() * 2, // 1-3px
      opacity: 0.40 + Math.random() * 0.30, // 40-70%
      animationDelay: Math.random() * 5, // 0-5s delay for twinkle
    });
  }
  return stars;
};

export const RelationshipMap = ({ members, constellationSign, selectedConnection, onConnectionTap }: RelationshipMapProps) => {
  const width = 420;
  const height = 480;
  const padding = 40;
  
  const memberPositions = useMemo(
    () => getMemberPositions(members), 
    [members]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(18), []);
  
  // Build connections - every member connects to every other member
  const connections = useMemo(() => {
    const conns: { 
      from: typeof memberPositions[0]; 
      to: typeof memberPositions[0];
    }[] = [];
    
    for (let i = 0; i < memberPositions.length; i++) {
      for (let j = i + 1; j < memberPositions.length; j++) {
        conns.push({ 
          from: memberPositions[i], 
          to: memberPositions[j],
        });
      }
    }
    
    return conns;
  }, [memberPositions]);

  const toPixelX = (normalized: number) => padding + normalized * (width - padding * 2);
  const toPixelY = (normalized: number) => padding + normalized * (height - padding * 2);

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
    <div className="w-full max-w-[480px] mx-auto px-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: '420px' }}>
        <defs>
          {/* Radial gradient background - deep blue-black center to pure black edge */}
          <radialGradient id="skyGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0a1128" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          
          {/* Glow filter for member nodes */}
          <filter id="memberGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle glow for connection hover/selected */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Ghost filter for zodiac background */}
          <filter id="zodiacGhostFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.12
                      0 0 0 0 0.10
                      0 0 0 0 0.15
                      0 0 0 0.18 0"
              result="colorized"
            />
          </filter>
          
          {/* Twinkle animation keyframes via CSS */}
          <style>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.7; }
            }
            .twinkle-star {
              animation: twinkle 4s ease-in-out infinite;
            }
          `}</style>
        </defs>
        
        {/* LAYER 1: Background gradient */}
        <rect 
          x="0" 
          y="0" 
          width={width} 
          height={height} 
          fill="url(#skyGradient)" 
        />
        
        {/* LAYER 2: Scattered background stars */}
        {backgroundStars.map((star, i) => (
          <circle
            key={`bg-star-${i}`}
            cx={star.x * width}
            cy={star.y * height}
            r={star.size}
            fill="#ffffff"
            className="twinkle-star"
            style={{ 
              animationDelay: `${star.animationDelay}s`,
              opacity: star.opacity 
            }}
          />
        ))}
        
        {/* LAYER 3: Zodiac illustration - ghost layer texture */}
        {(() => {
          const imageSize = Math.min(width, height) * 0.85;
          const imageX = (width - imageSize) / 2;
          const imageY = (height - imageSize) / 2;
          
          return (
            <image
              href={ZODIAC_IMAGES[constellationSign]}
              x={imageX}
              y={imageY}
              width={imageSize}
              height={imageSize}
              filter="url(#zodiacGhostFilter)"
              preserveAspectRatio="xMidYMid meet"
            />
          );
        })()}
        
        {/* LAYER 4: Connection lines - warm gold */}
        {connections.map((conn, connIdx) => {
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          
          const fromPx = toPixelX(conn.from.x);
          const fromPy = toPixelY(conn.from.y);
          const toPx = toPixelX(conn.to.x);
          const toPy = toPixelY(conn.to.y);
          
          const pathD = `M ${fromPx} ${fromPy} L ${toPx} ${toPy}`;
          
          return (
            <g key={`conn-${connIdx}`}>
              {/* Invisible hit area - 20px buffer */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth={24}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible connection line */}
              <path
                d={pathD}
                stroke="#C4A574"
                strokeWidth={isSelected ? 2 : 1.5}
                opacity={isSelected ? 0.9 : 0.6}
                fill="none"
                strokeLinecap="round"
                filter={isSelected ? "url(#lineGlow)" : undefined}
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* LAYER 5: Family member nodes */}
        {memberPositions.map(({ member, x, y }) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          const circleRadius = 28; // 56px diameter / 2
          
          return (
            <g key={member.id}>
              {/* Outer glow behind node */}
              <circle
                cx={px}
                cy={py}
                r={circleRadius + 8}
                fill="#C4A574"
                opacity={isInSelected ? 0.25 : 0.1}
                className="transition-all duration-300"
              />
              
              {/* Main circle - stroke only, no fill */}
              <circle
                cx={px}
                cy={py}
                r={circleRadius}
                fill="transparent"
                stroke="#C4A574"
                strokeWidth={2}
                filter={isInSelected ? "url(#memberGlow)" : undefined}
                className="transition-all duration-300"
              />
              
              {/* Zodiac symbol centered in circle */}
              {sign && (
                <g transform={`translate(${px - 11}, ${py - 11})`}>
                  <ZodiacIcon 
                    sign={sign} 
                    size={22} 
                    className={`transition-all duration-300 ${isInSelected ? 'text-[#C4A574]' : 'text-[#C4A574]/70'}`}
                  />
                </g>
              )}
              
              {/* Name label below circle */}
              <text
                x={px}
                y={py + circleRadius + 18}
                textAnchor="middle"
                fill={isInSelected ? "#C4A574" : "#999999"}
                style={{ 
                  fontSize: '14px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.05em',
                  fontWeight: 400
                }}
                className="transition-all duration-300"
              >
                {member.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Tap hint */}
      {!selectedConnection && (
        <p className="text-[11px] text-foreground/25 text-center mt-3 tracking-wide">
          Tap a connection to explore
        </p>
      )}
    </div>
  );
};
