import { ZodiacSign } from "./zodiac";

interface ConstellationIllustration {
  // SVG path for the mythological illustration (ghost layer)
  illustrationPath: string;
  // Viewbox dimensions for the illustration
  viewBox: { width: number; height: number };
  // Recommended scale and position adjustments
  transform?: { scale?: number; translateX?: number; translateY?: number };
  // Description of the mythological figure
  description: string;
}

// Mythological illustrations as SVG paths for each zodiac constellation
// These are designed to be rendered very faintly behind the star patterns
export const CONSTELLATION_ILLUSTRATIONS: Record<ZodiacSign, ConstellationIllustration> = {
  // ARIES - Crouching ram with curved horns
  aries: {
    illustrationPath: `
      M 120 180 
      Q 100 160 90 140 
      Q 80 120 95 100 
      Q 110 80 130 85 
      Q 150 90 160 110 
      Q 170 130 165 150 
      Q 160 170 140 180 
      Q 130 185 120 180 Z
      M 95 100 
      Q 70 80 60 60 
      Q 55 45 70 40 
      Q 85 35 95 50 
      Q 100 65 95 100
      M 130 85 
      Q 140 60 155 45 
      Q 170 35 180 45 
      Q 185 60 175 80 
      Q 165 95 160 110
      M 165 150 
      Q 180 160 200 165 
      Q 220 170 240 160 
      Q 260 150 270 140
      M 120 180 
      Q 115 200 120 220 
      Q 125 235 115 250
      M 160 170 
      Q 165 190 170 210 
      Q 175 230 170 250
    `,
    viewBox: { width: 300, height: 280 },
    description: 'Crouching ram with curved horns, head turned to side'
  },

  // TAURUS - Bull's head and shoulders with horns
  taurus: {
    illustrationPath: `
      M 200 220 
      Q 170 200 150 180 
      Q 130 160 120 130 
      Q 115 100 130 80 
      Q 145 60 170 55 
      Q 195 50 220 60 
      Q 245 70 260 95 
      Q 275 120 270 150 
      Q 265 180 250 200 
      Q 235 220 200 220 Z
      M 130 80 
      Q 100 50 80 30 
      Q 65 15 55 25 
      Q 45 40 55 55 
      Q 70 75 90 85
      M 260 95 
      Q 280 65 295 40 
      Q 305 20 320 30 
      Q 335 45 325 65 
      Q 310 90 285 105
      M 170 55 
      Q 175 40 180 30
      M 195 50 
      Q 200 35 205 25
      M 150 180 
      Q 130 190 110 200 
      Q 90 210 75 230
      M 250 200 
      Q 270 210 290 225 
      Q 305 240 315 260
      M 170 140 
      Q 175 145 180 140
      M 210 140 
      Q 215 145 220 140
      M 185 170 
      Q 190 180 195 185 
      Q 200 190 195 185 
      Q 190 180 185 170
    `,
    viewBox: { width: 350, height: 280 },
    transform: { scale: 0.9, translateX: -20 },
    description: 'Bulls head and shoulders with horns, powerful stance'
  },

  // GEMINI - Two human figures standing side by side
  gemini: {
    illustrationPath: `
      M 100 60 
      Q 90 50 100 40 
      Q 110 30 120 40 
      Q 130 50 120 60 
      Q 110 70 100 60 Z
      M 110 70 
      L 110 120 
      M 90 90 
      L 110 100 
      L 130 90
      M 110 120 
      L 90 180
      M 110 120 
      L 130 180
      M 200 60 
      Q 190 50 200 40 
      Q 210 30 220 40 
      Q 230 50 220 60 
      Q 210 70 200 60 Z
      M 210 70 
      L 210 120
      M 190 90 
      L 210 100 
      L 230 90
      M 210 120 
      L 190 180
      M 210 120 
      L 230 180
      M 120 50 
      Q 150 40 180 50 
      Q 195 55 200 60
      M 130 90 
      Q 150 85 170 85 
      Q 185 85 190 90
    `,
    viewBox: { width: 300, height: 200 },
    transform: { translateY: 40 },
    description: 'Two human figures standing side by side, holding hands'
  },

  // CANCER - Crab with claws extended
  cancer: {
    illustrationPath: `
      M 150 130 
      Q 120 120 100 130 
      Q 80 145 85 170 
      Q 90 195 115 210 
      Q 140 225 170 225 
      Q 200 225 225 210 
      Q 250 195 255 170 
      Q 260 145 240 130 
      Q 220 115 190 125 
      Q 170 135 150 130 Z
      M 100 130 
      Q 70 110 50 80 
      Q 40 60 55 50 
      Q 75 45 85 65 
      Q 95 90 100 130
      M 85 170 
      Q 55 165 35 150 
      Q 20 140 25 125 
      Q 35 115 55 125 
      Q 70 135 85 170
      M 240 130 
      Q 270 110 290 80 
      Q 300 60 285 50 
      Q 265 45 255 65 
      Q 245 90 240 130
      M 255 170 
      Q 285 165 305 150 
      Q 320 140 315 125 
      Q 305 115 285 125 
      Q 270 135 255 170
      M 115 210 
      Q 100 230 90 250
      M 140 225 
      Q 130 245 125 265
      M 200 225 
      Q 210 245 215 265
      M 225 210 
      Q 240 230 250 250
      M 145 160 
      Q 150 170 160 175 
      Q 175 175 185 170 
      Q 195 160 190 150
    `,
    viewBox: { width: 340, height: 280 },
    description: 'Crab with claws extended, legs spread'
  },

  // LEO - Majestic lion in profile
  leo: {
    illustrationPath: `
      M 80 140 
      Q 60 120 65 95 
      Q 70 70 90 55 
      Q 110 40 135 45 
      Q 160 50 175 70 
      Q 190 90 185 115 
      Q 180 140 160 155 
      Q 145 165 125 165 
      Q 105 165 90 155 
      Q 75 145 80 140 Z
      M 65 95 
      Q 45 90 35 75 
      Q 25 60 40 50 
      Q 55 40 70 55
      M 90 55 
      Q 80 35 90 25 
      Q 100 15 115 25 
      Q 125 35 120 50
      M 135 45 
      Q 145 25 160 20 
      Q 175 18 180 35 
      Q 182 50 175 70
      M 180 140 
      Q 210 150 240 155 
      Q 270 160 295 150 
      Q 320 140 330 120
      M 295 150 
      Q 305 170 300 190 
      Q 295 205 280 215
      M 160 155 
      Q 160 180 155 200 
      Q 150 215 140 230
      M 90 155 
      Q 85 175 80 195 
      Q 75 210 80 230
      M 110 95 
      Q 115 100 120 95
      M 145 95 
      Q 150 100 155 95
      M 125 120 
      Q 130 130 140 125
    `,
    viewBox: { width: 350, height: 250 },
    transform: { translateY: 20 },
    description: 'Majestic lion in profile, mane flowing'
  },

  // VIRGO - Female figure in flowing robes holding wheat
  virgo: {
    illustrationPath: `
      M 160 50 
      Q 145 40 150 25 
      Q 160 10 175 15 
      Q 190 20 190 35 
      Q 190 50 175 55 
      Q 165 58 160 50 Z
      M 170 55 
      L 165 80 
      L 160 120 
      L 155 180
      M 140 85 
      Q 155 95 165 80
      M 165 80 
      Q 175 95 190 85
      M 160 120 
      Q 135 130 115 160 
      Q 100 185 110 220
      M 160 120 
      Q 185 130 205 160 
      Q 220 185 210 220
      M 155 180 
      Q 130 200 120 240
      M 155 180 
      Q 180 200 190 240
      M 190 85 
      Q 215 75 235 70 
      Q 255 68 270 80 
      Q 280 95 275 110
      M 235 70 
      Q 245 55 260 50 
      Q 275 45 280 55
      M 255 68 
      Q 265 52 280 48
      M 270 80 
      Q 285 78 295 85
    `,
    viewBox: { width: 320, height: 260 },
    transform: { translateY: 10 },
    description: 'Female figure in flowing robes, holding wheat'
  },

  // LIBRA - Balance scales
  libra: {
    illustrationPath: `
      M 50 150 
      L 250 150
      M 150 150 
      L 150 80
      M 150 80 
      L 50 100 
      L 50 130 
      L 80 130 
      L 80 100 
      Q 65 90 50 100
      M 150 80 
      L 250 100 
      L 250 130 
      L 220 130 
      L 220 100 
      Q 235 90 250 100
      M 50 100 
      Q 65 105 80 100
      M 250 100 
      Q 235 105 220 100
      M 50 130 
      Q 55 140 65 140 
      Q 75 140 80 130
      M 220 130 
      Q 225 140 235 140 
      Q 245 140 250 130
      M 150 150 
      L 150 200
      M 120 200 
      L 180 200
    `,
    viewBox: { width: 300, height: 220 },
    transform: { translateY: 30 },
    description: 'Balance scales, two pans hanging from beam'
  },

  // SCORPIUS - Scorpion with curved tail and stinger
  scorpio: {
    illustrationPath: `
      M 60 120 
      Q 50 100 60 85 
      Q 75 70 95 75 
      Q 115 80 125 100 
      Q 135 120 130 140 
      Q 125 160 105 165 
      Q 85 168 70 155 
      Q 55 140 60 120 Z
      M 60 85 
      Q 40 75 30 55 
      Q 25 40 40 35 
      Q 55 32 60 50 
      Q 62 65 60 85
      M 50 100 
      Q 30 95 15 80 
      Q 5 70 12 55 
      Q 25 50 40 65
      M 130 140 
      Q 150 155 175 165 
      Q 200 175 225 175 
      Q 250 175 270 165 
      Q 285 155 295 140 
      Q 305 120 295 105 
      Q 280 95 265 105 
      Q 255 120 260 140
      M 260 140 
      Q 270 150 285 145 
      Q 295 138 300 125
      M 295 140 
      Q 310 150 325 145 
      Q 335 135 330 120
      M 70 155 
      Q 60 175 55 195
      M 90 168 
      Q 85 188 82 210
      M 115 165 
      Q 120 185 125 205
      M 85 105 
      Q 90 110 95 105
    `,
    viewBox: { width: 350, height: 230 },
    transform: { translateY: 30 },
    description: 'Scorpion with curved tail and stinger raised'
  },

  // SAGITTARIUS - Centaur drawing a bow and arrow (THE MAIN ONE)
  sagittarius: {
    illustrationPath: `
      M 160 70 
      Q 145 60 150 45 
      Q 158 30 175 35 
      Q 192 40 190 55 
      Q 188 70 175 75 
      Q 165 78 160 70 Z
      M 170 75 
      L 165 95 
      L 155 130 
      L 145 155
      M 145 155 
      Q 120 145 100 140 
      Q 80 138 60 145 
      Q 45 155 40 180
      M 145 155 
      Q 155 175 160 200 
      Q 165 225 155 250
      M 155 130 
      Q 140 125 125 130
      M 165 95 
      Q 180 105 195 100 
      Q 210 95 225 85
      M 195 100 
      Q 205 110 215 120 
      Q 225 130 220 145
      M 225 85 
      Q 250 70 280 55 
      Q 300 45 320 50
      M 280 55 
      L 50 55
      M 50 55 
      L 55 50 
      L 50 55 
      L 55 60
      M 145 155 
      L 165 165 
      L 180 165 
      L 195 165 
      L 215 170
      M 165 165 
      Q 155 185 145 200 
      Q 140 215 150 235
      M 180 165 
      Q 175 185 170 205 
      Q 168 225 180 245
      M 195 165 
      Q 200 185 210 200 
      Q 220 215 215 235
      M 215 170 
      Q 230 185 245 200 
      Q 255 215 250 240
    `,
    viewBox: { width: 350, height: 270 },
    transform: { scale: 0.95 },
    description: 'Centaur (half-man, half-horse) drawing a bow and arrow'
  },

  // CAPRICORNUS - Creature with goat head and fish tail
  capricorn: {
    illustrationPath: `
      M 80 100 
      Q 65 85 70 65 
      Q 80 45 100 50 
      Q 120 55 125 75 
      Q 130 95 120 110 
      Q 110 125 90 125 
      Q 75 122 80 100 Z
      M 70 65 
      Q 50 50 45 35 
      Q 42 22 55 20 
      Q 68 22 72 40
      M 100 50 
      Q 110 35 125 30 
      Q 140 28 145 42 
      Q 148 55 140 70
      M 120 110 
      Q 140 120 160 130 
      Q 180 140 200 145 
      Q 225 150 250 145 
      Q 275 138 290 120 
      Q 300 100 290 85
      M 290 85 
      Q 280 75 270 80 
      Q 265 90 275 100 
      Q 285 110 290 120
      M 250 145 
      Q 260 160 255 175 
      Q 248 188 235 185 
      Q 225 180 230 165
      M 275 138 
      Q 285 150 280 165 
      Q 273 178 260 175
      M 90 125 
      Q 85 145 90 165 
      Q 95 180 90 200
      M 100 130 
      Q 105 150 115 165 
      Q 125 180 120 200
      M 85 80 
      Q 90 85 95 80
    `,
    viewBox: { width: 320, height: 220 },
    transform: { translateY: 30 },
    description: 'Creature with goat head/front and fish tail'
  },

  // AQUARIUS - Figure pouring water from urn
  aquarius: {
    illustrationPath: `
      M 120 50 
      Q 105 40 110 25 
      Q 120 10 135 15 
      Q 150 20 150 35 
      Q 150 50 135 55 
      Q 125 58 120 50 Z
      M 130 55 
      L 125 80 
      L 120 120 
      L 115 170
      M 100 90 
      Q 115 100 125 80
      M 125 80 
      Q 135 100 155 95 
      Q 175 90 190 80 
      Q 205 70 220 75
      M 220 75 
      Q 240 80 255 95 
      Q 260 105 250 115 
      Q 240 120 230 115
      M 220 75 
      Q 230 90 225 105 
      Q 220 120 230 135
      M 230 115 
      Q 235 135 225 155 
      Q 215 175 230 195
      M 225 155 
      Q 240 170 250 190 
      Q 255 205 240 220
      M 230 195 
      Q 245 210 255 230
      M 240 220 
      Q 255 235 260 255
      M 120 120 
      Q 95 125 75 140 
      Q 60 155 70 180
      M 115 170 
      Q 95 180 85 200
      M 115 170 
      Q 135 180 145 200
    `,
    viewBox: { width: 300, height: 270 },
    transform: { translateX: 20 },
    description: 'Figure pouring water from urn/vessel'
  },

  // PISCES - Two fish swimming in opposite directions connected by cord
  pisces: {
    illustrationPath: `
      M 60 80 
      Q 40 65 45 45 
      Q 55 25 80 30 
      Q 105 35 115 55 
      Q 125 75 110 95 
      Q 95 110 70 105 
      Q 50 100 60 80 Z
      M 45 45 
      L 35 35
      M 115 55 
      Q 130 50 145 55 
      Q 160 60 165 70 
      Q 168 80 160 88 
      Q 150 92 145 85
      M 70 65 
      Q 75 70 80 65
      M 70 105 
      Q 85 120 100 135 
      Q 115 150 130 160 
      Q 150 175 170 175 
      Q 185 175 200 165
      M 240 190 
      Q 220 175 225 155 
      Q 235 135 260 140 
      Q 285 145 295 165 
      Q 305 185 290 205 
      Q 275 220 250 215 
      Q 230 210 240 190 Z
      M 225 155 
      L 215 145
      M 295 165 
      Q 310 160 325 165 
      Q 340 170 345 180 
      Q 348 190 340 198 
      Q 330 202 325 195
      M 260 175 
      Q 265 180 270 175
      M 200 165 
      Q 215 170 230 180 
      Q 238 188 240 190
    `,
    viewBox: { width: 370, height: 240 },
    transform: { translateY: 20 },
    description: 'Two fish swimming in opposite directions, connected by cord'
  }
};

