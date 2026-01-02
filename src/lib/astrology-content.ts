import { ZodiacSign, getZodiacName } from './zodiac';

// Sun sign core mechanics - the essential nature of the soul's expression
// The Sun represents your core identity, life force, and the central theme of your existence
export const SUN_MECHANICS: Record<ZodiacSign, string[]> = {
  aries: [
    'The pioneer spirit—driven by an inner fire that demands forward motion and new beginnings',
    'Possesses an instinctual courage that acts before fear has time to form objections',
    'Experiences emotions as pure energy bursts that fuel immediate action, then naturally dissipate',
    'Finds clarity through confrontation; conflict reveals truth rather than creating chaos'
  ],
  taurus: [
    'Embodies the principle of sacred timing—rushing destroys what patience would perfect',
    'Seeks security through sensory anchoring; physical comfort is a spiritual necessity, not indulgence',
    'What others call stubbornness is actually profound self-trust and unshakeable values',
    'The body is the temple—environment, texture, and beauty directly influence emotional state'
  ],
  gemini: [
    'Houses a multifaceted mind that genuinely holds contradictory truths simultaneously',
    'Experiences silence as a kind of exile—connection and exchange are life force',
    'Possesses a nervous system wired for variety; sameness creates genuine distress',
    'Learning is not a hobby but a hunger—the mind must be fed constantly or it withers'
  ],
  cancer: [
    'Lives through an emotional memory that stores feelings with photographic precision',
    'Home is not a location but an internal sanctuary that travels everywhere',
    'Protective instincts bypass rational thought—the heart knows who needs sheltering',
    'Often needs permission to acknowledge their own needs, so attuned are they to others'
  ],
  leo: [
    'Radiates a solar presence that naturally draws others into orbit',
    'Expresses emotions as creative acts—feelings become performance, art, and generous display',
    'Grows restless without creative expression or appreciative audience',
    'Generosity defines identity; giving is not what they do but who they are'
  ],
  virgo: [
    'Possesses a refined perception that notices the details everyone else overlooks',
    'Channels nervous energy into service—helping others soothes inner anxiety',
    'Perfectionism is protective armor; if they can control quality, they can control chaos',
    'Expresses love through improvement and critique—noticing flaws means caring enough to look'
  ],
  libra: [
    'Functions as an emotional barometer, unconsciously absorbing the moods of everyone present',
    'Experiences fairness as a visceral imperative, not an abstract ideal',
    'Decision-making triggers genuine existential anxiety—each choice means a path not taken',
    'Will sacrifice personal truth to preserve harmony; peace is oxygen'
  ],
  scorpio: [
    'Trust is sacred currency—earned through years of observation, destroyed in single moments',
    'Operates only in absolutes; half-measures and casual commitments feel meaningless',
    'Guards inner depths behind composed exterior; vulnerability is reserved for the chosen few',
    'Lives at emotional depth that others visit only occasionally'
  ],
  sagittarius: [
    'Experiences commitment as potential limitation; freedom is the prerequisite for joy',
    'Maintains optimism as philosophical stance, sometimes refusing to see darkness even when present',
    'Speaks truth as naturally as breathing, without calculating consequences',
    'Processes emotion through motion—travel, exploration, and expansion heal what stillness cannot'
  ],
  capricorn: [
    'Assumes responsibility reflexively, carrying burdens that were never theirs to carry',
    'Equates achievement with emotional safety; success is not ambition but survival',
    'Views life through realistic lens that others mistake for pessimism',
    'Prioritizes work and duty above pleasure; delayed gratification is natural state'
  ],
  aquarius: [
    'Needs to express uniqueness—fitting in feels like self-betrayal',
    'Maintains emotional distance as self-preservation; detachment enables objectivity',
    'Values ideas and principles above personal feelings; concepts feel more real than emotions',
    'Challenges convention instinctively; rebellion is identity expression'
  ],
  pisces: [
    'Experiences boundaries as permeable membranes rather than solid walls',
    'Absorbs others\' emotional states as naturally as breathing; empathy is uncontrollable',
    'Lives between worlds—reality and imagination blend seamlessly',
    'Always knows the escape routes; when life becomes too harsh, retreat is survival'
  ]
};

