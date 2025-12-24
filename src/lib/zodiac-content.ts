// Extended zodiac content for Family tab insights
import { ZodiacSign, getZodiacName } from './zodiac';

// Moon sign traits
export const MOON_SIGN_TRAITS: Record<ZodiacSign, {
  emotional: string;
  needs: string;
  soothing: string;
  traits: string[];
}> = {
  aries: {
    emotional: "Quick to feel, quick to move on. Emotions are expressed directly and honestly.",
    needs: "Physical outlet, independence, directness",
    soothing: "Action and movement help process big feelings. Don't over-analyze.",
    traits: ['direct', 'independent', 'action-oriented', 'quick to recover', 'honest']
  },
  taurus: {
    emotional: "Steady and slow to react. Emotions run deep but are expressed calmly.",
    needs: "Physical comfort, routine, sensory experiences",
    soothing: "Soft textures, familiar foods, and consistent presence bring calm.",
    traits: ['steady', 'sensory-focused', 'loyal', 'resistant to change', 'comforting']
  },
  gemini: {
    emotional: "Emotions are processed through talking and thinking. Mood can shift quickly.",
    needs: "Communication, variety, mental stimulation",
    soothing: "Talking it out, distraction, and new activities help reset emotions.",
    traits: ['communicative', 'curious', 'changeable', 'verbal', 'restless']
  },
  cancer: {
    emotional: "Deeply feeling and intuitive. Emotions are intense and long-lasting.",
    needs: "Security, nurturing, closeness",
    soothing: "Physical closeness, reassurance, and familiar routines bring comfort.",
    traits: ['nurturing', 'sensitive', 'protective', 'intuitive', 'moody']
  },
  leo: {
    emotional: "Emotions are big and need to be seen. Joy and hurt are both dramatic.",
    needs: "Recognition, warmth, creative expression",
    soothing: "Attention, validation, and creative outlets help process feelings.",
    traits: ['expressive', 'warm', 'proud', 'generous', 'dramatic']
  },
  virgo: {
    emotional: "Emotions are processed internally and practically. Calm on the surface.",
    needs: "Order, predictability, gentle guidance",
    soothing: "Routines, organization, and quiet support bring peace.",
    traits: ['calm', 'observant', 'conscientious', 'easy to soothe', 'predictable']
  },
  libra: {
    emotional: "Emotions seek balance. Disharmony is deeply uncomfortable.",
    needs: "Fairness, beauty, connection",
    soothing: "Peaceful environments, gentle words, and companionship restore balance.",
    traits: ['harmonious', 'social', 'indecisive', 'diplomatic', 'aesthetic']
  },
  scorpio: {
    emotional: "Emotions run extremely deep. Intensity is the baseline.",
    needs: "Trust, depth, privacy",
    soothing: "One-on-one connection, patience, and honoring their depth.",
    traits: ['intense', 'private', 'transformative', 'loyal', 'perceptive']
  },
  sagittarius: {
    emotional: "Emotions are processed through optimism and movement. Bounces back quickly.",
    needs: "Freedom, adventure, meaning",
    soothing: "New experiences, humor, and philosophical perspective help.",
    traits: ['optimistic', 'adventurous', 'restless', 'philosophical', 'honest']
  },
  capricorn: {
    emotional: "Emotions are controlled and private. Maturity beyond years.",
    needs: "Structure, achievement, respect",
    soothing: "Clear expectations, accomplishments, and quiet pride bring peace.",
    traits: ['mature', 'controlled', 'ambitious', 'responsible', 'reserved']
  },
  aquarius: {
    emotional: "Emotions are observed from a distance. Needs space to process.",
    needs: "Independence, understanding, uniqueness",
    soothing: "Space, logic, and accepting their different approach helps.",
    traits: ['independent', 'unconventional', 'detached', 'humanitarian', 'logical']
  },
  pisces: {
    emotional: "Emotions are oceanic—absorbing everything from everyone.",
    needs: "Gentleness, creativity, escape",
    soothing: "Imagination, gentle presence, and creative outlets bring calm.",
    traits: ['empathetic', 'imaginative', 'dreamy', 'sensitive', 'intuitive']
  }
};

