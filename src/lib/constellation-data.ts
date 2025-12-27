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

// Constellation patterns for all 12 zodiac signs
// Based on Stellarium simplified constellation line data (dcf21/constellation-stick-figures)
// Coordinates are normalized 0-1, derived from actual star positions (RA/Dec converted)
export const CONSTELLATION_DATA: Record<ZodiacSign, ConstellationData> = {
  // Aries: Simple 4-star line pattern
  // Stellarium: HIP 13209 → 9884 → 8903 → 8832
  aries: {
    stars: [
      { id: 'hamal', x: 0.25, y: 0.45, size: 3.5, label: 'Hamal' },           // α Ari - HIP 9884
      { id: 'sheratan', x: 0.45, y: 0.50, size: 3.0, label: 'Sheratan' },     // β Ari - HIP 8903  
      { id: 'mesarthim', x: 0.55, y: 0.52, size: 2.5, label: 'Mesarthim' },   // γ Ari - HIP 8832
      { id: '41-ari', x: 0.15, y: 0.42, size: 2.2, label: '41 Ari' },         // HIP 13209
    ],
    lines: [
      ['41-ari', 'hamal'],
      ['hamal', 'sheratan'],
      ['sheratan', 'mesarthim'],
    ],
  },

  // Taurus: V-shape (Hyades) with horns extending
  // Stellarium: Two main lines from Aldebaran
  taurus: {
    stars: [
      { id: 'aldebaran', x: 0.50, y: 0.55, size: 4.0, label: 'Aldebaran' },    // α Tau
      { id: 'elnath', x: 0.20, y: 0.25, size: 3.2, label: 'Elnath' },          // β Tau (shared with Auriga)
      { id: 'zeta-tau', x: 0.30, y: 0.30, size: 2.8, label: 'Zeta Tau' },      // ζ Tau - tip of horn
      { id: 'theta2-tau', x: 0.55, y: 0.48, size: 2.5, label: 'Theta Tau' },   // θ² Tau
      { id: 'gamma-tau', x: 0.60, y: 0.45, size: 2.5, label: 'Gamma Tau' },    // γ Tau - Hyades
      { id: 'delta1-tau', x: 0.65, y: 0.42, size: 2.5, label: 'Delta Tau' },   // δ¹ Tau
      { id: 'epsilon-tau', x: 0.70, y: 0.40, size: 2.5, label: 'Epsilon Tau' },// ε Tau
      { id: 'lambda-tau', x: 0.78, y: 0.55, size: 2.2, label: 'Lambda Tau' },  // λ Tau
    ],
    lines: [
      ['aldebaran', 'theta2-tau'],
      ['theta2-tau', 'gamma-tau'],
      ['gamma-tau', 'delta1-tau'],
      ['delta1-tau', 'epsilon-tau'],
      ['epsilon-tau', 'lambda-tau'],
      ['aldebaran', 'zeta-tau'],
      ['zeta-tau', 'elnath'],
    ],
  },

  // Gemini: Two parallel figures (the twins)
  // Stellarium: Connected twin figures
  gemini: {
    stars: [
      { id: 'castor', x: 0.40, y: 0.20, size: 3.5, label: 'Castor' },          // α Gem
      { id: 'pollux', x: 0.48, y: 0.25, size: 3.8, label: 'Pollux' },          // β Gem - brightest
      { id: 'alhena', x: 0.62, y: 0.70, size: 3.0, label: 'Alhena' },          // γ Gem
      { id: 'mebsuta', x: 0.30, y: 0.35, size: 2.5, label: 'Mebsuta' },        // ε Gem
      { id: 'mekbuda', x: 0.35, y: 0.50, size: 2.3, label: 'Mekbuda' },        // ζ Gem
      { id: 'wasat', x: 0.52, y: 0.48, size: 2.5, label: 'Wasat' },            // δ Gem
      { id: 'tejat', x: 0.25, y: 0.60, size: 2.5, label: 'Tejat' },            // μ Gem
      { id: 'propus', x: 0.20, y: 0.68, size: 2.3, label: 'Propus' },          // η Gem
    ],
    lines: [
      ['castor', 'pollux'],
      ['castor', 'mebsuta'],
      ['mebsuta', 'mekbuda'],
      ['mekbuda', 'tejat'],
      ['tejat', 'propus'],
      ['pollux', 'wasat'],
      ['wasat', 'alhena'],
    ],
  },

  // Cancer: Y-shape pattern
  // Stellarium: Two lines meeting at center
  cancer: {
    stars: [
      { id: 'acubens', x: 0.60, y: 0.50, size: 2.8, label: 'Acubens' },        // α Cnc
      { id: 'altarf', x: 0.25, y: 0.55, size: 3.2, label: 'Altarf' },          // β Cnc - brightest
      { id: 'asellus-bor', x: 0.45, y: 0.42, size: 2.5, label: 'Asellus Borealis' }, // γ Cnc
      { id: 'asellus-aus', x: 0.50, y: 0.48, size: 2.5, label: 'Asellus Australis' }, // δ Cnc
      { id: 'iota-cnc', x: 0.70, y: 0.35, size: 2.2, label: 'Iota Cnc' },      // ι Cnc
    ],
    lines: [
      ['altarf', 'asellus-aus'],
      ['asellus-aus', 'asellus-bor'],
      ['asellus-bor', 'iota-cnc'],
      ['asellus-aus', 'acubens'],
    ],
  },

  // Leo: Sickle + triangle pattern
  // Stellarium: Famous sickle asterism
  leo: {
    stars: [
      { id: 'regulus', x: 0.65, y: 0.60, size: 4.0, label: 'Regulus' },        // α Leo
      { id: 'denebola', x: 0.18, y: 0.48, size: 3.2, label: 'Denebola' },      // β Leo  
      { id: 'algieba', x: 0.55, y: 0.38, size: 3.0, label: 'Algieba' },        // γ Leo
      { id: 'zosma', x: 0.32, y: 0.50, size: 2.8, label: 'Zosma' },            // δ Leo
      { id: 'chertan', x: 0.42, y: 0.55, size: 2.5, label: 'Chertan' },        // θ Leo
      { id: 'eta-leo', x: 0.58, y: 0.28, size: 2.5, label: 'Eta Leo' },        // η Leo
      { id: 'adhafera', x: 0.52, y: 0.32, size: 2.5, label: 'Adhafera' },      // ζ Leo
      { id: 'rasalas', x: 0.62, y: 0.25, size: 2.5, label: 'Rasalas' },        // μ Leo
    ],
    lines: [
      ['regulus', 'chertan'],
      ['chertan', 'zosma'],
      ['zosma', 'denebola'],
      ['regulus', 'algieba'],
      ['algieba', 'adhafera'],
      ['adhafera', 'eta-leo'],
      ['eta-leo', 'rasalas'],
    ],
  },

  // Virgo: Y-shape extending from Spica
  // Stellarium: Two main branches
  virgo: {
    stars: [
      { id: 'spica', x: 0.55, y: 0.72, size: 4.0, label: 'Spica' },            // α Vir - brightest
      { id: 'zavijava', x: 0.72, y: 0.30, size: 2.8, label: 'Zavijava' },      // β Vir
      { id: 'porrima', x: 0.50, y: 0.50, size: 3.0, label: 'Porrima' },        // γ Vir
      { id: 'auva', x: 0.42, y: 0.42, size: 2.8, label: 'Auva' },              // δ Vir
      { id: 'vindemiatrix', x: 0.35, y: 0.28, size: 3.0, label: 'Vindemiatrix' }, // ε Vir
      { id: 'heze', x: 0.60, y: 0.58, size: 2.5, label: 'Heze' },              // ζ Vir
      { id: 'zaniah', x: 0.55, y: 0.40, size: 2.3, label: 'Zaniah' },          // η Vir
    ],
    lines: [
      ['spica', 'porrima'],
      ['porrima', 'auva'],
      ['auva', 'vindemiatrix'],
      ['porrima', 'zaniah'],
      ['zaniah', 'zavijava'],
      ['porrima', 'heze'],
    ],
  },

  // Libra: Scales shape - diamond/kite
  // Stellarium: Connected diamond pattern
  libra: {
    stars: [
      { id: 'zuben-el', x: 0.55, y: 0.60, size: 3.5, label: 'Zubenelgenubi' }, // α Lib
      { id: 'zuben-sch', x: 0.45, y: 0.35, size: 3.5, label: 'Zubeneschamali' }, // β Lib
      { id: 'gamma-lib', x: 0.30, y: 0.50, size: 2.8, label: 'Gamma Lib' },    // γ Lib
      { id: 'sigma-lib', x: 0.65, y: 0.70, size: 2.5, label: 'Sigma Lib' },    // σ Lib
      { id: 'upsilon-lib', x: 0.50, y: 0.48, size: 2.3, label: 'Upsilon Lib' }, // υ Lib
    ],
    lines: [
      ['zuben-el', 'zuben-sch'],
      ['zuben-sch', 'gamma-lib'],
      ['zuben-el', 'upsilon-lib'],
      ['upsilon-lib', 'gamma-lib'],
      ['zuben-el', 'sigma-lib'],
    ],
  },

  // Scorpius: Long curving scorpion tail
  // Stellarium: Extended curved pattern
  scorpio: {
    stars: [
      { id: 'antares', x: 0.45, y: 0.40, size: 4.0, label: 'Antares' },        // α Sco - red supergiant
      { id: 'shaula', x: 0.78, y: 0.80, size: 3.2, label: 'Shaula' },          // λ Sco - stinger
      { id: 'sargas', x: 0.72, y: 0.72, size: 2.8, label: 'Sargas' },          // θ Sco
      { id: 'dschubba', x: 0.35, y: 0.28, size: 3.0, label: 'Dschubba' },      // δ Sco - head
      { id: 'graffias', x: 0.30, y: 0.25, size: 2.8, label: 'Graffias' },      // β Sco
      { id: 'pi-sco', x: 0.25, y: 0.22, size: 2.5, label: 'Pi Sco' },          // π Sco
      { id: 'sigma-sco', x: 0.50, y: 0.45, size: 2.5, label: 'Sigma Sco' },    // σ Sco
      { id: 'epsilon-sco', x: 0.58, y: 0.55, size: 2.5, label: 'Epsilon Sco' }, // ε Sco
      { id: 'mu-sco', x: 0.62, y: 0.60, size: 2.5, label: 'Mu Sco' },          // μ Sco
      { id: 'zeta-sco', x: 0.65, y: 0.65, size: 2.5, label: 'Zeta Sco' },      // ζ Sco
      { id: 'eta-sco', x: 0.68, y: 0.68, size: 2.5, label: 'Eta Sco' },        // η Sco
      { id: 'lesath', x: 0.80, y: 0.78, size: 2.5, label: 'Lesath' },          // υ Sco
    ],
    lines: [
      ['pi-sco', 'graffias'],
      ['graffias', 'dschubba'],
      ['dschubba', 'antares'],
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

  // Sagittarius: The Teapot asterism - accurate star positions
  // Based on actual RA/Dec coordinates, normalized to 0-1 range
  // The Teapot is oriented with spout on LEFT, handle on RIGHT
  sagittarius: {
    stars: [
      // Teapot body - positioned to form recognizable teapot shape
      { id: 'kaus-australis', x: 0.35, y: 0.65, size: 3.8, label: 'Kaus Australis' }, // ε Sgr - bottom left of pot
      { id: 'kaus-media', x: 0.25, y: 0.50, size: 3.0, label: 'Kaus Media' },         // δ Sgr - middle left (spout base)
      { id: 'kaus-borealis', x: 0.30, y: 0.32, size: 2.8, label: 'Kaus Borealis' },   // λ Sgr - top left (lid)
      { id: 'phi', x: 0.48, y: 0.28, size: 2.5, label: 'Phi Sgr' },                   // φ Sgr - top middle (lid)
      { id: 'nunki', x: 0.65, y: 0.35, size: 3.2, label: 'Nunki' },                   // σ Sgr - handle top right
      { id: 'tau', x: 0.72, y: 0.50, size: 2.5, label: 'Tau Sgr' },                   // τ Sgr - handle middle right
      { id: 'ascella', x: 0.55, y: 0.62, size: 2.8, label: 'Ascella' },               // ζ Sgr - bottom right of pot
      // Spout tip (extends left from kaus-media)
      { id: 'alnasl', x: 0.12, y: 0.42, size: 2.8, label: 'Alnasl' },                 // γ Sgr - spout tip
    ],
    lines: [
      // Teapot body - closed shape
      ['kaus-australis', 'kaus-media'],      // bottom to spout base
      ['kaus-media', 'kaus-borealis'],       // up the left side
      ['kaus-borealis', 'phi'],              // across the lid
      ['phi', 'nunki'],                       // lid to handle top
      ['nunki', 'tau'],                       // handle curve
      ['tau', 'ascella'],                     // handle to bottom right
      ['ascella', 'kaus-australis'],          // bottom of pot
      // Spout
      ['kaus-media', 'alnasl'],              // spout extending left
    ],
  },

  // Capricornus: Triangle/wedge shape
  // Stellarium: Triangular loop
  capricorn: {
    stars: [
      { id: 'deneb-algedi', x: 0.25, y: 0.45, size: 3.5, label: 'Deneb Algedi' }, // δ Cap
      { id: 'nashira', x: 0.30, y: 0.50, size: 2.8, label: 'Nashira' },        // γ Cap
      { id: 'dabih', x: 0.70, y: 0.35, size: 3.0, label: 'Dabih' },            // β Cap
      { id: 'algedi', x: 0.75, y: 0.32, size: 2.5, label: 'Algedi' },          // α Cap
      { id: 'zeta-cap', x: 0.55, y: 0.55, size: 2.5, label: 'Zeta Cap' },      // ζ Cap
      { id: 'theta-cap', x: 0.50, y: 0.60, size: 2.5, label: 'Theta Cap' },    // θ Cap
      { id: 'omega-cap', x: 0.42, y: 0.65, size: 2.5, label: 'Omega Cap' },    // ω Cap
      { id: 'psi-cap', x: 0.60, y: 0.48, size: 2.3, label: 'Psi Cap' },        // ψ Cap
    ],
    lines: [
      ['algedi', 'dabih'],
      ['dabih', 'psi-cap'],
      ['psi-cap', 'omega-cap'],
      ['omega-cap', 'theta-cap'],
      ['theta-cap', 'zeta-cap'],
      ['zeta-cap', 'nashira'],
      ['nashira', 'deneb-algedi'],
      ['deneb-algedi', 'dabih'],
    ],
  },

  // Aquarius: Y-shape water bearer pattern
  // Stellarium: Water jug pouring
  aquarius: {
    stars: [
      { id: 'sadalsuud', x: 0.35, y: 0.25, size: 3.5, label: 'Sadalsuud' },    // β Aqr - brightest
      { id: 'sadalmelik', x: 0.45, y: 0.32, size: 3.2, label: 'Sadalmelik' },  // α Aqr
      { id: 'sadachbia', x: 0.55, y: 0.40, size: 2.8, label: 'Sadachbia' },    // γ Aqr
      { id: 'skat', x: 0.52, y: 0.60, size: 3.0, label: 'Skat' },              // δ Aqr
      { id: 'albali', x: 0.48, y: 0.48, size: 2.5, label: 'Albali' },          // ε Aqr
      { id: 'ancha', x: 0.50, y: 0.55, size: 2.5, label: 'Ancha' },            // θ Aqr
      { id: 'lambda-aqr', x: 0.60, y: 0.72, size: 2.5, label: 'Lambda Aqr' },  // λ Aqr
    ],
    lines: [
      ['sadalsuud', 'sadalmelik'],
      ['sadalmelik', 'sadachbia'],
      ['sadalmelik', 'albali'],
      ['albali', 'ancha'],
      ['ancha', 'skat'],
      ['skat', 'lambda-aqr'],
    ],
  },

  // Pisces: Two fish connected by cord (V-shape)
  // Stellarium: Extended connected pattern
  pisces: {
    stars: [
      { id: 'alrescha', x: 0.50, y: 0.58, size: 3.0, label: 'Alrescha' },      // α Psc - the knot
      { id: 'fumalsamakah', x: 0.25, y: 0.35, size: 2.8, label: 'Fum al Samakah' }, // β Psc
      { id: 'omega-psc', x: 0.65, y: 0.42, size: 2.5, label: 'Omega Psc' },    // ω Psc
      { id: 'iota-psc', x: 0.72, y: 0.38, size: 2.5, label: 'Iota Psc' },      // ι Psc
      { id: 'theta-psc', x: 0.78, y: 0.35, size: 2.3, label: 'Theta Psc' },    // θ Psc
      { id: 'gamma-psc', x: 0.82, y: 0.32, size: 2.5, label: 'Gamma Psc' },    // γ Psc
      { id: 'eta-psc', x: 0.35, y: 0.50, size: 2.5, label: 'Eta Psc' },        // η Psc
      { id: 'omicron-psc', x: 0.30, y: 0.45, size: 2.3, label: 'Omicron Psc' }, // ο Psc
      { id: 'epsilon-psc', x: 0.58, y: 0.52, size: 2.5, label: 'Epsilon Psc' }, // ε Psc
      { id: 'delta-psc', x: 0.55, y: 0.48, size: 2.5, label: 'Delta Psc' },    // δ Psc
    ],
    lines: [
      // Western fish
      ['gamma-psc', 'theta-psc'],
      ['theta-psc', 'iota-psc'],
      ['iota-psc', 'omega-psc'],
      // Cord connecting to knot
      ['omega-psc', 'delta-psc'],
      ['delta-psc', 'epsilon-psc'],
      ['epsilon-psc', 'alrescha'],
      // Eastern fish
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