// Moon sign emotional patterns - the hidden emotional landscape
// The Moon represents your inner emotional nature, instinctual reactions, and what you need to feel safe
export const MOON_PATTERNS: Record<ZodiacSign, string[]> = {
  aries: [
    'Emotions flash like lightning—intense, illuminating, and quickly dissipated',
    'Needs physical movement and active response when emotionally activated; stillness amplifies distress',
    'Blessed with emotional resilience; yesterday\'s wounds rarely carry into tomorrow',
    'Experiences vulnerability as exposure; showing softness feels like showing weakness'
  ],
  taurus: [
    'Emotions move like seasons—slow to shift, but profound when they arrive',
    'Finds emotional grounding through tactile comfort; specific objects and textures provide real security',
    'Needs physical presence and consistent routine over verbal reassurance',
    'Experiences change and unpredictability as genuine threats to emotional stability'
  ],
  gemini: [
    'Must verbalize to process; feelings remain shapeless until words give them form',
    'Mood can shift rapidly without obvious external cause—the mind processes constantly',
    'Instinctively intellectualizes emotions as a coping mechanism; analyzing feelings feels safer than drowning in them',
    'Requires variety and mental stimulation even in emotional comfort'
  ],
  cancer: [
    'Functions as an emotional sponge, absorbing the ambient feelings of any environment',
    'The past remains emotionally present; old feelings resurface with remarkable clarity',
    'Requires repeated reassurance; one declaration of love is not enough for lasting security',
    'Often nurtures others as a way of deflecting attention from personal emotional needs'
  ],
  leo: [
    'Needs emotions to be witnessed and acknowledged to feel fully real',
    'Beneath proud exterior lies a tender heart that bruises easily',
    'Being overlooked or ignored causes deeper wounds than direct criticism',
    'Expresses feelings with theatrical flair; dramatic expression is authentic, not performative'
  ],
  virgo: [
    'Anxiety serves as emotional baseline; the system runs on productive worry',
    'Finds emotional purpose through usefulness; being helpful justifies existence',
    'Carries a relentlessly self-critical inner voice that rarely offers praise',
    'Requires external order to achieve internal calm; chaos in environment creates chaos in psyche'
  ],
  libra: [
    'Prioritizes others\' emotional needs before acknowledging their own',
    'Experiences interpersonal conflict as physically and emotionally disturbing',
    'Struggles to trust personal feelings without external validation or agreement',
    'Sacrifices authentic emotional expression to maintain relational harmony'
  ],
  scorpio: [
    'Feels emotions at maximum intensity; there is no volume control',
    'Guards emotional depths fiercely despite projecting outward confidence and control',
    'Transforms and evolves through emotional intensity rather than gradual adjustment',
    'Stores betrayals in permanent memory; forgiveness is possible, forgetting is not'
  ],
  sagittarius: [
    'Defaults to optimism as emotional armor against life\'s disappointments',
    'Requires freedom and space to feel emotionally secure; containment creates panic',
    'Escapes heavy emotions through movement, humor, or philosophical reframing',
    'Speaks emotional truth without diplomatic packaging; honesty overrides tact'
  ],
  capricorn: [
    'Compartmentalizes and manages emotions to maintain functionality',
    'Experiences vulnerability as dangerous exposure; showing feelings feels like showing weakness',
    'Equates being useful with being worthy of love',
    'Prefers to process emotions on a schedule; unexpected feelings feel disruptive'
  ],
  aquarius: [
    'Observes personal emotions from detached, analytical perspective',
    'Feels genuinely uncomfortable with intense emotional exchanges; prefers rational discussion',
    'Needs significant private time and space to process feelings internally',
    'Approaches emotions intellectually; understanding feelings matters more than expressing them'
  ],
  pisces: [
    'Boundaries dissolve under emotional pressure; saying no to others\' pain is nearly impossible',
    'Absorbs the emotional atmosphere of any room as if it were personal experience',
    'Requires regular retreats into imagination and fantasy to recover from reality\'s demands',
    'Offers compassion without limits, sometimes to personal detriment'
  ]
};