// Sun sign child descriptions
export const SUN_SIGN_CHILD_TRAITS: Record<ZodiacSign, {
  core: string[];
  description: string;
  strengths: string;
  challenges: string;
}> = {
  aries: {
    core: ['bold', 'joyful', 'adventurous', 'enthusiastic', 'resilient', 'physically expressive'],
    description: "The little pioneer who charges ahead fearlessly. Physical, energetic, and direct.",
    strengths: "Natural confidence, quick recovery from setbacks, infectious enthusiasm",
    challenges: "Impatience, anger when thwarted, difficulty waiting"
  },
  taurus: {
    core: ['calm', 'sensory-focused', 'determined', 'loving', 'stubborn', 'comfort-seeking'],
    description: "The peaceful soul who appreciates life's pleasures. Steady, affectionate, and grounded.",
    strengths: "Patience, reliability, appreciation of beauty and comfort",
    challenges: "Resistance to change, stubbornness, possessiveness"
  },
  gemini: {
    core: ['curious', 'talkative', 'clever', 'adaptable', 'social', 'restless'],
    description: "The little communicator who wants to know everything. Quick, verbal, and mentally active.",
    strengths: "Fast learning, social ease, adaptability",
    challenges: "Difficulty focusing, inconsistency, superficiality"
  },
  cancer: {
    core: ['nurturing', 'sensitive', 'intuitive', 'home-loving', 'protective', 'moody'],
    description: "The tender heart who feels everything deeply. Caring, intuitive, and emotionally rich.",
    strengths: "Emotional intelligence, nurturing nature, strong memory",
    challenges: "Moodiness, clinginess, difficulty with separation"
  },
  leo: {
    core: ['confident', 'creative', 'warm', 'proud', 'dramatic', 'generous'],
    description: "The little star who needs to shine. Expressive, warm-hearted, and naturally magnetic.",
    strengths: "Natural leadership, creativity, warmth and generosity",
    challenges: "Need for attention, pride, sensitivity to criticism"
  },
  virgo: {
    core: ['observant', 'helpful', 'analytical', 'modest', 'careful', 'perfectionist'],
    description: "The little helper who notices every detail. Thoughtful, practical, and conscientious.",
    strengths: "Attention to detail, desire to help, analytical thinking",
    challenges: "Worry, perfectionism, difficulty relaxing"
  },
  libra: {
    core: ['charming', 'fair', 'social', 'artistic', 'peaceful', 'indecisive'],
    description: "The little diplomat who wants everyone happy. Sweet, social, and beauty-loving.",
    strengths: "Social grace, artistic sense, ability to see all sides",
    challenges: "Indecision, people-pleasing, avoiding conflict"
  },
  scorpio: {
    core: ['intense', 'perceptive', 'determined', 'loyal', 'private', 'passionate'],
    description: "The little detective who sees beneath surfaces. Deep, powerful, and emotionally intense.",
    strengths: "Emotional depth, determination, loyalty",
    challenges: "Intensity, jealousy, difficulty letting go"
  },
  sagittarius: {
    core: ['adventurous', 'optimistic', 'honest', 'philosophical', 'restless', 'enthusiastic'],
    description: "The little explorer who seeks meaning and adventure. Joyful, curious, and freedom-loving.",
    strengths: "Optimism, honesty, love of learning",
    challenges: "Restlessness, bluntness, overcommitting"
  },
  capricorn: {
    core: ['responsible', 'ambitious', 'practical', 'mature', 'disciplined', 'reserved'],
    description: "The old soul who takes life seriously. Mature, determined, and achievement-oriented.",
    strengths: "Responsibility, patience, goal-setting",
    challenges: "Pessimism, rigidity, difficulty playing"
  },
  aquarius: {
    core: ['unique', 'inventive', 'humanitarian', 'independent', 'friendly', 'rebellious'],
    description: "The little innovator who marches to their own drum. Original, social, and unconventional.",
    strengths: "Originality, social consciousness, independence",
    challenges: "Detachment, rebelliousness, difficulty with rules"
  },
  pisces: {
    core: ['imaginative', 'compassionate', 'artistic', 'dreamy', 'intuitive', 'gentle'],
    description: "The little dreamer who lives in imagination. Creative, empathetic, and spiritually sensitive.",
    strengths: "Creativity, empathy, spiritual depth",
    challenges: "Escapism, sensitivity, difficulty with boundaries"
  }
};

