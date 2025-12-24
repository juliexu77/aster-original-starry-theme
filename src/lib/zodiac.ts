// Zodiac sign utilities and compatibility system

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface ZodiacInfo {
  sign: ZodiacSign;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  traits: string[];
  rulingPlanet: string;
}

export const ZODIAC_DATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: { sign: 'aries', symbol: '♈', element: 'fire', modality: 'cardinal', traits: ['bold', 'energetic', 'pioneering'], rulingPlanet: 'Mars' },
  taurus: { sign: 'taurus', symbol: '♉', element: 'earth', modality: 'fixed', traits: ['grounded', 'patient', 'sensory'], rulingPlanet: 'Venus' },
  gemini: { sign: 'gemini', symbol: '♊', element: 'air', modality: 'mutable', traits: ['curious', 'communicative', 'adaptable'], rulingPlanet: 'Mercury' },
  cancer: { sign: 'cancer', symbol: '♋', element: 'water', modality: 'cardinal', traits: ['nurturing', 'intuitive', 'protective'], rulingPlanet: 'Moon' },
  leo: { sign: 'leo', symbol: '♌', element: 'fire', modality: 'fixed', traits: ['confident', 'expressive', 'warm'], rulingPlanet: 'Sun' },
  virgo: { sign: 'virgo', symbol: '♍', element: 'earth', modality: 'mutable', traits: ['analytical', 'helpful', 'detail-oriented'], rulingPlanet: 'Mercury' },
  libra: { sign: 'libra', symbol: '♎', element: 'air', modality: 'cardinal', traits: ['harmonious', 'fair', 'social'], rulingPlanet: 'Venus' },
  scorpio: { sign: 'scorpio', symbol: '♏', element: 'water', modality: 'fixed', traits: ['intense', 'perceptive', 'transformative'], rulingPlanet: 'Pluto' },
  sagittarius: { sign: 'sagittarius', symbol: '♐', element: 'fire', modality: 'mutable', traits: ['adventurous', 'philosophical', 'optimistic'], rulingPlanet: 'Jupiter' },
  capricorn: { sign: 'capricorn', symbol: '♑', element: 'earth', modality: 'cardinal', traits: ['ambitious', 'disciplined', 'practical'], rulingPlanet: 'Saturn' },
  aquarius: { sign: 'aquarius', symbol: '♒', element: 'air', modality: 'fixed', traits: ['innovative', 'independent', 'humanitarian'], rulingPlanet: 'Uranus' },
  pisces: { sign: 'pisces', symbol: '♓', element: 'water', modality: 'mutable', traits: ['empathetic', 'imaginative', 'dreamy'], rulingPlanet: 'Neptune' },
};

