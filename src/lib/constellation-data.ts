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

// Constellation patterns for all 12 zodiac signs (normalized 0-1 coordinates)
export const CONSTELLATION_DATA: Record<ZodiacSign, ConstellationData> = {
  aries: {
    stars: [
      { id: 'hamal', x: 0.35, y: 0.35, size: 3.5, label: 'Hamal' },
      { id: 'sheratan', x: 0.50, y: 0.45, size: 3, label: 'Sheratan' },
      { id: 'mesarthim', x: 0.58, y: 0.52, size: 2.5, label: 'Mesarthim' },
      { id: '41-ari', x: 0.25, y: 0.55, size: 2, label: '41 Ari' },
      { id: 'bharani', x: 0.42, y: 0.65, size: 2.5, label: 'Bharani' },
    ],
    lines: [
      ['hamal', 'sheratan'],
      ['sheratan', 'mesarthim'],
      ['hamal', '41-ari'],
      ['hamal', 'bharani'],
    ],
  },
  taurus: {
    stars: [
      { id: 'aldebaran', x: 0.45, y: 0.50, size: 4, label: 'Aldebaran' },
      { id: 'elnath', x: 0.25, y: 0.25, size: 3, label: 'Elnath' },
      { id: 'zeta-tau', x: 0.35, y: 0.35, size: 2.5, label: 'Zeta Tau' },
      { id: 'theta-tau', x: 0.55, y: 0.45, size: 2.5, label: 'Theta Tau' },
      { id: 'epsilon-tau', x: 0.60, y: 0.55, size: 2.5, label: 'Epsilon Tau' },
      { id: 'lambda-tau', x: 0.70, y: 0.65, size: 2, label: 'Lambda Tau' },
    ],
    lines: [
      ['aldebaran', 'zeta-tau'],
      ['zeta-tau', 'elnath'],
      ['aldebaran', 'theta-tau'],
      ['theta-tau', 'epsilon-tau'],
      ['epsilon-tau', 'lambda-tau'],
    ],
  },
  gemini: {
    stars: [
      { id: 'castor', x: 0.35, y: 0.25, size: 3.5, label: 'Castor' },
      { id: 'pollux', x: 0.45, y: 0.30, size: 3.5, label: 'Pollux' },
      { id: 'alhena', x: 0.55, y: 0.65, size: 3, label: 'Alhena' },
      { id: 'wasat', x: 0.50, y: 0.50, size: 2.5, label: 'Wasat' },
      { id: 'mebsuta', x: 0.30, y: 0.45, size: 2.5, label: 'Mebsuta' },
      { id: 'tejat', x: 0.40, y: 0.70, size: 2.5, label: 'Tejat' },
    ],
    lines: [
      ['castor', 'pollux'],
      ['castor', 'mebsuta'],
      ['mebsuta', 'tejat'],
      ['pollux', 'wasat'],
      ['wasat', 'alhena'],
    ],
  },
  cancer: {
    stars: [
      { id: 'acubens', x: 0.55, y: 0.55, size: 3, label: 'Acubens' },
      { id: 'altarf', x: 0.35, y: 0.65, size: 3, label: 'Altarf' },
      { id: 'asellus-bor', x: 0.45, y: 0.40, size: 2.5, label: 'Asellus Borealis' },
      { id: 'asellus-aus', x: 0.50, y: 0.48, size: 2.5, label: 'Asellus Australis' },
      { id: 'iota-cnc', x: 0.62, y: 0.35, size: 2, label: 'Iota Cnc' },
    ],
    lines: [
      ['altarf', 'acubens'],
      ['acubens', 'asellus-aus'],
      ['asellus-aus', 'asellus-bor'],
      ['asellus-bor', 'iota-cnc'],
    ],
  },
  leo: {
    stars: [
      { id: 'regulus', x: 0.55, y: 0.65, size: 4, label: 'Regulus' },
      { id: 'denebola', x: 0.25, y: 0.45, size: 3, label: 'Denebola' },
      { id: 'algieba', x: 0.50, y: 0.40, size: 3, label: 'Algieba' },
      { id: 'zosma', x: 0.35, y: 0.50, size: 2.5, label: 'Zosma' },
      { id: 'chertan', x: 0.42, y: 0.55, size: 2.5, label: 'Chertan' },
      { id: 'rasalas', x: 0.60, y: 0.30, size: 2.5, label: 'Rasalas' },
    ],
    lines: [
      ['regulus', 'chertan'],
      ['chertan', 'zosma'],
      ['zosma', 'denebola'],
      ['regulus', 'algieba'],
      ['algieba', 'rasalas'],
    ],
  },
  virgo: {
    stars: [
      { id: 'spica', x: 0.50, y: 0.70, size: 4, label: 'Spica' },
      { id: 'porrima', x: 0.45, y: 0.50, size: 3, label: 'Porrima' },
      { id: 'vindemiatrix', x: 0.35, y: 0.30, size: 3, label: 'Vindemiatrix' },
      { id: 'zavijava', x: 0.55, y: 0.35, size: 2.5, label: 'Zavijava' },
      { id: 'auva', x: 0.40, y: 0.42, size: 2.5, label: 'Auva' },
      { id: 'heze', x: 0.60, y: 0.55, size: 2.5, label: 'Heze' },
    ],
    lines: [
      ['spica', 'porrima'],
      ['porrima', 'auva'],
      ['auva', 'vindemiatrix'],
      ['porrima', 'zavijava'],
      ['porrima', 'heze'],
    ],
  },
  libra: {
    stars: [
      { id: 'zuben-el', x: 0.55, y: 0.55, size: 3.5, label: 'Zubenelgenubi' },
      { id: 'zuben-sch', x: 0.40, y: 0.35, size: 3.5, label: 'Zubeneschamali' },
      { id: 'brachium', x: 0.65, y: 0.70, size: 2.5, label: 'Brachium' },
      { id: 'zuben-hak', x: 0.50, y: 0.45, size: 2.5, label: 'Zubenelakrab' },
      { id: 'gamma-lib', x: 0.35, y: 0.55, size: 2, label: 'Gamma Lib' },
    ],
    lines: [
      ['zuben-el', 'zuben-sch'],
      ['zuben-el', 'brachium'],
      ['zuben-el', 'zuben-hak'],
      ['zuben-hak', 'gamma-lib'],
    ],
  },
  scorpio: {
    stars: [
      { id: 'antares', x: 0.45, y: 0.45, size: 4, label: 'Antares' },
      { id: 'shaula', x: 0.70, y: 0.75, size: 3, label: 'Shaula' },
      { id: 'dschubba', x: 0.35, y: 0.30, size: 3, label: 'Dschubba' },
      { id: 'sargas', x: 0.65, y: 0.65, size: 2.5, label: 'Sargas' },
      { id: 'graffias', x: 0.30, y: 0.35, size: 2.5, label: 'Graffias' },
      { id: 'lesath', x: 0.72, y: 0.72, size: 2.5, label: 'Lesath' },
    ],
    lines: [
      ['dschubba', 'graffias'],
      ['dschubba', 'antares'],
      ['antares', 'sargas'],
      ['sargas', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },
  sagittarius: {
    // The Teapot asterism - the most recognizable pattern in Sagittarius
    // Based on IAU star positions: forms a teapot shape
    stars: [
      // Lid (top)
      { id: 'kaus-borealis', x: 0.28, y: 0.32, size: 2.8, label: 'Kaus Borealis' }, // λ Sgr - handle of lid
      // Handle (left side, curves up)
      { id: 'nunki', x: 0.68, y: 0.40, size: 3.2, label: 'Nunki' }, // σ Sgr - top of handle
      { id: 'tau', x: 0.72, y: 0.55, size: 2.2, label: 'Tau' }, // τ Sgr - middle handle
      { id: 'ascella', x: 0.60, y: 0.62, size: 2.8, label: 'Ascella' }, // ζ Sgr - base of handle
      // Body (main teapot shape)
      { id: 'phi', x: 0.55, y: 0.38, size: 2.5, label: 'Phi' }, // φ Sgr - top of body
      { id: 'kaus-media', x: 0.35, y: 0.52, size: 2.8, label: 'Kaus Media' }, // δ Sgr - middle bow
      { id: 'kaus-australis', x: 0.45, y: 0.68, size: 3.5, label: 'Kaus Australis' }, // ε Sgr - brightest, base
      // Spout (extends left)
      { id: 'alnasl', x: 0.18, y: 0.45, size: 2.6, label: 'Alnasl' }, // γ Sgr - tip of spout
    ],
    lines: [
      // The Teapot shape
      // Lid
      ['kaus-borealis', 'phi'],
      // Body top
      ['phi', 'nunki'],
      // Handle
      ['nunki', 'tau'],
      ['tau', 'ascella'],
      // Body bottom
      ['ascella', 'kaus-australis'],
      // Body left/bow
      ['kaus-australis', 'kaus-media'],
      ['kaus-media', 'kaus-borealis'],
      // Spout
      ['kaus-media', 'alnasl'],
    ],
  },
  capricorn: {
    stars: [
      { id: 'deneb-algedi', x: 0.35, y: 0.40, size: 3.5, label: 'Deneb Algedi' },
      { id: 'dabih', x: 0.55, y: 0.35, size: 3, label: 'Dabih' },
      { id: 'algedi', x: 0.60, y: 0.30, size: 2.5, label: 'Algedi' },
      { id: 'nashira', x: 0.40, y: 0.50, size: 2.5, label: 'Nashira' },
      { id: 'omega-cap', x: 0.50, y: 0.65, size: 2.5, label: 'Omega Cap' },
      { id: 'zeta-cap', x: 0.45, y: 0.55, size: 2, label: 'Zeta Cap' },
    ],
    lines: [
      ['algedi', 'dabih'],
      ['dabih', 'deneb-algedi'],
      ['deneb-algedi', 'nashira'],
      ['nashira', 'zeta-cap'],
      ['zeta-cap', 'omega-cap'],
    ],
  },
  aquarius: {
    stars: [
      { id: 'sadalsuud', x: 0.40, y: 0.30, size: 3.5, label: 'Sadalsuud' },
      { id: 'sadalmelik', x: 0.50, y: 0.35, size: 3, label: 'Sadalmelik' },
      { id: 'skat', x: 0.55, y: 0.60, size: 3, label: 'Skat' },
      { id: 'albali', x: 0.45, y: 0.45, size: 2.5, label: 'Albali' },
      { id: 'ancha', x: 0.50, y: 0.52, size: 2.5, label: 'Ancha' },
      { id: 'sadachbia', x: 0.60, y: 0.42, size: 2.5, label: 'Sadachbia' },
    ],
    lines: [
      ['sadalsuud', 'sadalmelik'],
      ['sadalmelik', 'sadachbia'],
      ['sadalmelik', 'albali'],
      ['albali', 'ancha'],
      ['ancha', 'skat'],
    ],
  },
  pisces: {
    stars: [
      { id: 'alrescha', x: 0.50, y: 0.55, size: 3, label: 'Alrescha' },
      { id: 'fumalsamakah', x: 0.35, y: 0.35, size: 3, label: 'Fum al Samakah' },
      { id: 'omega-psc', x: 0.65, y: 0.40, size: 2.5, label: 'Omega Psc' },
      { id: 'delta-psc', x: 0.55, y: 0.45, size: 2.5, label: 'Delta Psc' },
      { id: 'epsilon-psc', x: 0.45, y: 0.42, size: 2.5, label: 'Epsilon Psc' },
      { id: 'eta-psc', x: 0.30, y: 0.50, size: 2.5, label: 'Eta Psc' },
      { id: 'gamma-psc', x: 0.70, y: 0.60, size: 2, label: 'Gamma Psc' },
    ],
    lines: [
      ['alrescha', 'delta-psc'],
      ['delta-psc', 'epsilon-psc'],
      ['epsilon-psc', 'fumalsamakah'],
      ['fumalsamakah', 'eta-psc'],
      ['alrescha', 'omega-psc'],
      ['omega-psc', 'gamma-psc'],
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