// Parent-child pairing content
export interface ParentChildInsight {
  hook: string;
  parentQualities: string[];
  whatChildNeeds: string[];
  friction: string[];
  currentPhase: Record<string, string>; // age range -> insight
}

export const getParentChildInsight = (
  parentSun: ZodiacSign, 
  parentMoon: ZodiacSign | null,
  childSun: ZodiacSign,
  childMoon: ZodiacSign | null,
  childName: string
): ParentChildInsight => {
  const parentSunName = getZodiacName(parentSun);
  const parentMoonName = parentMoon ? getZodiacName(parentMoon) : null;
  const childSunName = getZodiacName(childSun);
  
  // Generate personalized content based on combinations
  const baseInsight: ParentChildInsight = {
    hook: `You're not failing ${childName}. You're extremely aligned with their needs.`,
    parentQualities: getParentQualities(parentSun, parentMoon),
    whatChildNeeds: getChildNeeds(childSun, childMoon, childName),
    friction: getFrictionPoints(parentSun, childSun),
    currentPhase: getPhaseInsights(childSun, childMoon, childName)
  };
  
  return baseInsight;
};

const getParentQualities = (sun: ZodiacSign, moon: ZodiacSign | null): string[] => {
  const sunQualities: Record<ZodiacSign, string[]> = {
    aries: ['courage', 'directness', 'energy', 'protection'],
    taurus: ['patience', 'stability', 'sensory awareness', 'consistency'],
    gemini: ['curiosity', 'communication', 'adaptability', 'playfulness'],
    cancer: ['nurturing', 'intuition', 'emotional attunement', 'protection'],
    leo: ['warmth', 'confidence', 'generosity', 'celebration'],
    virgo: ['attention to detail', 'practical care', 'helpfulness', 'organization'],
    libra: ['fairness', 'harmony', 'patience', 'aesthetic sense'],
    scorpio: ['depth', 'intensity', 'loyalty', 'perception'],
    sagittarius: ['optimism', 'adventure', 'honesty', 'philosophical perspective'],
    capricorn: ['structure', 'responsibility', 'patience', 'goal-setting'],
    aquarius: ['independence', 'innovation', 'acceptance', 'uniqueness'],
    pisces: ['empathy', 'imagination', 'gentleness', 'intuition']
  };
  
  const moonQualities: Record<ZodiacSign, string[]> = {
    aries: ['quick responses', 'protective instincts'],
    taurus: ['calm presence', 'physical comfort'],
    gemini: ['verbal processing', 'mental flexibility'],
    cancer: ['deep nurturing', 'emotional safety'],
    leo: ['warm encouragement', 'joyful presence'],
    virgo: ['practical solutions', 'gentle routine'],
    libra: ['peaceful approach', 'balanced responses'],
    scorpio: ['emotional depth', 'fierce protection'],
    sagittarius: ['optimistic outlook', 'growth mindset'],
    capricorn: ['steady reliability', 'mature guidance'],
    aquarius: ['unique perspective', 'accepting nature'],
    pisces: ['emotional nuance', 'intuitive sensing']
  };
  
  const qualities = [...sunQualities[sun]];
  if (moon) {
    qualities.push(...moonQualities[moon]);
  }
  return qualities;
};

