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

// Mythological illustrations as SVG paths - stylized like classic zodiac artwork
// Clean angular lines, iconic silhouettes, less organic/cartoonish
export const CONSTELLATION_ILLUSTRATIONS: Record<ZodiacSign, ConstellationIllustration> = {
  // ARIES - Stylized ram with bold curved horns
  aries: {
    outlinePath: `
      M 160 185 L 130 175 L 105 155 L 90 130 L 85 100 L 95 75 L 115 55 L 145 48 L 175 52 L 200 68 L 215 92 L 218 120 L 208 150 L 185 172 L 160 185 Z
      M 95 75 L 75 55 L 60 35 L 55 20 L 65 15 L 80 22 L 90 42 L 95 65
      M 145 48 L 155 28 L 172 15 L 188 12 L 195 22 L 188 40 L 175 55
      M 218 120 L 248 125 L 280 118 L 305 100
      M 130 175 L 120 205 L 115 235
      M 185 172 L 195 200 L 200 230
    `,
    detailPath: `
      M 118 105 L 128 100 L 138 108
      M 165 98 L 175 93 L 185 100
      M 140 138 L 155 148 L 175 142
      M 100 85 L 115 80 L 130 88
      M 170 78 L 185 75 L 198 82
    `,
    viewBox: { width: 340, height: 260 },
    description: 'Stylized ram with curved horns'
  },

  // TAURUS - Bold bull silhouette
  taurus: {
    outlinePath: `
      M 175 210 L 140 200 L 110 180 L 88 152 L 78 120 L 82 88 L 100 62 L 135 48 L 175 45 L 215 52 L 248 72 L 268 102 L 272 138 L 258 172 L 232 198 L 195 212 L 175 210 Z
      M 100 62 L 70 38 L 48 18 L 35 15 L 28 28 L 38 48 L 58 68
      M 248 72 L 278 48 L 302 25 L 318 22 L 325 35 L 315 55 L 292 78
      M 78 120 L 52 128 L 30 145
      M 272 138 L 298 148 L 322 162
      M 140 200 L 130 235 L 125 265
      M 232 198 L 245 232 L 252 262
    `,
    detailPath: `
      M 125 108 L 138 102 L 152 110
      M 198 102 L 212 96 L 228 105
      M 158 155 L 175 165 L 195 158
      M 112 90 L 130 85 L 148 92
      M 202 88 L 222 82 L 242 92
      M 165 130 L 180 140 L 198 135
    `,
    viewBox: { width: 360, height: 285 },
    transform: { scale: 0.92 },
    description: 'Powerful bull with lowered horns'
  },

  // GEMINI - Twin figures in angular style
  gemini: {
    outlinePath: `
      M 88 55 L 78 42 L 82 28 L 98 22 L 115 28 L 118 45 L 108 58 L 95 62 L 88 55 Z
      M 102 65 L 98 95 L 92 135 L 85 185
      M 78 105 L 95 115 L 115 105
      M 92 135 L 65 185
      M 92 135 L 115 185
      M 212 55 L 202 42 L 206 28 L 222 22 L 238 28 L 242 45 L 232 58 L 218 62 L 212 55 Z
      M 225 65 L 222 95 L 215 135 L 208 185
      M 202 105 L 218 115 L 238 105
      M 215 135 L 188 185
      M 215 135 L 238 185
      M 118 38 L 150 28 L 182 28 L 215 38
      M 115 105 L 145 95 L 175 95 L 202 105
    `,
    detailPath: `
      M 95 42 L 102 38 L 110 45
      M 218 42 L 225 38 L 232 45
      M 85 155 L 95 162 L 108 158
      M 208 155 L 218 162 L 232 158
    `,
    viewBox: { width: 300, height: 205 },
    transform: { translateY: 25 },
    description: 'Twin figures connected'
  },

  // CANCER - Geometric crab with angular claws
  cancer: {
    outlinePath: `
      M 170 140 L 130 135 L 100 150 L 82 175 L 85 205 L 105 235 L 145 255 L 190 258 L 235 250 L 268 225 L 282 195 L 278 162 L 255 140 L 215 135 L 170 140 Z
      M 100 150 L 68 125 L 45 95 L 38 68 L 52 55 L 72 62 L 85 92 L 95 125
      M 82 175 L 48 168 L 22 152 L 12 132 L 25 118 L 48 128 L 72 152
      M 255 140 L 288 118 L 315 88 L 325 62 L 312 48 L 290 58 L 275 88 L 262 122
      M 278 162 L 312 158 L 342 142 L 355 125 L 342 108 L 318 118 L 292 145
      M 105 235 L 98 268 L 95 295
      M 145 255 L 142 285 L 140 312
      M 235 250 L 242 282 L 248 308
      M 268 225 L 278 258 L 285 288
    `,
    detailPath: `
      M 148 185 L 165 178 L 182 185
      M 202 180 L 218 175 L 235 182
      M 165 215 L 185 225 L 208 218
      M 55 82 L 68 78 L 78 88
      M 295 78 L 308 72 L 318 82
    `,
    viewBox: { width: 375, height: 330 },
    transform: { scale: 0.82 },
    description: 'Crab with raised angular claws'
  },

  // LEO - Majestic lion with geometric mane
  leo: {
    outlinePath: `
      M 85 148 L 62 122 L 58 92 L 72 62 L 98 42 L 135 35 L 175 42 L 208 62 L 228 95 L 232 130 L 218 162 L 190 185 L 152 192 L 115 185 L 88 165 L 85 148 Z
      M 58 92 L 35 82 L 22 62 L 28 45 L 48 42 L 62 58
      M 98 42 L 88 22 L 98 8 L 118 12 L 128 32
      M 135 35 L 138 15 L 155 8 L 172 15 L 172 35
      M 175 42 L 188 22 L 208 18 L 218 32 L 212 52
      M 232 130 L 268 138 L 305 142 L 342 132 L 372 112
      M 342 132 L 358 158 L 352 188 L 328 198 L 312 182
      M 190 185 L 185 218 L 178 252
      M 152 192 L 142 225 L 135 258
      M 115 185 L 102 218 L 92 252
    `,
    detailPath: `
      M 112 95 L 128 88 L 145 98
      M 172 88 L 188 82 L 205 92
      M 145 138 L 165 152 L 188 145
      M 75 72 L 88 68 L 102 78
      M 192 68 L 208 62 L 222 72
      M 285 140 L 308 145 L 332 138
    `,
    viewBox: { width: 400, height: 275 },
    transform: { scale: 0.85, translateY: 10 },
    description: 'Majestic lion with geometric mane'
  },

  // VIRGO - Elegant maiden with angular robes
  virgo: {
    outlinePath: `
      M 152 55 L 142 42 L 148 25 L 168 20 L 188 28 L 192 48 L 182 62 L 168 68 L 155 62 L 152 55 Z
      M 170 70 L 165 102 L 158 148 L 148 210
      M 145 115 L 162 128 L 185 118
      M 158 148 L 125 172 L 98 210 L 92 258
      M 158 148 L 192 172 L 218 210 L 225 258
      M 148 210 L 118 242 L 102 285
      M 148 210 L 178 242 L 195 285
      M 185 118 L 218 108 L 252 102 L 282 112
      M 252 102 L 272 82 L 295 72 L 315 78
      M 282 112 L 305 108 L 325 118
    `,
    detailPath: `
      M 162 38 L 172 35 L 182 42
      M 158 52 L 168 58 L 180 52
      M 152 132 L 168 142 L 185 135
      M 118 195 L 138 205 L 162 198
      M 168 198 L 192 208 L 215 200
      M 262 98 L 278 95 L 295 102
    `,
    viewBox: { width: 350, height: 305 },
    transform: { scale: 0.88 },
    description: 'Elegant maiden with flowing angular robes'
  },

  // LIBRA - Geometric balanced scales
  libra: {
    outlinePath: `
      M 45 175 L 275 175
      M 160 175 L 160 95
      M 160 95 L 55 122
      M 55 122 L 45 155 L 55 168 L 85 168 L 95 155 L 85 122 L 55 122
      M 160 95 L 265 122
      M 265 122 L 255 155 L 265 168 L 295 168 L 305 155 L 295 122 L 265 122
      M 55 168 L 70 178 L 85 168
      M 265 168 L 280 178 L 295 168
      M 160 175 L 160 225
      M 125 225 L 195 225
      M 125 225 L 118 242
      M 195 225 L 202 242
    `,
    detailPath: `
      M 62 142 L 72 138 L 82 145
      M 272 142 L 282 138 L 292 145
      M 65 158 L 75 162 L 88 158
      M 275 158 L 285 162 L 298 158
      M 155 125 L 160 118 L 165 125
      M 155 148 L 160 142 L 165 148
    `,
    viewBox: { width: 330, height: 260 },
    transform: { translateY: 15, scale: 0.95 },
    description: 'Geometric balanced scales'
  },

  // SCORPIO - Angular scorpion with sharp tail
  scorpio: {
    outlinePath: `
      M 72 125 L 55 105 L 55 78 L 72 58 L 98 55 L 125 65 L 142 92 L 145 125 L 132 155 L 105 168 L 75 165 L 58 145 L 62 125 L 72 125 Z
      M 55 78 L 35 62 L 22 42 L 25 25 L 42 22 L 55 38 L 58 62
      M 55 105 L 32 95 L 15 75 L 15 55 L 32 48 L 48 65
      M 145 125 L 178 142 L 218 155 L 262 162 L 305 155 L 338 135 L 355 108 L 352 82 L 332 75 L 318 92 L 328 118 L 348 142
      M 348 142 L 372 152 L 392 142 L 398 118 L 382 105
      M 75 165 L 68 198 L 65 228
      M 105 168 L 102 200 L 100 232
      M 132 155 L 138 188 L 145 220
    `,
    detailPath: `
      M 88 92 L 102 88 L 115 98
      M 98 128 L 115 138 L 132 130
      M 38 52 L 48 48 L 58 55
      M 265 158 L 288 162 L 312 155
      M 335 118 L 348 125 L 362 118
      M 378 125 L 388 130 L 395 122
    `,
    viewBox: { width: 420, height: 250 },
    transform: { scale: 0.78, translateY: 25 },
    description: 'Angular scorpion with raised stinger'
  },

  // SAGITTARIUS - Dynamic centaur archer
  sagittarius: {
    outlinePath: `
      M 175 72 L 162 55 L 168 38 L 188 32 L 208 42 L 212 62 L 200 78 L 185 82 L 175 72 Z
      M 192 85 L 185 118 L 172 158
      M 158 128 L 178 142 L 202 132
      M 202 132 L 225 142 L 252 148
      M 252 148 L 55 68
      M 55 68 L 48 58 L 55 68 L 62 58
      M 252 148 L 295 135 L 342 125 L 385 138
      M 172 158 L 188 175 L 212 178 L 238 182 L 272 195
      M 188 175 L 175 208 L 165 248
      M 212 178 L 205 212 L 198 252
      M 238 182 L 248 218 L 262 255
      M 272 195 L 295 225 L 318 265
      M 172 158 L 138 155 L 108 168 L 85 202
    `,
    detailPath: `
      M 182 52 L 192 48 L 202 55
      M 178 68 L 188 75 L 200 68
      M 165 142 L 180 152 L 198 145
      M 95 75 L 125 72 L 155 82
      M 295 138 L 325 132 L 358 140
      M 195 195 L 215 205 L 242 198
    `,
    viewBox: { width: 415, height: 285 },
    transform: { scale: 0.85 },
    description: 'Dynamic centaur archer with drawn bow'
  },

  // CAPRICORN - Angular sea-goat
  capricorn: {
    outlinePath: `
      M 88 112 L 72 92 L 75 65 L 95 48 L 125 48 L 152 62 L 165 92 L 162 125 L 142 152 L 112 162 L 82 155 L 70 132 L 78 115 L 88 112 Z
      M 75 65 L 52 48 L 42 28 L 48 15 L 68 15 L 78 35 L 82 55
      M 125 48 L 142 28 L 165 18 L 185 25 L 188 45 L 175 65
      M 162 125 L 198 142 L 242 155 L 292 158 L 338 145 L 368 118 L 378 88
      M 378 88 L 368 72 L 348 78 L 345 102 L 362 128 L 385 145
      M 292 158 L 308 185 L 298 212 L 272 218 L 258 198
      M 338 145 L 358 172 L 348 202 L 322 208
      M 112 162 L 108 198 L 112 235
      M 142 152 L 152 188 L 162 225
    `,
    detailPath: `
      M 102 82 L 118 78 L 132 88
      M 112 118 L 128 128 L 148 120
      M 58 42 L 72 38 L 85 48
      M 248 158 L 275 162 L 305 155
      M 352 105 L 368 112 L 380 102
      M 312 188 L 328 195 L 348 185
    `,
    viewBox: { width: 410, height: 255 },
    transform: { scale: 0.82, translateY: 18 },
    description: 'Angular sea-goat with fish tail'
  },

  // AQUARIUS - Geometric water bearer
  aquarius: {
    outlinePath: `
      M 128 58 L 115 42 L 122 25 L 142 20 L 162 28 L 168 48 L 158 62 L 142 68 L 130 62 L 128 58 Z
      M 148 72 L 142 108 L 132 158 L 122 218
      M 122 122 L 140 135 L 165 125
      M 165 125 L 202 115 L 242 108 L 278 118
      M 242 108 L 258 178
      M 258 178 L 268 202 L 258 225 L 232 232 L 218 212
      M 278 118 L 312 125 L 348 132
      M 132 158 L 102 178 L 82 218 L 85 268
      M 132 158 L 165 180 L 188 222 L 182 272
      M 122 218 L 98 248 L 88 288
      M 122 218 L 148 252 L 162 292
      M 285 155 L 268 175 L 262 202
      M 325 162 L 305 185 L 298 215
      M 358 168 L 342 195 L 335 228
    `,
    detailPath: `
      M 138 42 L 148 38 L 158 45
      M 135 55 L 145 62 L 158 55
      M 132 142 L 148 152 L 168 145
      M 98 202 L 122 215 L 152 205
      M 248 132 L 268 138 L 292 132
      M 272 188 L 288 198 L 308 190
    `,
    viewBox: { width: 385, height: 310 },
    transform: { scale: 0.85 },
    description: 'Geometric water bearer with flowing streams'
  },

  // PISCES - Two angular fish bound together
  pisces: {
    outlinePath: `
      M 82 68 L 62 52 L 55 32 L 68 18 L 92 22 L 108 42 L 108 72 L 92 95 L 68 102 L 52 92 L 52 72 L 62 62 L 75 62 L 82 68 Z
      M 55 32 L 35 28 L 22 42 L 28 62
      M 108 72 L 158 82 L 212 98 L 158 115 L 108 128
      M 108 128 L 85 142 L 68 172 L 68 208 L 88 235 L 122 248 L 158 242 L 185 218 L 192 182 L 175 152 L 142 138 L 108 128 Z
      M 68 208 L 48 218 L 35 205 L 42 185
      M 212 98 L 248 112 L 282 148 L 298 195 L 288 242 L 255 268 L 212 272 L 175 252 L 162 212 L 175 172 L 208 148 L 252 138 L 282 148
      M 252 138 L 272 128 L 282 142
      M 298 195 L 322 205 L 338 192 L 332 168
    `,
    detailPath: `
      M 72 48 L 85 42 L 98 52
      M 75 78 L 88 85 L 102 78
      M 128 92 L 158 88 L 188 95
      M 158 108 L 185 105 L 212 112
      M 88 175 L 105 168 L 122 178
      M 98 215 L 118 225 L 142 218
      M 228 175 L 248 168 L 268 178
      M 238 225 L 258 235 L 280 228
    `,
    viewBox: { width: 370, height: 295 },
    transform: { scale: 0.88 },
    description: 'Two angular fish bound by cord'
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
    'aldebaran': '#ffb090',
  },
  leo: {
    'regulus': '#b8c8ff',
  },
  virgo: {
    'spica': '#aaccff',
  },
  scorpio: {
    'antares': '#ff9080',
  },
  gemini: {
    'castor': '#fff8e0',
    'pollux': '#ffd8a0',
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
