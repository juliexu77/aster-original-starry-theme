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

// Strategic anchor points on each zodiac illustration for placing family members
// These positions are designed to integrate naturally with the mythological figures
const ZODIAC_ANCHOR_POINTS: Record<ZodiacSign, { x: number; y: number; label: string }[]> = {
  sagittarius: [
    { x: 0.52, y: 0.22, label: 'head' },        // Head of archer
    { x: 0.38, y: 0.38, label: 'bow-hand' },    // Hand holding bow
    { x: 0.62, y: 0.35, label: 'arrow' },       // Arrow tip
    { x: 0.50, y: 0.52, label: 'torso' },       // Center torso
    { x: 0.35, y: 0.68, label: 'horse-back' },  // Horse back
    { x: 0.65, y: 0.75, label: 'tail' },        // Horse tail
  ],
  aries: [
    { x: 0.55, y: 0.25, label: 'horn-1' },
    { x: 0.45, y: 0.25, label: 'horn-2' },
    { x: 0.50, y: 0.40, label: 'head' },
    { x: 0.50, y: 0.58, label: 'body' },
    { x: 0.35, y: 0.75, label: 'front-leg' },
    { x: 0.65, y: 0.75, label: 'back-leg' },
  ],
  taurus: [
    { x: 0.40, y: 0.28, label: 'horn-1' },
    { x: 0.60, y: 0.28, label: 'horn-2' },
    { x: 0.50, y: 0.42, label: 'head' },
    { x: 0.50, y: 0.60, label: 'body' },
    { x: 0.35, y: 0.78, label: 'front-leg' },
    { x: 0.65, y: 0.78, label: 'back-leg' },
  ],
  gemini: [
    { x: 0.35, y: 0.28, label: 'twin-1-head' },
    { x: 0.65, y: 0.28, label: 'twin-2-head' },
    { x: 0.35, y: 0.55, label: 'twin-1-body' },
    { x: 0.65, y: 0.55, label: 'twin-2-body' },
    { x: 0.50, y: 0.42, label: 'hands' },
    { x: 0.50, y: 0.75, label: 'feet' },
  ],
  cancer: [
    { x: 0.50, y: 0.30, label: 'shell-top' },
    { x: 0.30, y: 0.45, label: 'claw-1' },
    { x: 0.70, y: 0.45, label: 'claw-2' },
    { x: 0.50, y: 0.55, label: 'body' },
    { x: 0.35, y: 0.72, label: 'leg-1' },
    { x: 0.65, y: 0.72, label: 'leg-2' },
  ],
  leo: [
    { x: 0.50, y: 0.25, label: 'mane' },
    { x: 0.50, y: 0.42, label: 'head' },
    { x: 0.50, y: 0.58, label: 'body' },
    { x: 0.30, y: 0.70, label: 'front-paw' },
    { x: 0.70, y: 0.70, label: 'back-paw' },
    { x: 0.75, y: 0.55, label: 'tail' },
  ],
  virgo: [
    { x: 0.50, y: 0.22, label: 'head' },
    { x: 0.40, y: 0.38, label: 'shoulder' },
    { x: 0.60, y: 0.40, label: 'hand' },
    { x: 0.50, y: 0.55, label: 'waist' },
    { x: 0.45, y: 0.75, label: 'leg-1' },
    { x: 0.55, y: 0.75, label: 'leg-2' },
  ],
  libra: [
    { x: 0.50, y: 0.25, label: 'top' },
    { x: 0.30, y: 0.40, label: 'scale-1' },
    { x: 0.70, y: 0.40, label: 'scale-2' },
    { x: 0.50, y: 0.50, label: 'beam' },
    { x: 0.50, y: 0.68, label: 'stand' },
    { x: 0.50, y: 0.82, label: 'base' },
  ],
  scorpio: [
    { x: 0.45, y: 0.30, label: 'claw-1' },
    { x: 0.55, y: 0.30, label: 'claw-2' },
    { x: 0.50, y: 0.48, label: 'body' },
    { x: 0.60, y: 0.62, label: 'tail-mid' },
    { x: 0.70, y: 0.50, label: 'tail-curve' },
    { x: 0.75, y: 0.35, label: 'stinger' },
  ],
  capricorn: [
    { x: 0.45, y: 0.25, label: 'horn' },
    { x: 0.50, y: 0.38, label: 'head' },
    { x: 0.45, y: 0.55, label: 'body' },
    { x: 0.35, y: 0.72, label: 'front-leg' },
    { x: 0.60, y: 0.65, label: 'tail-start' },
    { x: 0.72, y: 0.78, label: 'tail-fin' },
  ],
  aquarius: [
    { x: 0.50, y: 0.22, label: 'head' },
    { x: 0.38, y: 0.40, label: 'shoulder' },
    { x: 0.62, y: 0.42, label: 'vessel' },
    { x: 0.50, y: 0.58, label: 'waist' },
    { x: 0.55, y: 0.72, label: 'water-1' },
    { x: 0.65, y: 0.82, label: 'water-2' },
  ],
  pisces: [
    { x: 0.35, y: 0.35, label: 'fish-1-head' },
    { x: 0.25, y: 0.50, label: 'fish-1-tail' },
    { x: 0.65, y: 0.55, label: 'fish-2-head' },
    { x: 0.75, y: 0.70, label: 'fish-2-tail' },
    { x: 0.50, y: 0.45, label: 'cord-mid' },
    { x: 0.50, y: 0.60, label: 'cord-end' },
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

// Assign members to zodiac anchor points
const getMemberPositionsOnZodiac = (members: FamilyMember[], sign: ZodiacSign) => {
  const anchors = ZODIAC_ANCHOR_POINTS[sign];
  const positions: { member: FamilyMember; x: number; y: number }[] = [];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  sorted.forEach((member, idx) => {
    if (idx < anchors.length) {
      positions.push({
        member,
        x: anchors[idx].x,
        y: anchors[idx].y,
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
      size: 0.5 + Math.random() * 1.2,
      opacity: 0.10 + Math.random() * 0.10,
    });
  }
  return stars;
};

export const RelationshipMap = ({ members, constellationSign, selectedConnection, onConnectionTap }: RelationshipMapProps) => {
  const width = 420;
  const height = 520;
  const padding = 20;
  
  const memberPositions = useMemo(
    () => getMemberPositionsOnZodiac(members, constellationSign), 
    [members, constellationSign]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(80), []); // More stars
  
  // Build connections - every member connects to every other member (direct lines)
  const connections = useMemo(() => {
    const conns: { 
      from: typeof memberPositions[0]; 
      to: typeof memberPositions[0];
    }[] = [];
    
    // Create connection between every pair of members
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
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: '400px' }}>
        <defs>
          {/* Glow filter for member nodes */}
          <filter id="memberGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle glow for stars */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#C4A574" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Constellation line gradient */}
          <linearGradient id="constLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A5650" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6A6660" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5A5650" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Night sky gradient - subtle twilight/dusk tones */}
          <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a12" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#0d0d18" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#12101a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#15121c" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* LAYER 1: Night sky background */}
        <rect 
          x="0" 
          y="0" 
          width={width} 
          height={height} 
          fill="url(#nightSkyGradient)" 
        />
        
        {/* Night sky scattered stars - tiny dots at varying sizes and opacities */}
        {backgroundStars.map((star, i) => (
          <circle
            key={`bg-star-${i}`}
            cx={star.x * width}
            cy={star.y * height}
            r={star.size}
            fill="#fff"
            opacity={star.opacity}
          />
        ))}
        
        {/* LAYER 2: Zodiac illustration - ghost layer texture */}
        {(() => {
          // Calculate 110% of full width, centered (will overflow)
          const imageWidth = width * 1.1;
          const imageHeight = height * 1.1;
          const imageX = (width - imageWidth) / 2;
          const imageY = (height - imageHeight) / 2;
          
          return (
            <>
              <defs>
                <filter id="zodiacGhostFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0.15
                            0 0 0 0 0.12
                            0 0 0 0 0.18
                            0 0 0 0.18 0"
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
              />
            </>
          );
        })()}
        
        {/* Family relationship connection lines - direct lines between all members */}
        {connections.map((conn, connIdx) => {
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          
          // Get pixel positions for from and to
          const fromPx = toPixelX(conn.from.x);
          const fromPy = toPixelY(conn.from.y);
          const toPx = toPixelX(conn.to.x);
          const toPy = toPixelY(conn.to.y);
          
          // Direct line between members
          const pathD = `M ${fromPx} ${fromPy} L ${toPx} ${toPy}`;
          
          return (
            <g key={`conn-${connIdx}`}>
              {/* Invisible hit area for the line */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth={30}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible line - thicker and more prominent */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#999"}
                strokeWidth={isSelected ? 3 : 2}
                opacity={isSelected ? 1 : 0.7}
                fill="none"
                strokeLinecap="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes - larger and more prominent */}
        {memberPositions.map(({ member, x, y }) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          return (
            <g key={member.id}>
              {/* Outer glow behind member node */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 24 : 18}
                fill="url(#starGlow)"
                opacity={isInSelected ? 0.9 : 0.5}
              />
              
              {/* Main member dot - larger and more prominent */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 10 : 8}
                fill={isInSelected ? "#D4A574" : "#bbb"}
                filter="url(#memberGlow)"
                className="transition-all duration-300"
              />
              
              {/* Inner bright core */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 4 : 3}
                fill={isInSelected ? "#fff" : "#ddd"}
                opacity={0.8}
                className="transition-all duration-300"
              />
              
              {/* Name label - larger and more readable */}
              <text
                x={px}
                y={py + 28}
                textAnchor="middle"
                fill={isInSelected ? "#D4A574" : "#999"}
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}
                className="transition-all duration-300"
              >
                {member.name}
              </text>
              
            </g>
          );
        })}
      </svg>
      
      {/* Tap hint - only show when no connection selected */}
      {!selectedConnection && (
        <p className="text-[11px] text-foreground/25 text-center mt-3 tracking-wide">
          Tap a connection to explore
        </p>
      )}
    </div>
  );
};