// Rising sign first impressions - how they enter rooms and are perceived by others
// The Ascendant (Rising) represents your social mask, first impressions, and how you instinctively approach new situations
export const RISING_PRESENCE: Record<ZodiacSign, {
  instinct: string;
  modification: string[];
}> = {
  aries: {
    instinct: 'Projects an aura of dynamic energy and initiative; others immediately sense someone who makes things happen',
    modification: [
      'Leads with direct action rather than observation or deliberation',
      'Radiates self-assurance that feels innate rather than cultivated',
      'Approaches new situations with immediate engagement and forward momentum',
      'What might be perceived as impatience actually communicates vitality and readiness'
    ]
  },
  taurus: {
    instinct: 'Projects calm authority and sensual awareness; others feel immediately grounded in their presence',
    modification: [
      'Enters situations deliberately and tends to establish lasting presence once settled',
      'Offers others a sense of stability and reliability simply by being present',
      'Measured pace conceals passionate nature; the surface calm masks inner intensity',
      'Attracts through quiet magnetism and steadfast demeanor rather than flashy display'
    ]
  },
  gemini: {
    instinct: 'Projects quick intelligence and adaptive curiosity; others sense a mind that\'s constantly processing',
    modification: [
      'Opens encounters with questions, observations, and genuine interest in others',
      'Unconsciously adjusts communication style and persona to match each social context',
      'Nervous energy translates to others as engaging enthusiasm and mental agility',
      'Verbal expression precedes emotional vulnerability; words form the bridge to connection'
    ]
  },
  cancer: {
    instinct: 'Projects protective warmth and emotional attunement; others sense someone who truly notices them',
    modification: [
      'Instinctively assesses emotional safety before allowing relaxation or openness',
      'Presents a protective exterior that shields a remarkably tender interior',
      'Offers nurturing care to others before revealing personal vulnerabilities',
      'True warmth and depth emerge gradually once trust has been established'
    ]
  },
  leo: {
    instinct: 'Projects radiant confidence and warm generosity; others naturally orient toward their presence',
    modification: [
      'Possesses natural charisma that draws attention without conscious effort',
      'Confidence arrives fully formed, requiring no warm-up period or external validation',
      'Expresses generosity immediately and with theatrical flair',
      'Physical and energetic presence naturally expands to fill available space'
    ]
  },
  virgo: {
    instinct: 'Projects competent attentiveness and refined perception; others sense someone who notices every detail',
    modification: [
      'Prefers to observe and analyze before actively participating',
      'Offers practical help as the primary mode of initial connection',
      'Careful, precise exterior conceals richer emotional complexity beneath',
      'Service and usefulness form the natural strategy for building relationships'
    ]
  },
  libra: {
    instinct: 'Projects graceful diplomacy and aesthetic awareness; others feel immediately at ease and appreciated',
    modification: [
      'Naturally reflects and validates those they encounter',
      'Charm flows effortlessly and genuinely without conscious calculation',
      'Instinctively softens tension and creates atmosphere of social harmony',
      'Maintains constant awareness of beauty, balance, and aesthetic considerations'
    ]
  },
  scorpio: {
    instinct: 'Projects compelling intensity and penetrating awareness; others sense depth they cannot quite read',
    modification: [
      'Radiates emotional intensity that is felt before it is understood',
      'Observes everything while revealing nothing; a master of strategic disclosure',
      'Exerts magnetic presence that simultaneously attracts and unsettles',
      'Requires demonstrated trustworthiness before allowing genuine access'
    ]
  },
  sagittarius: {
    instinct: 'Projects infectious optimism and expansive enthusiasm; others feel invited into larger possibilities',
    modification: [
      'Enthusiasm cannot be contained or hidden; it overflows naturally',
      'Approaches social boundaries as suggestions rather than rules',
      'Optimistic worldview is immediately apparent in demeanor and expression',
      'Constant movement and energy; rarely found in stillness'
    ]
  },
  capricorn: {
    instinct: 'Projects mature authority and quiet ambition; others sense capability and serious purpose',
    modification: [
      'Reserved, composed exterior conceals significant drive and aspiration',
      'Projects wisdom and groundedness beyond chronological years',
      'Takes situations seriously from the first moment; levity comes later if at all',
      'Natural authority that feels earned rather than assumed or forced'
    ]
  },
  aquarius: {
    instinct: 'Projects intellectual independence and unconventional perspective; others sense someone who thinks differently',
    modification: [
      'Deliberately creates distinctive first impression; conformity feels like invisibility',
      'Offers genuine friendliness while maintaining clear emotional boundaries',
      'Independence is communicated immediately as non-negotiable personal requirement',
      'Studies social conventions primarily to understand how to transcend them'
    ]
  },
  pisces: {
    instinct: 'Projects ethereal sensitivity and intuitive perception; others sense someone who perceives beyond the visible',
    modification: [
      'Dreamlike quality of presence makes them difficult to fully categorize',
      'Naturally absorbs and reflects the emotional atmosphere of any environment',
      'Gentle, unassuming entry often creates surprisingly profound impact',
      'Personal boundaries appear fluid or undefined from initial encounter'
    ]
  }
};

