import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday } from "@/lib/zodiac";

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
  selectedConnection: { from: FamilyMember; to: FamilyMember } | null;
  onConnectionTap: (from: FamilyMember, to: FamilyMember) => void;
}

// Sagittarius constellation star positions (normalized 0-1 coordinates)
// Based on actual astronomical positions of key stars
const SAGITTARIUS_STARS = [
  { id: 'kaus-australis', x: 0.45, y: 0.72, size: 3.5, label: 'Kaus Australis' }, // Brightest - epsilon Sgr
  { id: 'nunki', x: 0.68, y: 0.38, size: 3, label: 'Nunki' }, // sigma Sgr
  { id: 'ascella', x: 0.55, y: 0.55, size: 2.5, label: 'Ascella' }, // zeta Sgr
  { id: 'kaus-media', x: 0.38, y: 0.58, size: 2.5, label: 'Kaus Media' }, // delta Sgr
  { id: 'kaus-borealis', x: 0.28, y: 0.45, size: 2.5, label: 'Kaus Borealis' }, // lambda Sgr
  { id: 'albaldah', x: 0.52, y: 0.25, size: 2, label: 'Albaldah' }, // pi Sgr
  { id: 'phi', x: 0.72, y: 0.58, size: 2, label: 'Phi' }, // phi Sgr
  { id: 'tau', x: 0.62, y: 0.68, size: 2, label: 'Tau' }, // tau Sgr
];

// Constellation lines connecting the stars (teapot asterism)
const CONSTELLATION_LINES = [
  ['kaus-australis', 'kaus-media'],
  ['kaus-media', 'kaus-borealis'],
  ['kaus-australis', 'ascella'],
  ['ascella', 'phi'],
  ['phi', 'nunki'],
  ['nunki', 'albaldah'],
  ['ascella', 'tau'],
  ['tau', 'kaus-australis'],
];

// Map family member positions to specific stars based on their role
const getMemberStarPositions = (members: FamilyMember[]) => {
  const positions: { member: FamilyMember; star: typeof SAGITTARIUS_STARS[0] }[] = [];
  
  // Priority star assignments
  const starAssignments = [
    'kaus-australis', // Parent (brightest)
    'nunki',          // First child or partner
    'kaus-borealis',  // Second child
    'albaldah',       // Third child
    'phi',            // Fourth child
    'tau',            // Fifth child
  ];
  
  // Sort: parents first, then partners, then children
  const sorted = [...members].sort((a, b) => {
    const order = { parent: 0, partner: 1, child: 2 };
    return order[a.type] - order[b.type];
  });
  
  sorted.forEach((member, idx) => {
    const starId = starAssignments[idx] || starAssignments[starAssignments.length - 1];
    const star = SAGITTARIUS_STARS.find(s => s.id === starId);
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

export const RelationshipMap = ({ members, selectedConnection, onConnectionTap }: RelationshipMapProps) => {
  const width = 340;
  const height = 300;
  const padding = 50;
  
  const memberPositions = useMemo(() => getMemberStarPositions(members), [members]);
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
        
        {/* Sagittarius constellation stars (background) */}
        {SAGITTARIUS_STARS.map((star) => (
          <circle
            key={`const-star-${star.id}`}
            cx={toPixelX(star.x)}
            cy={toPixelY(star.y)}
            r={star.size * 0.6}
            fill="#4A4742"
            opacity={0.3}
          />
        ))}
        
        {/* Sagittarius constellation lines (very subtle) */}
        {CONSTELLATION_LINES.map(([fromId, toId], i) => {
          const fromStar = SAGITTARIUS_STARS.find(s => s.id === fromId);
          const toStar = SAGITTARIUS_STARS.find(s => s.id === toId);
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