const getChildNeeds = (sun: ZodiacSign, moon: ZodiacSign | null, name: string): string[] => {
  const baseNeeds: Record<ZodiacSign, string[]> = {
    aries: ['physical outlet', 'independence', 'direct communication', 'room to lead'],
    taurus: ['consistent routine', 'physical comfort', 'patience', 'sensory experiences'],
    gemini: ['mental stimulation', 'conversation', 'variety', 'social interaction'],
    cancer: ['emotional security', 'closeness', 'familiar routines', 'gentle handling'],
    leo: ['recognition', 'creative expression', 'warmth', 'celebration'],
    virgo: ['gentle structure', 'practical guidance', 'quiet support', 'order'],
    libra: ['harmony', 'fairness', 'beauty', 'companionship'],
    scorpio: ['trust', 'privacy', 'depth', 'loyalty'],
    sagittarius: ['freedom', 'adventure', 'optimism', 'meaning'],
    capricorn: ['respect', 'clear expectations', 'achievement', 'structure'],
    aquarius: ['independence', 'acceptance', 'uniqueness', 'freedom'],
    pisces: ['gentleness', 'imagination', 'emotional safety', 'creative outlet']
  };
  
  return baseNeeds[sun];
};

const getFrictionPoints = (parentSun: ZodiacSign, childSun: ZodiacSign): string[] => {
  // Element-based friction patterns
  const parentElement = getElement(parentSun);
  const childElement = getElement(childSun);
  
  const frictionMap: Record<string, string[]> = {
    'fire-earth': ['Your pace may feel too fast', 'Their stubbornness tests your patience'],
    'fire-water': ['Your directness may overwhelm', 'Their sensitivity needs gentler handling'],
    'earth-fire': ['Their energy exhausts you', 'Your caution feels limiting to them'],
    'earth-air': ['Their restlessness unsettles you', 'Your stability feels boring to them'],
    'air-earth': ['Your ideas seem impractical to them', 'Their slowness frustrates you'],
    'air-water': ['Your logic dismisses their feelings', 'Their emotions overwhelm your thinking'],
    'water-fire': ['Their intensity drains you', 'Your sensitivity seems weak to them'],
    'water-air': ['Their detachment hurts you', 'Your emotions confuse them'],
  };
  
  const key = `${parentElement}-${childElement}`;
  return frictionMap[key] || ['You understand each other naturally', 'Shared approach creates harmony'];
};

const getElement = (sign: ZodiacSign): string => {
  const elements: Record<ZodiacSign, string> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water'
  };
  return elements[sign];
};

const getPhaseInsights = (
  childSun: ZodiacSign, 
  childMoon: ZodiacSign | null, 
  name: string
): Record<string, string> => {
  // Age-specific insights by sun sign
  return {
    '0-6m': `At this stage, ${name}'s ${getZodiacName(childSun)} nature is just emerging. Watch for early signs of their elemental energy.`,
    '6-12m': `As ${name} becomes more mobile, their ${getZodiacName(childSun)} traits become clearer—especially in how they explore.`,
    '12-18m': `${name}'s ${getZodiacName(childSun)} personality is blossoming. This is when you'll really see their sign's energy.`,
    '18-24m': `The toddler stage amplifies ${name}'s ${getZodiacName(childSun)} nature. Big feelings, big expressions.`,
    '2-3y': `${name}'s ${getZodiacName(childSun)} Sun is in full bloom. Language helps them express their sign's qualities.`,
    '3-4y': `Preschool age brings out ${name}'s social ${getZodiacName(childSun)} nature in relationships.`,
    '4-5y': `${name}'s ${getZodiacName(childSun)} confidence is growing. Watch their natural leadership emerge.`
  };
};