// Chart synthesis - how placements work together
// Simplified language focusing on personality traits rather than astrological jargon
export const getChartSynthesis = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): { strengths: string[]; growthEdges: string[] } => {
  const strengths: string[] = [];
  const edges: string[] = [];
  
  const sunElement = getElement(sunSign);
  const moonElement = moonSign ? getElement(moonSign) : null;
  const risingElement = risingSign ? getElement(risingSign) : null;
  
  // === CORE + EMOTIONAL INTEGRATION ===
  if (moonSign) {
    if (sunSign === moonSign) {
      // Double sign - intensified nature
      strengths.push(`Remarkable consistency—inner feelings and outward actions naturally align`);
      edges.push(`Strong traits can become excessive without balancing influences`);
    } else if (sunElement === moonElement) {
      // Same element - natural harmony
      strengths.push(`Natural harmony between instincts and identity—comfortable in their own skin`);
    } else {
      // Different elements - creative tension
      const sunMoonCombos: Record<string, { strength: string; edge: string }> = {
        'fire-earth': {
          strength: `Enthusiasm is grounded by a need for stability—bold yet patient`,
          edge: `Caution can sometimes frustrate the impulse to act quickly`
        },
        'earth-fire': {
          strength: `Steadiness is enlivened by inner spark—practical with passion`,
          edge: `Internal restlessness can conflict with a need for security`
        },
        'fire-water': {
          strength: `Boldness is deepened by emotional intensity—courage with depth`,
          edge: `Deep sensitivity can sometimes slow forward momentum`
        },
        'water-fire': {
          strength: `Intuition is activated by enthusiasm—feelings that inspire action`,
          edge: `Impatience can bypass the need to process deeply`
        },
        'fire-air': {
          strength: `Passion is amplified by ideas—action meets inspiration`,
          edge: `Lots of acceleration but may need help finding grounding`
        },
        'air-fire': {
          strength: `Ideas gain momentum from drive—thinking that leads to doing`,
          edge: `Can move through connections quickly before depth develops`
        },
        'earth-water': {
          strength: `Reliability is enriched by emotional depth—steady and feeling`,
          edge: `Can become emotionally heavy; tends toward inward focus`
        },
        'water-earth': {
          strength: `Sensitivity is anchored by practicality—dreams with structure`,
          edge: `Emotional currents can be suppressed by need for control`
        },
        'earth-air': {
          strength: `Groundedness gains perspective from objectivity—practical meets philosophical`,
          edge: `Mental detachment can feel distant from material needs`
        },
        'air-earth': {
          strength: `Ideas are given form by need for tangible results`,
          edge: `Attachment to routine can limit mental freedom`
        },
        'water-air': {
          strength: `Intuition is articulated by mental clarity—feelings find words`,
          edge: `Rationality can sometimes dismiss emotional knowing`
        },
        'air-water': {
          strength: `Objectivity is humanized by emotional attunement`,
          edge: `Sensitivity can overwhelm the need for logic`
        }
      };
      
      const combo = `${sunElement}-${moonElement}`;
      const comboData = sunMoonCombos[combo];
      if (comboData) {
        strengths.push(comboData.strength);
        edges.push(comboData.edge);
      }
    }
  }
  
  // === CORE + FIRST IMPRESSION INTEGRATION ===
  if (risingSign) {
    if (sunSign === risingSign) {
      strengths.push(`What others see is exactly who they are—no mask, pure authenticity`);
    } else if (sunElement === risingElement) {
      strengths.push(`Comfortable in their own presentation—natural and genuine`);
    } else {
      // Different elements create interesting first impression dynamics
      const risingModifies: Record<string, string> = {
        'fire-earth': `Appears calmer than the inner drive`,
        'earth-fire': `Appears bolder than the cautious core`,
        'fire-water': `Appears more receptive than the active core`,
        'water-fire': `Appears more dynamic than the reflective core`,
        'fire-air': `Appears more rational than the impulsive core`,
        'air-fire': `Appears more action-oriented than the mental core`,
        'earth-water': `Appears more feeling than the grounded core`,
        'water-earth': `Appears more composed than the sensitive core`,
        'earth-air': `Appears more flexible than the stable core`,
        'air-earth': `Appears more practical than the conceptual core`,
        'water-air': `Appears more detached than the emotional core`,
        'air-water': `Appears more mysterious than the logical core`
      };
      
      const sunRisingCombo = `${sunElement}-${risingElement}`;
      if (risingModifies[sunRisingCombo]) {
        strengths.push(risingModifies[sunRisingCombo]);
      }
    }
  }
  
  // === EMOTIONAL + FIRST IMPRESSION INTEGRATION ===
  if (moonSign && risingSign) {
    if (moonSign === risingSign) {
      strengths.push(`Emotional needs are visible in first impressions—transparent and authentic`);
    } else if (moonElement !== risingElement) {
      // Tension between inner emotional needs and outer presentation
      const moonRisingEdges: Record<string, string> = {
        'fire-earth': `May seem calmer than they feel inside`,
        'earth-fire': `May seem braver than they feel inside`,
        'fire-water': `May seem gentler than they feel inside`,
        'water-fire': `May seem tougher than they feel inside`,
        'fire-air': `May seem cooler than they feel inside`,
        'air-fire': `May seem more engaged than comfortable`,
        'earth-water': `Inner world is more controlled than it appears`,
        'water-earth': `Appears simpler than the rich inner landscape`,
        'earth-air': `Appears more carefree than they feel`,
        'air-earth': `Appears more settled than the inner activity`,
        'water-air': `Thinking and feeling can pull in different directions`,
        'air-water': `Appears more emotional than the analytical core`
      };
      
      const moonRisingCombo = `${moonElement}-${risingElement}`;
      if (moonRisingEdges[moonRisingCombo]) {
        edges.push(moonRisingEdges[moonRisingCombo]);
      }
    }
  }
  
  // === THREE-SIGN ELEMENTAL BALANCE ===
  if (moonSign && risingSign) {
    const elements = [sunElement, moonElement, risingElement].filter(Boolean);
    const uniqueElements = [...new Set(elements)];
    
    if (uniqueElements.length === 1) {
      // All same element - powerful but unbalanced
      edges.push(`Strong consistency in approach but may lack counterbalancing perspectives`);
    } else if (uniqueElements.length === 3) {
      // All different elements - versatile
      strengths.push(`Versatile access to different modes of being`);
    }
    
    // Check for missing elements and note the gap
    const allElements = ['fire', 'earth', 'air', 'water'];
    const presentElements = new Set(elements);
    const missingElements = allElements.filter(e => !presentElements.has(e));
    
    if (missingElements.length >= 2) {
      const missingDescriptions: Record<string, string> = {
        'fire': 'spontaneous action',
        'earth': 'practical grounding',
        'air': 'objective perspective', 
        'water': 'emotional depth'
      };
      const missingQualities = missingElements.map(e => missingDescriptions[e]).join(' and ');
      edges.push(`May need to consciously cultivate ${missingQualities}`);
    }
  }
  
  // Ensure we have at least 3 items each
  const fallbackStrengths = [
    `Consistent identity foundation`,
    moonSign ? `Emotional richness` : 'Emotional processing is internalized',
    risingSign ? `Approachable first impression` : 'Natural authenticity in presentation'
  ];
  
  const fallbackEdges = [
    `Under stress, core patterns may intensify`,
    moonSign ? `Emotional needs may be overlooked at times` : 'Emotional needs can go unrecognized',
    risingSign ? `First impression may mask deeper needs` : 'True self may take time to reveal'
  ];
  
  while (strengths.length < 3) {
    const fallback = fallbackStrengths[strengths.length];
    if (!strengths.includes(fallback)) {
      strengths.push(fallback);
    } else {
      break;
    }
  }
  
  while (edges.length < 3) {
    const fallback = fallbackEdges[edges.length];
    if (!edges.includes(fallback)) {
      edges.push(fallback);
    } else {
      break;
    }
  }

  return { strengths: strengths.slice(0, 3), growthEdges: edges.slice(0, 3) };
};