export const getZodiacFromBirthday = (birthday: string | null | undefined): ZodiacSign | null => {
  if (!birthday) return null;
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

// Approximate moon sign calculation
// Note: This is an approximation. Accurate moon sign requires precise astronomical calculations.
// The moon changes signs roughly every 2.5 days.
export const getMoonSignFromBirthDateTime = (birthday: string | null | undefined, birthTime: string | null | undefined): ZodiacSign | null => {
  if (!birthday) return null;
  
  const date = new Date(birthday);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Get time in hours (0-24)
  let hours = 12; // Default to noon if no time provided
  if (birthTime) {
    const [h, m] = birthTime.split(':').map(Number);
    hours = h + (m / 60);
  }
  
  // Julian day calculation (simplified)
  const a = Math.floor((14 - (month + 1)) / 12);
  const y = year + 4800 - a;
  const m = (month + 1) + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time component
  const jdWithTime = jd + (hours - 12) / 24;
  
  // Moon's mean longitude (simplified calculation)
  // Based on lunar cycle of approximately 27.3 days through 360 degrees
  const daysSinceEpoch = jdWithTime - 2451545.0; // Days since J2000.0
  const moonLongitude = (218.32 + 13.176396 * daysSinceEpoch) % 360;
  const normalizedLongitude = moonLongitude < 0 ? moonLongitude + 360 : moonLongitude;
  
  // Convert longitude to zodiac sign (30 degrees each)
  const signIndex = Math.floor(normalizedLongitude / 30);
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  return signs[signIndex % 12];
};

export const getZodiacSymbol = (birthday: string | null | undefined): string => {
  const sign = getZodiacFromBirthday(birthday);
  return sign ? ZODIAC_DATA[sign].symbol : '';
};

export const getZodiacName = (sign: ZodiacSign): string => {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
};

// Compatibility scoring based on elements and modalities
export type CompatibilityLevel = 'high' | 'medium' | 'challenging';

export interface CompatibilityResult {
  level: CompatibilityLevel;
  score: number; // 1-10
  strengths: string[];
  challenges: string[];
  tips: string[];
  summary: string;
}

// Element compatibility matrix
const ELEMENT_COMPATIBILITY: Record<string, CompatibilityLevel> = {
  'fire-fire': 'high',
  'fire-air': 'high',
  'fire-earth': 'challenging',
  'fire-water': 'medium',
  'earth-earth': 'high',
  'earth-water': 'high',
  'earth-air': 'medium',
  'air-air': 'high',
  'air-water': 'medium',
  'water-water': 'high',
};

// Detailed compatibility insights for parent-child relationships
const PARENT_CHILD_COMPATIBILITY: Record<string, CompatibilityResult> = {
  'fire-fire': {
    level: 'high',
    score: 9,
    strengths: ['Shared enthusiasm and energy', 'Mutual love of adventure', 'Natural understanding of each other\'s drive'],
    challenges: ['Power struggles can emerge', 'Both may be impatient', 'Tempers may clash'],
    tips: ['Give space for independence', 'Channel competitive energy into shared goals', 'Practice patience together'],
    summary: 'A dynamic duo with endless energy. You understand their bold spirit because you share it.'
  },
  'earth-fire': {
    level: 'medium',
    score: 6,
    strengths: ['You provide essential stability', 'Their energy livens your world', 'Balance of caution and courage'],
    challenges: ['Their impulsiveness challenges you', 'You may seem too slow for them', 'Risk vs security tension'],
    tips: ['Allow controlled risk-taking', 'Celebrate their boldness', 'Find joy in their spontaneity'],
    summary: 'You\'re the steady ground they can always return to. Let them run, knowing you\'re there.'
  },
  'fire-earth': {
    level: 'medium',
    score: 6,
    strengths: ['You inspire them to take risks', 'They ground your energy', 'Complementary approaches to life'],
    challenges: ['Different paces may frustrate both', 'Your spontaneity vs their need for routine', 'Communication styles differ'],
    tips: ['Respect their need for stability', 'Plan ahead but leave room for surprises', 'Celebrate their methodical wins'],
    summary: 'You light the spark, they build the fire. Balance adventure with their need for security.'
  },
  'air-fire': {
    level: 'high',
    score: 8,
    strengths: ['Intellectual connection', 'Shared love of excitement', 'You understand their boldness'],
    challenges: ['Grounding is needed', 'Routines may suffer', 'Scattered attention'],
    tips: ['Create some structure together', 'Channel energy into projects', 'Balance talking with doing'],
    summary: 'Ideas in motion. You fan their flames with curiosity and conversation.'
  },
  'fire-air': {
    level: 'high',
    score: 8,
    strengths: ['Ideas flow freely between you', 'Mutual enthusiasm for new experiences', 'You fuel their curiosity'],
    challenges: ['Both may struggle with follow-through', 'Scattered energy at times', 'Grounding may be needed'],
    tips: ['Create structure for your adventures', 'Listen to their many ideas', 'Help them focus without stifling creativity'],
    summary: 'Your spark ignites their mind. Together you dream big and explore fearlessly.'
  },
  'water-fire': {
    level: 'medium',
    score: 6,
    strengths: ['You sense their needs deeply', 'They energize your intuition', 'Passion meets compassion'],
    challenges: ['Their intensity can overwhelm', 'You may dampen their fire', 'Energy levels differ'],
    tips: ['Celebrate their boldness openly', 'Don\'t take their directness personally', 'Match their energy sometimes'],
    summary: 'Ocean and volcano. Your depths can hold their heat—with care.'
  },
  'fire-water': {
    level: 'medium',
    score: 6,
    strengths: ['You teach them courage', 'They soften your approach', 'Deep emotional growth for both'],
    challenges: ['Your intensity may overwhelm them', 'Their sensitivity needs gentle handling', 'Different emotional expressions'],
    tips: ['Tune into their emotional cues', 'Create safe spaces for feelings', 'Balance action with reflection'],
    summary: 'Steam rising. Your fire warms their waters, but gentleness is key.'
  },
  'earth-earth': {
    level: 'high',
    score: 9,
    strengths: ['Deep understanding of each other', 'Shared appreciation for routine', 'Building together comes naturally'],
    challenges: ['May resist change together', 'Stubbornness from both', 'Comfort zone can limit growth'],
    tips: ['Introduce gentle novelty', 'Encourage each other to stretch', 'Celebrate small adventures'],
    summary: 'Rooted and reliable. You speak the same language of love through actions.'
  },
  'air-earth': {
    level: 'medium',
    score: 6,
    strengths: ['You bring lightness to their solidity', 'They teach you patience', 'Different strengths combine well'],
    challenges: ['Your pace may feel too fast', 'Their stubbornness meets your flexibility', 'Communication gaps'],
    tips: ['Slow down to their rhythm sometimes', 'Appreciate their consistent nature', 'Find shared grounding activities'],
    summary: 'Breeze over mountains. Your ideas inspire them while they keep you grounded.'
  },
  'earth-air': {
    level: 'medium',
    score: 6,
    strengths: ['You ground their scattered energy', 'They bring new perspectives', 'Practical meets creative'],
    challenges: ['Their restlessness vs your routine', 'Different communication needs', 'You may seem too rigid to them'],
    tips: ['Be flexible with their changing interests', 'Engage with their ideas seriously', 'Create varied experiences'],
    summary: 'You\'re the container for their swirling thoughts. Your steadiness helps them land.'
  },
  'water-earth': {
    level: 'high',
    score: 8,
    strengths: ['Deep nurturing connection', 'They feel your love consistently', 'Stable emotional bond'],
    challenges: ['May enable over-dependence', 'Both can be too cautious', 'Change is hard for you both'],
    tips: ['Encourage their independence', 'Let them get messy and try', 'Trust their groundedness'],
    summary: 'River and shore. Your emotional attunement meets their solid presence.'
  },
  'earth-water': {
    level: 'high',
    score: 8,
    strengths: ['Nurturing flows naturally', 'Deep emotional security', 'You create a safe haven'],
    challenges: ['May enable over-dependence', 'Both can be too cautious', 'Change is hard for you both'],
    tips: ['Encourage their emotional expression', 'Push gently toward independence', 'Grow together gradually'],
    summary: 'Garden and rain. You nurture their sensitivity with exactly what they need.'
  },
  'air-air': {
    level: 'high',
    score: 9,
    strengths: ['Constant conversation and connection', 'Shared curiosity', 'Mental stimulation abundant'],
    challenges: ['May live too much in thoughts', 'Feelings sometimes overlooked', 'Structure is scarce'],
    tips: ['Make time for feelings, not just thoughts', 'Create anchoring rituals', 'Get physical together—walk, play'],
    summary: 'Two minds dancing. You understand their need to question everything.'
  },
  'water-air': {
    level: 'medium',
    score: 6,
    strengths: ['You teach emotional depth', 'They help you communicate', 'Heart meets mind'],
    challenges: ['May seem too emotional to them', 'Their detachment can hurt', 'Different processing speeds'],
    tips: ['Give them thinking space', 'Ask questions, don\'t assume feelings', 'Bridge feeling and thought'],
    summary: 'Mist rising. Your emotions find expression through their words.'
  },
  'air-water': {
    level: 'medium',
    score: 6,
    strengths: ['You help them articulate feelings', 'They deepen your emotional life', 'Growth in understanding'],
    challenges: ['Your logic vs their feelings', 'May seem dismissive of emotions', 'Different processing styles'],
    tips: ['Listen before analyzing', 'Validate their feelings first', 'Create emotional check-ins'],
    summary: 'Clouds and sea. You give words to their waves of feeling.'
  },
  'water-water': {
    level: 'high',
    score: 9,
    strengths: ['Profound emotional understanding', 'Intuitive connection', 'Nurturing flows both ways'],
    challenges: ['Can amplify each other\'s moods', 'May struggle with boundaries', 'Outside energy needed sometimes'],
    tips: ['Create emotional boundaries together', 'Bring in grounding activities', 'Celebrate joy as much as processing pain'],
    summary: 'Two oceans meeting. You feel everything together—the gift and the challenge.'
  },
};

// Sibling compatibility insights
const SIBLING_COMPATIBILITY: Record<string, CompatibilityResult> = {
  'fire-fire': {
    level: 'high',
    score: 8,
    strengths: ['Endless games and adventures', 'Natural playmates', 'Push each other to try new things'],
    challenges: ['Competition can get fierce', 'Both want to lead', 'Explosive arguments possible'],
    tips: ['Give each leadership roles', 'Teach conflict resolution early', 'Channel competition into team activities'],
    summary: 'Two flames burning bright. Exciting playmates who need room to both shine.'
  },
  'fire-earth': {
    level: 'medium',
    score: 6,
    strengths: ['Balance each other naturally', 'Fire inspires, earth builds', 'Different skills complement'],
    challenges: ['Pace differences cause friction', 'Fire may overlook earth\'s needs', 'Earth may slow fire down too much'],
    tips: ['Celebrate different strengths', 'Find activities both enjoy', 'Teach appreciation of differences'],
    summary: 'Campfire and ground. They learn balance from each other.'
  },
  'earth-fire': {
    level: 'medium',
    score: 6,
    strengths: ['Balance each other naturally', 'Fire inspires, earth builds', 'Different skills complement'],
    challenges: ['Pace differences cause friction', 'Fire may overlook earth\'s needs', 'Earth may slow fire down too much'],
    tips: ['Celebrate different strengths', 'Find activities both enjoy', 'Teach appreciation of differences'],
    summary: 'Campfire and ground. They learn balance from each other.'
  },
  'fire-air': {
    level: 'high',
    score: 8,
    strengths: ['Ideas spark constantly', 'Energetic play together', 'Mutual enthusiasm'],
    challenges: ['May ignore practical needs together', 'Can egg each other on', 'Grounding needed from outside'],
    tips: ['Provide structure for their adventures', 'Encourage follow-through', 'Join their brainstorms'],
    summary: 'Wildfire spreading. Exciting together—keep an eye on the sparks.'
  },
  'air-fire': {
    level: 'high',
    score: 8,
    strengths: ['Ideas spark constantly', 'Energetic play together', 'Mutual enthusiasm'],
    challenges: ['May ignore practical needs together', 'Can egg each other on', 'Grounding needed from outside'],
    tips: ['Provide structure for their adventures', 'Encourage follow-through', 'Join their brainstorms'],
    summary: 'Wildfire spreading. Exciting together—keep an eye on the sparks.'
  },
  'fire-water': {
    level: 'medium',
    score: 5,
    strengths: ['Learn from differences', 'Fire protects water\'s sensitivity', 'Water calms fire\'s intensity'],
    challenges: ['Fire may seem too loud', 'Water\'s feelings may confuse fire', 'Different needs in conflict'],
    tips: ['Teach fire to be gentle', 'Help water speak up', 'Create calm-down spaces'],
    summary: 'Steam and sizzle. Beautiful when balanced, challenging when not.'
  },
  'water-fire': {
    level: 'medium',
    score: 5,
    strengths: ['Learn from differences', 'Fire protects water\'s sensitivity', 'Water calms fire\'s intensity'],
    challenges: ['Fire may seem too loud', 'Water\'s feelings may confuse fire', 'Different needs in conflict'],
    tips: ['Teach fire to be gentle', 'Help water speak up', 'Create calm-down spaces'],
    summary: 'Steam and sizzle. Beautiful when balanced, challenging when not.'
  },
  'earth-earth': {
    level: 'high',
    score: 8,
    strengths: ['Play well side by side', 'Share toys and routines easily', 'Predictable and steady together'],
    challenges: ['May resist new activities', 'Can both be stubborn', 'Need outside stimulation'],
    tips: ['Introduce variety gently', 'Encourage trying new things together', 'Celebrate when they adapt'],
    summary: 'Two steady souls. Reliable friendship that builds over time.'
  },
  'earth-air': {
    level: 'medium',
    score: 6,
    strengths: ['Earth grounds air\'s ideas', 'Air lightens earth\'s routine', 'Can learn from each other'],
    challenges: ['Different interests may diverge', 'Air may seem flighty to earth', 'Earth may seem boring to air'],
    tips: ['Find overlapping interests', 'Celebrate their unique perspectives', 'Create shared rituals'],
    summary: 'Wind over fields. Different but complementary if given space.'
  },
  'air-earth': {
    level: 'medium',
    score: 6,
    strengths: ['Earth grounds air\'s ideas', 'Air lightens earth\'s routine', 'Can learn from each other'],
    challenges: ['Different interests may diverge', 'Air may seem flighty to earth', 'Earth may seem boring to air'],
    tips: ['Find overlapping interests', 'Celebrate their unique perspectives', 'Create shared rituals'],
    summary: 'Wind over fields. Different but complementary if given space.'
  },
  'earth-water': {
    level: 'high',
    score: 8,
    strengths: ['Deep emotional bond', 'Earth protects water', 'Water softens earth'],
    challenges: ['May resist outside friendships', 'Can become too intertwined', 'Need encouragement to branch out'],
    tips: ['Foster individual friendships too', 'Appreciate their closeness', 'Give each alone time'],
    summary: 'Garden growing. Nurturing connection that runs deep.'
  },
  'water-earth': {
    level: 'high',
    score: 8,
    strengths: ['Deep emotional bond', 'Earth protects water', 'Water softens earth'],
    challenges: ['May resist outside friendships', 'Can become too intertwined', 'Need encouragement to branch out'],
    tips: ['Foster individual friendships too', 'Appreciate their closeness', 'Give each alone time'],
    summary: 'Garden growing. Nurturing connection that runs deep.'
  },
  'air-air': {
    level: 'high',
    score: 8,
    strengths: ['Non-stop conversation', 'Shared curiosity about world', 'Understand each other\'s thoughts'],
    challenges: ['May talk instead of do', 'Feelings might be overlooked', 'Both need outside grounding'],
    tips: ['Encourage physical play', 'Teach emotional awareness', 'Create action-based activities'],
    summary: 'Conversation never ends. Best friends in thought and word.'
  },
  'air-water': {
    level: 'medium',
    score: 6,
    strengths: ['Air helps water express feelings', 'Water teaches air to feel', 'Growth through difference'],
    challenges: ['Air may dismiss water\'s emotions', 'Water may overwhelm air', 'Different processing styles'],
    tips: ['Teach both to listen', 'Validate different approaches', 'Create emotional vocabulary together'],
    summary: 'Clouds and ocean. They speak different languages but can learn.'
  },
  'water-air': {
    level: 'medium',
    score: 6,
    strengths: ['Air helps water express feelings', 'Water teaches air to feel', 'Growth through difference'],
    challenges: ['Air may dismiss water\'s emotions', 'Water may overwhelm air', 'Different processing styles'],
    tips: ['Teach both to listen', 'Validate different approaches', 'Create emotional vocabulary together'],
    summary: 'Clouds and ocean. They speak different languages but can learn.'
  },
  'water-water': {
    level: 'high',
    score: 8,
    strengths: ['Intuitive understanding', 'Play imaginatively together', 'Deep emotional bond'],
    challenges: ['Moods may amplify', 'May isolate together', 'Need lightness from outside'],
    tips: ['Bring in active, social play', 'Teach healthy boundaries', 'Celebrate their creative world'],
    summary: 'Two drops becoming one. Beautifully connected, needing outside light.'
  },
};

export const getCompatibility = (
  sign1: ZodiacSign, 
  sign2: ZodiacSign, 
  relationship: 'parent-child' | 'siblings'
): CompatibilityResult => {
  const element1 = ZODIAC_DATA[sign1].element;
  const element2 = ZODIAC_DATA[sign2].element;
  
  const key = `${element1}-${element2}`;
  const compatibilityMap = relationship === 'parent-child' ? PARENT_CHILD_COMPATIBILITY : SIBLING_COMPATIBILITY;
  
  // Get base compatibility from element pairing
  const baseResult = compatibilityMap[key];
  
  if (baseResult) {
    return baseResult;
  }
  
  // Fallback
  return {
    level: 'medium',
    score: 7,
    strengths: ['Unique connection to discover'],
    challenges: ['Different approaches to life'],
    tips: ['Embrace what makes you different'],
    summary: 'A special bond waiting to unfold.'
  };
};

// Get personalized insight based on specific sign combination
export const getSignSpecificInsight = (parentSign: ZodiacSign, childSign: ZodiacSign): string => {
  const insights: Record<string, string> = {
    'aries-aries': `Two warriors in one home! Your little Ram matches your fire. Channel that competitive spirit into team adventures.`,
    'aries-taurus': `Your bold energy meets their stubborn calm. They're teaching you patience, even when you want to charge ahead.`,
    'aries-gemini': `Your action fuels their curiosity. Keep up with their questions—they love your directness.`,
    'aries-cancer': `Your warrior heart must protect their tender shell. Slow down; they need your gentleness as much as your strength.`,
    'aries-leo': `Double fire drama! You're both stars. Give them the spotlight sometimes—they've inherited your charisma.`,
    'aries-virgo': `Your impulses meet their precision. They notice everything you miss. Value their careful observations.`,
    'aries-libra': `Opposite signs, magnetic connection. They bring balance to your intensity. Listen to their need for harmony.`,
    'aries-scorpio': `Two intense souls. Power struggles are possible but so is profound loyalty. Respect their depth.`,
    'aries-sagittarius': `Adventure buddies from day one. Your shared love of exploration makes every day an expedition.`,
    'aries-capricorn': `Your fire meets their mountain. They're ambitious like you but in their own steady way.`,
    'aries-aquarius': `You both value independence. They'll surprise you with their unique perspectives. Embrace the unexpected.`,
    'aries-pisces': `Your directness meets their dreams. Be gentle with their sensitivity—it's a superpower, not weakness.`,
    'taurus-aries': `Their fire rushes past your steady pace. Create safe spaces for their energy while keeping your grounding presence.`,
    'taurus-taurus': `Two peaceful souls building a cozy world. Watch for shared stubbornness but celebrate your mutual love of comfort.`,
    'taurus-gemini': `Their rapid thoughts circle your steady mind. Bring them back to earth with sensory experiences.`,
    'taurus-cancer': `A natural nurturing bond. You both treasure home and security. This connection runs deep.`,
    'taurus-leo': `Your quiet strength meets their need for attention. Celebrate them publicly; love them privately.`,
    'taurus-virgo': `Earth meeting earth. You understand each other's need for order and quality. A harmonious match.`,
    'taurus-libra': `Venus rules you both—beauty and harmony matter. Create aesthetic experiences together.`,
    'taurus-scorpio': `Opposite signs with magnetic pull. Intense loyalty possible. Both stubborn, both devoted.`,
    'taurus-sagittarius': `Their wanderlust challenges your roots. Travel together in small doses. Ground their adventures.`,
    'taurus-capricorn': `Earth supporting earth. You understand their ambitions. Practical love in every gesture.`,
    'taurus-aquarius': `Their innovation meets your tradition. They'll challenge your routines—let some fresh air in.`,
    'taurus-pisces': `Your stability holds their dreams. You're the shore to their ocean. Beautiful creative partnership.`,
  };
  
  const key = `${parentSign}-${childSign}`;
  return insights[key] || `Your ${getZodiacName(parentSign)} energy guides their ${getZodiacName(childSign)} journey in unique ways.`;
};

export const getElementEmoji = (element: string): string => {
  switch (element) {
    case 'fire': return '🔥';
    case 'earth': return '🌍';
    case 'air': return '💨';
    case 'water': return '💧';
    default: return '✨';
  }
};