// Sun + Moon synthesis
export const getSunMoonSynthesis = (
  sun: ZodiacSign, 
  moon: ZodiacSign | null,
  name: string
): string => {
  if (!moon) {
    return `${name}'s ${getZodiacName(sun)} Sun brings ${SUN_SIGN_CHILD_TRAITS[sun].description.toLowerCase()}`;
  }
  
  const sunElement = getElement(sun);
  const moonElement = getElement(moon);
  
  // Element harmony patterns
  if (sunElement === moonElement) {
    return `${name}'s ${getZodiacName(sun)} Sun and ${getZodiacName(moon)} Moon are in harmony—${sunElement} energy runs consistently through their nature. What you see is what you get emotionally.`;
  }
  
  if ((sunElement === 'fire' && moonElement === 'earth') || (sunElement === 'earth' && moonElement === 'fire')) {
    return `${name}'s ${getZodiacName(sun)} Sun meets their ${getZodiacName(moon)} Moon in an interesting balance—action paired with groundedness. Bold expression, steady core.`;
  }
  
  if ((sunElement === 'fire' && moonElement === 'air') || (sunElement === 'air' && moonElement === 'fire')) {
    return `${name}'s ${getZodiacName(sun)} Sun + ${getZodiacName(moon)} Moon creates high energy and ideas in motion. They think and act in exciting bursts.`;
  }
  
  if ((sunElement === 'earth' && moonElement === 'water') || (sunElement === 'water' && moonElement === 'earth')) {
    return `${name}'s ${getZodiacName(sun)} Sun + ${getZodiacName(moon)} Moon creates a nurturing, grounded child. Deep feelings with practical expression.`;
  }
  
  if ((sunElement === 'air' && moonElement === 'water') || (sunElement === 'water' && moonElement === 'air')) {
    return `${name}'s ${getZodiacName(sun)} Sun + ${getZodiacName(moon)} Moon blends thought and feeling. They process both intellectually and emotionally.`;
  }
  
  return `${name}'s ${getZodiacName(sun)} Sun brings ${SUN_SIGN_CHILD_TRAITS[sun].core.slice(0, 3).join(', ')}, while their ${getZodiacName(moon)} Moon adds ${MOON_SIGN_TRAITS[moon].traits.slice(0, 3).join(', ')}.`;
};