// Get sun sign synthesis paragraph
export const getSunSynthesis = (sunSign: ZodiacSign): string => {
  const sunName = getZodiacName(sunSign);
  const element = getElement(sunSign);
  
  const syntheses: Record<ZodiacSign, string> = {
    aries: `${sunName} core: impulse is intelligence. Action creates clarity—movement over deliberation.`,
    taurus: `${sunName} core: stability is non-negotiable. Change happens on their timeline, not yours.`,
    gemini: `${sunName} core: curiosity drives everything. The mind runs faster than most can follow.`,
    cancer: `${sunName} core: feeling is remembering. Home isn't a place—it's a feeling they carry.`,
    leo: `${sunName} core: being seen is being real. Warmth and generosity expand with attention.`,
    virgo: `${sunName} core: improvement is instinctual. They make things better because imperfection feels wrong.`,
    libra: `${sunName} core: harmony is essential. Their needs often get lost in service of peace.`,
    scorpio: `${sunName} core: depth is default. What they love, they love completely.`,
    sagittarius: `${sunName} core: expansion is oxygen. Optimism isn't naive—it refuses to accept limitation.`,
    capricorn: `${sunName} core: responsibility is identity. Achievement isn't ambition; it's security.`,
    aquarius: `${sunName} core: difference is destiny. Conformity feels like erasure.`,
    pisces: `${sunName} core: boundaries are permeable. They feel what others feel, dream what others can't.`
  };
  
  return syntheses[sunSign];
};

// Get moon sign synthesis paragraph
export const getMoonSynthesis = (moonSign: ZodiacSign): string => {
  const moonName = getZodiacName(moonSign);
  
  const syntheses: Record<ZodiacSign, string> = {
    aries: `${moonName} moon: emotions arrive sudden and intense. They need to move, not sit with it.`,
    taurus: `${moonName} moon: emotions need anchoring. What they feel today, they'll still feel next month.`,
    gemini: `${moonName} moon: emotions need words. Silence in distress isn't calm—it's confusion.`,
    cancer: `${moonName} moon: emotions are memory. They need to feel safe before anything else.`,
    leo: `${moonName} moon: emotions need witness. Pride protects a tender heart.`,
    virgo: `${moonName} moon: emotions need organizing. Useful when helping, anxious when not.`,
    libra: `${moonName} moon: emotions need balance. Their needs get filed under 'later.'`,
    scorpio: `${moonName} moon: emotions run at full volume. No dimmer switch, only on and off.`,
    sagittarius: `${moonName} moon: emotions need room. Heaviness converts to humor, sadness to philosophy.`,
    capricorn: `${moonName} moon: emotions need purpose. Vulnerability is exposure; productivity is safety.`,
    aquarius: `${moonName} moon: emotions need distance. They process privately before sharing.`,
    pisces: `${moonName} moon: emotions have no edges. Their feelings tangle with everyone else's.`
  };
  
  return syntheses[moonSign];
};

