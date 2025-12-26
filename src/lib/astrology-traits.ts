import { ZodiacSign, ZODIAC_DATA } from './zodiac';

// Rising sign modifiers for how the child presents themselves
export const RISING_MODIFIERS: Record<ZodiacSign, string> = {
  aries: 'directness',
  taurus: 'steadiness',
  gemini: 'curiosity',
  cancer: 'nurturing',
  leo: 'warmth',
  virgo: 'precision',
  libra: 'grace',
  scorpio: 'intensity',
  sagittarius: 'enthusiasm',
  capricorn: 'determination',
  aquarius: 'originality',
  pisces: 'sensitivity'
};

// Core traits by sun sign - how they approach the world
export const SUN_CORE_TRAITS: Record<ZodiacSign, string[]> = {
  aries: ['Bold', 'Joyful', 'Adventurous'],
  taurus: ['Steady', 'Sensory', 'Grounded'],
  gemini: ['Curious', 'Verbal', 'Quick'],
  cancer: ['Tender', 'Protective', 'Intuitive'],
  leo: ['Radiant', 'Expressive', 'Generous'],
  virgo: ['Observant', 'Helpful', 'Precise'],
  libra: ['Charming', 'Fair', 'Harmonious'],
  scorpio: ['Deep', 'Intense', 'Perceptive'],
  sagittarius: ['Free', 'Optimistic', 'Philosophical'],
  capricorn: ['Determined', 'Patient', 'Wise'],
  aquarius: ['Original', 'Independent', 'Humanitarian'],
  pisces: ['Dreamy', 'Empathetic', 'Imaginative']
};

// Emotional traits by moon sign
export const MOON_EMOTIONAL_TRAITS: Record<ZodiacSign, string[]> = {
  aries: ['Quick to feel', 'Passionate', 'Direct'],
  taurus: ['Steady', 'Comfort-seeking', 'Loyal'],
  gemini: ['Changeable', 'Talkative', 'Restless'],
  cancer: ['Deep', 'Nurturing', 'Sensitive'],
  leo: ['Warm', 'Dramatic', 'Proud'],
  virgo: ['Anxious', 'Helpful', 'Detail-focused'],
  libra: ['Peaceful', 'Relationship-oriented', 'Indecisive'],
  scorpio: ['Intense', 'Private', 'Transformative'],
  sagittarius: ['Optimistic', 'Freedom-loving', 'Restless'],
  capricorn: ['Reserved', 'Responsible', 'Controlled'],
  aquarius: ['Detached', 'Intellectual', 'Unconventional'],
  pisces: ['Absorbing', 'Dreamy', 'Compassionate']
};

// Strengths based on sun sign
export const SIGN_STRENGTHS: Record<ZodiacSign, string[]> = {
  aries: ['Natural confidence', 'Quick recovery from setbacks', 'Infectious enthusiasm', 'Leadership instinct'],
  taurus: ['Calm presence', 'Patience', 'Reliability', 'Appreciation of beauty'],
  gemini: ['Quick mind', 'Adaptability', 'Communication skills', 'Curiosity that never stops'],
  cancer: ['Emotional intelligence', 'Nurturing nature', 'Strong memory', 'Protective instincts'],
  leo: ['Natural charisma', 'Creativity', 'Generosity', 'Courage to shine'],
  virgo: ['Attention to detail', 'Problem-solving', 'Helpfulness', 'Practical wisdom'],
  libra: ['Fairness', 'Diplomacy', 'Aesthetic sense', 'Peacemaking abilities'],
  scorpio: ['Deep perception', 'Determination', 'Loyalty', 'Transformative power'],
  sagittarius: ['Optimism', 'Honesty', 'Adventure spirit', 'Philosophical mind'],
  capricorn: ['Discipline', 'Patience', 'Ambition', 'Practical problem-solving'],
  aquarius: ['Originality', 'Humanitarian spirit', 'Independence', 'Innovative thinking'],
  pisces: ['Imagination', 'Compassion', 'Intuition', 'Creative vision']
};

