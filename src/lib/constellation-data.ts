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

// Constellation patterns based on History of Science Museum zodiac guide
// Star positions normalized to 0-1 based on the official diagrams
// These match the simplified, recognizable constellation stick figures

export const CONSTELLATION_DATA: Record<ZodiacSign, ConstellationData> = {
  // ARIES - The Ram
  // Simple diagonal line with 3 stars
  aries: {
    stars: [
      { id: 'hamal', x: 0.20, y: 0.25, size: 4.0, label: 'Hamal', bayer: 'α' },
      { id: 'sheratan', x: 0.50, y: 0.50, size: 3.2, label: 'Sheratan', bayer: 'β' },
      { id: 'mesarthim', x: 0.70, y: 0.70, size: 2.8, label: 'Mesarthim', bayer: 'γ' },
    ],
    lines: [
      ['hamal', 'sheratan'],
      ['sheratan', 'mesarthim'],
    ],
  },

  // TAURUS - The Bull
  // V-shape with two prongs extending upward
  taurus: {
    stars: [
      { id: 'aldebaran', x: 0.55, y: 0.80, size: 4.5, label: 'Aldebaran', bayer: 'α' },
      { id: 'elnath', x: 0.35, y: 0.20, size: 3.5, label: 'Elnath', bayer: 'β' },
      { id: 'zeta-tau', x: 0.75, y: 0.25, size: 3.0, label: 'Tianguan', bayer: 'ζ' },
      { id: 'center', x: 0.55, y: 0.45, size: 3.0, label: 'Center' },
      { id: 'theta-tau', x: 0.70, y: 0.55, size: 2.8, label: 'Theta Tau', bayer: 'θ' },
      { id: 'epsilon-tau', x: 0.80, y: 0.45, size: 2.8, label: 'Ain', bayer: 'ε' },
    ],
    lines: [
      ['aldebaran', 'center'],
      ['center', 'elnath'],
      ['center', 'theta-tau'],
      ['theta-tau', 'epsilon-tau'],
      ['epsilon-tau', 'zeta-tau'],
    ],
  },

  // GEMINI - The Twins
  // Two parallel lines with connected heads (rectangular shape)
  gemini: {
    stars: [
      { id: 'castor', x: 0.30, y: 0.15, size: 3.8, label: 'Castor', bayer: 'α' },
      { id: 'pollux', x: 0.50, y: 0.20, size: 4.2, label: 'Pollux', bayer: 'β' },
      { id: 'mebsuta', x: 0.32, y: 0.38, size: 2.8, label: 'Mebsuta', bayer: 'ε' },
      { id: 'wasat', x: 0.48, y: 0.42, size: 2.6, label: 'Wasat', bayer: 'δ' },
      { id: 'tejat', x: 0.25, y: 0.62, size: 2.8, label: 'Tejat', bayer: 'μ' },
      { id: 'alhena', x: 0.52, y: 0.68, size: 3.2, label: 'Alhena', bayer: 'γ' },
      { id: 'propus', x: 0.20, y: 0.85, size: 2.6, label: 'Propus', bayer: 'η' },
      { id: 'foot-right', x: 0.55, y: 0.88, size: 2.6, label: 'Foot' },
    ],
    lines: [
      // Left twin
      ['castor', 'mebsuta'],
      ['mebsuta', 'tejat'],
      ['tejat', 'propus'],
      // Right twin
      ['pollux', 'wasat'],
      ['wasat', 'alhena'],
      ['alhena', 'foot-right'],
      // Connect heads
      ['castor', 'pollux'],
    ],
  },

  // CANCER - The Crab
  // Inverted Y shape (Y rotated, stem pointing up)
  cancer: {
    stars: [
      { id: 'iota-cnc', x: 0.50, y: 0.15, size: 3.0, label: 'Iota Cnc', bayer: 'ι' },
      { id: 'asellus-bor', x: 0.50, y: 0.42, size: 2.8, label: 'Asellus Borealis', bayer: 'γ' },
      { id: 'altarf', x: 0.20, y: 0.85, size: 3.5, label: 'Altarf', bayer: 'β' },
      { id: 'acubens', x: 0.75, y: 0.80, size: 3.0, label: 'Acubens', bayer: 'α' },
    ],
    lines: [
      ['iota-cnc', 'asellus-bor'],
      ['asellus-bor', 'altarf'],
      ['asellus-bor', 'acubens'],
    ],
  },

  // LEO - The Lion
  // Sickle shape (backwards question mark) + triangle
  leo: {
    stars: [
      { id: 'epsilon-leo', x: 0.18, y: 0.55, size: 2.8, label: 'Algenubi', bayer: 'ε' },
      { id: 'mu-leo', x: 0.22, y: 0.72, size: 2.6, label: 'Rasalas', bayer: 'μ' },
      { id: 'regulus', x: 0.28, y: 0.88, size: 4.5, label: 'Regulus', bayer: 'α' },
      { id: 'eta-leo', x: 0.45, y: 0.62, size: 3.0, label: 'Eta Leo', bayer: 'η' },
      { id: 'algieba', x: 0.50, y: 0.42, size: 3.2, label: 'Algieba', bayer: 'γ' },
      { id: 'adhafera', x: 0.42, y: 0.25, size: 2.8, label: 'Adhafera', bayer: 'ζ' },
      { id: 'rasalas', x: 0.55, y: 0.15, size: 2.6, label: 'Rasalas Top', bayer: 'λ' },
      { id: 'chertan', x: 0.60, y: 0.60, size: 2.8, label: 'Chertan', bayer: 'θ' },
      { id: 'zosma', x: 0.72, y: 0.42, size: 3.0, label: 'Zosma', bayer: 'δ' },
      { id: 'denebola', x: 0.82, y: 0.75, size: 3.5, label: 'Denebola', bayer: 'β' },
    ],
    lines: [
      // Sickle (head)
      ['epsilon-leo', 'mu-leo'],
      ['mu-leo', 'regulus'],
      ['regulus', 'eta-leo'],
      ['eta-leo', 'algieba'],
      ['algieba', 'adhafera'],
      ['adhafera', 'rasalas'],
      // Body triangle
      ['chertan', 'zosma'],
      ['zosma', 'denebola'],
      ['denebola', 'chertan'],
      // Connect head to body
      ['eta-leo', 'chertan'],
    ],
  },

  // VIRGO - The Maiden
  // Y-shape with extended arms and rightward wing
  virgo: {
    stars: [
      { id: 'vindemiatrix', x: 0.18, y: 0.22, size: 3.2, label: 'Vindemiatrix', bayer: 'ε' },
      { id: 'auva', x: 0.28, y: 0.35, size: 3.0, label: 'Auva', bayer: 'δ' },
      { id: 'porrima', x: 0.35, y: 0.48, size: 3.2, label: 'Porrima', bayer: 'γ' },
      { id: 'zaniah', x: 0.42, y: 0.58, size: 2.6, label: 'Zaniah', bayer: 'η' },
      { id: 'theta-vir', x: 0.48, y: 0.68, size: 2.5, label: 'Theta Vir', bayer: 'θ' },
      { id: 'spica', x: 0.58, y: 0.80, size: 4.5, label: 'Spica', bayer: 'α' },
      { id: 'zeta-vir', x: 0.52, y: 0.20, size: 2.8, label: 'Zeta Vir', bayer: 'ζ' },
      { id: 'tau-vir', x: 0.60, y: 0.38, size: 2.6, label: 'Tau Vir', bayer: 'τ' },
      { id: 'sigma-vir', x: 0.68, y: 0.55, size: 2.5, label: 'Sigma Vir', bayer: 'σ' },
      { id: 'iota-vir', x: 0.72, y: 0.68, size: 2.5, label: 'Syrma', bayer: 'ι' },
      { id: 'mu-vir', x: 0.85, y: 0.75, size: 2.4, label: 'Mu Vir', bayer: 'μ' },
    ],
    lines: [
      // Main body line
      ['vindemiatrix', 'auva'],
      ['auva', 'porrima'],
      ['porrima', 'zaniah'],
      ['zaniah', 'theta-vir'],
      ['theta-vir', 'spica'],
      // Upper branch
      ['porrima', 'zeta-vir'],
      ['porrima', 'tau-vir'],
      ['tau-vir', 'sigma-vir'],
      ['sigma-vir', 'iota-vir'],
      ['iota-vir', 'mu-vir'],
    ],
  },

  // LIBRA - The Scales
  // Rectangle/quadrilateral with 4 corners (5 stars)
  libra: {
    stars: [
      { id: 'zuben-sch', x: 0.55, y: 0.18, size: 3.8, label: 'Zubeneschamali', bayer: 'β' },
      { id: 'zuben-el', x: 0.72, y: 0.52, size: 3.5, label: 'Zubenelgenubi', bayer: 'α' },
      { id: 'zuben-hak', x: 0.22, y: 0.42, size: 3.0, label: 'Zubenelakrab', bayer: 'γ' },
      { id: 'brachium', x: 0.35, y: 0.78, size: 2.6, label: 'Brachium', bayer: 'σ' },
    ],
    lines: [
      ['zuben-sch', 'zuben-el'],
      ['zuben-el', 'brachium'],
      ['brachium', 'zuben-hak'],
      ['zuben-hak', 'zuben-sch'],
    ],
  },

  // SCORPIUS - The Scorpion
  // Curved tail pattern (J-shape) - using simpler pattern since PDF didn't show it
  // Will use the standard recognizable scorpion shape
  scorpio: {
    stars: [
      { id: 'graffias', x: 0.22, y: 0.22, size: 3.0, label: 'Graffias', bayer: 'β' },
      { id: 'dschubba', x: 0.28, y: 0.28, size: 3.2, label: 'Dschubba', bayer: 'δ' },
      { id: 'pi-sco', x: 0.35, y: 0.32, size: 2.6, label: 'Pi Sco', bayer: 'π' },
      { id: 'antares', x: 0.32, y: 0.42, size: 4.5, label: 'Antares', bayer: 'α' },
      { id: 'sigma-sco', x: 0.38, y: 0.52, size: 2.8, label: 'Alniyat', bayer: 'σ' },
      { id: 'epsilon-sco', x: 0.48, y: 0.58, size: 2.8, label: 'Epsilon Sco', bayer: 'ε' },
      { id: 'mu-sco', x: 0.55, y: 0.65, size: 2.6, label: 'Mu Sco', bayer: 'μ' },
      { id: 'zeta-sco', x: 0.62, y: 0.70, size: 2.6, label: 'Zeta Sco', bayer: 'ζ' },
      { id: 'sargas', x: 0.72, y: 0.72, size: 3.0, label: 'Sargas', bayer: 'θ' },
      { id: 'shaula', x: 0.78, y: 0.65, size: 3.5, label: 'Shaula', bayer: 'λ' },
      { id: 'lesath', x: 0.82, y: 0.58, size: 2.8, label: 'Lesath', bayer: 'υ' },
    ],
    lines: [
      // Head
      ['graffias', 'dschubba'],
      ['dschubba', 'pi-sco'],
      ['pi-sco', 'antares'],
      // Body
      ['antares', 'sigma-sco'],
      ['sigma-sco', 'epsilon-sco'],
      // Curved tail
      ['epsilon-sco', 'mu-sco'],
      ['mu-sco', 'zeta-sco'],
      ['zeta-sco', 'sargas'],
      ['sargas', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },

  // SAGITTARIUS - The Archer (Teapot asterism from PDF)
  // Complex shape with triangular top and body
  sagittarius: {
    stars: [
      // Top triangle (lid)
      { id: 'kaus-borealis', x: 0.32, y: 0.18, size: 3.0, label: 'Kaus Borealis', bayer: 'λ' },
      { id: 'phi-sgr', x: 0.45, y: 0.22, size: 2.8, label: 'Phi Sgr', bayer: 'φ' },
      { id: 'sigma-sgr', x: 0.55, y: 0.18, size: 2.6, label: 'Sigma Sgr' },
      // Middle row
      { id: 'kaus-media', x: 0.40, y: 0.38, size: 3.2, label: 'Kaus Media', bayer: 'δ' },
      { id: 'nunki', x: 0.62, y: 0.32, size: 3.5, label: 'Nunki', bayer: 'σ' },
      { id: 'right-ext', x: 0.78, y: 0.28, size: 2.8, label: 'Right' },
      // Bottom row
      { id: 'alnasl', x: 0.22, y: 0.55, size: 3.0, label: 'Alnasl', bayer: 'γ²' },
      { id: 'kaus-australis', x: 0.50, y: 0.58, size: 4.0, label: 'Kaus Australis', bayer: 'ε' },
      { id: 'ascella', x: 0.70, y: 0.52, size: 3.0, label: 'Ascella', bayer: 'ζ' },
      // Lower triangle
      { id: 'bottom-left', x: 0.42, y: 0.78, size: 2.6, label: 'Bottom Left' },
      { id: 'bottom-right', x: 0.62, y: 0.75, size: 2.6, label: 'Bottom Right' },
    ],
    lines: [
      // Top triangle
      ['kaus-borealis', 'phi-sgr'],
      ['phi-sgr', 'sigma-sgr'],
      // Middle connections
      ['kaus-borealis', 'kaus-media'],
      ['kaus-media', 'kaus-australis'],
      ['sigma-sgr', 'nunki'],
      ['nunki', 'right-ext'],
      ['nunki', 'ascella'],
      ['ascella', 'kaus-australis'],
      // Outer connections
      ['alnasl', 'kaus-media'],
      ['kaus-australis', 'bottom-left'],
      ['kaus-australis', 'bottom-right'],
      ['bottom-right', 'ascella'],
    ],
  },

  // CAPRICORNUS - The Sea-Goat
  // Arrow/wedge pointing left with complex body (from PDF)
  capricorn: {
    stars: [
      // Top row
      { id: 'algedi', x: 0.50, y: 0.18, size: 2.8, label: 'Algedi', bayer: 'α²' },
      { id: 'dabih', x: 0.62, y: 0.20, size: 3.2, label: 'Dabih', bayer: 'β' },
      // Second row
      { id: 'gamma-cap', x: 0.42, y: 0.32, size: 2.6, label: 'Gamma Cap', bayer: 'γ' },
      // Third row (left point)
      { id: 'point-left', x: 0.18, y: 0.48, size: 3.0, label: 'Left Point' },
      { id: 'iota-cap', x: 0.55, y: 0.45, size: 2.5, label: 'Iota Cap', bayer: 'ι' },
      // Fourth row
      { id: 'zeta-cap', x: 0.65, y: 0.55, size: 2.6, label: 'Zeta Cap', bayer: 'ζ' },
      // Bottom row
      { id: 'deneb-algedi', x: 0.50, y: 0.72, size: 3.8, label: 'Deneb Algedi', bayer: 'δ' },
      { id: 'omega-cap', x: 0.72, y: 0.68, size: 2.6, label: 'Omega Cap', bayer: 'ω' },
      { id: 'psi-cap', x: 0.82, y: 0.78, size: 2.5, label: 'Psi Cap', bayer: 'ψ' },
    ],
    lines: [
      // Top edge
      ['algedi', 'dabih'],
      // Left side going to point
      ['algedi', 'gamma-cap'],
      ['gamma-cap', 'point-left'],
      ['point-left', 'deneb-algedi'],
      // Right side
      ['dabih', 'iota-cap'],
      ['iota-cap', 'zeta-cap'],
      ['zeta-cap', 'omega-cap'],
      ['omega-cap', 'psi-cap'],
      // Bottom connections
      ['deneb-algedi', 'omega-cap'],
    ],
  },

  // AQUARIUS - The Water-Bearer
  // U-shaped water stream with upper extensions (from PDF)
  aquarius: {
    stars: [
      // Left upper branch
      { id: 'upper-left', x: 0.18, y: 0.30, size: 2.8, label: 'Upper Left' },
      { id: 'left-mid', x: 0.22, y: 0.45, size: 2.6, label: 'Left Mid' },
      { id: 'left-lower', x: 0.28, y: 0.58, size: 2.6, label: 'Left Lower' },
      // Bottom of U
      { id: 'sadachbia', x: 0.35, y: 0.72, size: 3.0, label: 'Sadachbia', bayer: 'γ' },
      { id: 'skat', x: 0.45, y: 0.78, size: 3.2, label: 'Skat', bayer: 'δ' },
      { id: 'bottom-right', x: 0.55, y: 0.72, size: 2.6, label: 'Bottom Right' },
      // Right branch going up
      { id: 'right-lower', x: 0.62, y: 0.58, size: 2.6, label: 'Right Lower' },
      { id: 'right-mid', x: 0.65, y: 0.45, size: 2.6, label: 'Right Mid' },
      { id: 'sadalmelik', x: 0.58, y: 0.28, size: 3.5, label: 'Sadalmelik', bayer: 'α' },
      // Top right extension
      { id: 'sadalsuud', x: 0.78, y: 0.15, size: 3.8, label: 'Sadalsuud', bayer: 'β' },
      // Right side extension
      { id: 'ancha', x: 0.75, y: 0.42, size: 2.5, label: 'Ancha', bayer: 'θ' },
    ],
    lines: [
      // Left branch going down
      ['upper-left', 'left-mid'],
      ['left-mid', 'left-lower'],
      ['left-lower', 'sadachbia'],
      // Bottom of U
      ['sadachbia', 'skat'],
      ['skat', 'bottom-right'],
      // Right branch going up
      ['bottom-right', 'right-lower'],
      ['right-lower', 'right-mid'],
      ['right-mid', 'sadalmelik'],
      ['sadalmelik', 'sadalsuud'],
      // Right extension
      ['right-mid', 'ancha'],
    ],
  },

  // PISCES - The Fish
  // V-shape with circlet at top right (from PDF)
  pisces: {
    stars: [
      // Left fish (western) - diagonal line going up-left
      { id: 'fumalsamakah', x: 0.15, y: 0.22, size: 3.0, label: 'Fum al Samakah', bayer: 'β' },
      { id: 'left-mid', x: 0.25, y: 0.38, size: 2.6, label: 'Left Mid' },
      { id: 'left-lower', x: 0.32, y: 0.52, size: 2.6, label: 'Left Lower' },
      // Junction/vertex of V
      { id: 'alrescha', x: 0.42, y: 0.78, size: 3.2, label: 'Alrescha', bayer: 'α' },
      // Central connecting cord
      { id: 'cord-mid', x: 0.48, y: 0.58, size: 2.4, label: 'Cord Mid' },
      { id: 'cord-upper', x: 0.52, y: 0.45, size: 2.4, label: 'Cord Upper' },
      // Right fish circlet
      { id: 'circlet-bottom', x: 0.58, y: 0.32, size: 2.5, label: 'Circlet Bottom' },
      { id: 'circlet-left', x: 0.62, y: 0.20, size: 2.5, label: 'Circlet Left' },
      { id: 'circlet-top', x: 0.68, y: 0.12, size: 2.6, label: 'Circlet Top' },
      { id: 'circlet-right', x: 0.75, y: 0.18, size: 2.5, label: 'Circlet Right' },
      { id: 'circlet-br', x: 0.72, y: 0.28, size: 2.5, label: 'Circlet BR' },
    ],
    lines: [
      // Left fish (western) line
      ['fumalsamakah', 'left-mid'],
      ['left-mid', 'left-lower'],
      ['left-lower', 'alrescha'],
      // Connecting cord up to right fish
      ['alrescha', 'cord-mid'],
      ['cord-mid', 'cord-upper'],
      ['cord-upper', 'circlet-bottom'],
      // Right fish circlet
      ['circlet-bottom', 'circlet-left'],
      ['circlet-left', 'circlet-top'],
      ['circlet-top', 'circlet-right'],
      ['circlet-right', 'circlet-br'],
      ['circlet-br', 'circlet-bottom'],
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
