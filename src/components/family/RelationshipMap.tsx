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

// Position members along constellation lines with good spacing
const getMemberPositionsOnLines = (members: FamilyMember[], sign: ZodiacSign) => {
  const constellation = CONSTELLATION_DATA[sign];
  const positions: { member: FamilyMember; x: number; y: number }[] = [];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  // Get all line segments
  const lineSegments = constellation.lines.map(([fromId, toId]) => {
    const fromStar = constellation.stars.find(s => s.id === fromId);
    const toStar = constellation.stars.find(s => s.id === toId);
    return { from: fromStar, to: toStar };
  }).filter(seg => seg.from && seg.to);
  
  // Calculate positions spaced along lines
  const totalMembers = sorted.length;
  
  sorted.forEach((member, idx) => {
    // Distribute members across different lines/positions
    // Use major star positions for first few, then interpolate along lines
    if (idx < constellation.stars.length) {
      // Use prominent star positions but offset slightly
      const starIdx = idx % constellation.stars.length;
      const star = constellation.stars
        .slice()
        .sort((a, b) => b.size - a.size)[starIdx];
      
      // Add slight offset based on member type for visual variety
      const offsetX = (idx % 3 - 1) * 0.05;
      const offsetY = (idx % 2) * 0.05;
      
      positions.push({
        member,
        x: Math.max(0.1, Math.min(0.9, star.x + offsetX)),
        y: Math.max(0.1, Math.min(0.9, star.y + offsetY)),
      });
    } else if (lineSegments.length > 0) {
      // Place on line midpoints
      const lineIdx = idx % lineSegments.length;
      const seg = lineSegments[lineIdx];
      if (seg.from && seg.to) {
        const t = 0.3 + (idx * 0.2) % 0.4; // Vary position along line
        positions.push({
          member,
          x: seg.from.x + (seg.to.x - seg.from.x) * t,
          y: seg.from.y + (seg.to.y - seg.from.y) * t,
        });
      }
    }
  });
  
  return positions;
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
    () => getMemberPositionsOnLines(members, constellationSign), 
    [members, constellationSign]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(35), []);
  
  // Build connections between family members
  const connections = useMemo(() => {
    const conns: { from: typeof memberPositions[0]; to: typeof memberPositions[0] }[] = [];
    
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
        
        {/* CONSTELLATION LINES - More visible */}
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
              stroke="url(#constLineGrad)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
        
        {/* CONSTELLATION STARS - More visible */}
        {constellation.stars.map((star) => (
          <g key={`const-star-${star.id}`}>
            {/* Star glow */}
            <circle
              cx={toPixelX(star.x)}
              cy={toPixelY(star.y)}
              r={star.size * 2.5}
              fill="#5A5650"
              opacity={0.15}
            />
            {/* Star core */}
            <circle
              cx={toPixelX(star.x)}
              cy={toPixelY(star.y)}
              r={star.size * 0.8}
              fill="#6A6660"
              opacity={0.6}
            />
          </g>
        ))}
        
        {/* Family relationship connection lines */}
        {connections.map((conn, i) => {
          const fromX = toPixelX(conn.from.x);
          const fromY = toPixelY(conn.from.y);
          const toX = toPixelX(conn.to.x);
          const toY = toPixelY(conn.to.y);
          const isSelected = isConnectionSelected(conn.from.member, conn.to.member);
          
          return (
            <g key={`conn-${i}`}>
              {/* Invisible hit area */}
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="transparent"
                strokeWidth={40}
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.from.member, conn.to.member)}
              />
              {/* Visible line */}
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={isSelected ? "#D4A574" : "#C4A574"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isSelected ? 1 : 0.5}
                strokeDasharray={isSelected ? "none" : "6,6"}
                strokeLinecap="round"
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes */}
        {memberPositions.map(({ member, x, y }) => {
          const px = toPixelX(x);
          const py = toPixelY(y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          return (
            <g key={member.id}>
              {/* Outer glow */}
              <circle
                cx={px}
                cy={py}
                r={32}
                fill="url(#starGlow)"
                opacity={isInSelected ? 0.7 : 0.5}
                className="transition-opacity duration-300"
              />
              
              {/* Node circle */}
              <circle
                cx={px}
                cy={py}
                r={24}
                fill="none"
                stroke={isInSelected ? "#D4A574" : "#C4A574"}
                strokeWidth={isInSelected ? 2.5 : 2}
                opacity={isInSelected ? 1 : 0.85}
                className="transition-all duration-300"
              />
              
              {/* Zodiac icon */}
              {sign && (
                <foreignObject
                  x={px - 11}
                  y={py - 11}
                  width={22}
                  height={22}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ZodiacIcon 
                      sign={sign} 
                      size={18} 
                      className={isInSelected ? "text-[#D4A574]" : "text-[#C4A574]"}
                    />
                  </div>
                </foreignObject>
              )}
              
              {/* Name label */}
              <text
                x={px}
                y={py + 42}
                textAnchor="middle"
                fill={isInSelected ? "#B8A080" : "#888"}
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.03em'
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
