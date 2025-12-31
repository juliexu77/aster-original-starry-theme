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
export const getChartSynthesis = (
  sunSign: ZodiacSign,
  moonSign: ZodiacSign | null,
  risingSign: ZodiacSign | null
): { strengths: string[]; growthEdges: string[] } => {
  // These are specific combinations, not generic traits
  const synthStrengths: Record<ZodiacSign, string[]> = {
    aries: [
      'Assumes they belong in any room',
      'Short emotional memory, rebounds fast',
      'Infectious confidence that pulls others along'
    ],
    taurus: [
      'Unshakeable once committed',
      'Creates stability for everyone around them',
      'Patience that outlasts any opposition'
    ],
    gemini: [
      'Connects ideas no one else sees',
      'Adapts instantly to any social situation',
      'Makes complexity look effortless'
    ],
    cancer: [
      'Emotional intelligence off the charts',
      'Creates belonging wherever they go',
      'Remembers what matters to people'
    ],
    leo: [
      'Makes others feel special by association',
      'Courage to be visible when it counts',
      'Generosity that creates loyalty'
    ],
    virgo: [
      'Notices what everyone else misses',
      'Improves everything they touch',
      'Reliability that becomes invisible because it\'s constant'
    ],
    libra: [
      'Natural mediator in any conflict',
      'Creates beauty and harmony automatically',
      'Makes difficult people feel understood'
    ],
    scorpio: [
      'Reads emotional undercurrents instinctively',
      'Loyalty that is absolute and fierce',
      'Transformative presence that changes systems'
    ],
    sagittarius: [
      'Optimism that is genuinely contagious',
      'Sees possibility where others see problems',
      'Adventure spirit that expands everyone\'s world'
    ],
    capricorn: [
      'Gets things done when no one else will',
      'Builds structures that last',
      'Earns respect through quiet competence'
    ],
    aquarius: [
      'Thinks thoughts no one else is thinking',
      'Challenges systems that need challenging',
      'Comfortable being the only one'
    ],
    pisces: [
      'Understands what people can\'t articulate',
      'Creative vision that transcends the ordinary',
      'Compassion that is boundless and healing'
    ]
  };

  const synthEdges: Record<ZodiacSign, string[]> = {
    aries: [
      'Expects immediate emotional response from others',
      'Collapses when not stimulated',
      'Needs constant proof of being prioritized'
    ],
    taurus: [
      'Treats preferences as non-negotiable truths',
      'Digs in when flexibility is required',
      'Comfort-seeking overrides growth'
    ],
    gemini: [
      'Consistency feels like a trap',
      'Depth requires uncomfortable stillness',
      'Talks around feelings instead of through them'
    ],
    cancer: [
      'Takes everything personally, even when it\'s not',
      'Past hurts stay present indefinitely',
      'Needs reassurance more than independence'
    ],
    leo: [
      'Being ignored wounds more than criticism',
      'Needs audience to feel real',
      'Pride protects but also isolates'
    ],
    virgo: [
      'Perfectionism is a cage, not a standard',
      'Criticizes self and others reflexively',
      'Anxiety masquerades as productivity'
    ],
    libra: [
      'Avoids conflict at cost of authenticity',
      'Other people\'s needs eclipse their own',
      'Decisions paralyze instead of clarify'
    ],
    scorpio: [
      'Trust issues that become self-fulfilling',
      'Intensity that exhausts others',
      'Forgiveness is a foreign concept'
    ],
    sagittarius: [
      'Commitment phobia dressed as freedom-seeking',
      'Bluntness that wounds without intention',
      'Avoids depth through constant motion'
    ],
    capricorn: [
      'Work becomes identity, not just activity',
      'Emotional vulnerability feels like failure',
      'Takes responsibility for things that aren\'t theirs'
    ],
    aquarius: [
      'Emotional distance that hurts those closest',
      'Contrarian for its own sake',
      'Ideas valued over people\'s feelings'
    ],
    pisces: [
      'Boundaries that dissolve under pressure',
      'Escapes when reality gets difficult',
      'Takes on others\' pain as their own'
    ]
  };

  let strengths = [...synthStrengths[sunSign]];
  let edges = [...synthEdges[sunSign]];

  // Moon adds emotional coloring
  if (moonSign && moonSign !== sunSign) {
    const moonEdge = synthEdges[moonSign][0];
    if (!edges.includes(moonEdge)) {
      edges[2] = moonEdge;
    }
  }

  return { strengths, growthEdges: edges };
};