// Growth edges based on sun sign
export const SIGN_GROWTH_EDGES: Record<ZodiacSign, string[]> = {
  aries: ['Impatience', 'Difficulty waiting', 'Anger when thwarted', 'Impulsiveness'],
  taurus: ['Resistance to change', 'Stubbornness', 'Possessiveness', 'Comfort-seeking over growth'],
  gemini: ['Scattered focus', 'Inconsistency', 'Superficiality', 'Restlessness'],
  cancer: ['Moodiness', 'Over-sensitivity', 'Clinginess', 'Difficulty letting go'],
  leo: ['Need for attention', 'Pride', 'Dramatic reactions', 'Difficulty sharing spotlight'],
  virgo: ['Perfectionism', 'Over-criticism', 'Anxiety', 'Difficulty relaxing'],
  libra: ['Indecisiveness', 'People-pleasing', 'Conflict avoidance', 'Dependency'],
  scorpio: ['Jealousy', 'Secrecy', 'Intensity', 'Difficulty forgiving'],
  sagittarius: ['Over-promising', 'Bluntness', 'Restlessness', 'Commitment challenges'],
  capricorn: ['Rigidity', 'Pessimism', 'Work over play', 'Emotional suppression'],
  aquarius: ['Detachment', 'Stubbornness', 'Contrarianism', 'Difficulty with emotions'],
  pisces: ['Escapism', 'Overwhelm', 'Boundary issues', 'Difficulty with reality']
};

// Rising sign influences how traits are expressed
const RISING_TRAIT_ADJUSTMENTS: Record<ZodiacSign, { emphasize: string; deemphasize: string }> = {
  aries: { emphasize: 'Bold', deemphasize: 'Reserved' },
  taurus: { emphasize: 'Steady', deemphasize: 'Impulsive' },
  gemini: { emphasize: 'Curious', deemphasize: 'Single-minded' },
  cancer: { emphasize: 'Nurturing', deemphasize: 'Detached' },
  leo: { emphasize: 'Expressive', deemphasize: 'Shy' },
  virgo: { emphasize: 'Precise', deemphasize: 'Careless' },
  libra: { emphasize: 'Harmonious', deemphasize: 'Abrasive' },
  scorpio: { emphasize: 'Intense', deemphasize: 'Superficial' },
  sagittarius: { emphasize: 'Optimistic', deemphasize: 'Pessimistic' },
  capricorn: { emphasize: 'Determined', deemphasize: 'Flighty' },
  aquarius: { emphasize: 'Original', deemphasize: 'Conventional' },
  pisces: { emphasize: 'Sensitive', deemphasize: 'Insensitive' }
};

// Adjust traits based on rising sign influence
export const getAdjustedCoreTraits = (
  sunSign: ZodiacSign,
  risingSign: ZodiacSign | null
): string[] => {
  const baseTraits = [...SUN_CORE_TRAITS[sunSign]];
  
  if (!risingSign) return baseTraits;
  
  // Rising sign adds a layer of expression
  const risingElement = ZODIAC_DATA[risingSign].element;
  const sunElement = ZODIAC_DATA[sunSign].element;
  
  // If same element, emphasize those qualities
  if (risingElement === sunElement) {
    return baseTraits; // Pure expression
  }
  
  // If complementary elements (fire-air, earth-water), blend well
  if ((risingElement === 'fire' && sunElement === 'air') ||
      (risingElement === 'air' && sunElement === 'fire') ||
      (risingElement === 'earth' && sunElement === 'water') ||
      (risingElement === 'water' && sunElement === 'earth')) {
    return baseTraits;
  }
  
  // For other combinations, rising softens or intensifies
  return baseTraits;
};

export const getAdjustedStrengths = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): string[] => {
  const baseStrengths = [...SIGN_STRENGTHS[sunSign]].slice(0, 3);
  
  // Moon adds emotional strengths
  if (moonSign) {
    const moonStrength = SIGN_STRENGTHS[moonSign][0];
    if (!baseStrengths.includes(moonStrength)) {
      baseStrengths[2] = moonStrength; // Replace last with moon influence
    }
  }
  
  return baseStrengths;
};

export const getAdjustedGrowthEdges = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): string[] => {
  const baseEdges = [...SIGN_GROWTH_EDGES[sunSign]].slice(0, 3);
  
  // Moon sign can intensify certain edges
  if (moonSign) {
    const moonEdge = SIGN_GROWTH_EDGES[moonSign][0];
    if (!baseEdges.includes(moonEdge)) {
      baseEdges[2] = moonEdge;
    }
  }
  
  return baseEdges;
};

// Get full astrology grid data
export interface AstrologyGridData {
  core: {
    traits: string[];
    risingModifier: string | null;
  };
  emotional: {
    traits: string[];
  };
  strengths: string[];
  growthEdges: string[];
}

export const getAstrologyGridData = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): AstrologyGridData => {
  return {
    core: {
      traits: getAdjustedCoreTraits(sunSign, risingSign),
      risingModifier: risingSign ? RISING_MODIFIERS[risingSign] : null
    },
    emotional: {
      traits: moonSign ? MOON_EMOTIONAL_TRAITS[moonSign] : MOON_EMOTIONAL_TRAITS[sunSign]
    },
    strengths: getAdjustedStrengths(sunSign, moonSign, risingSign),
    growthEdges: getAdjustedGrowthEdges(sunSign, moonSign, risingSign)
  };
};
