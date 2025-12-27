import { ZodiacSign } from "./zodiac";

interface ConstellationStar {
  id: string;
  x: number;
  y: number;
  size: number;
  label: string;
  bayer?: string; // Bayer designation (α, β, γ, etc.)
}

interface ConstellationData {
  stars: ConstellationStar[];
  lines: [string, string][];
}

// Official IAU constellation patterns based on Stellarium/d3-celestial data
// Star positions are normalized 0-1 based on actual Right Ascension and Declination
// These patterns match the official IAU constellation stick figures

export const CONSTELLATION_DATA: Record<ZodiacSign, ConstellationData> = {
  // ARIES - The Ram
  // Simple bent line pattern - one of the smallest zodiac constellations
  // Based on IAU official stick figure
  aries: {
    stars: [
      { id: 'hamal', x: 0.25, y: 0.42, size: 4.0, label: 'Hamal', bayer: 'α' },           // α Ari - mag 2.0, brightest
      { id: 'sheratan', x: 0.45, y: 0.48, size: 3.2, label: 'Sheratan', bayer: 'β' },     // β Ari - mag 2.6
      { id: 'mesarthim', x: 0.58, y: 0.52, size: 2.8, label: 'Mesarthim', bayer: 'γ' },   // γ Ari - mag 3.9
      { id: '41-ari', x: 0.72, y: 0.45, size: 2.2, label: '41 Ari' },                      // 41 Ari - mag 3.6
    ],
    lines: [
      ['hamal', 'sheratan'],
      ['sheratan', 'mesarthim'],
      ['mesarthim', '41-ari'],
    ],
  },

  // TAURUS - The Bull
  // V-shaped Hyades cluster (bull's face) with horns extending upward
  // Aldebaran is the bright orange eye
  taurus: {
    stars: [
      { id: 'aldebaran', x: 0.45, y: 0.52, size: 4.5, label: 'Aldebaran', bayer: 'α' },   // α Tau - mag 0.85, orange giant
      { id: 'elnath', x: 0.22, y: 0.18, size: 3.5, label: 'Elnath', bayer: 'β' },         // β Tau - mag 1.65, northern horn tip
      { id: 'zeta-tau', x: 0.35, y: 0.25, size: 3.0, label: 'Tianguan', bayer: 'ζ' },     // ζ Tau - mag 3.0, southern horn
      { id: 'theta2-tau', x: 0.52, y: 0.45, size: 2.8, label: 'Theta² Tau', bayer: 'θ²' },// θ² Tau - Hyades
      { id: 'gamma-tau', x: 0.58, y: 0.40, size: 2.8, label: 'Gamma Tau', bayer: 'γ' },   // γ Tau - Hyades
      { id: 'delta1-tau', x: 0.65, y: 0.38, size: 2.8, label: 'Delta¹ Tau', bayer: 'δ¹' },// δ Tau - Hyades
      { id: 'epsilon-tau', x: 0.72, y: 0.42, size: 2.8, label: 'Ain', bayer: 'ε' },       // ε Tau - Hyades, end of V
    ],
    lines: [
      // V-shape of the face (Hyades)
      ['aldebaran', 'theta2-tau'],
      ['theta2-tau', 'gamma-tau'],
      ['gamma-tau', 'delta1-tau'],
      ['delta1-tau', 'epsilon-tau'],
      // Horns
      ['aldebaran', 'zeta-tau'],
      ['zeta-tau', 'elnath'],
    ],
  },

  // GEMINI - The Twins
  // Two parallel stick figures with Castor and Pollux as the heads
  gemini: {
    stars: [
      { id: 'castor', x: 0.32, y: 0.18, size: 3.8, label: 'Castor', bayer: 'α' },         // α Gem - mag 1.58
      { id: 'pollux', x: 0.42, y: 0.22, size: 4.2, label: 'Pollux', bayer: 'β' },         // β Gem - mag 1.14, actually brighter
      { id: 'mebsuta', x: 0.28, y: 0.38, size: 2.8, label: 'Mebsuta', bayer: 'ε' },       // ε Gem - Castor's shoulder
      { id: 'tejat', x: 0.22, y: 0.55, size: 2.8, label: 'Tejat', bayer: 'μ' },           // μ Gem - Castor's knee
      { id: 'propus', x: 0.18, y: 0.68, size: 2.6, label: 'Propus', bayer: 'η' },         // η Gem - Castor's foot
      { id: 'wasat', x: 0.48, y: 0.45, size: 2.6, label: 'Wasat', bayer: 'δ' },           // δ Gem - Pollux's waist
      { id: 'alhena', x: 0.55, y: 0.70, size: 3.2, label: 'Alhena', bayer: 'γ' },         // γ Gem - Pollux's foot
    ],
    lines: [
      // Castor (western twin)
      ['castor', 'mebsuta'],
      ['mebsuta', 'tejat'],
      ['tejat', 'propus'],
      // Pollux (eastern twin)
      ['pollux', 'wasat'],
      ['wasat', 'alhena'],
      // Connect the twins at the head
      ['castor', 'pollux'],
    ],
  },

  // CANCER - The Crab
  // Inverted Y shape - faintest zodiac constellation
  cancer: {
    stars: [
      { id: 'altarf', x: 0.22, y: 0.55, size: 3.5, label: 'Altarf', bayer: 'β' },         // β Cnc - mag 3.5, brightest
      { id: 'acubens', x: 0.65, y: 0.58, size: 3.0, label: 'Acubens', bayer: 'α' },       // α Cnc - mag 4.25
      { id: 'asellus-bor', x: 0.45, y: 0.35, size: 2.8, label: 'Asellus Borealis', bayer: 'γ' }, // γ Cnc - northern donkey
      { id: 'asellus-aus', x: 0.50, y: 0.48, size: 2.8, label: 'Asellus Australis', bayer: 'δ' }, // δ Cnc - southern donkey
      { id: 'iota-cnc', x: 0.52, y: 0.25, size: 2.5, label: 'Iota Cnc', bayer: 'ι' },     // ι Cnc
    ],
    lines: [
      // Inverted Y
      ['altarf', 'asellus-aus'],
      ['acubens', 'asellus-aus'],
      ['asellus-aus', 'asellus-bor'],
      ['asellus-bor', 'iota-cnc'],
    ],
  },

  // LEO - The Lion
  // Distinctive backwards question mark (The Sickle) + triangle (hindquarters)
  // One of the most recognizable constellations
  leo: {
    stars: [
      { id: 'regulus', x: 0.25, y: 0.62, size: 4.5, label: 'Regulus', bayer: 'α' },       // α Leo - mag 1.35, the heart
      { id: 'denebola', x: 0.78, y: 0.48, size: 3.5, label: 'Denebola', bayer: 'β' },     // β Leo - mag 2.14, the tail
      { id: 'algieba', x: 0.32, y: 0.42, size: 3.2, label: 'Algieba', bayer: 'γ' },       // γ Leo - mag 2.08, the mane
      { id: 'zosma', x: 0.62, y: 0.45, size: 3.0, label: 'Zosma', bayer: 'δ' },           // δ Leo - mag 2.56
      { id: 'chertan', x: 0.48, y: 0.55, size: 2.8, label: 'Chertan', bayer: 'θ' },       // θ Leo - mag 3.33
      { id: 'adhafera', x: 0.38, y: 0.32, size: 2.8, label: 'Adhafera', bayer: 'ζ' },     // ζ Leo - the Sickle
      { id: 'rasalas', x: 0.42, y: 0.22, size: 2.6, label: 'Rasalas', bayer: 'μ' },       // μ Leo - top of Sickle
      { id: 'epsilon-leo', x: 0.30, y: 0.25, size: 2.8, label: 'Algenubi', bayer: 'ε' },  // ε Leo - the Sickle
    ],
    lines: [
      // The Sickle (lion's head and mane) - backwards question mark
      ['regulus', 'algieba'],
      ['algieba', 'adhafera'],
      ['adhafera', 'rasalas'],
      ['adhafera', 'epsilon-leo'],
      // Body and hindquarters
      ['regulus', 'chertan'],
      ['chertan', 'zosma'],
      ['zosma', 'denebola'],
    ],
  },

  // VIRGO - The Maiden
  // Large Y-shape with brilliant Spica at the base
  virgo: {
    stars: [
      { id: 'spica', x: 0.48, y: 0.78, size: 4.5, label: 'Spica', bayer: 'α' },           // α Vir - mag 0.97, very bright
      { id: 'porrima', x: 0.45, y: 0.52, size: 3.2, label: 'Porrima', bayer: 'γ' },       // γ Vir - Y junction
      { id: 'auva', x: 0.38, y: 0.38, size: 3.0, label: 'Auva', bayer: 'δ' },             // δ Vir
      { id: 'vindemiatrix', x: 0.28, y: 0.22, size: 3.2, label: 'Vindemiatrix', bayer: 'ε' }, // ε Vir - mag 2.83
      { id: 'zavijava', x: 0.62, y: 0.28, size: 3.0, label: 'Zavijava', bayer: 'β' },     // β Vir - mag 3.6
      { id: 'zaniah', x: 0.55, y: 0.42, size: 2.6, label: 'Zaniah', bayer: 'η' },         // η Vir
      { id: 'syrma', x: 0.52, y: 0.65, size: 2.5, label: 'Syrma', bayer: 'ι' },           // ι Vir
    ],
    lines: [
      // Y-shape
      ['spica', 'syrma'],
      ['syrma', 'porrima'],
      ['porrima', 'auva'],
      ['auva', 'vindemiatrix'],
      ['porrima', 'zaniah'],
      ['zaniah', 'zavijava'],
    ],
  },

  // LIBRA - The Scales
  // Quadrilateral balance shape
  libra: {
    stars: [
      { id: 'zuben-el', x: 0.58, y: 0.62, size: 3.5, label: 'Zubenelgenubi', bayer: 'α' }, // α Lib - southern claw
      { id: 'zuben-sch', x: 0.42, y: 0.28, size: 3.8, label: 'Zubeneschamali', bayer: 'β' }, // β Lib - northern claw, greenish
      { id: 'zuben-hak', x: 0.28, y: 0.55, size: 3.0, label: 'Zubenelakrab', bayer: 'γ' }, // γ Lib
      { id: 'brachium', x: 0.52, y: 0.42, size: 2.6, label: 'Brachium', bayer: 'σ' },     // σ Lib
      { id: 'upsilon-lib', x: 0.62, y: 0.35, size: 2.5, label: 'Upsilon Lib', bayer: 'υ' }, // υ Lib
    ],
    lines: [
      // Balance/rectangle shape
      ['zuben-hak', 'zuben-sch'],
      ['zuben-sch', 'upsilon-lib'],
      ['upsilon-lib', 'zuben-el'],
      ['zuben-el', 'zuben-hak'],
      ['brachium', 'zuben-sch'],
    ],
  },

  // SCORPIUS - The Scorpion
  // Distinctive J-shaped curved tail with bright red Antares
  // One of the most recognizable constellations
  scorpio: {
    stars: [
      { id: 'antares', x: 0.32, y: 0.35, size: 4.5, label: 'Antares', bayer: 'α' },       // α Sco - mag 1.06, red supergiant
      { id: 'graffias', x: 0.22, y: 0.22, size: 3.0, label: 'Graffias', bayer: 'β' },     // β Sco - head/claw
      { id: 'dschubba', x: 0.28, y: 0.25, size: 3.2, label: 'Dschubba', bayer: 'δ' },     // δ Sco - head
      { id: 'pi-sco', x: 0.35, y: 0.28, size: 2.6, label: 'Pi Sco', bayer: 'π' },         // π Sco
      { id: 'sigma-sco', x: 0.38, y: 0.42, size: 2.8, label: 'Alniyat', bayer: 'σ' },     // σ Sco
      { id: 'tau-sco', x: 0.40, y: 0.32, size: 2.6, label: 'Tau Sco', bayer: 'τ' },       // τ Sco
      { id: 'epsilon-sco', x: 0.48, y: 0.52, size: 2.8, label: 'Epsilon Sco', bayer: 'ε' }, // ε Sco
      { id: 'mu-sco', x: 0.55, y: 0.58, size: 2.6, label: 'Mu Sco', bayer: 'μ' },         // μ Sco
      { id: 'zeta-sco', x: 0.62, y: 0.65, size: 2.6, label: 'Zeta Sco', bayer: 'ζ' },     // ζ Sco
      { id: 'eta-sco', x: 0.68, y: 0.68, size: 2.6, label: 'Eta Sco', bayer: 'η' },       // η Sco
      { id: 'sargas', x: 0.75, y: 0.72, size: 3.0, label: 'Sargas', bayer: 'θ' },         // θ Sco
      { id: 'shaula', x: 0.82, y: 0.65, size: 3.5, label: 'Shaula', bayer: 'λ' },         // λ Sco - stinger, mag 1.62
      { id: 'lesath', x: 0.85, y: 0.62, size: 2.8, label: 'Lesath', bayer: 'υ' },         // υ Sco - stinger tip
    ],
    lines: [
      // Head (claws)
      ['graffias', 'dschubba'],
      ['dschubba', 'pi-sco'],
      ['pi-sco', 'antares'],
      // Body
      ['antares', 'sigma-sco'],
      ['sigma-sco', 'epsilon-sco'],
      // Curved tail (J-shape)
      ['epsilon-sco', 'mu-sco'],
      ['mu-sco', 'zeta-sco'],
      ['zeta-sco', 'eta-sco'],
      ['eta-sco', 'sargas'],
      ['sargas', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },

  // SAGITTARIUS - The Archer (THE TEAPOT)
  // Famous Teapot asterism - most recognizable pattern
  // Based on Wikipedia: δ, ε, ζ, φ form body; λ is lid; γ² is spout tip; σ, τ are handle
  sagittarius: {
    stars: [
      { id: 'kaus-australis', x: 0.42, y: 0.68, size: 4.0, label: 'Kaus Australis', bayer: 'ε' }, // ε Sgr - mag 1.85, brightest, bottom of pot
      { id: 'kaus-media', x: 0.32, y: 0.52, size: 3.2, label: 'Kaus Media', bayer: 'δ' },         // δ Sgr - mag 2.70, left side
      { id: 'kaus-borealis', x: 0.38, y: 0.35, size: 3.0, label: 'Kaus Borealis', bayer: 'λ' },   // λ Sgr - mag 2.81, lid point
      { id: 'phi-sgr', x: 0.52, y: 0.32, size: 2.8, label: 'Phi Sgr', bayer: 'φ' },               // φ Sgr - top of pot body
      { id: 'nunki', x: 0.65, y: 0.38, size: 3.5, label: 'Nunki', bayer: 'σ' },                   // σ Sgr - mag 2.05, handle top
      { id: 'tau-sgr', x: 0.72, y: 0.52, size: 2.8, label: 'Tau Sgr', bayer: 'τ' },               // τ Sgr - handle middle
      { id: 'ascella', x: 0.68, y: 0.62, size: 3.0, label: 'Ascella', bayer: 'ζ' },               // ζ Sgr - mag 2.60, handle bottom
      { id: 'alnasl', x: 0.18, y: 0.48, size: 3.0, label: 'Alnasl', bayer: 'γ²' },                 // γ² Sgr - mag 2.99, spout tip
    ],
    lines: [
      // Teapot body (closed quadrilateral)
      ['kaus-australis', 'kaus-media'],   // bottom to left
      ['kaus-media', 'kaus-borealis'],    // left up to lid
      ['kaus-borealis', 'phi-sgr'],       // lid to top
      ['phi-sgr', 'nunki'],               // top to handle
      ['nunki', 'ascella'],               // handle down (via tau)
      ['ascella', 'kaus-australis'],      // handle to bottom (closes pot)
      // Spout
      ['kaus-media', 'alnasl'],           // spout extends left
      // Handle detail
      ['nunki', 'tau-sgr'],
      ['tau-sgr', 'ascella'],
    ],
  },

  // CAPRICORNUS - The Sea-Goat
  // Triangular/wedge shape like an arrowhead pointing right
  capricorn: {
    stars: [
      { id: 'deneb-algedi', x: 0.22, y: 0.45, size: 3.8, label: 'Deneb Algedi', bayer: 'δ' }, // δ Cap - mag 2.81, brightest
      { id: 'nashira', x: 0.32, y: 0.52, size: 3.0, label: 'Nashira', bayer: 'γ' },       // γ Cap - mag 3.67
      { id: 'dabih', x: 0.72, y: 0.32, size: 3.2, label: 'Dabih', bayer: 'β' },           // β Cap - mag 3.08
      { id: 'algedi', x: 0.78, y: 0.28, size: 2.8, label: 'Algedi', bayer: 'α²' },         // α² Cap - double star
      { id: 'omega-cap', x: 0.42, y: 0.65, size: 2.6, label: 'Omega Cap', bayer: 'ω' },   // ω Cap
      { id: 'zeta-cap', x: 0.52, y: 0.58, size: 2.6, label: 'Zeta Cap', bayer: 'ζ' },     // ζ Cap
      { id: 'theta-cap', x: 0.60, y: 0.48, size: 2.5, label: 'Theta Cap', bayer: 'θ' },   // θ Cap
      { id: 'iota-cap', x: 0.65, y: 0.40, size: 2.5, label: 'Iota Cap', bayer: 'ι' },     // ι Cap
    ],
    lines: [
      // Triangular shape
      ['algedi', 'dabih'],
      ['dabih', 'iota-cap'],
      ['iota-cap', 'theta-cap'],
      ['theta-cap', 'zeta-cap'],
      ['zeta-cap', 'omega-cap'],
      ['omega-cap', 'nashira'],
      ['nashira', 'deneb-algedi'],
      ['deneb-algedi', 'iota-cap'],
    ],
  },

  // AQUARIUS - The Water-Bearer
  // Y-shape with cascading "water" pattern
  aquarius: {
    stars: [
      { id: 'sadalsuud', x: 0.32, y: 0.20, size: 3.8, label: 'Sadalsuud', bayer: 'β' },   // β Aqr - mag 2.87, brightest
      { id: 'sadalmelik', x: 0.45, y: 0.28, size: 3.5, label: 'Sadalmelik', bayer: 'α' }, // α Aqr - mag 2.94
      { id: 'sadachbia', x: 0.52, y: 0.42, size: 3.0, label: 'Sadachbia', bayer: 'γ' },   // γ Aqr - Y junction
      { id: 'skat', x: 0.48, y: 0.58, size: 3.2, label: 'Skat', bayer: 'δ' },             // δ Aqr - water stream
      { id: 'albali', x: 0.40, y: 0.48, size: 2.6, label: 'Albali', bayer: 'ε' },         // ε Aqr
      { id: 'ancha', x: 0.55, y: 0.50, size: 2.5, label: 'Ancha', bayer: 'θ' },           // θ Aqr
      { id: 'lambda-aqr', x: 0.52, y: 0.72, size: 2.6, label: 'Lambda Aqr', bayer: 'λ' }, // λ Aqr - water stream
      { id: 'phi-aqr', x: 0.62, y: 0.78, size: 2.5, label: 'Phi Aqr', bayer: 'φ' },       // φ Aqr - end of water
    ],
    lines: [
      // Y-shape with water cascade
      ['sadalsuud', 'sadalmelik'],
      ['sadalmelik', 'sadachbia'],
      ['sadalmelik', 'albali'],
      ['sadachbia', 'ancha'],
      ['albali', 'skat'],
      ['ancha', 'skat'],
      ['skat', 'lambda-aqr'],
      ['lambda-aqr', 'phi-aqr'],
    ],
  },

  // PISCES - The Fish
  // Two fish connected by a cord in V-pattern
  pisces: {
    stars: [
      { id: 'alrescha', x: 0.48, y: 0.62, size: 3.2, label: 'Alrescha', bayer: 'α' },     // α Psc - the knot/cord junction
      { id: 'fumalsamakah', x: 0.20, y: 0.35, size: 3.0, label: 'Fum al Samakah', bayer: 'β' }, // β Psc - western fish mouth
      { id: 'gamma-psc', x: 0.85, y: 0.28, size: 2.8, label: 'Gamma Psc', bayer: 'γ' },   // γ Psc - eastern fish
      { id: 'omega-psc', x: 0.62, y: 0.45, size: 2.6, label: 'Omega Psc', bayer: 'ω' },   // ω Psc - eastern cord
      { id: 'iota-psc', x: 0.70, y: 0.38, size: 2.5, label: 'Iota Psc', bayer: 'ι' },     // ι Psc
      { id: 'theta-psc', x: 0.78, y: 0.32, size: 2.5, label: 'Theta Psc', bayer: 'θ' },   // θ Psc
      { id: 'eta-psc', x: 0.35, y: 0.50, size: 2.6, label: 'Eta Psc', bayer: 'η' },       // η Psc - western cord
      { id: 'omicron-psc', x: 0.28, y: 0.42, size: 2.4, label: 'Omicron Psc', bayer: 'ο' }, // ο Psc
      { id: 'epsilon-psc', x: 0.25, y: 0.32, size: 2.3, label: 'Epsilon Psc', bayer: 'ε' }, // ε Psc - western fish body
    ],
    lines: [
      // Eastern fish (circlet)
      ['gamma-psc', 'theta-psc'],
      ['theta-psc', 'iota-psc'],
      ['iota-psc', 'omega-psc'],
      // Cord to knot
      ['omega-psc', 'alrescha'],
      // Western fish and cord
      ['alrescha', 'eta-psc'],
      ['eta-psc', 'omicron-psc'],
      ['omicron-psc', 'epsilon-psc'],
      ['epsilon-psc', 'fumalsamakah'],
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