// Calculate age-appropriate developmental context
const getAgeContext = (birthday: string | null): { 
  ageLabel: string; 
  developmentalFocus: string;
  parentingLens: string;
} => {
  if (!birthday) {
    return {
      ageLabel: '',
      developmentalFocus: 'their natural way of being',
      parentingLens: 'honoring who they are'
    };
  }
  
  const birthDate = new Date(birthday);
  const now = new Date();
  const ageInMonths = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const ageInYears = Math.floor(ageInMonths / 12);
  
  if (ageInMonths < 6) {
    return {
      ageLabel: `at ${ageInMonths} months`,
      developmentalFocus: 'establishing security and basic trust',
      parentingLens: 'attuning to their sensory preferences and rhythm'
    };
  } else if (ageInMonths < 12) {
    return {
      ageLabel: `at ${ageInMonths} months`,
      developmentalFocus: 'exploring the world through senses and movement',
      parentingLens: 'creating a secure base for their emerging independence'
    };
  } else if (ageInYears < 2) {
    return {
      ageLabel: `at ${ageInYears === 1 ? '1 year' : `${ageInMonths} months`}`,
      developmentalFocus: 'asserting independence while needing reassurance',
      parentingLens: 'balancing safety with their drive to explore'
    };
  } else if (ageInYears < 4) {
    return {
      ageLabel: `at ${ageInYears}`,
      developmentalFocus: 'imaginative play and emotional vocabulary',
      parentingLens: 'naming feelings and setting gentle limits'
    };
  } else if (ageInYears < 7) {
    return {
      ageLabel: `at ${ageInYears}`,
      developmentalFocus: 'social dynamics and moral development',
      parentingLens: 'supporting friendships and building resilience'
    };
  } else if (ageInYears < 10) {
    return {
      ageLabel: `at ${ageInYears}`,
      developmentalFocus: 'competence, comparison, and identity formation',
      parentingLens: 'nurturing their unique strengths without pressure'
    };
  } else if (ageInYears < 13) {
    return {
      ageLabel: `at ${ageInYears}`,
      developmentalFocus: 'pre-adolescent identity and peer belonging',
      parentingLens: 'staying connected while giving more autonomy'
    };
  } else {
    return {
      ageLabel: `at ${ageInYears}`,
      developmentalFocus: 'identity crystallization and emotional complexity',
      parentingLens: 'being a steady presence they can return to'
    };
  }
};

