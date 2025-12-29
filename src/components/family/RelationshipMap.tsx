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
    { x: 0.50, y: 0.08, label: 'head' },        // Head of archer - top
    { x: 0.15, y: 0.35, label: 'bow-hand' },    // Hand holding bow - far left
    { x: 0.85, y: 0.28, label: 'arrow' },       // Arrow tip - far right
    { x: 0.50, y: 0.50, label: 'torso' },       // Center torso
    { x: 0.18, y: 0.75, label: 'horse-back' },  // Horse back - bottom left
    { x: 0.82, y: 0.88, label: 'tail' },        // Horse tail - bottom right
  ],
  aries: [
    { x: 0.70, y: 0.10, label: 'horn-1' },
    { x: 0.30, y: 0.10, label: 'horn-2' },
    { x: 0.50, y: 0.35, label: 'head' },
    { x: 0.50, y: 0.55, label: 'body' },
    { x: 0.15, y: 0.85, label: 'front-leg' },
    { x: 0.85, y: 0.85, label: 'back-leg' },
  ],
  taurus: [
    { x: 0.20, y: 0.12, label: 'horn-1' },
    { x: 0.80, y: 0.12, label: 'horn-2' },
    { x: 0.50, y: 0.38, label: 'head' },
    { x: 0.50, y: 0.58, label: 'body' },
    { x: 0.15, y: 0.88, label: 'front-leg' },
    { x: 0.85, y: 0.88, label: 'back-leg' },
  ],
  gemini: [
    { x: 0.18, y: 0.15, label: 'twin-1-head' },
    { x: 0.82, y: 0.15, label: 'twin-2-head' },
    { x: 0.18, y: 0.60, label: 'twin-1-body' },
    { x: 0.82, y: 0.60, label: 'twin-2-body' },
    { x: 0.50, y: 0.38, label: 'hands' },
    { x: 0.50, y: 0.88, label: 'feet' },
  ],
  cancer: [
    { x: 0.50, y: 0.10, label: 'shell-top' },
    { x: 0.12, y: 0.40, label: 'claw-1' },
    { x: 0.88, y: 0.40, label: 'claw-2' },
    { x: 0.50, y: 0.55, label: 'body' },
    { x: 0.20, y: 0.85, label: 'leg-1' },
    { x: 0.80, y: 0.85, label: 'leg-2' },
  ],
  leo: [
    { x: 0.50, y: 0.08, label: 'mane' },
    { x: 0.50, y: 0.35, label: 'head' },
    { x: 0.50, y: 0.55, label: 'body' },
    { x: 0.12, y: 0.78, label: 'front-paw' },
    { x: 0.88, y: 0.78, label: 'back-paw' },
    { x: 0.85, y: 0.45, label: 'tail' },
  ],
  virgo: [
    { x: 0.50, y: 0.08, label: 'head' },
    { x: 0.18, y: 0.32, label: 'shoulder' },
    { x: 0.82, y: 0.35, label: 'hand' },
    { x: 0.50, y: 0.55, label: 'waist' },
    { x: 0.25, y: 0.88, label: 'leg-1' },
    { x: 0.75, y: 0.88, label: 'leg-2' },
  ],
  libra: [
    { x: 0.50, y: 0.08, label: 'top' },
    { x: 0.12, y: 0.35, label: 'scale-1' },
    { x: 0.88, y: 0.35, label: 'scale-2' },
    { x: 0.50, y: 0.50, label: 'beam' },
    { x: 0.50, y: 0.72, label: 'stand' },
    { x: 0.50, y: 0.92, label: 'base' },
  ],
  scorpio: [
    { x: 0.25, y: 0.15, label: 'claw-1' },
    { x: 0.60, y: 0.15, label: 'claw-2' },
    { x: 0.40, y: 0.45, label: 'body' },
    { x: 0.55, y: 0.68, label: 'tail-mid' },
    { x: 0.75, y: 0.55, label: 'tail-curve' },
    { x: 0.88, y: 0.25, label: 'stinger' },
  ],
  capricorn: [
    { x: 0.25, y: 0.10, label: 'horn' },
    { x: 0.50, y: 0.30, label: 'head' },
    { x: 0.35, y: 0.55, label: 'body' },
    { x: 0.15, y: 0.82, label: 'front-leg' },
    { x: 0.65, y: 0.65, label: 'tail-start' },
    { x: 0.88, y: 0.88, label: 'tail-fin' },
  ],
  aquarius: [
    { x: 0.50, y: 0.08, label: 'head' },
    { x: 0.15, y: 0.35, label: 'shoulder' },
    { x: 0.80, y: 0.38, label: 'vessel' },
    { x: 0.50, y: 0.58, label: 'waist' },
    { x: 0.60, y: 0.78, label: 'water-1' },
    { x: 0.85, y: 0.92, label: 'water-2' },
  ],
  pisces: [
    { x: 0.20, y: 0.22, label: 'fish-1-head' },
    { x: 0.08, y: 0.50, label: 'fish-1-tail' },
    { x: 0.80, y: 0.55, label: 'fish-2-head' },
    { x: 0.92, y: 0.80, label: 'fish-2-tail' },
    { x: 0.50, y: 0.38, label: 'cord-mid' },
    { x: 0.50, y: 0.68, label: 'cord-end' },
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

// Generate random background stars for night sky effect with varied sizes and brightness
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    // Most stars are tiny pinpricks, some are larger
    const sizeRoll = Math.random();
    let size: number;
    let hasFlare = false;
    
    if (sizeRoll > 0.97) {
      // ~3% are larger "featured" stars with flares
      size = 1.8 + Math.random() * 1.2;
      hasFlare = true;
    } else if (sizeRoll > 0.85) {
      // ~12% are medium stars
      size = 1.0 + Math.random() * 0.8;
    } else {
      // ~85% are tiny pinpricks
      size = 0.3 + Math.random() * 0.6;
    }
    
    // Varied brightness - some very dim, some bright
    const brightnessRoll = Math.random();
    let opacity: number;
    if (brightnessRoll > 0.9) {
      opacity = 0.35 + Math.random() * 0.25; // Bright stars
    } else if (brightnessRoll > 0.5) {
      opacity = 0.15 + Math.random() * 0.15; // Medium stars
    } else {
      opacity = 0.06 + Math.random() * 0.08; // Dim stars
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
          
          {/* Soft white halo gradient for nodes */}
          <radialGradient id="nodeHalo">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#D4A574" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Enhanced star glow with golden tint */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#D4A574" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Cross-shaped lens flare for featured stars */}
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
          
          {/* Nebula texture overlay */}
          <filter id="nebulaFilter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="15" result="noise" />
            <feColorMatrix in="noise" type="matrix"
              values="0 0 0 0 0.15
                      0 0 0 0 0.08
                      0 0 0 0 0.25
                      0 0 0 0.12 0" />
          </filter>
          
          {/* Night sky gradient with purple/blue cosmic tones */}
          <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a12" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#0d0d1a" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#12101f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#18142a" stopOpacity="0.3" />
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
        
        {/* Nebula texture overlay for cosmic depth */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          filter="url(#nebulaFilter)"
          opacity="0.12"
        />
        
        {/* Night sky scattered stars - varied sizes with lens flares on featured stars */}
        {backgroundStars.map((star, i) => (
          <g key={`bg-star-${i}`}>
            {/* Base star */}
            <circle
              cx={star.x * width}
              cy={star.y * height}
              r={star.size}
              fill="#fff"
              opacity={star.opacity}
              filter={star.hasFlare ? "url(#starFlare)" : undefined}
            />
            {/* Cross-shaped lens flare for featured stars */}
            {star.hasFlare && (
              <>
                {/* Horizontal flare */}
                <rect
                  x={star.x * width - star.size * 6}
                  y={star.y * height - star.size * 0.15}
                  width={star.size * 12}
                  height={star.size * 0.3}
                  fill="#fff"
                  opacity={star.opacity * 0.4}
                  rx={star.size * 0.15}
                />
                {/* Vertical flare */}
                <rect
                  x={star.x * width - star.size * 0.15}
                  y={star.y * height - star.size * 6}
                  width={star.size * 0.3}
                  height={star.size * 12}
                  fill="#fff"
                  opacity={star.opacity * 0.4}
                  rx={star.size * 0.15}
                />
                {/* Diagonal flares (45°) */}
                <rect
                  x={star.x * width - star.size * 4}
                  y={star.y * height - star.size * 0.1}
                  width={star.size * 8}
                  height={star.size * 0.2}
                  fill="#fff"
                  opacity={star.opacity * 0.2}
                  rx={star.size * 0.1}
                  transform={`rotate(45 ${star.x * width} ${star.y * height})`}
                />
                <rect
                  x={star.x * width - star.size * 4}
                  y={star.y * height - star.size * 0.1}
                  width={star.size * 8}
                  height={star.size * 0.2}
                  fill="#fff"
                  opacity={star.opacity * 0.2}
                  rx={star.size * 0.1}
                  transform={`rotate(-45 ${star.x * width} ${star.y * height})`}
                />
              </>
            )}
          </g>
        ))}
        
        {/* LAYER 2: Zodiac illustration - very subtle outline-only watermark */}
        {(() => {
          // Calculate 90% of full size, centered
          const imageWidth = width * 0.9;
          const imageHeight = height * 0.9;
          const imageX = (width - imageWidth) / 2;
          const imageY = (height - imageHeight) / 2;
          
          return (
            <>
              <defs>
                {/* Ultra-subtle outline filter - much more ghostly */}
                <filter id="zodiacGhostFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0.12
                            0 0 0 0 0.10
                            0 0 0 0 0.16
                            0 0 0 0.08 0"
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
        
        {/* Family relationship connection lines - delicate ethereal lines */}
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
              {/* Glow layer for ethereal effect */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#888"}
                strokeWidth={isSelected ? 4 : 3}
                opacity={isSelected ? 0.3 : 0.15}
                fill="none"
                strokeLinecap="round"
                filter="url(#lineGlow)"
                className="pointer-events-none"
              />
              {/* Visible line - thinner and more delicate */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#aaa"}
                strokeWidth={isSelected ? 1.5 : 0.8}
                opacity={isSelected ? 0.9 : 0.45}
                fill="none"
                strokeLinecap="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes - smaller, luminous with halos */}
        {memberPositions.map(({ member, x, y }, idx) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          // Stagger animation delays for visual interest
          const animDelay = idx * 0.15;
          
          return (
            <g key={member.id}>
              {/* Outer soft white halo - feathered edge */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 32 : 26}
                fill="url(#nodeHalo)"
                opacity={isInSelected ? 1 : 0.7}
                className="animate-node-pulse"
                style={{ animationDelay: `${animDelay}s` }}
              />
              
              {/* Secondary glow ring */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 18 : 14}
                fill="url(#starGlow)"
                opacity={isInSelected ? 0.95 : 0.6}
              />
              
              {/* Main member dot - smaller and more luminous */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 6 : 5}
                fill={isInSelected ? "#fff" : "#e8e8e8"}
                filter="url(#memberGlow)"
                className="transition-all duration-300"
              />
              
              {/* Inner brilliant core */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 3 : 2.5}
                fill="#fff"
                opacity={isInSelected ? 1 : 0.9}
                className="transition-all duration-300"
              />
              
              {/* Name label */}
              <text
                x={px}
                y={py + 24}
                textAnchor="middle"
                fill={isInSelected ? "#D4A574" : "#aaa"}
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.1em',
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
