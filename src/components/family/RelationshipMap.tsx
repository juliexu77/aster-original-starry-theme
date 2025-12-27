import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";
import { CONSTELLATION_DATA } from "@/lib/constellation-data";
import { CONSTELLATION_ILLUSTRATIONS, getStarColor } from "@/lib/constellation-illustrations";
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
  const width = 420;
  const height = 440;
  const padding = 30;
  
  const constellation = CONSTELLATION_DATA[constellationSign];
  const illustration = CONSTELLATION_ILLUSTRATIONS[constellationSign];
  const memberPositions = useMemo(
    () => getMemberPositionsOnStars(members, constellationSign), 
    [members, constellationSign]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(60), []);
  
  // Build connections between family members using constellation paths
  const connections = useMemo(() => {
    const conns: { 
      from: typeof memberPositions[0]; 
      to: typeof memberPositions[0];
      path: string[] | null; // Star IDs along the path, or null if no path exists
      hasConstellationPath: boolean;
    }[] = [];
    
    for (let i = 0; i < memberPositions.length; i++) {
      for (let j = i + 1; j < memberPositions.length; j++) {
        const from = memberPositions[i];
        const to = memberPositions[j];
        
        // Find path along constellation lines
        const path = findPathBetweenStars(from.starId, to.starId, constellation.lines);
        
        // Always add the connection, even if no constellation path exists
        conns.push({ 
          from, 
          to, 
          path: path && path.length > 1 ? path : null,
          hasConstellationPath: !!(path && path.length > 1)
        });
      }
    }
    
    return conns;
  }, [memberPositions, constellation.lines]);

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
        
        {/* MYTHOLOGICAL ILLUSTRATION - elegant gold line-art style */}
        {illustration && (
          <g 
            opacity={0.55}
            transform={`translate(${padding + (illustration.transform?.translateX || 0)}, ${padding + (illustration.transform?.translateY || 0)}) scale(${((width - padding * 2) / illustration.viewBox.width) * (illustration.transform?.scale || 1)})`}
          >
            {/* Main outline of the mythological figure - rich gold */}
            <path
              d={illustration.outlinePath}
              stroke="#c9a55a"
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Interior detail lines for depth - slightly lighter gold */}
            <path
              d={illustration.detailPath}
              stroke="#d4b06a"
              strokeWidth={1.2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          </g>
        )}
        {/* CONSTELLATION LINES - gold dotted lines */}
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
              stroke="#d4af70"
              strokeWidth={1}
              strokeDasharray="3,3"
              strokeLinecap="round"
              opacity={0.45}
            />
          );
        })}
        
        {/* CONSTELLATION STARS - gold star dots */}
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
              opacity={0.9}
            />
          );
        })}
        
        {/* Family relationship connection lines - draw along constellation paths */}
        {connections.map((conn, connIdx) => {
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          
          // Get pixel positions for from and to
          const fromPx = toPixelX(conn.from.x);
          const fromPy = toPixelY(conn.from.y);
          const toPx = toPixelX(conn.to.x);
          const toPy = toPixelY(conn.to.y);
          
          let pathD: string;
          
          if (conn.hasConstellationPath && conn.path) {
            // Build path segments from the star path
            const pathSegments: { x1: number; y1: number; x2: number; y2: number }[] = [];
            for (let i = 0; i < conn.path.length - 1; i++) {
              const fromStar = constellation.stars.find(s => s.id === conn.path![i]);
              const toStar = constellation.stars.find(s => s.id === conn.path![i + 1]);
              if (fromStar && toStar) {
                pathSegments.push({
                  x1: toPixelX(fromStar.x),
                  y1: toPixelY(fromStar.y),
                  x2: toPixelX(toStar.x),
                  y2: toPixelY(toStar.y),
                });
              }
            }
            
            // Build SVG path string for constellation path
            pathD = pathSegments.map((seg, i) => 
              i === 0 ? `M ${seg.x1} ${seg.y1} L ${seg.x2} ${seg.y2}` : `L ${seg.x2} ${seg.y2}`
            ).join(' ');
          } else {
            // No constellation path - draw a gentle arc between the two points
            const midX = (fromPx + toPx) / 2;
            const midY = (fromPy + toPy) / 2;
            
            // Calculate perpendicular offset for the arc
            const dx = toPx - fromPx;
            const dy = toPy - fromPy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Arc curves outward, amount proportional to distance
            const arcHeight = Math.min(distance * 0.25, 40);
            
            // Perpendicular direction (rotate 90 degrees)
            const perpX = -dy / distance;
            const perpY = dx / distance;
            
            // Control point for quadratic curve
            const ctrlX = midX + perpX * arcHeight;
            const ctrlY = midY + perpY * arcHeight;
            
            pathD = `M ${fromPx} ${fromPy} Q ${ctrlX} ${ctrlY} ${toPx} ${toPy}`;
          }
          
          return (
            <g key={`conn-${connIdx}`}>
              {/* Invisible hit area for the entire path */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth={24}
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible path - solid for constellation path, dashed for direct arc */}
              <path
                d={pathD}
                stroke={isSelected ? "#D4A574" : conn.hasConstellationPath ? "#999" : "#777"}
                strokeWidth={isSelected ? 2.5 : conn.hasConstellationPath ? 1.8 : 1.2}
                opacity={isSelected ? 1 : conn.hasConstellationPath ? 0.7 : 0.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={conn.hasConstellationPath ? "none" : "4,4"}
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
