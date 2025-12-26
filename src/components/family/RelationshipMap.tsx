import { useMemo } from "react";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { ZodiacSign, getZodiacFromBirthday, getMoonSignFromBirthDateTime, getZodiacName } from "@/lib/zodiac";

interface FamilyMember {
  id: string;
  name: string;
  type: 'parent' | 'partner' | 'child';
  birthday: string | null;
  birth_time?: string | null;
  birth_location?: string | null;
}

interface Connection {
  from: FamilyMember;
  to: FamilyMember;
  type: 'parent-child' | 'parent-partner' | 'sibling';
}

interface RelationshipMapProps {
  members: FamilyMember[];
  onConnectionTap: (from: FamilyMember, to: FamilyMember) => void;
}

// Constellation positions for different family sizes
const getPositions = (memberCount: number, size: number) => {
  const center = size / 2;
  const radius = size * 0.32;
  
  if (memberCount === 2) {
    return [
      { x: center, y: center - radius * 0.8 }, // Parent top
      { x: center, y: center + radius * 0.8 }, // Child bottom
    ];
  }
  
  if (memberCount === 3) {
    return [
      { x: center, y: center - radius * 0.9 }, // Parent top
      { x: center - radius * 0.8, y: center + radius * 0.6 }, // Bottom left
      { x: center + radius * 0.8, y: center + radius * 0.6 }, // Bottom right
    ];
  }
  
  if (memberCount === 4) {
    return [
      { x: center, y: center - radius }, // Top
      { x: center - radius * 0.9, y: center + radius * 0.3 }, // Left
      { x: center + radius * 0.9, y: center + radius * 0.3 }, // Right
      { x: center, y: center + radius }, // Bottom
    ];
  }
  
  // 5+ members: distribute in a circle
  return Array.from({ length: memberCount }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / memberCount;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });
};

// Generate star background
const generateStars = (count: number, size: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * size,
      y: Math.random() * size,
      r: 0.3 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.2,
    });
  }
  return stars;
};

export const RelationshipMap = ({ members, onConnectionTap }: RelationshipMapProps) => {
  const size = 340;
  const positions = useMemo(() => getPositions(members.length, size), [members.length]);
  const stars = useMemo(() => generateStars(30, size), []);
  
  // Build connections (parent to each child, partner pairs)
  const connections = useMemo(() => {
    const conns: { from: number; to: number; fromMember: FamilyMember; toMember: FamilyMember }[] = [];
    
    const parents = members.filter(m => m.type === 'parent' || m.type === 'partner');
    const children = members.filter(m => m.type === 'child');
    
    // Parent to each child
    parents.forEach(parent => {
      const parentIdx = members.indexOf(parent);
      children.forEach(child => {
        const childIdx = members.indexOf(child);
        conns.push({ from: parentIdx, to: childIdx, fromMember: parent, toMember: child });
      });
    });
    
    // Parent to partner
    if (parents.length === 2) {
      conns.push({ 
        from: members.indexOf(parents[0]), 
        to: members.indexOf(parents[1]),
        fromMember: parents[0],
        toMember: parents[1]
      });
    }
    
    // Siblings
    for (let i = 0; i < children.length; i++) {
      for (let j = i + 1; j < children.length; j++) {
        conns.push({
          from: members.indexOf(children[i]),
          to: members.indexOf(children[j]),
          fromMember: children[i],
          toMember: children[j]
        });
      }
    }
    
    return conns;
  }, [members]);
  
  const getMemberSign = (member: FamilyMember): ZodiacSign | null => {
    return getZodiacFromBirthday(member.birthday);
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[13px] text-foreground/40">
          Add family members to see your relationship constellation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
        {/* Background stars */}
        {stars.map((star, i) => (
          <circle
            key={`star-${i}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#C4A574"
            opacity={star.opacity}
          />
        ))}
        
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const fromPos = positions[conn.from];
          const toPos = positions[conn.to];
          if (!fromPos || !toPos) return null;
          
          return (
            <g key={`conn-${i}`}>
              {/* Clickable hit area */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="transparent"
                strokeWidth={30}
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionTap(conn.fromMember, conn.toMember)}
              />
              {/* Visible line */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#C4A574"
                strokeWidth={1}
                opacity={0.4}
                strokeDasharray="4,4"
                className="pointer-events-none"
              />
            </g>
          );
        })}
        
        {/* Member nodes */}
        {members.map((member, i) => {
          const pos = positions[i];
          if (!pos) return null;
          
          const sign = getMemberSign(member);
          
          return (
            <g key={member.id}>
              {/* Glow effect */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={24}
                fill="url(#nodeGlow)"
                opacity={0.3}
              />
              
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={20}
                fill="#252525"
                stroke="#C4A574"
                strokeWidth={1}
                opacity={0.8}
              />
              
              {/* Zodiac icon */}
              {sign && (
                <foreignObject
                  x={pos.x - 10}
                  y={pos.y - 10}
                  width={20}
                  height={20}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <ZodiacIcon sign={sign} size={16} className="text-[#C4A574]" />
                  </div>
                </foreignObject>
              )}
              
              {/* Name label */}
              <text
                x={pos.x}
                y={pos.y + 35}
                textAnchor="middle"
                fill="#8A8A8A"
                style={{ 
                  fontSize: '11px', 
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.02em'
                }}
              >
                {member.name}
              </text>
            </g>
          );
        })}
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#C4A574" />
            <stop offset="100%" stopColor="#C4A574" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Tap hint */}
      <p className="text-[10px] text-foreground/30 text-center mt-4 tracking-wide">
        Tap a connection to explore
      </p>
    </div>
  );
};