// Get the integrated "So What" synthesis - the real takeaway for parents
export const getChartIntegration = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null,
  name: string,
  birthday: string | null
): {
  title: string;
  subtitle: string;
  integration: string;
  keyInsight: string;
  parentingNote: string;
} => {
  const firstName = name.split(' ')[0];
  const sunName = getZodiacName(sunSign);
  const moonName = moonSign ? getZodiacName(moonSign) : null;
  const risingName = risingSign ? getZodiacName(risingSign) : null;
  
  const sunElement = getElement(sunSign);
  const moonElement = moonSign ? getElement(moonSign) : null;
  const risingElement = risingSign ? getElement(risingSign) : null;
  
  const { ageLabel, developmentalFocus, parentingLens } = getAgeContext(birthday);
  
  // Build the core integration narrative
  let integration = '';
  let keyInsight = '';
  let parentingNote = '';
  
  // Count elements present
  const elements = [sunElement, moonElement, risingElement].filter(Boolean) as string[];
  const uniqueElements = [...new Set(elements)];
  const elementCounts = elements.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find dominant element if any
  const dominantElement = Object.entries(elementCounts).find(([_, count]) => count >= 2)?.[0];
  
  // Get sign-specific key traits for personalization
  const getSignKeyTrait = (sign: ZodiacSign): string => {
    const traits: Record<ZodiacSign, string> = {
      aries: 'pioneer spirit and need to lead',
      taurus: 'need for stability and sensory grounding',
      gemini: 'curious mind that must understand everything',
      cancer: 'deep emotional memory and protective instincts',
      leo: 'generous heart that needs to shine',
      virgo: 'refined perception and drive to be useful',
      libra: 'quest for harmony and fear of discord',
      scorpio: 'emotional intensity and need for deep trust',
      sagittarius: 'hunger for freedom and meaning',
      capricorn: 'sense of responsibility and drive for achievement',
      aquarius: 'need for independence and unique self-expression',
      pisces: 'permeable boundaries and profound empathy'
    };
    return traits[sign];
  };

  const getSignChallenge = (sign: ZodiacSign): string => {
    const challenges: Record<ZodiacSign, string> = {
      aries: 'learning patience without losing their spark',
      taurus: 'embracing change without losing their center',
      gemini: 'finding focus without feeling trapped',
      cancer: 'setting boundaries without closing their heart',
      leo: 'sharing the spotlight without dimming their light',
      virgo: 'accepting imperfection without losing their standards',
      libra: 'standing firm without losing connection',
      scorpio: 'trusting without losing their protective instincts',
      sagittarius: 'committing without losing their freedom',
      capricorn: 'relaxing without losing their sense of purpose',
      aquarius: 'connecting deeply without losing their independence',
      pisces: 'staying grounded without losing their magic'
    };
    return challenges[sign];
  };
  
  // Generate integration based on chart composition
  if (moonSign && risingSign) {
    // Full chart available - create sign-specific narrative
    
    // Check for the "outlier" - when one placement differs from dominant element
    const outlierSign = dominantElement 
      ? (moonElement !== dominantElement ? moonSign : (risingElement !== dominantElement ? risingSign : null))
      : null;
    const outlierElement = outlierSign 
      ? (moonElement !== dominantElement ? moonElement : risingElement)
      : null;
    const outlierRole = outlierSign
      ? (moonElement !== dominantElement ? 'emotional core' : 'first impression')
      : null;
    
    if (dominantElement && !outlierSign) {
      // Triple element emphasis - all same element
      const tripleIntegrations: Record<string, { integration: string; insight: string; note: string }> = {
        fire: {
          integration: `${firstName}'s chart is pure fire—${sunName} identity, ${moonName} emotions, ${risingName} presence. Triple fire means their ${getSignKeyTrait(sunSign)} shapes everything. They lead with ${sunName}'s particular brand of courage, feel through ${moonName}'s emotional lens, and show up with ${risingName}'s unmistakable energy.`,
          insight: `The ${sunName}-specific challenge is ${getSignChallenge(sunSign)}. Watch especially for ${moonName} emotional patterns—they process feelings fast but ${moonSign === 'aries' ? 'may not fully digest them' : moonSign === 'leo' ? 'need them witnessed' : 'run from the heavy ones'}.`,
          note: `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means channeling all that fire through ${sunName}'s natural strengths.`
        },
        earth: {
          integration: `${firstName}'s chart is grounded to the core—${sunName} identity, ${moonName} emotions, ${risingName} presence. Triple earth means their ${getSignKeyTrait(sunSign)} is reinforced at every level. They need things to be real, tangible, and purposeful.`,
          insight: `The ${sunName}-specific work is ${getSignChallenge(sunSign)}. Their ${moonName} moon means emotional security comes through ${moonSign === 'taurus' ? 'physical comfort and consistency' : moonSign === 'virgo' ? 'being useful and having order' : 'achievement and structure'}.`,
          note: `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means respecting their ${sunName} pace while gently stretching their comfort zone.`
        },
        air: {
          integration: `${firstName}'s chart lives in the mind—${sunName} identity, ${moonName} emotions, ${risingName} presence. Triple air means their ${getSignKeyTrait(sunSign)} expresses through constant mental activity. They need to understand, discuss, and connect ideas.`,
          insight: `The ${sunName}-specific challenge is ${getSignChallenge(sunSign)}. With ${moonName} moon, they ${moonSign === 'gemini' ? 'process emotions by talking them through' : moonSign === 'libra' ? 'need relationship harmony to feel secure' : 'analyze feelings rather than fully experiencing them'}.`,
          note: `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means honoring their ${sunName} intellectual nature while helping them land in their body.`
        },
        water: {
          integration: `${firstName}'s chart runs deep—${sunName} identity, ${moonName} emotions, ${risingName} presence. Triple water means their ${getSignKeyTrait(sunSign)} is felt at profound levels. They sense what others miss and carry emotions that don't easily let go.`,
          insight: `The ${sunName}-specific work is ${getSignChallenge(sunSign)}. Their ${moonName} moon ${moonSign === 'cancer' ? 'stores every feeling with photographic precision' : moonSign === 'scorpio' ? 'feels at maximum intensity with no volume control' : 'absorbs the emotional atmosphere of any room'}.`,
          note: `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means protecting their ${sunName} sensitivity while teaching healthy emotional boundaries.`
        }
      };
      
      const domData = tripleIntegrations[dominantElement];
      integration = domData.integration;
      keyInsight = domData.insight;
      parentingNote = domData.note;
    } else if (dominantElement && outlierSign && outlierElement && outlierRole) {
      // Two same + one outlier - the common pattern
      integration = `${firstName}'s chart has a clear theme with an important twist—${sunName} sun, ${moonName} moon, ${risingName} rising. The ${dominantElement} nature (${getSignKeyTrait(sunSign)}) is central, but the ${outlierElement} ${outlierRole} (${getZodiacName(outlierSign)}'s ${getSignKeyTrait(outlierSign)}) adds crucial depth.`;
      
      if (outlierRole === 'emotional core') {
        keyInsight = `Here's what matters: while they present as ${dominantElement}, their emotional needs are actually ${outlierElement}. ${getZodiacName(outlierSign)} moon means they ${outlierElement === 'water' ? 'need more emotional processing than their surface suggests' : outlierElement === 'earth' ? 'crave more stability than their active exterior shows' : outlierElement === 'air' ? 'need to talk through feelings before acting on them' : 'have more drive inside than their calm exterior reveals'}. Don't be fooled by the ${dominantElement} wrapper.`;
      } else {
        keyInsight = `The ${sunName} core and ${moonName} emotional nature tell the real story—what they want and what they need. But they lead with ${risingName} rising, which is ${outlierElement} energy. Others see ${outlierElement === 'water' ? 'sensitivity and intuition' : outlierElement === 'earth' ? 'groundedness and reliability' : outlierElement === 'air' ? 'curiosity and sociability' : 'energy and initiative'} first, before discovering the ${dominantElement} depths.`;
      }
      
      parentingNote = `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means speaking to both their ${dominantElement} nature and their ${outlierElement} ${outlierRole}.`;
    } else {
      // Diverse elemental mix - focus on sun-moon-rising interaction with sign specificity
      integration = `${firstName}'s chart tells a layered story—${sunName} sun (${getSignKeyTrait(sunSign)}), ${moonName} moon (${getSignKeyTrait(moonSign!)}), ${risingName} rising (${getSignKeyTrait(risingSign!)}). These aren't contradictions—they're different instruments in the same orchestra.`;
      
      keyInsight = `The ${sunName} core is learning ${getSignChallenge(sunSign)}. When stressed, their ${moonName} moon needs ${moonElement === 'fire' ? 'action and outlet' : moonElement === 'earth' ? 'stability and comfort' : moonElement === 'air' ? 'to talk it through' : 'space to feel'}. And their ${risingName} first impression means others ${risingElement === 'fire' ? 'see boldness before depth' : risingElement === 'earth' ? 'see calm before complexity' : risingElement === 'air' ? 'see social ease before intensity' : 'sense feeling before strategy'}.`;
      
      parentingNote = `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means seeing all three layers—not just what shows up first.`;
    }
  } else if (moonSign) {
    // Sun + Moon only - sign-specific narrative
    integration = `${firstName}'s ${sunName} sun and ${moonName} moon create their core dynamic. The ${sunName} identity (${getSignKeyTrait(sunSign)}) is learning ${getSignChallenge(sunSign)}, while the ${moonName} heart needs ${moonElement === 'fire' ? 'enthusiasm and movement' : moonElement === 'earth' ? 'stability and presence' : moonElement === 'air' ? 'conversation and connection' : 'emotional depth and safety'}.`;
    
    if (sunElement === moonElement) {
      keyInsight = `Double ${sunElement} creates consistency—what they show and what they feel are the same language. The ${sunName}-${moonName} combination means they ${sunSign === moonSign ? `are intensely, purely ${sunName}` : `express ${sunElement} in complementary ways`}.`;
    } else {
      keyInsight = `The creative tension: ${sunName} wants to ${sunSign === 'aries' ? 'act' : sunSign === 'taurus' ? 'build' : sunSign === 'gemini' ? 'explore' : sunSign === 'cancer' ? 'nurture' : sunSign === 'leo' ? 'express' : sunSign === 'virgo' ? 'perfect' : sunSign === 'libra' ? 'harmonize' : sunSign === 'scorpio' ? 'transform' : sunSign === 'sagittarius' ? 'expand' : sunSign === 'capricorn' ? 'achieve' : sunSign === 'aquarius' ? 'innovate' : 'transcend'}, while ${moonName} moon needs ${getSignKeyTrait(moonSign!)}.`;
    }
    parentingNote = `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means tracking both what they do (${sunName}) and what they feel (${moonName}).`;
  } else {
    // Sun only - sign-specific
    integration = `${firstName}'s ${sunName} sun is their foundation—the ${getSignKeyTrait(sunSign)}. This is the central theme around which their personality organizes.`;
    keyInsight = `The ${sunName}-specific work is ${getSignChallenge(sunSign)}. ${SUN_MECHANICS[sunSign][0]}`;
    parentingNote = `${ageLabel ? `Right now, ${ageLabel}, while ` : 'While '}${developmentalFocus}, ${parentingLens} means honoring their ${sunName} nature at every stage.`;
  }
  
  return {
    title: `What This Means for ${firstName}`,
    subtitle: 'The integrated picture',
    integration,
    keyInsight,
    parentingNote
  };
};

