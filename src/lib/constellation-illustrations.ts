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

// Sophisticated zodiac silhouettes as SVG paths - outline only, no fill
// Based on classic golden zodiac artwork style
export const CONSTELLATION_ILLUSTRATIONS: Record<ZodiacSign, ConstellationIllustration> = {
  // ARIES - Standing ram with curved horns
  aries: {
    outlinePath: `
      M 95 185 C 85 180 75 170 70 155 C 65 140 68 125 75 112 C 82 99 92 90 105 85 
      C 118 80 132 82 145 88 C 158 94 168 105 175 120 C 182 135 183 152 178 168 
      C 173 184 162 197 148 205 C 134 213 118 215 103 210 C 93 206 95 185 95 185 Z
      M 75 112 C 60 95 50 75 55 55 C 58 40 68 30 82 28 C 96 26 108 35 112 50 
      C 116 65 110 82 100 95
      M 145 88 C 155 70 170 55 188 52 C 206 49 222 58 228 75 C 234 92 225 112 210 122
      M 95 185 C 85 200 80 220 85 240
      M 148 205 C 155 225 158 245 155 265
      M 178 168 C 200 175 225 178 250 172 C 275 166 295 152 305 132
      M 70 155 C 50 160 35 172 25 188
    `,
    detailPath: `
      M 105 130 C 110 125 120 125 125 132
      M 145 125 C 150 120 160 122 162 130
      M 115 155 C 125 165 140 168 155 162
      M 85 105 C 95 100 108 102 115 110
      M 160 108 C 170 105 182 110 188 120
    `,
    viewBox: { width: 330, height: 285 },
    description: 'Standing ram with curved horns'
  },

  // TAURUS - Powerful charging bull
  taurus: {
    outlinePath: `
      M 50 180 C 50 150 60 120 85 100 C 110 80 145 75 180 80 C 215 85 245 100 265 125 
      C 285 150 290 180 280 210 C 270 240 245 260 215 270 C 185 280 150 278 120 265 
      C 90 252 65 228 55 200 C 50 185 50 180 50 180 Z
      M 85 100 C 70 80 55 55 40 35 C 30 20 35 8 50 5 C 65 2 80 12 88 30 C 96 48 95 70 90 90
      M 265 125 C 285 105 310 85 335 80 C 355 76 370 88 368 105 C 366 122 350 138 330 145
      M 50 180 C 30 185 15 200 8 220
      M 280 210 C 300 220 315 238 322 260
      M 120 265 C 110 285 105 310 108 335
      M 215 270 C 225 292 230 318 228 345
    `,
    detailPath: `
      M 120 145 C 130 138 145 140 152 150
      M 195 140 C 205 133 222 138 228 148
      M 150 190 C 165 205 190 210 215 200
      M 95 125 C 110 118 130 122 142 135
      M 230 135 C 245 130 262 138 270 152
      M 175 165 C 185 175 200 178 215 172
    `,
    viewBox: { width: 385, height: 365 },
    transform: { scale: 0.82 },
    description: 'Powerful charging bull'
  },

  // GEMINI - Twin figures holding hands
  gemini: {
    outlinePath: `
      M 75 50 C 65 45 60 35 65 25 C 70 15 82 12 92 18 C 102 24 108 38 102 50 
      C 96 62 82 65 75 58 C 72 55 75 50 75 50 Z
      M 88 65 L 85 95 L 80 140 L 72 200
      M 60 110 C 72 120 85 115 92 105
      M 92 105 C 100 118 115 115 128 108
      M 80 140 L 55 200
      M 80 140 L 98 200
      M 195 50 C 185 45 180 35 185 25 C 190 15 202 12 212 18 C 222 24 228 38 222 50 
      C 216 62 202 65 195 58 C 192 55 195 50 195 50 Z
      M 208 65 L 205 95 L 200 140 L 192 200
      M 180 110 C 192 120 205 115 212 105
      M 212 105 C 220 118 235 115 248 108
      M 200 140 L 175 200
      M 200 140 L 218 200
      M 102 38 C 120 28 150 25 170 28 C 190 31 205 40 212 50
      M 128 108 C 145 100 165 100 180 108
    `,
    detailPath: `
      M 80 35 C 86 32 94 35 96 42
      M 200 35 C 206 32 214 35 216 42
      M 75 160 C 82 168 92 170 100 165
      M 195 160 C 202 168 212 170 220 165
    `,
    viewBox: { width: 280, height: 220 },
    transform: { translateY: 15 },
    description: 'Twin figures holding hands'
  },

  // CANCER - Detailed crab with claws
  cancer: {
    outlinePath: `
      M 170 130 C 130 125 100 140 85 165 C 70 190 75 225 100 250 C 125 275 165 290 210 290 
      C 255 290 295 275 320 250 C 345 225 350 190 335 165 C 320 140 290 125 250 130 
      C 220 134 190 134 170 130 Z
      M 85 165 C 55 140 30 105 25 70 C 22 45 35 28 55 25 C 75 22 95 38 105 62 C 115 86 110 115 95 140
      M 55 175 C 25 168 5 148 2 122 C 0 100 15 82 38 82 C 61 82 80 100 85 125
      M 335 165 C 365 140 390 105 395 70 C 398 45 385 28 365 25 C 345 22 325 38 315 62 
      C 305 86 310 115 325 140
      M 365 175 C 395 168 415 148 418 122 C 420 100 405 82 382 82 C 359 82 340 100 335 125
      M 100 250 C 90 278 85 310 92 340
      M 150 290 C 145 318 145 350 152 380
      M 270 290 C 275 318 275 350 268 380
      M 320 250 C 330 278 335 310 328 340
    `,
    detailPath: `
      M 155 185 C 170 178 190 180 205 190
      M 215 185 C 230 178 252 182 265 195
      M 175 225 C 195 240 225 242 255 230
      M 40 55 C 52 48 68 55 75 68
      M 345 55 C 358 48 375 58 380 72
      M 25 108 C 38 102 55 110 62 125
      M 395 108 C 382 102 365 110 358 125
    `,
    viewBox: { width: 420, height: 400 },
    transform: { scale: 0.72, translateY: -10 },
    description: 'Detailed crab with raised claws'
  },

  // LEO - Majestic lion with flowing mane
  leo: {
    outlinePath: `
      M 80 165 C 55 140 50 105 62 75 C 74 45 100 25 135 22 C 170 19 205 32 230 58 
      C 255 84 265 120 258 155 C 251 190 225 218 192 232 C 159 246 122 245 92 228 
      C 75 218 80 165 80 165 Z
      M 62 75 C 38 68 22 52 25 35 C 28 18 48 10 68 18 C 88 26 98 48 90 68
      M 100 35 C 88 15 95 0 115 0 C 135 0 148 18 142 40
      M 135 22 C 138 2 155 -8 175 -2 C 195 4 205 25 198 48
      M 175 18 C 185 -2 208 -8 228 2 C 248 12 255 38 242 60
      M 258 155 C 295 168 338 178 378 172 C 418 166 448 145 458 115
      M 378 172 C 398 200 395 235 372 255 C 349 275 318 275 305 252
      M 192 232 C 185 268 172 305 175 342
      M 122 245 C 108 278 95 315 102 352
      M 80 220 C 62 252 48 290 58 328
    `,
    detailPath: `
      M 118 105 C 132 95 152 98 162 112
      M 185 100 C 200 90 222 95 232 110
      M 148 155 C 168 172 198 175 225 162
      M 78 58 C 92 52 110 58 118 72
      M 205 52 C 222 48 242 58 250 75
      M 320 172 C 348 178 378 175 402 165
      M 115 140 C 132 152 155 155 178 148
    `,
    viewBox: { width: 480, height: 370 },
    transform: { scale: 0.72, translateY: 25 },
    description: 'Majestic lion with flowing mane'
  },

  // VIRGO - Flowing female figure with wheat
  virgo: {
    outlinePath: `
      M 145 55 C 132 48 128 35 135 22 C 142 9 160 5 175 12 C 190 19 198 38 192 55 
      C 186 72 168 78 155 70 C 148 66 145 55 145 55 Z
      M 172 78 L 165 115 L 155 175 L 142 250
      M 142 130 C 158 145 172 138 180 122
      M 180 122 C 190 140 210 138 228 128
      M 155 175 C 125 198 102 238 95 285 C 90 320 100 358 120 390
      M 155 175 C 188 200 215 242 225 292 C 232 330 222 370 200 402
      M 142 250 C 115 280 98 325 105 375
      M 142 250 C 172 285 192 332 185 385
      M 228 128 C 262 118 298 112 332 125
      M 298 112 C 315 92 340 82 365 90 C 390 98 402 122 395 148
      M 332 125 C 355 118 380 128 392 150
      M 365 90 C 385 78 408 82 420 100
    `,
    detailPath: `
      M 158 35 C 168 30 182 35 188 48
      M 152 58 C 162 65 178 62 185 52
      M 148 152 C 162 165 182 162 195 150
      M 118 265 C 138 280 168 278 192 262
      M 172 315 C 192 332 218 328 238 312
      M 312 120 C 332 128 355 122 370 108
    `,
    viewBox: { width: 440, height: 420 },
    transform: { scale: 0.7, translateY: -5 },
    description: 'Flowing female figure with wheat'
  },

  // LIBRA - Figure holding balanced scales
  libra: {
    outlinePath: `
      M 165 55 C 152 48 148 35 155 22 C 162 9 180 5 195 12 C 210 19 218 38 212 55 
      C 206 72 188 78 175 70 C 168 66 165 55 165 55 Z
      M 188 78 L 182 115 L 175 175 L 168 245
      M 162 130 C 178 145 192 138 200 122
      M 200 122 C 210 140 228 138 245 128
      M 175 175 L 168 320
      M 168 320 L 135 320 L 205 320
      M 162 130 L 55 155
      M 55 155 L 45 200 L 55 220 L 95 220 L 105 200 L 95 155 L 55 155 Z
      M 245 128 L 305 155
      M 305 155 L 295 200 L 305 220 L 345 220 L 355 200 L 345 155 L 305 155 Z
      M 55 220 C 65 235 85 235 95 220
      M 305 220 C 315 235 335 235 345 220
    `,
    detailPath: `
      M 178 35 C 188 30 202 35 208 48
      M 172 58 C 182 65 198 62 205 52
      M 65 180 C 75 175 88 180 92 192
      M 315 180 C 325 175 338 180 342 192
      M 68 205 C 78 212 92 210 98 200
      M 318 205 C 328 212 342 210 348 200
      M 168 280 C 175 275 182 280 185 290
    `,
    viewBox: { width: 400, height: 340 },
    transform: { scale: 0.82, translateY: -5 },
    description: 'Figure holding balanced scales'
  },

  // SCORPIO - Detailed scorpion with curved tail
  scorpio: {
    outlinePath: `
      M 75 145 C 52 128 48 100 62 78 C 76 56 105 52 130 65 C 155 78 168 108 160 140 
      C 152 172 125 192 95 190 C 72 188 62 168 68 148 C 72 135 75 145 75 145 Z
      M 62 78 C 42 62 28 38 32 18 C 35 2 52 -5 72 2 C 92 9 102 32 95 55
      M 48 100 C 25 92 8 72 12 48 C 15 28 35 18 58 25 C 81 32 92 58 82 82
      M 160 140 C 195 158 242 175 292 178 C 342 181 388 168 418 142 C 448 116 455 80 435 55 
      C 415 30 378 28 358 52 C 345 68 352 95 375 112 C 398 129 428 132 452 118
      M 452 118 C 478 132 502 122 512 98 C 522 74 508 52 482 48
      M 95 190 C 88 222 85 258 95 292
      M 130 192 C 128 225 130 262 142 298
      M 160 185 C 165 218 175 255 192 290
    `,
    detailPath: `
      M 95 105 C 110 98 128 105 135 120
      M 105 145 C 122 158 145 155 162 140
      M 48 45 C 62 38 80 48 85 65
      M 32 75 C 48 68 68 78 75 95
      M 275 178 C 308 182 345 178 378 165
      M 388 118 C 408 128 432 122 448 105
      M 475 82 C 492 88 508 78 515 60
    `,
    viewBox: { width: 540, height: 320 },
    transform: { scale: 0.62, translateY: 20 },
    description: 'Detailed scorpion with curved stinger'
  },

  // SAGITTARIUS - Centaur archer with drawn bow
  sagittarius: {
    outlinePath: `
      M 185 72 C 172 62 170 48 180 35 C 190 22 210 22 225 32 C 240 42 245 62 235 78 
      C 225 94 205 98 192 88 C 185 83 185 72 185 72 Z
      M 215 98 L 205 138 L 192 188
      M 175 148 C 192 162 210 155 220 138
      M 220 138 C 232 155 255 152 275 142
      M 275 142 L 55 52
      M 55 52 L 48 42 L 55 52 L 62 42
      M 275 142 C 310 128 352 118 395 130
      M 192 188 L 215 208 L 248 212 L 285 218 L 328 235
      M 215 208 C 202 242 195 285 208 328
      M 248 212 C 242 252 245 298 262 342
      M 285 218 C 295 262 315 308 342 348
      M 328 235 C 358 272 395 318 432 355
      M 192 188 C 155 185 122 198 102 228 C 82 258 82 298 102 335
    `,
    detailPath: `
      M 198 52 C 212 45 228 52 235 68
      M 195 78 C 208 88 228 85 238 72
      M 185 165 C 202 178 225 175 242 160
      M 105 62 C 142 58 182 72 212 98
      M 325 138 C 358 132 392 142 418 162
      M 248 258 C 275 272 308 275 342 265
    `,
    viewBox: { width: 460, height: 380 },
    transform: { scale: 0.75, translateY: -5 },
    description: 'Centaur archer with drawn bow'
  },

  // CAPRICORN - Sea-goat with fish tail
  capricorn: {
    outlinePath: `
      M 92 125 C 72 108 70 82 85 62 C 100 42 130 40 155 55 C 180 70 192 100 182 132 
      C 172 164 142 182 112 178 C 88 175 80 155 88 135 C 92 125 92 125 92 125 Z
      M 85 62 C 65 45 55 22 62 5 C 68 -10 88 -12 105 -2 C 122 8 128 32 118 52
      M 130 42 C 142 22 165 12 188 18 C 211 24 225 48 218 75
      M 182 132 C 218 152 265 172 318 178 C 371 184 418 172 448 145 C 478 118 485 82 462 55 
      C 439 28 398 28 378 55 C 365 72 375 102 402 118 C 429 134 462 135 488 118
      M 318 178 C 338 208 335 248 312 278 C 289 308 252 318 225 302
      M 418 172 C 442 202 442 245 418 278 C 394 311 355 325 325 312
      M 112 178 C 105 212 108 252 125 288
      M 155 182 C 162 218 178 258 202 292
    `,
    detailPath: `
      M 110 92 C 128 85 148 95 158 112
      M 118 138 C 138 152 165 150 185 135
      M 78 38 C 95 32 115 42 122 62
      M 158 48 C 178 42 202 55 212 78
      M 365 82 C 388 92 415 85 435 68
      M 412 135 C 438 142 468 132 488 112
      M 335 245 C 358 258 388 252 408 232
    `,
    viewBox: { width: 520, height: 350 },
    transform: { scale: 0.65, translateY: 15 },
    description: 'Sea-goat with curled fish tail'
  },

  // AQUARIUS - Figure pouring water from urn
  aquarius: {
    outlinePath: `
      M 145 58 C 132 48 130 35 140 22 C 150 9 170 8 185 18 C 200 28 205 48 195 65 
      C 185 82 165 85 152 75 C 145 70 145 58 145 58 Z
      M 175 85 L 168 128 L 158 195 L 148 275
      M 148 145 C 168 162 188 155 200 135
      M 200 135 C 215 155 242 152 268 142
      M 268 142 L 285 218
      M 285 218 C 295 248 288 282 262 302 C 236 322 202 318 185 292
      M 268 142 L 322 155 L 378 168
      M 158 195 C 122 225 98 278 105 338 C 110 385 138 428 178 455
      M 158 195 C 198 228 232 285 242 352 C 250 402 232 452 198 488
      M 148 275 C 118 318 102 378 118 438
      M 148 275 C 182 322 205 385 198 452
      M 322 195 C 305 232 302 278 318 322
      M 378 208 C 362 252 358 305 378 352
      M 420 218 C 408 268 405 325 428 378
    `,
    detailPath: `
      M 158 38 C 172 32 188 40 195 55
      M 155 62 C 168 72 188 68 198 55
      M 158 168 C 178 182 205 178 225 162
      M 125 305 C 152 325 192 322 222 302
      M 185 382 C 215 402 255 395 282 368
      M 308 272 C 332 285 362 278 382 255
    `,
    viewBox: { width: 460, height: 510 },
    transform: { scale: 0.62, translateY: -15 },
    description: 'Figure pouring water from urn'
  },

  // PISCES - Two fish swimming in circle
  pisces: {
    outlinePath: `
      M 88 82 C 65 65 58 38 72 18 C 86 -2 115 -5 140 12 C 165 29 175 62 162 92 
      C 149 122 118 138 88 130 C 65 124 58 102 72 82 C 80 72 88 82 88 82 Z
      M 72 18 C 52 12 35 25 35 48 C 35 71 55 88 75 85
      M 162 92 L 215 105 L 275 125 L 215 148 L 162 168
      M 162 168 C 142 185 128 212 132 245 C 136 278 162 308 198 322 
      C 234 336 275 328 302 302 C 329 276 335 238 318 205 C 301 172 262 155 225 162 
      C 195 168 175 192 182 222 C 188 245 215 262 245 258
      M 132 245 C 112 252 95 275 98 302 C 101 329 125 352 155 355
      M 275 125 C 308 138 348 162 382 198 C 416 234 435 282 428 332 
      C 421 382 385 422 338 438 C 291 454 242 438 212 402
      M 428 332 C 455 338 478 322 485 295 C 492 268 475 242 448 235
    `,
    detailPath: `
      M 98 55 C 115 48 135 58 145 78
      M 102 102 C 122 115 148 110 168 92
      M 192 118 C 228 125 268 122 302 108
      M 188 195 C 212 185 242 192 262 212
      M 212 262 C 242 275 278 268 302 245
      M 355 335 C 388 348 425 338 448 312
    `,
    viewBox: { width: 520, height: 480 },
    transform: { scale: 0.62, translateY: -20 },
    description: 'Two fish swimming in circular pattern'
  },
};

// Color schemes for constellation rendering - elegant gold line-art style
export const CONSTELLATION_COLORS = {
  background: {
    gradient: {
      start: '#0a0a12',
      end: '#12121e',
    },
  },
  stars: {
    default: '#d4af70', // Gold-amber stars
    bright: '#e8c47a',
    dim: '#a8905a',
  },
  illustration: {
    stroke: '#c9a55a', // Rich gold for mythological figures
    strokeLight: '#b89545', // Slightly darker gold for details
    fill: 'none',
    opacity: 0.55,
  },
  lines: {
    constellation: {
      stroke: '#d4af70', // Gold constellation lines
      opacity: 0.5,
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