// Get sun sign synthesis paragraph
export const getSunSynthesis = (sunSign: ZodiacSign): string => {
  const sunName = getZodiacName(sunSign);
  const element = getElement(sunSign);
  
  const syntheses: Record<ZodiacSign, string> = {
    aries: `${sunName} at the core means impulse is intelligence. This child doesn't wait to feel ready—action creates clarity. ${element === 'fire' ? 'Fire energy' : 'Their energy'} burns bright and fast, preferring movement to deliberation.`,
    taurus: `${sunName} at the core means stability is non-negotiable. This child builds their world slowly, brick by brick, and resists anything that threatens their carefully constructed comfort. Change happens on their timeline, not yours.`,
    gemini: `${sunName} at the core means curiosity drives everything. This child's mind runs faster than most can follow—collecting information, making connections, asking the next question before the first is answered. Stillness feels like stagnation.`,
    cancer: `${sunName} at the core means feeling is remembering. This child holds onto emotional experiences long after they've passed, building their identity from moments of connection and belonging. Home isn't a place—it's a feeling they carry.`,
    leo: `${sunName} at the core means being seen is being real. This child needs an audience not for validation but for existence—their warmth, creativity, and generosity expand in direct proportion to attention received.`,
    virgo: `${sunName} at the core means improvement is instinctual. This child notices every flaw, every possibility for refinement—not from criticism but from genuine care. They make things better because leaving them imperfect feels wrong.`,
    libra: `${sunName} at the core means harmony is essential. This child reads the room before they've fully entered it, adjusting themselves to create balance. Their own needs often get lost in the service of peace.`,
    scorpio: `${sunName} at the core means depth is default. This child doesn't do surface level—every experience is felt fully, every relationship tested for loyalty. What they love, they love completely; what they trust, they trust absolutely.`,
    sagittarius: `${sunName} at the core means expansion is oxygen. This child needs to grow, explore, understand—staying put feels like shrinking. Their optimism isn't naive; it's a refusal to accept limitation as final.`,
    capricorn: `${sunName} at the core means responsibility is identity. This child takes things seriously, perhaps too seriously—they feel the weight of expectations even when none have been placed. Achievement isn't ambition; it's security.`,
    aquarius: `${sunName} at the core means difference is destiny. This child needs to think their own thoughts, follow their own path—conformity feels like erasure. They're building a future that doesn't exist yet.`,
    pisces: `${sunName} at the core means boundaries are permeable. This child feels what others feel, dreams what others can't imagine, and moves between reality and fantasy with unsettling ease. Separation is an illusion they never quite believe.`
  };
  
  return syntheses[sunSign];
};

// Get moon sign synthesis paragraph
export const getMoonSynthesis = (moonSign: ZodiacSign): string => {
  const moonName = getZodiacName(moonSign);
  
  const syntheses: Record<ZodiacSign, string> = {
    aries: `Moon in ${moonName} means emotions arrive like weather—sudden, intense, and soon passed. This child processes feelings through action, not reflection. When upset, they need to move, not sit with it.`,
    taurus: `Moon in ${moonName} means emotions need anchoring. This child processes feelings slowly, through comfort, routine, and physical presence. What they feel today, they'll still feel next month—loyalty runs deep.`,
    gemini: `Moon in ${moonName} means emotions need words. This child talks through feelings, shifting perspectives until something makes sense. Silence in distress isn't calm—it's confusion.`,
    cancer: `Moon in ${moonName} means emotions are memory. This child holds feelings close, letting them accumulate into a rich inner world. They need to feel safe before they can feel anything else.`,
    leo: `Moon in ${moonName} means emotions need witness. This child's feelings become real when acknowledged by others. Pride protects a tender heart that wants nothing more than to be celebrated for existing.`,
    virgo: `Moon in ${moonName} means emotions need organizing. This child worries as a way of caring, analyzing feelings until they're manageable. They feel useful when they're helping—and anxious when they're not.`,
    libra: `Moon in ${moonName} means emotions need balance. This child absorbs the feelings of those around them, adjusting their own state to maintain harmony. Their needs often get filed under 'later.'`,
    scorpio: `Moon in ${moonName} means emotions run at full volume. This child feels everything deeply—joy and grief, trust and betrayal. There's no dimmer switch, only on and off.`,
    sagittarius: `Moon in ${moonName} means emotions need room to roam. This child processes through movement, adventure, and optimism. Heaviness gets converted to humor; sadness becomes philosophy.`,
    capricorn: `Moon in ${moonName} means emotions need purpose. This child learns early to manage feelings, to be useful, to not burden others. Vulnerability feels like exposure; productivity feels like safety.`,
    aquarius: `Moon in ${moonName} means emotions need distance. This child observes their own feelings from a step removed, analyzing rather than immersing. They need space to process privately before sharing.`,
    pisces: `Moon in ${moonName} means emotions have no edges. This child feels everything in the room—their own feelings tangled with everyone else's. They need regular escape into imagination to survive reality.`
  };
  
  return syntheses[moonSign];
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
    return `${risingName} rising amplifies this ${sunName}'s natural tendencies. ${rising.instinct}. Double ${sunElement} energy means what you see is what you get—no hidden layers, just pure expression.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'fire')) {
    return `${risingName} rising fans this ${sunName}'s flames. ${rising.instinct}. The combination creates someone who thinks fast and acts faster, ideas becoming action almost instantaneously.`;
  }
  
  if ((sunElement === 'earth' && risingElement === 'water') || 
      (sunElement === 'water' && risingElement === 'earth')) {
    return `${risingName} rising grounds this ${sunName}'s depths. ${rising.instinct}. There's substance beneath the surface—feelings have roots, and instincts are reliable.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'water') || 
      (sunElement === 'water' && risingElement === 'fire')) {
    return `${risingName} rising creates steam with this ${sunName} energy. ${rising.instinct}. The combination produces emotional intensity that others feel before they understand.`;
  }
  
  if ((sunElement === 'earth' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'earth')) {
    return `${risingName} rising intellectualizes this ${sunName}'s groundedness. ${rising.instinct}. Practical ideas and idealistic plans merge into something actually achievable.`;
  }
  
  if ((sunElement === 'fire' && risingElement === 'earth') || 
      (sunElement === 'earth' && risingElement === 'fire')) {
    return `${risingName} rising channels this ${sunName}'s drive into tangible results. ${rising.instinct}. Ambition meets patience—they want it all and they'll build it brick by brick.`;
  }
  
  if ((sunElement === 'water' && risingElement === 'air') || 
      (sunElement === 'air' && risingElement === 'water')) {
    return `${risingName} rising gives this ${sunName}'s feelings an intellectual frame. ${rising.instinct}. They understand emotions conceptually while feeling them deeply—sometimes simultaneously, sometimes alternating.`;
  }
  
  return `${risingName} rising modifies how this ${sunName} shows up. ${rising.instinct}. What you see first isn't the whole story—the core takes time to reveal itself.`;
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