// Age-specific sign insights
export const getAgeSignInsight = (
  sun: ZodiacSign,
  moon: ZodiacSign | null,
  ageMonths: number,
  name: string
): { title: string; content: string; areas: Record<string, string> } => {
  const sunName = getZodiacName(sun);
  const moonName = moon ? getZodiacName(moon) : null;
  
  // Base age-sign patterns
  const signAgePatterns: Record<ZodiacSign, Record<string, { physical: string; sleep: string; feeding: string; emotional: string }>> = {
    aries: {
      '0-6': {
        physical: `${name} is likely hitting physical milestones early—Aries babies are natural movers.`,
        sleep: `Fighting sleep is the Aries way. They resent missing out on action.`,
        feeding: `Enthusiastic but impatient eater. Wants it NOW.`,
        emotional: `Not a sensitive baby emotionally. Quick to cry, quicker to recover.`
      },
      '6-12': {
        physical: `${name} is probably ahead physically—expect early crawling and pulling to stand.`,
        sleep: `Sleep regression hits hard because Aries hates being passive.`,
        feeding: `Wants to self-feed immediately. Let them try—it feeds their autonomy.`,
        emotional: `Big feelings expressed loudly but passes quickly. Don't over-process.`
      },
      '12-24': {
        physical: `Walking means running for Aries. They don't do slow.`,
        sleep: `One nap is easier once they're tired from constant movement.`,
        feeding: `Impatient eater but adventurous with new foods.`,
        emotional: `Tantrums are fierce but short. Stay calm and matter-of-fact.`
      },
      '24-48': {
        physical: `${name} needs constant physical outlet. Climbing, running, rough play.`,
        sleep: `May resist naps as "boring" but still needs quiet time.`,
        feeding: `Opinions are STRONG about food now.`,
        emotional: `Learning to channel that fire. Needs physical outlets for big feelings.`
      }
    },
    taurus: {
      '0-6': {
        physical: `${name} appreciates slow, steady development. Not rushed.`,
        sleep: `May be an easier sleeper if environment is comfortable and consistent.`,
        feeding: `Loves feeding time—it's sensory pleasure.`,
        emotional: `Calm and content as long as basic needs are met.`
      },
      '6-12': {
        physical: `Takes time to master skills but retains them solidly.`,
        sleep: `Creatures of habit—same routine, same order, same outcome.`,
        feeding: `Starting to show food preferences and sticking to them.`,
        emotional: `Slow to anger but watch for stubbornness emerging.`
      },
      '12-24': {
        physical: `${name} may walk later but walks confidently.`,
        sleep: `Disrupted routine = disrupted Taurus. Keep it consistent.`,
        feeding: `May become picky as they assert preferences.`,
        emotional: `Stubbornness is developing. Give warnings before transitions.`
      },
      '24-48': {
        physical: `Enjoys physical comfort over physical challenge.`,
        sleep: `Needs their specific blanket/lovey/routine. Non-negotiable.`,
        feeding: `Very specific preferences. Same foods, same bowls.`,
        emotional: `Security = happiness. Change requires extra patience.`
      }
    },
    gemini: {
      '0-6': {
        physical: `${name} is alert and tracking everything visually.`,
        sleep: `May struggle to wind down—mind is always active.`,
        feeding: `Easily distracted during feeds.`,
        emotional: `Changing moods but easily redirected with novelty.`
      },
      '6-12': {
        physical: `Quick to imitate gestures and sounds.`,
        sleep: `Overstimulation = sleep problems. Wind down is crucial.`,
        feeding: `Interested in variety. Gets bored with same foods.`,
        emotional: `Needs lots of interaction and conversation.`
      },
      '12-24': {
        physical: `${name}'s language will likely explode early.`,
        sleep: `Talks/babbles in bed. May need white noise to settle.`,
        feeding: `Wants to try everything once, commit to nothing.`,
        emotional: `Talks through feelings even before full sentences.`
      },
      '24-48': {
        physical: `Verbal skills outpace emotional maturity.`,
        sleep: `Negotiates bedtime. Has "one more thing" to say.`,
        feeding: `Eating while doing something else. Focus is hard.`,
        emotional: `Can articulate feelings but may not understand them.`
      }
    },
    cancer: {
      '0-6': {
        physical: `${name} is sensitive to environment and atmosphere.`,
        sleep: `Needs to feel completely safe. Proximity helps.`,
        feeding: `Feeding is bonding. May cluster feed for connection.`,
        emotional: `Absorbs caregiver's emotions. Stay calm.`
      },
      '6-12': {
        physical: `May prefer staying close to explore.`,
        sleep: `Separation at bedtime is hardest. Needs gradual transitions.`,
        feeding: `Comfort feeding is real. Food = love.`,
        emotional: `Stranger anxiety may be stronger than average.`
      },
      '12-24': {
        physical: `${name} explores in widening circles, always returning.`,
        sleep: `Needs you nearby even if not touching.`,
        feeding: `Emotional eating patterns starting. Watch for comfort patterns.`,
        emotional: `Clinginess peaks. This is normal and healthy.`
      },
      '24-48': {
        physical: `Still needs home base security for adventures.`,
        sleep: `Same lovey, same routine, same parent. Consistency is love.`,
        feeding: `May refuse food when emotionally upset.`,
        emotional: `Big feelings that need coregulation. Can't self-soothe yet.`
      }
    },
    leo: {
      '0-6': {
        physical: `${name} loves attention and responds to praise.`,
        sleep: `May want to stay up where the action is.`,
        feeding: `Enjoys feeding as quality time with full attention.`,
        emotional: `Already showing personality and charm.`
      },
      '6-12': {
        physical: `Loves performing new skills for applause.`,
        sleep: `FOMO is real. Separation feels like rejection.`,
        feeding: `Dramatic about preferences. Big reactions.`,
        emotional: `Needs lots of positive attention and celebration.`
      },
      '12-24': {
        physical: `${name} wants to show off every new ability.`,
        sleep: `May resist bedtime as missing out on family time.`,
        feeding: `Wants to eat what the family eats. Big kid food.`,
        emotional: `Pride is developing. Handle mistakes gently.`
      },
      '24-48': {
        physical: `Natural leader in play. Wants to be in charge.`,
        sleep: `Needs to feel special at bedtime. Songs, stories, their name.`,
        feeding: `Opinions about food are LOUD.`,
        emotional: `Sensitive to criticism even when disguised.`
      }
    },
    virgo: {
      '0-6': {
        physical: `${name} is observant and notices small details.`,
        sleep: `May be easier to get on schedule if consistent.`,
        feeding: `Sensitive to tastes and textures from early on.`,
        emotional: `Calm and content with order and routine.`
      },
      '6-12': {
        physical: `Careful in movements. Observes before trying.`,
        sleep: `Routine is soothing. Same order, same way.`,
        feeding: `May reject foods based on texture.`,
        emotional: `Worries are starting—comfort the concern.`
      },
      '12-24': {
        physical: `${name} is careful and deliberate in physical play.`,
        sleep: `Needs everything "just right" to settle.`,
        feeding: `Very specific about how food is presented.`,
        emotional: `Can become anxious if things are "wrong."`
      },
      '24-48': {
        physical: `Enjoys sorting, organizing, helping with tasks.`,
        sleep: `Predictable routine is essential.`,
        feeding: `May separate foods, have specific preferences.`,
        emotional: `Perfectionism emerging. Celebrate effort over result.`
      }
    },
    libra: {
      '0-6': {
        physical: `${name} responds to beauty and pleasant environments.`,
        sleep: `May be easier to soothe with music and softness.`,
        feeding: `Peaceful feeders in calm environments.`,
        emotional: `Distressed by conflict or harsh tones.`
      },
      '6-12': {
        physical: `Social and responsive to other people.`,
        sleep: `Wants company while falling asleep.`,
        feeding: `Enjoys social aspect of meals.`,
        emotional: `Already trying to please and get positive responses.`
      },
      '12-24': {
        physical: `${name} is developing social skills early.`,
        sleep: `May resist sleeping alone. Likes companionship.`,
        feeding: `Eats better with company.`,
        emotional: `People-pleasing is developing. Validate their own opinions.`
      },
      '24-48': {
        physical: `Prefers cooperative play to competitive.`,
        sleep: `Needs connection before separation at bedtime.`,
        feeding: `Indecisive about food choices. May need fewer options.`,
        emotional: `Avoids conflict. May hide true feelings.`
      }
    },
    scorpio: {
      '0-6': {
        physical: `${name} has intense eye contact and awareness.`,
        sleep: `All or nothing—deeply asleep or wide awake.`,
        feeding: `Intense focus during feeding.`,
        emotional: `Already shows depth of feeling.`
      },
      '6-12': {
        physical: `Watches everything intently before acting.`,
        sleep: `May have intense sleep disruptions during developmental leaps.`,
        feeding: `Strong preferences forming. Fixed.`,
        emotional: `Attachment is intense. Very bonded.`
      },
      '12-24': {
        physical: `${name} is determined and doesn't give up.`,
        sleep: `Power struggles possible. They have strong will.`,
        feeding: `Once they decide, they don't change minds easily.`,
        emotional: `Intense emotions that run deep. Don't dismiss.`
      },
      '24-48': {
        physical: `Focused and determined on goals.`,
        sleep: `Privacy matters. Needs their own space.`,
        feeding: `Fixed preferences. Very specific.`,
        emotional: `Trust is paramount. Betrayal is not forgotten.`
      }
    },
    sagittarius: {
      '0-6': {
        physical: `${name} is curious and wiggly from the start.`,
        sleep: `May fight swaddles or constraints.`,
        feeding: `Distractible but enthusiastic.`,
        emotional: `Generally cheerful and optimistic.`
      },
      '6-12': {
        physical: `Wants to move and explore constantly.`,
        sleep: `Hates feeling confined or restricted.`,
        feeding: `Open to trying new things.`,
        emotional: `Bounces back quickly from upsets.`
      },
      '12-24': {
        physical: `${name} is on the move constantly. Everywhere.`,
        sleep: `Too much to do to waste time sleeping.`,
        feeding: `Adventurous eater. Curious about everything.`,
        emotional: `Naturally optimistic. Quick to laugh.`
      },
      '24-48': {
        physical: `Needs lots of physical freedom and outdoor time.`,
        sleep: `May resist bedtime as end of adventure.`,
        feeding: `Easily bored with routine meals.`,
        emotional: `Honest to a fault. Working on tact.`
      }
    },
    capricorn: {
      '0-6': {
        physical: `${name} seems old and wise from day one.`,
        sleep: `May respond well to clear routines.`,
        feeding: `Serious about eating. Focused.`,
        emotional: `Reserved but watching everything.`
      },
      '6-12': {
        physical: `Determined to master skills properly.`,
        sleep: `Routine helps them feel secure.`,
        feeding: `May be cautious with new foods.`,
        emotional: `Needs to feel competent. Praise efforts.`
      },
      '12-24': {
        physical: `${name} practices skills until mastered.`,
        sleep: `Clear expectations help them settle.`,
        feeding: `Practical eater. Not picky but not adventurous.`,
        emotional: `Hard on themselves. Needs encouragement.`
      },
      '24-48': {
        physical: `Enjoys tasks with clear completion.`,
        sleep: `Appreciates knowing exactly what comes next.`,
        feeding: `Responsible about eating if given trust.`,
        emotional: `Reserved with feelings. Needs safe space to open up.`
      }
    },
    aquarius: {
      '0-6': {
        physical: `${name} is alert and interested in everything.`,
        sleep: `May have unusual sleep patterns.`,
        feeding: `May prefer less conventional approaches.`,
        emotional: `Observing from a slight distance even as infant.`
      },
      '6-12': {
        physical: `Interested in how things work.`,
        sleep: `Unusual patterns are their normal.`,
        feeding: `Unpredictable preferences.`,
        emotional: `Independent even when small.`
      },
      '12-24': {
        physical: `${name} explores in their own unique way.`,
        sleep: `Don't expect conventional sleep patterns.`,
        feeding: `Will eat what they want, not what you expect.`,
        emotional: `Already showing independence and uniqueness.`
      },
      '24-48': {
        physical: `Inventive in play. Unconventional approaches.`,
        sleep: `May fight routine just because it's routine.`,
        feeding: `Unpredictable. May love something then refuse it.`,
        emotional: `Needs freedom to be themselves. Accept uniqueness.`
      }
    },
    pisces: {
      '0-6': {
        physical: `${name} is dreamy and sensitive to atmosphere.`,
        sleep: `May sleep more than average or very restlessly.`,
        feeding: `Absorbs your energy during feeding.`,
        emotional: `Highly sensitive to environment and emotions.`
      },
      '6-12': {
        physical: `Gentle in movements. Creative exploration.`,
        sleep: `Needs very calm environment to settle.`,
        feeding: `May refuse food when emotionally overwhelmed.`,
        emotional: `Absorbs emotions of everyone around them.`
      },
      '12-24': {
        physical: `${name} may prefer imaginative play to physical.`,
        sleep: `Needs extra gentle transitions.`,
        feeding: `Mood affects appetite significantly.`,
        emotional: `Deeply feeling. Needs lots of emotional support.`
      },
      '24-48': {
        physical: `Creative and imaginative in play.`,
        sleep: `Rich dream life. May need processing time.`,
        feeding: `Sensitive to textures, moods, environment.`,
        emotional: `Boundary-setting is important. They absorb others' feelings.`
      }
    }
  };
  
  let ageKey = '0-6';
  if (ageMonths >= 6 && ageMonths < 12) ageKey = '6-12';
  else if (ageMonths >= 12 && ageMonths < 24) ageKey = '12-24';
  else if (ageMonths >= 24) ageKey = '24-48';
  
  const patterns = signAgePatterns[sun]?.[ageKey] || signAgePatterns.aries[ageKey];
  
  let title = `${sunName} at ${ageMonths < 12 ? `${ageMonths} months` : ageMonths < 24 ? '1 year' : `${Math.floor(ageMonths / 12)} years`}`;
  if (moon) {
    title = `${sunName} Sun + ${getZodiacName(moon)} Moon`;
  }
  
  return {
    title,
    content: `Your ${sunName} ${moon ? `Sun + ${getZodiacName(moon)} Moon` : ''} baby at this stage:`,
    areas: patterns
  };
};
