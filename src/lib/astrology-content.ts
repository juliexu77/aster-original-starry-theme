import { ZodiacSign, getZodiacName } from './zodiac';

// Sun sign core mechanics - NOT generic adjectives, but personality patterns
export const SUN_MECHANICS: Record<ZodiacSign, string[]> = {
  aries: [
    'Needs to be first, not best—first',
    'Boredom registers as physical discomfort',
    'Emotions happen in bursts, then disappear',
    'Conflict is clarifying, not scary'
  ],
  taurus: [
    'Processes change on their own timeline, not yours',
    'Comfort is a non-negotiable, not a preference',
    'Stubbornness is actually deep self-trust',
    'Physical environment directly affects mood'
  ],
  gemini: [
    'Two opinions on everything, both genuine',
    'Silence feels like abandonment',
    'Easily bored but never boring',
    'Learning is a hunger, not a hobby'
  ],
  cancer: [
    'Remembers feelings more than facts',
    'Home is the emotional control center',
    'Protective instincts override logic',
    'Needs permission to need things'
  ],
  leo: [
    'Needs to be the center of gravity',
    'Emotions as performance art',
    'Restless without novelty or audience',
    'Generosity as identity, not just behavior'
  ],
  virgo: [
    'Notices what everyone else misses',
    'Anxiety disguised as helpfulness',
    'Perfectionism as self-protection',
    'Criticism is their love language'
  ],
  libra: [
    'Absorbs the mood of whoever is closest',
    'Fairness is an obsession, not a preference',
    'Decisions feel like existential threats',
    'Harmony at any personal cost'
  ],
  scorpio: [
    'Trust is earned in years, lost in seconds',
    'All or nothing, no middle ground',
    'Secrets feel safer than openness',
    'Intensity as default setting'
  ],
  sagittarius: [
    'Commitment feels like a cage',
    'Optimism that borders on denial',
    'Truth-telling without editing',
    'Motion as emotional regulation'
  ],
  capricorn: [
    'Takes responsibility for things that aren\'t theirs',
    'Achievement as emotional security',
    'Pessimism disguised as realism',
    'Work before play, always'
  ],
  aquarius: [
    'Needs to be different, not better',
    'Emotional detachment as survival strategy',
    'Ideas matter more than feelings',
    'Rebellion for its own sake'
  ],
  pisces: [
    'Boundaries are suggestions, not rules',
    'Other people\'s feelings feel like their own',
    'Reality is negotiable',
    'Escape routes always mapped'
  ]
};

// Moon sign emotional patterns - how feelings actually work
export const MOON_PATTERNS: Record<ZodiacSign, string[]> = {
  aries: [
    'Feelings arrive fast and hot, then evaporate',
    'Needs action when upset, not comfort',
    'Emotional memory is mercifully short',
    'Vulnerability feels like weakness'
  ],
  taurus: [
    'Slow to feel, slower to unfeel',
    'Comfort objects are emotionally essential',
    'Needs physical presence, not words',
    'Change triggers deep anxiety'
  ],
  gemini: [
    'Talks to process, can\'t feel in silence',
    'Mood shifts without clear trigger',
    'Intellectualizes to avoid feeling',
    'Needs variety even in comfort'
  ],
  cancer: [
    'Absorbs ambient emotion like a sponge',
    'Past feelings stay present',
    'Needs reassurance on repeat',
    'Nurtures others to avoid own needs'
  ],
  leo: [
    'Needs feelings witnessed to feel real',
    'Pride protects soft center',
    'Wounded by being ignored, not criticized',
    'Dramatic expression is authentic expression'
  ],
  virgo: [
    'Worry is the baseline emotional state',
    'Helps others to feel useful enough to exist',
    'Self-critical inner monologue on loop',
    'Needs order to feel safe'
  ],
  libra: [
    'Other people\'s emotions come first',
    'Conflict is viscerally disturbing',
    'Needs external validation to trust own feelings',
    'Peace at any personal cost'
  ],
  scorpio: [
    'Feelings at full volume, always',
    'Protective of inner world despite outward confidence',
    'Grows through intensity, not gradually',
    'Betrayal is never forgotten'
  ],
  sagittarius: [
    'Optimism as emotional defense',
    'Needs freedom to feel safe',
    'Avoids heavy emotions through motion',
    'Honesty without tact'
  ],
  capricorn: [
    'Suppresses feelings to function',
    'Vulnerability feels dangerous',
    'Needs to be useful to feel loved',
    'Emotions on a schedule'
  ],
  aquarius: [
    'Observes own feelings from a distance',
    'Uncomfortable with emotional intensity',
    'Needs space to process privately',
    'Intellectual about feelings'
  ],
  pisces: [
    'Boundaries dissolve under emotional pressure',
    'Feels everything in the room',
    'Needs fantasy to cope with reality',
    'Compassion without limits'
  ]
};

