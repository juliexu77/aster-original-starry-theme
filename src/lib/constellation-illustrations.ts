import { ZodiacSign } from "./zodiac";

interface ConstellationIllustration {
  // SVG path for the mythological illustration outline
  outlinePath: string;
  // SVG path for interior detail lines
  detailPath: string;
  // Viewbox dimensions for the illustration
  viewBox: { width: number; height: number };
  // Recommended scale and position adjustments
  transform?: { scale?: number; translateX?: number; translateY?: number };
  // Description of the mythological figure
  description: string;
}

// Mythological illustrations as SVG paths for each zodiac constellation
// Styled like the golden zodiac symbols - outline with interior detail
export const CONSTELLATION_ILLUSTRATIONS: Record<ZodiacSign, ConstellationIllustration> = {
  // ARIES - Ram in profile with curved horns
  aries: {
    outlinePath: `
      M 140 200 
      Q 100 195 75 175 
      Q 55 155 50 130 
      Q 45 100 60 75 
      Q 80 50 115 45 
      Q 150 42 180 55 
      Q 210 70 225 100 
      Q 235 130 225 160 
      Q 210 190 180 200 
      Q 160 205 140 200 Z
      M 60 75 
      Q 40 50 35 30 
      Q 32 15 45 12 
      Q 60 10 70 25 
      Q 78 40 75 60
      M 115 45 
      Q 125 25 145 15 
      Q 165 8 175 20 
      Q 182 35 175 55
      M 50 130 
      Q 30 135 15 150
      M 225 160 
      Q 255 165 280 155 
      Q 305 145 320 125 
      Q 330 105 325 85
      M 180 200 
      Q 175 225 165 245
      M 140 200 
      Q 130 225 120 245
    `,
    detailPath: `
      M 90 110 Q 95 105 100 110
      M 145 100 Q 150 95 155 100
      M 115 145 Q 125 155 140 152 Q 155 148 160 138
      M 80 85 Q 95 80 110 85
      M 150 75 Q 165 72 180 78
      M 100 130 Q 110 140 125 138
      M 145 128 Q 155 138 170 135
    `,
    viewBox: { width: 350, height: 280 },
    description: 'Ram in profile with curved horns'
  },

  // TAURUS - Powerful bull charging forward
  taurus: {
    outlinePath: `
      M 180 220 
      Q 140 210 110 185 
      Q 85 160 80 125 
      Q 78 95 95 70 
      Q 115 45 150 40 
      Q 185 38 215 50 
      Q 250 65 270 95 
      Q 285 125 280 160 
      Q 270 195 240 215 
      Q 210 230 180 220 Z
      M 95 70 
      Q 60 40 40 20 
      Q 28 8 18 18 
      Q 10 32 20 48 
      Q 35 68 60 82
      M 215 50 
      Q 250 25 280 15 
      Q 300 10 310 25 
      Q 318 42 305 60 
      Q 285 80 260 90
      M 80 125 
      Q 55 130 35 145
      M 280 160 
      Q 305 165 325 180
      M 180 220 
      Q 175 245 168 270
      M 240 215 
      Q 245 240 250 265
    `,
    detailPath: `
      M 130 110 Q 138 105 145 112
      M 195 105 Q 203 100 210 107
      M 160 155 Q 175 168 195 162
      M 145 85 Q 160 80 175 82 Q 190 85 200 92
      M 110 100 Q 125 95 140 100
      M 200 95 Q 215 92 230 98
      M 150 130 Q 160 140 175 138
      M 180 130 Q 195 140 210 135
      M 165 180 Q 175 188 190 185
    `,
    viewBox: { width: 350, height: 290 },
    transform: { scale: 0.95 },
    description: 'Powerful bull with horns lowered'
  },

  // GEMINI - Twin figures standing together
  gemini: {
    outlinePath: `
      M 85 60 
      Q 70 50 75 35 
      Q 82 20 100 22 
      Q 118 25 120 42 
      Q 120 58 105 65 
      Q 92 70 85 60 Z
      M 100 70 
      L 95 95 
      L 85 145 
      L 75 200
      M 70 110 Q 85 120 95 105
      M 95 105 Q 105 120 125 110
      M 85 145 L 55 200
      M 85 145 L 105 200
      M 195 60 
      Q 180 50 185 35 
      Q 192 20 210 22 
      Q 228 25 230 42 
      Q 230 58 215 65 
      Q 202 70 195 60 Z
      M 210 70 
      L 205 95 
      L 195 145 
      L 185 200
      M 180 110 Q 195 120 205 105
      M 205 105 Q 215 120 235 110
      M 195 145 L 165 200
      M 195 145 L 215 200
      M 120 42 Q 145 30 170 30 Q 195 32 210 42
      M 125 110 Q 145 100 165 100 Q 185 102 195 110
    `,
    detailPath: `
      M 92 42 Q 98 40 102 45
      M 202 42 Q 208 40 212 45
      M 88 52 Q 95 58 105 55
      M 198 52 Q 205 58 215 55
      M 80 130 Q 90 138 100 135
      M 190 130 Q 200 138 210 135
      M 82 170 Q 90 175 98 172
      M 192 170 Q 200 175 208 172
    `,
    viewBox: { width: 300, height: 220 },
    transform: { translateY: 20 },
    description: 'Twin figures standing side by side'
  },

  // CANCER - Crab with claws raised
  cancer: {
    outlinePath: `
      M 160 145 
      Q 120 135 95 150 
      Q 70 170 75 200 
      Q 80 230 110 250 
      Q 145 268 185 268 
      Q 225 268 260 250 
      Q 290 230 295 200 
      Q 300 170 275 150 
      Q 250 135 210 145 
      Q 185 152 160 145 Z
      M 95 150 
      Q 60 125 40 90 
      Q 30 65 50 50 
      Q 72 40 88 60 
      Q 100 82 95 115
      M 70 170 
      Q 35 160 15 140 
      Q 0 125 10 108 
      Q 25 95 48 108 
      Q 65 125 75 155
      M 275 150 
      Q 310 125 330 90 
      Q 340 65 320 50 
      Q 298 40 282 60 
      Q 270 82 275 115
      M 300 170 
      Q 335 160 355 140 
      Q 370 125 360 108 
      Q 345 95 322 108 
      Q 305 125 295 155
      M 110 250 Q 105 275 98 295
      M 150 268 Q 148 290 145 310
      M 220 268 Q 222 290 225 310
      M 260 250 Q 265 275 272 295
    `,
    detailPath: `
      M 145 185 Q 155 180 165 185
      M 195 185 Q 205 180 215 185
      M 165 215 Q 180 225 200 220
      M 130 200 Q 145 210 165 205
      M 205 200 Q 225 210 240 205
      M 55 75 Q 65 70 72 78
      M 298 75 Q 308 70 315 78
      M 35 120 Q 45 115 52 122
      M 318 120 Q 328 115 335 122
    `,
    viewBox: { width: 370, height: 330 },
    transform: { scale: 0.85 },
    description: 'Crab with claws raised and extended'
  },

  // LEO - Majestic lion with flowing mane
  leo: {
    outlinePath: `
      M 80 155 
      Q 55 130 60 100 
      Q 68 70 95 50 
      Q 125 30 165 35 
      Q 200 40 225 65 
      Q 245 90 240 125 
      Q 232 160 200 180 
      Q 170 195 135 190 
      Q 100 185 80 165 Z
      M 60 100 
      Q 35 90 25 70 
      Q 18 52 35 42 
      Q 55 35 68 52
      M 95 50 
      Q 85 28 95 15 
      Q 108 5 125 15 
      Q 135 28 130 48
      M 165 35 
      Q 175 12 195 8 
      Q 215 6 222 22 
      Q 225 42 215 60
      M 240 125 
      Q 270 135 300 140 
      Q 330 145 355 135 
      Q 380 120 385 95
      M 355 135 
      Q 365 158 358 180 
      Q 348 200 325 200 
      Q 305 198 310 175
      M 200 180 
      Q 195 210 185 235
      M 135 190 
      Q 125 215 115 240
      M 80 165 
      Q 70 195 65 225
    `,
    detailPath: `
      M 115 100 Q 125 95 135 102
      M 175 95 Q 185 90 195 97
      M 145 140 Q 160 152 180 148
      M 90 75 Q 105 68 120 75
      M 170 65 Q 185 60 200 68
      M 120 120 Q 135 130 155 125
      M 165 118 Q 180 128 200 122
      M 280 140 Q 295 145 310 140
      M 330 120 Q 345 125 360 118
    `,
    viewBox: { width: 410, height: 260 },
    transform: { scale: 0.88, translateY: 15 },
    description: 'Majestic lion with flowing mane'
  },

  // VIRGO - Maiden with flowing robes and wheat
  virgo: {
    outlinePath: `
      M 155 60 
      Q 138 48 145 30 
      Q 155 12 175 16 
      Q 195 22 195 42 
      Q 192 60 175 68 
      Q 162 72 155 60 Z
      M 172 70 
      L 165 100 
      L 155 150 
      L 145 210
      M 140 110 Q 158 122 165 105
      M 165 105 Q 172 120 195 115
      M 155 150 
      Q 125 165 100 195 
      Q 85 220 95 255
      M 155 150 
      Q 185 165 210 195 
      Q 225 220 215 255
      M 145 210 
      Q 120 230 105 270
      M 145 210 
      Q 170 230 185 270
      M 195 115 
      Q 225 105 250 100 
      Q 275 98 295 110
      M 250 100 
      Q 265 82 285 75 
      Q 305 70 315 82
      M 275 98 
      Q 290 80 310 75
      M 295 110 
      Q 312 108 325 118
    `,
    detailPath: `
      M 162 38 Q 170 34 178 40
      M 158 52 Q 168 58 180 54
      M 150 130 Q 162 138 175 134
      M 130 180 Q 145 190 165 185
      M 165 185 Q 185 195 205 188
      M 115 235 Q 128 245 145 240
      M 175 235 Q 190 245 208 238
      M 260 95 Q 272 92 282 98
      M 295 102 Q 305 98 315 105
    `,
    viewBox: { width: 345, height: 290 },
    transform: { scale: 0.92 },
    description: 'Maiden in flowing robes holding wheat'
  },

  // LIBRA - Balanced scales
  libra: {
    outlinePath: `
      M 50 180 
      L 270 180
      M 160 180 
      L 160 100
      M 160 100 
      L 60 125
      M 60 125 
      L 50 155 
      L 70 170 
      L 95 170 
      L 105 155 
      L 95 125 
      Q 78 118 60 125
      M 160 100 
      L 260 125
      M 260 125 
      L 250 155 
      L 270 170 
      L 295 170 
      L 305 155 
      L 295 125 
      Q 278 118 260 125
      M 60 125 
      Q 78 132 95 125
      M 260 125 
      Q 278 132 295 125
      M 50 155 
      Q 60 165 72 168 
      Q 85 170 95 165
      M 250 155 
      Q 260 165 272 168 
      Q 285 170 295 165
      M 160 180 
      L 160 230
      M 130 230 
      L 190 230
      M 130 230 
      Q 125 242 130 250
      M 190 230 
      Q 195 242 190 250
    `,
    detailPath: `
      M 65 145 Q 72 142 78 148
      M 85 145 Q 92 142 98 148
      M 255 145 Q 262 142 268 148
      M 275 145 Q 282 142 288 148
      M 72 160 Q 80 165 90 162
      M 262 160 Q 270 165 280 162
      M 155 130 Q 160 125 165 130
      M 155 150 Q 160 145 165 150
    `,
    viewBox: { width: 330, height: 270 },
    transform: { translateY: 5, scale: 0.95 },
    description: 'Balanced scales of justice'
  },

  // SCORPIO - Scorpion with curved tail and stinger
  scorpio: {
    outlinePath: `
      M 70 130 
      Q 50 110 58 85 
      Q 70 60 100 62 
      Q 130 65 145 90 
      Q 155 115 145 145 
      Q 132 170 100 175 
      Q 72 178 60 155 
      Q 52 138 70 130 Z
      M 58 85 
      Q 35 72 25 50 
      Q 20 32 38 28 
      Q 58 26 65 48 
      Q 68 65 62 82
      M 50 110 
      Q 28 102 15 82 
      Q 6 65 20 52 
      Q 38 48 50 68
      M 145 145 
      Q 175 160 210 170 
      Q 245 178 280 175 
      Q 310 170 330 155 
      Q 350 135 345 110 
      Q 338 88 315 92 
      Q 298 100 305 125 
      Q 315 145 330 155
      M 330 155 
      Q 350 165 370 158 
      Q 385 148 380 128 
      Q 372 115 355 125
      M 60 155 
      Q 50 180 48 205
      M 85 178 
      Q 80 200 78 225
      M 120 175 
      Q 125 198 128 222
    `,
    detailPath: `
      M 85 100 Q 95 95 105 102
      M 100 125 Q 112 135 128 130
      M 32 58 Q 42 52 50 60
      M 28 78 Q 38 72 48 80
      M 260 172 Q 275 175 290 170
      M 300 148 Q 315 155 328 148
      M 355 138 Q 365 145 375 138
      M 75 120 Q 88 128 102 122
    `,
    viewBox: { width: 400, height: 245 },
    transform: { scale: 0.82, translateY: 25 },
    description: 'Scorpion with curved tail and stinger'
  },

  // SAGITTARIUS - Centaur archer drawing bow
  sagittarius: {
    outlinePath: `
      M 170 75 
      Q 152 62 158 42 
      Q 168 22 190 28 
      Q 212 35 210 58 
      Q 205 78 185 85 
      Q 175 88 170 75 Z
      M 185 88 
      L 175 120 
      L 160 160
      M 145 130 Q 165 142 175 125
      M 175 125 Q 185 138 210 130
      M 210 130 
      Q 225 140 240 145 
      Q 255 148 265 142
      M 240 145 
      L 55 65
      M 55 65 
      L 50 58 
      M 55 65 
      L 62 58
      M 265 142 
      Q 300 125 335 115 
      Q 365 108 385 120
      M 160 160 
      L 175 175 
      L 195 175 
      L 218 175 
      L 250 185
      M 175 175 
      Q 165 200 155 230
      M 195 175 
      Q 188 200 182 230
      M 218 175 
      Q 228 200 240 230
      M 250 185 
      Q 268 205 285 235
      M 160 160 
      Q 130 155 105 165 
      Q 78 178 68 210
    `,
    detailPath: `
      M 178 50 Q 188 45 195 52
      M 175 65 Q 185 72 198 68
      M 155 145 Q 168 152 182 148
      M 80 75 Q 100 72 115 80
      M 120 85 Q 140 82 155 90
      M 285 125 Q 305 122 325 128
      M 182 190 Q 195 198 212 195
      M 230 195 Q 248 202 268 198
    `,
    viewBox: { width: 410, height: 260 },
    transform: { scale: 0.88 },
    description: 'Centaur archer drawing bow and arrow'
  },

  // CAPRICORN - Sea-goat with fish tail
  capricorn: {
    outlinePath: `
      M 85 115 
      Q 65 98 72 72 
      Q 82 48 115 52 
      Q 145 58 155 85 
      Q 162 110 150 138 
      Q 135 162 102 165 
      Q 75 165 70 138 
      Q 68 122 85 115 Z
      M 72 72 
      Q 48 55 45 35 
      Q 44 18 60 15 
      Q 78 15 85 35 
      Q 88 52 82 70
      M 115 52 
      Q 130 32 152 28 
      Q 172 26 178 45 
      Q 180 62 168 80
      M 150 138 
      Q 180 150 212 158 
      Q 248 165 285 158 
      Q 318 148 338 125 
      Q 355 100 345 78
      M 345 78 
      Q 335 65 318 72 
      Q 308 85 318 105 
      Q 332 125 350 135
      M 285 158 
      Q 298 178 290 198 
      Q 280 215 260 210 
      Q 245 202 252 182
      M 318 148 
      Q 332 165 325 185 
      Q 315 202 295 198
      M 102 165 
      Q 95 190 100 215
      M 120 165 
      Q 130 190 138 215
    `,
    detailPath: `
      M 98 85 Q 108 80 118 88
      M 105 115 Q 118 125 135 120
      M 58 52 Q 68 48 78 55
      M 145 58 Q 158 55 168 62
      M 240 160 Q 258 165 278 158
      M 305 135 Q 322 142 338 135
      M 325 95 Q 335 102 345 95
      M 95 140 Q 108 148 125 142
    `,
    viewBox: { width: 375, height: 235 },
    transform: { scale: 0.88, translateY: 20 },
    description: 'Sea-goat with goat head and fish tail'
  },

  // AQUARIUS - Water bearer pouring from urn
  aquarius: {
    outlinePath: `
      M 125 60 
      Q 108 48 115 30 
      Q 125 12 148 16 
      Q 168 22 168 42 
      Q 165 60 148 68 
      Q 135 72 125 60 Z
      M 145 70 
      L 138 100 
      L 128 150 
      L 118 210
      M 115 115 Q 132 125 138 108
      M 138 108 Q 148 122 175 115
      M 175 115 
      Q 205 108 230 100 
      Q 258 95 280 105
      M 230 100 
      L 245 170
      M 245 170 
      Q 250 185 245 200 
      Q 238 218 220 222 
      Q 200 225 198 205
      M 280 105 
      L 310 110 
      L 340 115
      M 128 150 
      Q 102 165 85 200 
      Q 75 235 90 270
      M 128 150 
      Q 155 165 175 200 
      Q 185 235 170 270
      M 118 210 
      Q 95 230 85 265
      M 118 210 
      Q 140 230 152 265
      M 280 140 
      Q 260 155 255 175
      M 320 145 
      Q 300 162 295 185
      M 350 148 
      Q 332 168 328 195
    `,
    detailPath: `
      M 135 38 Q 145 34 155 40
      M 132 52 Q 142 58 155 54
      M 125 135 Q 138 142 152 138
      M 98 185 Q 115 195 138 188
      M 142 185 Q 162 195 185 188
      M 232 135 Q 248 142 268 135
      M 252 180 Q 265 188 280 182
      M 290 178 Q 305 185 322 178
    `,
    viewBox: { width: 375, height: 290 },
    transform: { scale: 0.88 },
    description: 'Water bearer pouring from urn'
  },

  // PISCES - Two fish swimming in opposite directions
  pisces: {
    outlinePath: `
      M 80 70 
      Q 55 60 45 40 
      Q 40 20 60 15 
      Q 82 12 95 30 
      Q 108 50 100 75 
      Q 92 98 68 105 
      Q 48 108 45 85 
      Q 45 72 60 68 
      Q 72 65 80 70 Z
      M 45 40 
      Q 28 35 20 48 
      Q 15 62 28 72
      M 100 75 
      L 160 85 
      L 220 100 
      L 160 115 
      L 100 125
      M 100 125 
      Q 75 132 60 155 
      Q 48 180 55 205 
      Q 65 228 95 230 
      Q 125 230 140 208 
      Q 155 185 145 158 
      Q 132 135 100 125 Z
      M 55 205 
      Q 38 210 28 195 
      Q 22 178 38 170
      M 220 100 
      Q 250 108 275 140 
      Q 298 175 292 210 
      Q 282 245 248 250 
      Q 215 252 198 225 
      Q 182 198 195 165 
      Q 212 138 250 130 
      Q 275 125 285 145 
      Q 292 165 275 178 
      Q 258 188 248 175 
      Q 242 160 255 152
      M 292 210 
      Q 312 218 325 205 
      Q 335 188 318 175
    `,
    detailPath: `
      M 62 48 Q 72 44 82 52
      M 70 78 Q 82 85 95 80
      M 115 92 Q 135 88 155 92
      M 155 108 Q 175 105 195 110
      M 75 165 Q 88 162 100 170
      M 85 195 Q 100 202 118 195
      M 235 165 Q 250 162 265 170
      M 245 205 Q 262 212 280 205
    `,
    viewBox: { width: 360, height: 275 },
    transform: { scale: 0.9, translateY: 5 },
    description: 'Two fish swimming in opposite directions, bound by cord'
  },
};

