import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";
import { CONSTELLATION_DATA, getMemberStarAssignments } from "@/lib/constellation-data";

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

// Map family member positions to specific stars based on their role
const getMemberStarPositions = (members: FamilyMember[], sign: ZodiacSign) => {
  const constellation = CONSTELLATION_DATA[sign];
  const starAssignments = getMemberStarAssignments(sign);
  
  const positions: { member: FamilyMember; star: typeof constellation.stars[0] }[] = [];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  sorted.forEach((member, idx) => {
    const starId = starAssignments[idx] || starAssignments[starAssignments.length - 1];
    const star = constellation.stars.find(s => s.id === starId);
    if (star) {
      positions.push({ member, star });
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
      size: 0.5 + Math.random() * 1,
      opacity: 0.05 + Math.random() * 0.12,
    });
  }
  return stars;
};

export const RelationshipMap = ({ members, constellationSign, selectedConnection, onConnectionTap }: RelationshipMapProps) => {
  const width = 340;
  const height = 300;
  const padding = 50;
  
  const constellation = CONSTELLATION_DATA[constellationSign];
  const memberPositions = useMemo(
    () => getMemberStarPositions(members, constellationSign), 
    [members, constellationSign]
  );
  const backgroundStars = useMemo(() => generateBackgroundStars(25), []);
  
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
  const toPixelY = (normalized: number) => padding * 0.5 + normalized * (height - padding);

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
    <div className="w-full max-w-[340px] mx-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          {/* Glow filter for member nodes */}
          <filter id="memberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Subtle glow for stars */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#C4A574" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C4A574" stopOpacity="0" />
          </radialGradient>
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
        
        {/* Zodiac constellation stars (background) */}
        {constellation.stars.map((star) => (
          <circle
            key={`const-star-${star.id}`}
            cx={toPixelX(star.x)}
            cy={toPixelY(star.y)}
            r={star.size * 0.6}
            fill="#4A4742"
            opacity={0.3}
          />
        ))}
        
        {/* Zodiac constellation lines (very subtle) */}
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
              stroke="#2A2A2A"
              strokeWidth={0.5}
              strokeDasharray="2,3"
              opacity={0.5}
            />
          );
        })}
        
        {/* Family relationship connection lines */}
        {connections.map((conn, i) => {
          const fromX = toPixelX(conn.from.star.x);
          const fromY = toPixelY(conn.from.star.y);
          const toX = toPixelX(conn.to.star.x);
          const toY = toPixelY(conn.to.star.y);
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
                strokeWidth={44}
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
                strokeWidth={isSelected ? 2 : 1.5}
                opacity={isSelected ? 0.9 : 0.5}
                strokeDasharray={isSelected ? "none" : "4,4"}
                className="pointer-events-none transition-all duration-300"
              />
            </g>
          );
        })}
        
        {/* Family member nodes */}
        {memberPositions.map(({ member, star }) => {
          const x = toPixelX(star.x);
          const y = toPixelY(star.y);
          const sign = getMemberSign(member);
          const isInSelected = selectedConnection && 
            (selectedConnection.from.id === member.id || selectedConnection.to.id === member.id);
          
          return (
            <g key={member.id}>
              {/* Outer glow */}
              <circle
                cx={x}
                cy={y}
                r={28}
                fill="url(#starGlow)"
                opacity={isInSelected ? 0.6 : 0.4}
                className="transition-opacity duration-300"
              />
              
              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={22}
                fill="none"
                stroke={isInSelected ? "#D4A574" : "#C4A574"}
                strokeWidth={isInSelected ? 2.5 : 2}
                opacity={isInSelected ? 1 : 0.8}
                className="transition-all duration-300"
              />
              
              {/* Zodiac icon */}
              {sign && (
                <foreignObject
                  x={x - 10}
                  y={y - 10}
                  width={20}
                  height={20}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ZodiacIcon 
                      sign={sign} 
                      size={16} 
                      className={isInSelected ? "text-[#D4A574]" : "text-[#C4A574]"}
                    />
                  </div>
                </foreignObject>
              )}
              
              {/* Name label */}
              <text
                x={x}
                y={y + 38}
                textAnchor="middle"
                fill={isInSelected ? "#B8A080" : "#999"}
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.02em'
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