// Rising sign first impressions - how they enter rooms
export const RISING_PRESENCE: Record<ZodiacSign, {
  instinct: string;
  modification: string[];
}> = {
  aries: {
    instinct: 'First impulse is always movement',
    modification: [
      'Leads with action, not observation',
      'Confidence is instinctual, not performed',
      'Meets new situations with immediate engagement',
      'Impatience reads as energy, not rudeness'
    ]
  },
  taurus: {
    instinct: 'First impulse is to assess stability',
    modification: [
      'Enters slowly, stays indefinitely',
      'Physical presence is grounding to others',
      'Deliberate pace masks inner fire',
      'Charm through steadiness, not sparkle'
    ]
  },
  gemini: {
    instinct: 'First impulse is to gather information',
    modification: [
      'Leads with questions and curiosity',
      'Adapts persona to each room',
      'Nervous energy reads as enthusiasm',
      'Words come before feelings show'
    ]
  },
  cancer: {
    instinct: 'First impulse is to read emotional safety',
    modification: [
      'Scans for threat before relaxing',
      'Protective shell hides soft center',
      'Nurtures before revealing self',
      'Warmth emerges once trust is established'
    ]
  },
  leo: {
    instinct: 'First impulse is to be seen',
    modification: [
      'Natural spotlight magnetism',
      'Confidence requires no warm-up',
      'Generosity is immediate and theatrical',
      'Presence fills the room automatically'
    ]
  },
  virgo: {
    instinct: 'First impulse is to analyze and categorize',
    modification: [
      'Observes before participating',
      'Helpfulness is the entry point',
      'Precision masks inner chaos',
      'Service as connection strategy'
    ]
  },
  libra: {
    instinct: 'First impulse is to harmonize',
    modification: [
      'Mirrors whoever is present',
      'Charm is automatic, not calculated',
      'Smooths rough edges in any room',
      'Aesthetically aware at all times'
    ]
  },
  scorpio: {
    instinct: 'First impulse is to observe without revealing',
    modification: [
      'Intensity is felt before seen',
      'Reveals nothing while seeing everything',
      'Presence is magnetic and unnerving',
      'Trust must be proven, not assumed'
    ]
  },
  sagittarius: {
    instinct: 'First impulse is to explore and expand',
    modification: [
      'Enthusiasm is uncontainable',
      'Boundaries feel optional',
      'Optimism is immediately apparent',
      'Movement is constant'
    ]
  },
  capricorn: {
    instinct: 'First impulse is to assess structure and hierarchy',
    modification: [
      'Reserved exterior masks ambition',
      'Maturity beyond their years',
      'Takes situations seriously from the start',
      'Authority feels natural, not forced'
    ]
  },
  aquarius: {
    instinct: 'First impulse is to differentiate from the group',
    modification: [
      'Deliberately unusual first impression',
      'Friendly but emotionally distant',
      'Independence is non-negotiable',
      'Observes social rules to break them'
    ]
  },
  pisces: {
    instinct: 'First impulse is to merge with the environment',
    modification: [
      'Dreamy presence, hard to pin down',
      'Absorbs mood of the room',
      'Gentle entry, deep impact',
      'Boundaries unclear from the start'
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
