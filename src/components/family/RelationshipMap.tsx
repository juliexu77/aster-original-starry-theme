import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";
import { CONSTELLATION_DATA } from "@/lib/constellation-data";

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

// Assign members to actual constellation star positions
const getMemberPositionsOnStars = (members: FamilyMember[], sign: ZodiacSign) => {
  const constellation = CONSTELLATION_DATA[sign];
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
  const width = 360;
  const height = 340;
  const padding = 45;
  
  const constellation = CONSTELLATION_DATA[constellationSign];
  const memberPositions = useMemo(
    () => getMemberPositionsOnStars(members, constellationSign), 
    [members, constellationSign]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(35), []);
  
  // Build connections between family members using constellation paths
  const connections = useMemo(() => {
    const conns: { 
      from: typeof memberPositions[0]; 
      to: typeof memberPositions[0];
      path: string[]; // Star IDs along the path
    }[] = [];
    
    for (let i = 0; i < memberPositions.length; i++) {
      for (let j = i + 1; j < memberPositions.length; j++) {
        const from = memberPositions[i];
        const to = memberPositions[j];
        
        // Find path along constellation lines
        const path = findPathBetweenStars(from.starId, to.starId, constellation.lines);
        
        if (path && path.length > 1) {
          conns.push({ from, to, path });
        }
      }
    }
    
    return conns;
  }, [memberPositions, constellation.lines]);

  const toPixelX = (normalized: number) => padding + normalized * (width - padding * 2);
  const toPixelY = (normalized: number) => padding * 0.6 + normalized * (height - padding * 1.2);

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
    <div className="w-full max-w-[360px] mx-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          {/* Glow filter for member nodes */}
          <filter id="memberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle glow for stars */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#C4A574" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C4A574" stopOpacity="0" />
          </radialGradient>
          
          {/* Constellation line gradient */}
          <linearGradient id="constLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A5650" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6A6660" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5A5650" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Background stars */}
        {backgroundStars.map((star, i) => (
          <circle
            key={`bg-star-${i}`}
            cx={toPixelX(star.x)}
            cy={toPixelY(star.y)}
            r={star.size}
            fill="#C4A574"
            opacity={star.opacity}
          />
        ))}
        
        {/* CONSTELLATION LINES - thin and clean */}
        {constellation.lines.map(([fromId, toId], i) => {
          const fromStar = constellation.stars.find(s => s.id === fromId);
          const toStar = constellation.stars.find(s => s.id === toId);
          if (!fromStar || !toStar) return null;
          
          return (
            <line
              key={`const-line-${i}`}
              x1={toPixelX(fromStar.x)}
              y1={toPixelY(fromStar.y)}
              x2={toPixelX(toStar.x)}
              y2={toPixelY(toStar.y)}
              stroke="#555"
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.7}
            />
          );
        })}
        
        {/* CONSTELLATION STARS - simple filled dots */}
        {constellation.stars.map((star) => (
          <circle
            key={`const-star-${star.id}`}
            cx={toPixelX(star.x)}
            cy={toPixelY(star.y)}
            r={star.size * 0.8}
            fill="#666"
          />
        ))}
        
        {/* Family relationship connection lines - draw along constellation paths */}
        {connections.map((conn, connIdx) => {
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          
          // Build path segments from the star path
          const pathSegments: { x1: number; y1: number; x2: number; y2: number }[] = [];
          for (let i = 0; i < conn.path.length - 1; i++) {
            const fromStar = constellation.stars.find(s => s.id === conn.path[i]);
            const toStar = constellation.stars.find(s => s.id === conn.path[i + 1]);
            if (fromStar && toStar) {
              pathSegments.push({
                x1: toPixelX(fromStar.x),
                y1: toPixelY(fromStar.y),
                x2: toPixelX(toStar.x),
                y2: toPixelY(toStar.y),
              });
            }
          }
          
          // Build SVG path string for the connection
          const pathD = pathSegments.map((seg, i) => 
            i === 0 ? `M ${seg.x1} ${seg.y1} L ${seg.x2} ${seg.y2}` : `L ${seg.x2} ${seg.y2}`
          ).join(' ');
          
          return (
            <g key={`conn-${connIdx}`}>
              {/* Invisible hit area for the entire path */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth={30}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible path along constellation lines */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : "#C4A574"}
                strokeWidth={isSelected ? 3 : 2}
                opacity={isSelected ? 1 : 0.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes - simple filled dots like reference */}
        {memberPositions.map(({ member, x, y }) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          return (
            <g key={member.id}>
              {/* Main star dot - filled, no outline */}
              <circle
                cx={px}
                cy={py}
                r={isInSelected ? 8 : 6}
                fill={isInSelected ? "#B8A080" : "#888"}
                className="transition-all duration-300"
              />
              
              {/* Name label */}
              <text
                x={px}
                y={py + 22}
                textAnchor="middle"
                fill={isInSelected ? "#B8A080" : "#666"}
                style={{ 
                  fontSize: '10px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                className="transition-all duration-300"
              >
                {member.name}
              </text>
              
              {/* Zodiac icon below name if space allows */}
              {sign && (
                <foreignObject
                  x={px - 8}
                  y={py + 28}
                  width={16}
                  height={16}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ZodiacIcon 
                      sign={sign} 
                      size={12} 
                      className={isInSelected ? "text-[#B8A080]" : "text-[#555]"}
                    />
                  </div>
                </foreignObject>
              )}
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
