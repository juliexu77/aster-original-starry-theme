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

// 5 recognizable constellations ordered by complexity (fewer to more lines)
// Each has star positions and lines connecting them
const FAMILY_CONSTELLATIONS = [
  // 2 members - Gemini (simple twin stars)
  {
    name: 'gemini',
    stars: [
      { id: 'a', x: 0.35, y: 0.3, size: 3 },
      { id: 'b', x: 0.65, y: 0.3, size: 3 },
      { id: 'c', x: 0.3, y: 0.5, size: 2 },
      { id: 'd', x: 0.7, y: 0.5, size: 2 },
      { id: 'e', x: 0.35, y: 0.7, size: 2 },
      { id: 'f', x: 0.65, y: 0.7, size: 2 },
    ],
    lines: [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'e'], ['d', 'f']] as [string, string][],
  },
  // 3 members - Orion's Belt (triangle)
  {
    name: 'orions-belt',
    stars: [
      { id: 'a', x: 0.3, y: 0.45, size: 3 },
      { id: 'b', x: 0.5, y: 0.5, size: 3 },
      { id: 'c', x: 0.7, y: 0.55, size: 3 },
      { id: 'd', x: 0.5, y: 0.3, size: 2 },
      { id: 'e', x: 0.5, y: 0.7, size: 2 },
    ],
    lines: [['a', 'b'], ['b', 'c'], ['b', 'd'], ['b', 'e']] as [string, string][],
  },
  // 4 members - Cassiopeia (W shape)
  {
    name: 'cassiopeia',
    stars: [
      { id: 'a', x: 0.2, y: 0.4, size: 3 },
      { id: 'b', x: 0.35, y: 0.55, size: 3 },
      { id: 'c', x: 0.5, y: 0.4, size: 3 },
      { id: 'd', x: 0.65, y: 0.55, size: 3 },
      { id: 'e', x: 0.8, y: 0.4, size: 3 },
    ],
    lines: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']] as [string, string][],
  },
  // 5 members - Big Dipper
  {
    name: 'big-dipper',
    stars: [
      { id: 'a', x: 0.2, y: 0.35, size: 3 },
      { id: 'b', x: 0.3, y: 0.4, size: 3 },
      { id: 'c', x: 0.4, y: 0.45, size: 3 },
      { id: 'd', x: 0.5, y: 0.5, size: 3 },
      { id: 'e', x: 0.6, y: 0.55, size: 3 },
      { id: 'f', x: 0.7, y: 0.5, size: 2.5 },
      { id: 'g', x: 0.75, y: 0.4, size: 2.5 },
    ],
    lines: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'f'], ['f', 'g'], ['g', 'd']] as [string, string][],
  },
  // 6+ members - Orion (full constellation)
  {
    name: 'orion',
    stars: [
      { id: 'a', x: 0.35, y: 0.2, size: 3 }, // Betelgeuse (shoulder)
      { id: 'b', x: 0.65, y: 0.2, size: 2.5 }, // Bellatrix (shoulder)
      { id: 'c', x: 0.3, y: 0.45, size: 2.5 }, // Belt left
      { id: 'd', x: 0.5, y: 0.5, size: 3 }, // Belt center
      { id: 'e', x: 0.7, y: 0.55, size: 2.5 }, // Belt right
      { id: 'f', x: 0.25, y: 0.75, size: 2.5 }, // Saiph (foot)
      { id: 'g', x: 0.75, y: 0.75, size: 3 }, // Rigel (foot)
      { id: 'h', x: 0.5, y: 0.65, size: 2 }, // Sword
    ],
    lines: [['a', 'c'], ['b', 'e'], ['c', 'd'], ['d', 'e'], ['c', 'f'], ['e', 'g'], ['d', 'h']] as [string, string][],
  },
];

