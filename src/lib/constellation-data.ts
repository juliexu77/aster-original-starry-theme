import { ZodiacSign } from "./zodiac";

interface ConstellationStar {
  id: string;
  x: number;
  y: number;
  size: number;
  label: string;
}

interface ConstellationData {
  stars: ConstellationStar[];
  lines: [string, string][];
}

// Simplified, recognizable constellation patterns for all 12 zodiac signs
// Based on traditional asterisms that people actually recognize in the sky
// Coordinates are normalized 0-1, designed for clear visual representation

export const CONSTELLATION_DATA: Record<ZodiacSign, ConstellationData> = {
  // ARIES (Ram) - Simple curved line / check mark shape
  // 3-4 stars forming a bent line
  aries: {
    stars: [
      { id: 'hamal', x: 0.30, y: 0.45, size: 3.5, label: 'Hamal' },           // α Ari - brightest, ram's head
      { id: 'sheratan', x: 0.50, y: 0.50, size: 3.0, label: 'Sheratan' },     // β Ari - horn
      { id: 'mesarthim', x: 0.65, y: 0.55, size: 2.5, label: 'Mesarthim' },   // γ Ari - other horn
      { id: '41-ari', x: 0.20, y: 0.40, size: 2.2, label: '41 Ari' },         // extends the line
    ],
    lines: [
      ['41-ari', 'hamal'],
      ['hamal', 'sheratan'],
      ['sheratan', 'mesarthim'],
    ],
  },

  // TAURUS (Bull) - V-shape with extension (the Hyades)
  // Distinctive V for the bull's face with Aldebaran as the eye
  taurus: {
    stars: [
      { id: 'aldebaran', x: 0.45, y: 0.55, size: 4.0, label: 'Aldebaran' },   // α Tau - the eye, orange-red
      { id: 'elnath', x: 0.25, y: 0.25, size: 3.2, label: 'Elnath' },         // β Tau - tip of horn
      { id: 'zeta-tau', x: 0.40, y: 0.30, size: 2.8, label: 'Zeta Tau' },     // ζ Tau - other horn tip
      { id: 'theta-tau', x: 0.55, y: 0.48, size: 2.5, label: 'Theta Tau' },   // θ Tau - Hyades V
      { id: 'gamma-tau', x: 0.62, y: 0.42, size: 2.5, label: 'Gamma Tau' },   // γ Tau - Hyades V
      { id: 'delta-tau', x: 0.70, y: 0.38, size: 2.5, label: 'Delta Tau' },   // δ Tau - Hyades V
      { id: 'epsilon-tau', x: 0.78, y: 0.35, size: 2.5, label: 'Epsilon Tau' },// ε Tau - end of V
    ],
    lines: [
      // The V-shape (Hyades)
      ['aldebaran', 'theta-tau'],
      ['theta-tau', 'gamma-tau'],
      ['gamma-tau', 'delta-tau'],
      ['delta-tau', 'epsilon-tau'],
      // Horns extending up
      ['aldebaran', 'zeta-tau'],
      ['zeta-tau', 'elnath'],
    ],
  },

  // GEMINI (Twins) - Two parallel stick figures
  // Castor and Pollux as heads, two roughly parallel lines
  gemini: {
    stars: [
      { id: 'castor', x: 0.35, y: 0.20, size: 3.5, label: 'Castor' },         // α Gem - twin 1 head
      { id: 'pollux', x: 0.50, y: 0.22, size: 3.8, label: 'Pollux' },         // β Gem - twin 2 head (brightest)
      { id: 'mebsuta', x: 0.32, y: 0.40, size: 2.5, label: 'Mebsuta' },       // ε Gem - Castor's body
      { id: 'wasat', x: 0.52, y: 0.45, size: 2.5, label: 'Wasat' },           // δ Gem - Pollux's body
      { id: 'mekbuda', x: 0.30, y: 0.55, size: 2.3, label: 'Mekbuda' },       // ζ Gem - Castor's feet
      { id: 'alhena', x: 0.55, y: 0.68, size: 3.0, label: 'Alhena' },         // γ Gem - Pollux's feet
    ],
    lines: [
      // Twin 1 (Castor's line)
      ['castor', 'mebsuta'],
      ['mebsuta', 'mekbuda'],
      // Twin 2 (Pollux's line)
      ['pollux', 'wasat'],
      ['wasat', 'alhena'],
      // Connection between twins
      ['castor', 'pollux'],
    ],
  },

  // CANCER (Crab) - Inverted Y shape
  // Faint constellation, simple Y pattern
  cancer: {
    stars: [
      { id: 'acubens', x: 0.60, y: 0.55, size: 2.8, label: 'Acubens' },       // α Cnc
      { id: 'altarf', x: 0.25, y: 0.50, size: 3.2, label: 'Altarf' },         // β Cnc - brightest
      { id: 'asellus-bor', x: 0.42, y: 0.38, size: 2.5, label: 'Asellus Borealis' }, // γ Cnc - top of Y
      { id: 'asellus-aus', x: 0.48, y: 0.50, size: 2.5, label: 'Asellus Australis' }, // δ Cnc - center
      { id: 'iota-cnc', x: 0.55, y: 0.30, size: 2.2, label: 'Iota Cnc' },     // ι Cnc - stem
    ],
    lines: [
      // Inverted Y
      ['altarf', 'asellus-aus'],          // left arm
      ['acubens', 'asellus-aus'],         // right arm
      ['asellus-aus', 'asellus-bor'],     // up to center
      ['asellus-bor', 'iota-cnc'],        // stem up
    ],
  },

  // LEO (Lion) - Backwards question mark (Sickle) + triangle
  // The most distinctive pattern after Sagittarius
  leo: {
    stars: [
      { id: 'regulus', x: 0.30, y: 0.60, size: 4.0, label: 'Regulus' },       // α Leo - the heart (brightest)
      { id: 'denebola', x: 0.80, y: 0.50, size: 3.2, label: 'Denebola' },     // β Leo - tail
      { id: 'algieba', x: 0.35, y: 0.42, size: 3.0, label: 'Algieba' },       // γ Leo - mane
      { id: 'zosma', x: 0.65, y: 0.48, size: 2.8, label: 'Zosma' },           // δ Leo - hindquarters
      { id: 'chertan', x: 0.52, y: 0.55, size: 2.5, label: 'Chertan' },       // θ Leo - body
      { id: 'eta-leo', x: 0.28, y: 0.28, size: 2.5, label: 'Eta Leo' },       // η Leo - top of sickle
      { id: 'adhafera', x: 0.38, y: 0.32, size: 2.5, label: 'Adhafera' },     // ζ Leo - sickle curve
      { id: 'rasalas', x: 0.45, y: 0.25, size: 2.5, label: 'Rasalas' },       // μ Leo - sickle end
    ],
    lines: [
      // The Sickle (backwards question mark) - the mane
      ['regulus', 'algieba'],
      ['algieba', 'adhafera'],
      ['adhafera', 'rasalas'],
      ['adhafera', 'eta-leo'],
      // Body and hindquarters (triangle)
      ['regulus', 'chertan'],
      ['chertan', 'zosma'],
      ['zosma', 'denebola'],
    ],
  },

  // VIRGO (Maiden) - Y-shape with Spica at bottom
  // Large Y extending from bright Spica
  virgo: {
    stars: [
      { id: 'spica', x: 0.50, y: 0.75, size: 4.0, label: 'Spica' },           // α Vir - very bright, base of Y
      { id: 'porrima', x: 0.48, y: 0.50, size: 3.0, label: 'Porrima' },       // γ Vir - Y junction
      { id: 'auva', x: 0.40, y: 0.38, size: 2.8, label: 'Auva' },             // δ Vir - left branch
      { id: 'vindemiatrix', x: 0.30, y: 0.25, size: 3.0, label: 'Vindemiatrix' }, // ε Vir - left top
      { id: 'zavijava', x: 0.65, y: 0.28, size: 2.8, label: 'Zavijava' },     // β Vir - right branch top
      { id: 'zaniah', x: 0.58, y: 0.40, size: 2.3, label: 'Zaniah' },         // η Vir - right branch
    ],
    lines: [
      // Y-shape
      ['spica', 'porrima'],              // stem from Spica up
      ['porrima', 'auva'],               // left branch
      ['auva', 'vindemiatrix'],          // left top
      ['porrima', 'zaniah'],             // right branch
      ['zaniah', 'zavijava'],            // right top
    ],
  },

  // LIBRA (Scales) - Rectangle / balance beam shape
  // Simple quadrilateral suggesting balance
  libra: {
    stars: [
      { id: 'zuben-el', x: 0.55, y: 0.60, size: 3.5, label: 'Zubenelgenubi' }, // α Lib - bottom right
      { id: 'zuben-sch', x: 0.45, y: 0.30, size: 3.5, label: 'Zubeneschamali' }, // β Lib - top left
      { id: 'gamma-lib', x: 0.30, y: 0.55, size: 2.8, label: 'Gamma Lib' },   // γ Lib - bottom left
      { id: 'upsilon-lib', x: 0.55, y: 0.40, size: 2.3, label: 'Upsilon Lib' }, // υ Lib - middle right
      { id: 'sigma-lib', x: 0.70, y: 0.65, size: 2.5, label: 'Sigma Lib' },   // σ Lib - far right
    ],
    lines: [
      // Rectangle/balance shape
      ['gamma-lib', 'zuben-sch'],        // left side up
      ['zuben-sch', 'upsilon-lib'],      // top across
      ['upsilon-lib', 'zuben-el'],       // right side down
      ['zuben-el', 'gamma-lib'],         // bottom across
      ['zuben-el', 'sigma-lib'],         // extension right
    ],
  },

  // SCORPIUS (Scorpion) - Curved fish-hook / J-shape
  // Distinctive curved tail with Antares as the heart
  scorpio: {
    stars: [
      { id: 'antares', x: 0.35, y: 0.35, size: 4.0, label: 'Antares' },       // α Sco - bright red heart
      { id: 'graffias', x: 0.25, y: 0.25, size: 2.8, label: 'Graffias' },     // β Sco - head
      { id: 'dschubba', x: 0.30, y: 0.28, size: 3.0, label: 'Dschubba' },     // δ Sco - head
      { id: 'sigma-sco', x: 0.40, y: 0.42, size: 2.5, label: 'Sigma Sco' },   // σ Sco - body
      { id: 'epsilon-sco', x: 0.48, y: 0.52, size: 2.5, label: 'Epsilon Sco' }, // ε Sco - tail start
      { id: 'mu-sco', x: 0.55, y: 0.60, size: 2.5, label: 'Mu Sco' },         // μ Sco - tail
      { id: 'zeta-sco', x: 0.62, y: 0.68, size: 2.5, label: 'Zeta Sco' },     // ζ Sco - tail curve
      { id: 'eta-sco', x: 0.68, y: 0.72, size: 2.5, label: 'Eta Sco' },       // η Sco - tail curve
      { id: 'sargas', x: 0.75, y: 0.75, size: 2.8, label: 'Sargas' },         // θ Sco - near stinger
      { id: 'shaula', x: 0.82, y: 0.70, size: 3.2, label: 'Shaula' },         // λ Sco - stinger
      { id: 'lesath', x: 0.85, y: 0.68, size: 2.5, label: 'Lesath' },         // υ Sco - stinger tip
    ],
    lines: [
      // Head (claws area)
      ['graffias', 'dschubba'],
      ['dschubba', 'antares'],
      // Body and curved tail (J-shape)
      ['antares', 'sigma-sco'],
      ['sigma-sco', 'epsilon-sco'],
      ['epsilon-sco', 'mu-sco'],
      ['mu-sco', 'zeta-sco'],
      ['zeta-sco', 'eta-sco'],
      ['eta-sco', 'sargas'],
      ['sargas', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },

  // SAGITTARIUS (Archer) - THE TEAPOT - Most recognizable pattern
  // 8 stars forming teapot: pot body with spout (left) and handle (right)
  sagittarius: {
    stars: [
      { id: 'kaus-australis', x: 0.35, y: 0.65, size: 3.8, label: 'Kaus Australis' }, // ε Sgr - bottom left of pot
      { id: 'kaus-media', x: 0.30, y: 0.50, size: 3.0, label: 'Kaus Media' },         // δ Sgr - left side (spout base)
      { id: 'kaus-borealis', x: 0.35, y: 0.35, size: 2.8, label: 'Kaus Borealis' },   // λ Sgr - top left
      { id: 'phi', x: 0.50, y: 0.30, size: 2.5, label: 'Phi Sgr' },                   // φ Sgr - lid/top middle
      { id: 'nunki', x: 0.65, y: 0.35, size: 3.2, label: 'Nunki' },                   // σ Sgr - top of handle
      { id: 'tau', x: 0.72, y: 0.50, size: 2.5, label: 'Tau Sgr' },                   // τ Sgr - handle curve
      { id: 'ascella', x: 0.65, y: 0.62, size: 2.8, label: 'Ascella' },               // ζ Sgr - bottom of handle
      { id: 'alnasl', x: 0.15, y: 0.42, size: 2.8, label: 'Alnasl' },                 // γ Sgr - spout tip
    ],
    lines: [
      // Closed teapot body
      ['kaus-australis', 'kaus-media'],
      ['kaus-media', 'kaus-borealis'],
      ['kaus-borealis', 'phi'],
      ['phi', 'nunki'],
      ['nunki', 'tau'],
      ['tau', 'ascella'],
      ['ascella', 'kaus-australis'],
      // Spout extending left
      ['kaus-media', 'alnasl'],
    ],
  },

  // CAPRICORNUS (Sea-Goat) - Smile or bent triangle
  // Triangular smile shape
  capricorn: {
    stars: [
      { id: 'deneb-algedi', x: 0.25, y: 0.45, size: 3.5, label: 'Deneb Algedi' }, // δ Cap - eastern point
      { id: 'nashira', x: 0.32, y: 0.50, size: 2.8, label: 'Nashira' },       // γ Cap
      { id: 'dabih', x: 0.70, y: 0.35, size: 3.0, label: 'Dabih' },           // β Cap - western point
      { id: 'algedi', x: 0.78, y: 0.32, size: 2.5, label: 'Algedi' },         // α Cap - far west
      { id: 'omega-cap', x: 0.40, y: 0.62, size: 2.5, label: 'Omega Cap' },   // ω Cap - bottom of smile
      { id: 'zeta-cap', x: 0.50, y: 0.58, size: 2.5, label: 'Zeta Cap' },     // ζ Cap - bottom
      { id: 'theta-cap', x: 0.58, y: 0.52, size: 2.5, label: 'Theta Cap' },   // θ Cap
    ],
    lines: [
      // Smile/triangle shape
      ['algedi', 'dabih'],               // top western edge
      ['dabih', 'theta-cap'],            // down right side
      ['theta-cap', 'zeta-cap'],         // across bottom
      ['zeta-cap', 'omega-cap'],         // bottom
      ['omega-cap', 'nashira'],          // up left
      ['nashira', 'deneb-algedi'],       // top left
      ['deneb-algedi', 'dabih'],         // close top
    ],
  },

  // AQUARIUS (Water-Bearer) - Inverted Y / water cascade
  // Y-pattern with water pouring
  aquarius: {
    stars: [
      { id: 'sadalsuud', x: 0.35, y: 0.22, size: 3.5, label: 'Sadalsuud' },   // β Aqr - brightest (top left)
      { id: 'sadalmelik', x: 0.48, y: 0.30, size: 3.2, label: 'Sadalmelik' }, // α Aqr - top center
      { id: 'sadachbia', x: 0.55, y: 0.42, size: 2.8, label: 'Sadachbia' },   // γ Aqr - Y junction
      { id: 'skat', x: 0.52, y: 0.58, size: 3.0, label: 'Skat' },             // δ Aqr - water stream
      { id: 'albali', x: 0.45, y: 0.48, size: 2.5, label: 'Albali' },         // ε Aqr
      { id: 'lambda-aqr', x: 0.55, y: 0.72, size: 2.5, label: 'Lambda Aqr' }, // λ Aqr - bottom of stream
    ],
    lines: [
      // Y-shape with cascade
      ['sadalsuud', 'sadalmelik'],       // top arm
      ['sadalmelik', 'sadachbia'],       // to junction
      ['sadalmelik', 'albali'],          // other branch
      ['albali', 'skat'],                // down
      ['sadachbia', 'skat'],             // converge
      ['skat', 'lambda-aqr'],            // water pours down
    ],
  },

  // PISCES (Fish) - V-shape with circular cluster
  // Two fish connected by a cord in V pattern
  pisces: {
    stars: [
      { id: 'alrescha', x: 0.50, y: 0.60, size: 3.0, label: 'Alrescha' },     // α Psc - the knot (cord junction)
      { id: 'fumalsamakah', x: 0.22, y: 0.35, size: 2.8, label: 'Fum al Samakah' }, // β Psc - western fish
      { id: 'omega-psc', x: 0.62, y: 0.45, size: 2.5, label: 'Omega Psc' },   // ω Psc - eastern cord
      { id: 'iota-psc', x: 0.70, y: 0.40, size: 2.5, label: 'Iota Psc' },     // ι Psc
      { id: 'theta-psc', x: 0.78, y: 0.35, size: 2.3, label: 'Theta Psc' },   // θ Psc
      { id: 'gamma-psc', x: 0.85, y: 0.30, size: 2.5, label: 'Gamma Psc' },   // γ Psc - eastern fish head
      { id: 'eta-psc', x: 0.38, y: 0.48, size: 2.5, label: 'Eta Psc' },       // η Psc - western cord
      { id: 'omicron-psc', x: 0.28, y: 0.42, size: 2.3, label: 'Omicron Psc' }, // ο Psc
    ],
    lines: [
      // Eastern fish
      ['gamma-psc', 'theta-psc'],
      ['theta-psc', 'iota-psc'],
      ['iota-psc', 'omega-psc'],
      // Cord to knot
      ['omega-psc', 'alrescha'],
      // Western fish and cord
      ['alrescha', 'eta-psc'],
      ['eta-psc', 'omicron-psc'],
      ['omicron-psc', 'fumalsamakah'],
    ],
  },
};

// Get priority stars for family member placement (ordered by visual prominence)
export const getMemberStarAssignments = (sign: ZodiacSign): string[] => {
  const constellation = CONSTELLATION_DATA[sign];
  // Sort by size descending to get most prominent stars first
  return constellation.stars
    .slice()
    .sort((a, b) => b.size - a.size)
    .map(s => s.id);
};
