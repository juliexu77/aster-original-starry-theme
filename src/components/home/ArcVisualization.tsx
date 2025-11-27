import { ARC_CONFIG, ANGLE_RANGE, createBaseArcPath } from "@/utils/arcCalculations";

interface ArcVisualizationProps {
  isDay: boolean;
  arcPosition: number;
  trailPath: string;
  iconX: number;
  iconY: number;
  isOvertired: boolean;
  inTwilightZone: boolean;
}

export const ArcVisualization = ({
  isDay,
  arcPosition,
  trailPath,
  iconX,
  iconY,
  isOvertired,
  inTwilightZone,
}: ArcVisualizationProps) => {
  const { viewBoxWidth, viewBoxHeight, centerX, centerY, arcRadius, startAngle, endAngle } = ARC_CONFIG;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: '100%', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="dayBaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(30 40% 92%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(15 45% 88%)" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="dayTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(40 60% 88%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(35 55% 85%)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="dayTwilightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(25 50% 80%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(15 45% 75%)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="overtiredGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(15 70% 65%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(0 60% 60%)" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="nightBaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(240 25% 75%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(260 18% 80%)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="nightTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(245 30% 70%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(255 22% 75%)" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#FFD580" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFD580" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="hsl(240 40% 80%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(240 40% 80%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="overtiredGlow">
          <stop offset="0%" stopColor="hsl(0 70% 60%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(0 70% 60%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Base Arc Background */}
      <path
        d={createBaseArcPath()}
        fill="none"
        stroke={isDay ? "url(#dayBaseGradient)" : "url(#nightBaseGradient)"}
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Twilight zone (sweet spot at 80-100%) */}
      {inTwilightZone && isDay && !isOvertired && (
        <path
          d={`M ${centerX + Math.cos(startAngle - 0.8 * ANGLE_RANGE) * arcRadius} ${centerY - Math.sin(startAngle - 0.8 * ANGLE_RANGE) * arcRadius} A ${arcRadius} ${arcRadius} 0 0 1 ${centerX + Math.cos(endAngle) * arcRadius} ${centerY - Math.sin(endAngle) * arcRadius}`}
          fill="none"
          stroke="url(#dayTwilightGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
      
      {/* Overtired zone (>100% of wake window) */}
      {isOvertired && isDay && (
        <path
          d={`M ${centerX + Math.cos(startAngle - 0.8 * ANGLE_RANGE) * arcRadius} ${centerY - Math.sin(startAngle - 0.8 * ANGLE_RANGE) * arcRadius} A ${arcRadius} ${arcRadius} 0 0 1 ${centerX + Math.cos(endAngle) * arcRadius} ${centerY - Math.sin(endAngle) * arcRadius}`}
          fill="none"
          stroke="url(#overtiredGradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      )}
      
      {/* Trail Fill (Progress) */}
      <path
        d={trailPath}
        fill="none"
        stroke={isOvertired ? "url(#overtiredGradient)" : (isDay ? "url(#dayTrailGradient)" : "url(#nightTrailGradient)")}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Icon Glow */}
      <circle
        cx={iconX}
        cy={iconY}
        r="24"
        fill={isOvertired ? "url(#overtiredGlow)" : (isDay ? "url(#sunGlow)" : "url(#moonGlow)")}
      />
      
      {/* The Icon Itself */}
      {isDay ? (
        <circle
          cx={iconX}
          cy={iconY}
          r="10"
          fill={isOvertired ? "hsl(0 70% 55%)" : "#FFB347"}
          style={{
            filter: isOvertired 
              ? 'drop-shadow(0 0 8px hsla(0, 70%, 60%, 0.6))' 
              : 'drop-shadow(0 0 10px rgba(255, 213, 128, 0.6))'
          }}
        />
      ) : (
        <g>
          {/* Moon base circle */}
          <circle
            cx={iconX}
            cy={iconY}
            r="10"
            fill="hsl(240 30% 75%)"
            style={{
              filter: 'drop-shadow(0 0 8px hsla(240, 30%, 75%, 0.4))'
            }}
          />
          {/* Crescent shadow */}
          <path
            d={`
              M ${iconX + 2} ${iconY - 10}
              A 8 8 0 0 1 ${iconX + 2} ${iconY + 10}
              A 6 6 0 0 0 ${iconX + 2} ${iconY - 10}
              Z
            `}
            fill="hsl(240 20% 60%)"
            opacity="0.5"
          />
        </g>
      )}
      
      {/* Zone indicator text */}
      {isOvertired && isDay && (
        <text
          x={centerX + Math.cos(endAngle) * arcRadius - 40}
          y={centerY - Math.sin(endAngle) * arcRadius + 25}
          textAnchor="middle"
          className="text-[9px] font-semibold"
          fill="hsl(0 70% 55%)"
        >
          Overtired
        </text>
      )}
      {inTwilightZone && isDay && !isOvertired && (
        <text
          x={centerX + Math.cos(endAngle) * arcRadius - 40}
          y={centerY - Math.sin(endAngle) * arcRadius + 25}
          textAnchor="middle"
          className="text-[9px] font-medium fill-muted-foreground"
        >
          Wind down
        </text>
      )}
      
      {/* Visual connector line from icon to card */}
      <line
        x1={iconX}
        y1={iconY + 12}
        x2={centerX}
        y2={viewBoxHeight + 10}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        strokeDasharray="2,3"
        opacity="0.2"
      />
    </svg>
  );
};