// Color schemes for constellation rendering
export const CONSTELLATION_COLORS = {
  background: {
    gradient: {
      start: '#0a0a12',
      end: '#12121e',
    },
  },
  stars: {
    default: '#e8e4d9',
    bright: '#fff5e0',
    dim: '#a8a090',
  },
  illustration: {
    stroke: '#4a5a6a',
    fill: 'none',
    opacity: 0.15,
  },
  lines: {
    constellation: {
      stroke: '#ffffff',
      opacity: 0.4,
    },
    relationship: {
      stroke: '#D4A574',
      opacity: 0.8,
    },
  },
};

// Special star colors for specific constellations
export const SPECIAL_STAR_COLORS: Partial<Record<ZodiacSign, Record<string, string>>> = {
  taurus: {
    'aldebaran': '#ffb090', // Orange-red giant
  },
  leo: {
    'regulus': '#b8c8ff', // Blue-white
  },
  virgo: {
    'spica': '#aaccff', // Blue-white
  },
  scorpio: {
    'antares': '#ff9080', // Red supergiant
  },
  gemini: {
    'castor': '#fff8e0',
    'pollux': '#ffd8a0', // Orange giant
  },
  aquarius: {
    'sadalsuud': '#fffadc',
  },
};

export const getStarColor = (sign: ZodiacSign, starId: string): string => {
  const signColors = SPECIAL_STAR_COLORS[sign];
  if (signColors && signColors[starId]) {
    return signColors[starId];
  }
  return CONSTELLATION_COLORS.stars.default;
};