// Get full sun-rising synthesis text
export const getSunRisingSynthesis = (
  sunSign: ZodiacSign,
  risingSign: ZodiacSign
): string => {
  const sunName = getZodiacName(sunSign);
  const risingName = getZodiacName(risingSign);
  const rising = RISING_PRESENCE[risingSign];
  
  // Generate specific synthesis based on element combinations
  const sunElement = getElement(sunSign);
  const risingElement = getElement(risingSign);
  
  if (sunElement === risingElement) {
    return `${risingName} rising amplifies ${sunName}. Double ${sunElement}—what you see is what you get.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'fire')) {
    return `${risingName} rising fans ${sunName}'s flames. Thinks fast, acts faster.`;
  }
  
  if ((sunElement === 'earth' && risingElement === 'water') || 
      (sunElement === 'water' && risingElement === 'earth')) {
    return `${risingName} rising grounds ${sunName}'s depths. Feelings have roots, instincts are reliable.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'water') || 
      (sunElement === 'water' && risingElement === 'fire')) {
    return `${risingName} rising creates steam with ${sunName}. Emotional intensity others feel before they understand.`;
  }
  
  if ((sunElement === 'earth' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'earth')) {
    return `${risingName} rising intellectualizes ${sunName}'s groundedness. Practical meets idealistic.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'earth') || 
      (sunElement === 'earth' && risingElement === 'fire')) {
    return `${risingName} rising channels ${sunName}'s drive. Ambition meets patience.`;
  }
  
  if ((sunElement === 'water' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'water')) {
    return `${risingName} rising frames ${sunName}'s feelings. Understands emotions while feeling them deeply.`;
  }
  
  return `${risingName} rising modifies ${sunName}. What you see first isn't the whole story.`;
};

const getElement = (sign: ZodiacSign): string => {
  const fire = ['aries', 'leo', 'sagittarius'];
  const earth = ['taurus', 'virgo', 'capricorn'];
  const air = ['gemini', 'libra', 'aquarius'];
  const water = ['cancer', 'scorpio', 'pisces'];
  
  if (fire.includes(sign)) return 'fire';
  if (earth.includes(sign)) return 'earth';
  if (air.includes(sign)) return 'air';
  return 'water';
};