// Color schemes for constellation rendering
export const CONSTELLATION_COLORS = {
  background: {
    gradient: {
      start: '#0a1128',
      end: '#1a1a1a'
    }
  },
  illustration: {
    stroke: '#2a3a4a',
    opacity: 0.15
  },
  stars: {
    default: '#e8e8e8',
    warm: '#e8e8e8',
    orange: '#ffb366',  // Aldebaran (Taurus)
    blueWhite: '#d4e4ff', // Regulus (Leo), Spica (Virgo)
    red: '#ff9999',      // Antares (Scorpius)
    greenTint: '#e8ffe8', // Zubeneschamali (Libra)
    paleBlue: '#d4e8ff'   // Aquarius stars
  },
  lines: {
    constellation: {
      stroke: '#ffffff',
      opacity: 0.4,
      dashArray: '3,3'
    },
    family: {
      stroke: '#C4A574',
      opacity: 0.6
    }
  }
};

// Special star colors for specific constellations
export const SPECIAL_STAR_COLORS: Partial<Record<ZodiacSign, Record<string, string>>> = {
  taurus: {
    aldebaran: '#ffb366'  // Orange-red eye of the bull
  },
  leo: {
    regulus: '#d4e4ff'    // Blue-white heart
  },
  virgo: {
    spica: '#c8d4ff'      // Bright blue-white
  },
  libra: {
    'zuben-sch': '#e8ffe8' // Greenish tint
  },
  scorpio: {
    antares: '#ff9999'    // Red heart of the scorpion
  },
  aquarius: {
    sadalsuud: '#d4e8ff',
    sadalmelik: '#d4e8ff'
  }
};

// Get the special color for a star, if any
export const getStarColor = (sign: ZodiacSign, starId: string): string => {
  const signColors = SPECIAL_STAR_COLORS[sign];
  if (signColors && signColors[starId]) {
    return signColors[starId];
  }
  return CONSTELLATION_COLORS.stars.default;
};