// Get constellation based on family size
const getConstellationForFamily = (memberCount: number) => {
  if (memberCount <= 2) return FAMILY_CONSTELLATIONS[0];
  if (memberCount === 3) return FAMILY_CONSTELLATIONS[1];
  if (memberCount === 4) return FAMILY_CONSTELLATIONS[2];
  if (memberCount === 5) return FAMILY_CONSTELLATIONS[3];
  return FAMILY_CONSTELLATIONS[4]; // 6+
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

// Assign members to constellation star positions
const getMemberPositionsOnStars = (members: FamilyMember[], constellation: typeof FAMILY_CONSTELLATIONS[0]) => {
  const positions: { member: FamilyMember; x: number; y: number; starId: string }[] = [];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  // Sort stars by size (prominence) to assign most prominent to first members
  const sortedStars = [...constellation.stars].sort((a, b) => b.size - a.size);
  
  sorted.forEach((member, idx) => {
    if (idx < sortedStars.length) {
      const star = sortedStars[idx];
      positions.push({
        member,
        x: star.x,
        y: star.y,
        starId: star.id,
      });
    }
  });
  
  return positions;
};

// Find path between two stars using BFS along constellation lines
const findPathBetweenStars = (
  fromStarId: string, 
  toStarId: string, 
  lines: [string, string][]
): string[] | null => {
  if (fromStarId === toStarId) return [fromStarId];
  
  // Build adjacency list
  const adjacency: Record<string, string[]> = {};
  lines.forEach(([a, b]) => {
    if (!adjacency[a]) adjacency[a] = [];
    if (!adjacency[b]) adjacency[b] = [];
    adjacency[a].push(b);
    adjacency[b].push(a);
  });
  
  // BFS to find shortest path
  const queue: { node: string; path: string[] }[] = [{ node: fromStarId, path: [fromStarId] }];
  const visited = new Set<string>([fromStarId]);
  
  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    
    const neighbors = adjacency[node] || [];
    for (const neighbor of neighbors) {
      if (neighbor === toStarId) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }
  
  return null; // No path found
};

// Generate random background stars
const generateBackgroundStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.3 + Math.random() * 0.8,
      opacity: 0.03 + Math.random() * 0.08,
    });
  }
  return stars;
};

export const RelationshipMap = ({ members, constellationSign, selectedConnection, onConnectionTap }: RelationshipMapProps) => {
  const width = 420;
  const height = 440;
  const padding = 30;
  
  // Get constellation based on family size, not zodiac sign
  const constellation = useMemo(() => getConstellationForFamily(members.length), [members.length]);
  
  const memberPositions = useMemo(
    () => getMemberPositionsOnStars(members, constellation), 
    [members, constellation]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(60), []);
  
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
    <div className="w-full max-w-[440px] mx-auto px-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          {/* Glow filter for member nodes */}
          <filter id="memberGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle glow for stars */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#C4A574" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Constellation line gradient */}
          <linearGradient id="constLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A5650" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6A6660" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5A5650" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Scattered background stars - very faint texture */}
        {backgroundStars.map((star, i) => (
          <circle
            key={`bg-star-${i}`}
            cx={toPixelX(star.x)}
            cy={toPixelY(star.y)}
            r={star.size * 0.5}
            fill="#666"
            opacity={star.opacity * 0.6}
          />
        ))}
        
        {/* MYTHOLOGICAL ILLUSTRATION - using actual zodiac images, 110% of page width */}
        {(() => {
          // Calculate 110% of full width, centered (will overflow)
          const imageWidth = width * 1.1;
          const imageHeight = height * 1.1;
          const imageX = (width - imageWidth) / 2;
          const imageY = (height - imageHeight) / 2;
          
          return (
            <image
              href={ZODIAC_IMAGES[constellationSign]}
              x={imageX}
              y={imageY}
              width={imageWidth}
              height={imageHeight}
              opacity={0.6}
              preserveAspectRatio="xMidYMid meet"
            />
          );
        })()}
        {/* CONSTELLATION STARS - gold star dots (only show unused stars) */}
        {constellation.stars.map((star) => {
          // Check if this star has a family member on it
          const hasMember = memberPositions.some(mp => mp.starId === star.id);
          
          return (
            <circle
              key={`const-star-${star.id}`}
              cx={toPixelX(star.x)}
              cy={toPixelY(star.y)}
              r={hasMember ? 0 : Math.max(1.8, star.size * 0.7)}
              fill="#d4af70"
              opacity={0.5}
            />
          );
        })}
        
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
                strokeWidth={24}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible line */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#888"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isSelected ? 1 : 0.6}
                fill="none"
                strokeLinecap="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes - slightly larger with subtle glow */}
        {memberPositions.map(({ member, x, y }) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          return (
            <g key={member.id}>
              {/* Subtle glow behind member node */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 14 : 10}
                fill="url(#starGlow)"
                opacity={isInSelected ? 0.8 : 0.4}
              />
              
              {/* Main member dot - larger */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 6 : 5}
                fill={isInSelected ? "#D4A574" : "#999"}
                filter="url(#memberGlow)"
                className="transition-all duration-300"
              />
              
              {/* Name label */}
              <text
                x={px}
                y={py + 20}
                textAnchor="middle"
                fill={isInSelected ? "#D4A574" : "#777"}
                style={{ 
                  fontSize: '10px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.05em',
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
