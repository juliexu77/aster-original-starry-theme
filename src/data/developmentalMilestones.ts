// Developmental milestones data: Weeks 0-16, Months 4-12
// Warm pediatrician tone + CDC Development + TCB Feel + Tribal Knowledge

export interface MilestoneSet {
  emergingSkills: string[];
  communication: string[];
  playCuriosity: string[];
  tribalTip?: string;
  reminder?: string;
}

export const weeklyMilestones: Record<number, MilestoneSet> = {
  0: {
    emergingSkills: [
      "Adjusting to new light, sound, and touch",
      "Movements are mostly reflexive",
      "Sleep fills most of the day"
    ],
    communication: [
      "Crying is their main language",
      "Many babies settle with skin contact, gentle rocking, or your voice"
    ],
    playCuriosity: [
      "During brief alert moments, may focus on high-contrast shapes",
      "Your face held close captures attention"
    ],
    reminder: "There is no expected rhythm yet. All patterns are normal at this stage."
  },
  1: {
    emergingSkills: [
      "Tiny head lifts may appear",
      "Movements begin feeling a bit smoother"
    ],
    communication: [
      "Recognizes your voice",
      "May pause or quiet briefly when hearing it"
    ],
    playCuriosity: [
      "Faces and slow movement capture attention best"
    ],
    tribalTip: "Newborns see best at 8–12 inches, roughly the distance to your face while holding them.",
    reminder: "Everything still changes day to day."
  },
  2: {
    emergingSkills: [
      "Sucking has more rhythm",
      "Hands may open more often and move toward center"
    ],
    communication: [
      "Cries begin to sound slightly different for different needs"
    ],
    playCuriosity: [
      "May study your face for longer stretches"
    ],
    tribalTip: "Hand-to-mouth movements help babies feel organized and calm.",
    reminder: "Short awake windows are expected."
  },
  3: {
    emergingSkills: [
      "Head lifting during tummy time strengthens",
      "Muscles feel slightly firmer"
    ],
    communication: [
      "Soft coos may appear",
      "Beginning to react to your tone of voice"
    ],
    playCuriosity: [
      "May follow gentle motion or light shifts across the room"
    ],
    tribalTip: "Many parents notice sounds like 'neh' for hunger and 'eh' for a burp.",
    reminder: "All skill appearance varies widely."
  },
  4: {
    emergingSkills: [
      "Head and neck control improve",
      "Arm and leg movements look more intentional"
    ],
    communication: [
      "Social smiles often appear around now",
      "Timing is very individual"
    ],
    playCuriosity: [
      "May track slow movement more steadily",
      "Beginning to notice simple colors"
    ],
    tribalTip: "A sleepy cry can begin with an 'owh' sound, shaped by a wide open mouth.",
    reminder: "Smiles can appear anytime between 4 and 8 weeks."
  },
  5: {
    emergingSkills: [
      "Upper body strength grows",
      "Often bringing hands toward center of chest"
    ],
    communication: [
      "More vocal sounds appear",
      "Seeking comfort through your presence"
    ],
    playCuriosity: [
      "Tracking moving objects becomes more reliable"
    ],
    tribalTip: "Bicycle legs can help relieve gas by supporting digestion.",
    reminder: "Awake windows are still short but feel more meaningful."
  },
  6: {
    emergingSkills: [
      "Movements feel more purposeful",
      "Many babies start batting at toys"
    ],
    communication: [
      "Smiles become more consistent",
      "Eye contact grows richer"
    ],
    playCuriosity: [
      "May look closely at your expressions",
      "Reacts with delight"
    ],
    tribalTip: "A gentle 'heh' sound can appear when babies feel mildly uncomfortable.",
    reminder: "Growth spurts can change sleep or feeding temporarily."
  },
  7: {
    emergingSkills: [
      "Head control increases",
      "Tummy time strength continues improving"
    ],
    communication: [
      "More cooing and early playful noises",
      "Enjoys short social games"
    ],
    playCuriosity: [
      "Hands become interesting objects to study",
      "May watch them move"
    ],
    tribalTip: "Parents often get better at distinguishing hunger, burping, and tired cries.",
    reminder: "Daily rhythms still shift easily."
  },
  8: {
    emergingSkills: [
      "Reaching becomes smoother",
      "Some babies begin early rolling motions"
    ],
    communication: [
      "Vocal play and eye contact deepen"
    ],
    playCuriosity: [
      "Color vision sharpens",
      "Beginning to notice brighter hues and textures"
    ],
    tribalTip: "Cry cues remain helpful but don't need to be perfect. Understanding grows naturally.",
    reminder: "Rolling may appear anytime between 3 and 6 months."
  },
  9: {
    emergingSkills: [
      "Hands often reach the mouth intentionally",
      "Tummy time sessions become stronger"
    ],
    communication: [
      "May create longer strings of coos and squeals"
    ],
    playCuriosity: [
      "Swatting, early grabbing, and following moving toys",
      "More coordinated movements"
    ],
    tribalTip: "A hungry cry may still begin with a 'neh' while a burp cry starts with an 'eh'.",
    reminder: "Variability is still very normal."
  },
  10: {
    emergingSkills: [
      "Some babies roll from tummy to back",
      "Head control strengthens"
    ],
    communication: [
      "May watch your expressions closely",
      "Attempting simple sound imitation"
    ],
    playCuriosity: [
      "Reaching and grabbing look more intentional"
    ],
    tribalTip: "Cry patterns begin blending as babies become more expressive.",
    reminder: "Sleep often shifts around this time."
  },
  11: {
    emergingSkills: [
      "Reaching becomes more accurate",
      "Torso strength increases"
    ],
    communication: [
      "Vocal play expands",
      "Shows excitement during social exchanges"
    ],
    playCuriosity: [
      "Beginning to observe cause-and-effect",
      "Noticing when they make a toy move"
    ],
    tribalTip: "Babies love watching your mouth as you talk. This helps them learn early language patterns.",
    reminder: "Skill timelines vary widely."
  },
  12: {
    emergingSkills: [
      "Rolling attempts increase",
      "Many babies push up strongly on forearms"
    ],
    communication: [
      "Laughter often appears",
      "Social play becomes livelier"
    ],
    playCuriosity: [
      "Toy study becomes more detailed",
      "Turning and tapping objects"
    ],
    tribalTip: "Babies this age enjoy seeing you smile and hearing a warm, sing-song voice.",
    reminder: "All of this can unfold over several weeks."
  },
  13: {
    emergingSkills: [
      "May bear more weight on legs when supported",
      "Head control is strong"
    ],
    communication: [
      "Vocal sounds grow more varied",
      "Recognizes familiar voices quickly"
    ],
    playCuriosity: [
      "Interest in simple actions like tapping or shaking toys increases"
    ],
    tribalTip: "Babies love gentle repetition. Doing the same play pattern a few times helps their brain process it.",
    reminder: "Each baby follows a unique path."
  },
  14: {
    emergingSkills: [
      "Rolling may become more fluid",
      "Some show early interest in sitting with support"
    ],
    communication: [
      "Back-and-forth interactions become more fun",
      "More expressive exchanges"
    ],
    playCuriosity: [
      "Reaching becomes more deliberate",
      "May explore a favorite toy repeatedly"
    ],
    tribalTip: "Babies often enjoy seeing the same object in different orientations. This builds visual understanding.",
    reminder: "Attention spans continue to grow slowly."
  },
  15: {
    emergingSkills: [
      "Push-ups become stronger",
      "Pivoting in tummy time may appear"
    ],
    communication: [
      "Babbling begins to resemble early conversation rhythms"
    ],
    playCuriosity: [
      "May grab, turn, and mouth objects to study them"
    ],
    tribalTip: "Mouthing is a key way babies learn about texture and shape.",
    reminder: "Sleep and feeding shifts sometimes accompany new skills."
  },
  16: {
    emergingSkills: [
      "Some show interest in supported sitting",
      "Rolling may be more consistent"
    ],
    communication: [
      "Babbling becomes more complex",
      "Shows enthusiasm when interacting with familiar people"
    ],
    playCuriosity: [
      "Toy exploration includes shaking, tapping, and studying small details"
    ],
    tribalTip: "Babies may enjoy peekaboo-like interactions, which support early social awareness.",
    reminder: "There is a wide range of normal progression here."
  }
};

// Monthly milestones (4-24 months)
export const monthlyMilestones: Record<number, MilestoneSet> = {
  4: {
    emergingSkills: [
      "Head control is strong",
      "Many babies begin rolling",
      "Hands reach for toys with more intention"
    ],
    communication: [
      "Smiles and giggles become frequent",
      "Turns toward voices and studies your face for comfort"
    ],
    playCuriosity: [
      "Toy exploration grows richer",
      "Beginning to notice more colors and follow movement smoothly"
    ],
    tribalTip: "Repetition helps learning. Babies enjoy seeing the same small action several times.",
    reminder: "Rolling occurs at very different ages."
  },
  5: {
    emergingSkills: [
      "Supported sitting becomes steadier",
      "Grasping and reaching continue improving"
    ],
    communication: [
      "Babbling begins to take shape",
      "Recognizes familiar people with excitement"
    ],
    playCuriosity: [
      "Exploration includes shaking, dropping, and twisting toys"
    ],
    tribalTip: "Hand-chewing often peaks now as babies explore their bodies and soothe themselves.",
    reminder: "Readiness for solids varies and unfolds gradually."
  },
  6: {
    emergingSkills: [
      "Many babies sit with support",
      "Early crawling motions appear",
      "Hand-to-hand transfers look smooth"
    ],
    communication: [
      "Babbling expands",
      "Responds to their name more consistently"
    ],
    playCuriosity: [
      "Interest in cause-and-effect grows",
      "Studies objects closely and explores new textures"
    ],
    tribalTip: "Offering a chance to explore safe textures supports early feeding skills.",
    reminder: "Mobility emerges on a broad timeline."
  },
  7: {
    emergingSkills: [
      "Sitting becomes steadier with small pivots",
      "Early crawling motions can appear"
    ],
    communication: [
      "Babble strings lengthen",
      "Shows clear delight when seeing familiar faces"
    ],
    playCuriosity: [
      "Toy study becomes detailed",
      "Passes items between hands and explores texture more deeply"
    ],
    tribalTip: "Distraction during feeding is common because the world is becoming more interesting.",
    reminder: "Each baby moves into mobility in their own time."
  },
  8: {
    emergingSkills: [
      "Crawling or scooting may begin",
      "Some babies pull to their knees or show early standing interest"
    ],
    communication: [
      "Babbling feels more expressive",
      "Shared social games become more enjoyable"
    ],
    playCuriosity: [
      "Starts looking for objects that fall out of sight",
      "A sign of early object permanence"
    ],
    tribalTip: "Babies love copying simple motions like clapping or tapping.",
    reminder: "New skills often arrive in small bursts."
  },
  9: {
    emergingSkills: [
      "Crawling grows more confident",
      "Many babies pull to stand and may begin cruising"
    ],
    communication: [
      "Babbling begins to resemble early conversation",
      "Responds to simple phrases and gestures"
    ],
    playCuriosity: [
      "Peekaboo becomes more meaningful",
      "Enjoys copying simple actions and sounds"
    ],
    tribalTip: "Repetition builds understanding. Babies may request the same game again and again.",
    reminder: "Standing and cruising vary widely."
  },
  10: {
    emergingSkills: [
      "Standing with support is common",
      "Cruising along furniture may begin"
    ],
    communication: [
      "Uses a wider variety of sounds",
      "May try simple gestures like waving"
    ],
    playCuriosity: [
      "Interest in exploring drawers, lids, and containers increases"
    ],
    tribalTip: "Babies enjoy putting objects in and taking them out of simple containers.",
    reminder: "Skill progression is highly individual."
  },
  11: {
    emergingSkills: [
      "Cruising becomes more confident",
      "Some babies begin attempting a step or two"
    ],
    communication: [
      "Early words or clear word-like sounds may appear",
      "Understands simple instructions"
    ],
    playCuriosity: [
      "Fine motor development grows",
      "May use a pincer grasp to pick up small items"
    ],
    tribalTip: "Babies this age enjoy play that mirrors daily life, such as pretending to brush hair or hold a cup.",
    reminder: "Walking emerges at many different ages."
  },
  12: {
    emergingSkills: [
      "Many babies pull to stand easily and cruise with confidence",
      "Some take their first independent steps",
      "Movements look more coordinated and purposeful"
    ],
    communication: [
      "A few early words or word-like sounds may appear",
      "Understands far more than they can say",
      "Simple gestures like pointing or waving become clear"
    ],
    playCuriosity: [
      "Exploration becomes intentional",
      "Enjoys opening, closing, stacking, and studying how objects work"
    ],
    tribalTip: "Narrating daily routines helps language blossom. For example, 'We are putting on your socks.'",
    reminder: "Walking anytime between 9 and 18 months is typical."
  },
  13: {
    emergingSkills: [
      "Walking may begin or grow steadier",
      "Crawlers may still use crawling as their fastest method"
    ],
    communication: [
      "Often uses pointing to show interest",
      "May bring you objects to share a moment"
    ],
    playCuriosity: [
      "Enjoys dropping items into containers",
      "Then taking them out repeatedly"
    ],
    tribalTip: "Repetition builds understanding and is not a sign of boredom.",
    reminder: "Some babies are quiet observers and take their time with new actions."
  },
  14: {
    emergingSkills: [
      "Walking becomes more confident",
      "May experiment with squatting to pick up a toy"
    ],
    communication: [
      "More varied babble patterns that resemble conversation",
      "Understands simple questions like 'Where is the ball?'"
    ],
    playCuriosity: [
      "Enjoys large movements like pushing a toy cart",
      "Or carrying a soft object"
    ],
    tribalTip: "Carrying objects while walking helps balance and coordination.",
    reminder: "There is a wide range in early walking and talking."
  },
  15: {
    emergingSkills: [
      "Climbing interest increases",
      "May step over small obstacles or attempt to get onto low surfaces"
    ],
    communication: [
      "Many babies use a few clear words and gestures to express needs"
    ],
    playCuriosity: [
      "Simple pretend play may begin",
      "Such as holding a phone to the ear"
    ],
    tribalTip: "Pretend play signals early imagination. It grows slowly and naturally.",
    reminder: "Speech develops unevenly. Understanding always comes first."
  },
  16: {
    emergingSkills: [
      "Walking may look smoother with quick stops and turns",
      "May start to run in a short burst"
    ],
    communication: [
      "Gestures and early words combine",
      "Such as pointing while vocalizing"
    ],
    playCuriosity: [
      "Enjoys trying to copy adult actions",
      "Like wiping a table or brushing hair"
    ],
    tribalTip: "They love participating in simple tasks and often feel proud when included.",
    reminder: "Speech ranges are very broad at this age."
  },
  17: {
    emergingSkills: [
      "Climbing becomes more adventurous",
      "May step backward or sideways with intention"
    ],
    communication: [
      "More expressive babbles",
      "Early two-word attempts may appear"
    ],
    playCuriosity: [
      "Enjoys matching lids to containers",
      "Placing shapes into openings, even if not perfectly"
    ],
    tribalTip: "Offering two simple choices helps babies feel understood without pressure.",
    reminder: "Not all babies use many words yet and that is normal."
  },
  18: {
    emergingSkills: [
      "Running becomes more coordinated",
      "Many babies try to kick a ball or walk while carrying objects"
    ],
    communication: [
      "Vocabulary often expands",
      "May point to body parts or familiar pictures on request"
    ],
    playCuriosity: [
      "Pretend play grows",
      "Such as feeding a stuffed animal"
    ],
    tribalTip: "This is a peak age for imitation. Babies copy what they see throughout the day.",
    reminder: "There is a large range in expressive language at this age."
  },
  19: {
    emergingSkills: [
      "Balance improves",
      "May attempt walking up steps with support"
    ],
    communication: [
      "More consistent words may appear",
      "Early problem solving like pointing and vocalizing to ask for help"
    ],
    playCuriosity: [
      "Enjoys exploring how objects fit together"
    ],
    tribalTip: "Naming feelings simply, like 'You feel frustrated,' supports early emotional understanding.",
    reminder: "Understanding always outpaces speech."
  },
  20: {
    emergingSkills: [
      "Running is more confident",
      "May attempt climbing onto furniture independently"
    ],
    communication: [
      "Two-word combinations often begin",
      "Responds to simple instructions with ease"
    ],
    playCuriosity: [
      "Enjoys sorting objects by color or type",
      "Even in their own way"
    ],
    tribalTip: "Children this age love gentle routines and may repeat them for comfort.",
    reminder: "Some babies build vocabulary slowly at first and then progress quickly."
  },
  21: {
    emergingSkills: [
      "Movement becomes coordinated enough for gentle kicking or tossing"
    ],
    communication: [
      "May name familiar objects or people more consistently"
    ],
    playCuriosity: [
      "Simple problem solving appears",
      "Like moving an object to reach something else"
    ],
    tribalTip: "Offering time for your child to try something before helping builds confidence.",
    reminder: "Pacing varies. Some children focus on motor skills first, others on language."
  },
  22: {
    emergingSkills: [
      "Running, climbing, and squatting look more fluid",
      "Some toddlers begin attempting to jump with both feet"
    ],
    communication: [
      "Sentence-like speech may begin forming",
      "Two to three word combinations"
    ],
    playCuriosity: [
      "Imaginative play becomes richer",
      "Early scenarios like pretending to cook or clean"
    ],
    tribalTip: "Toddlers learn deeply through imitation of daily life activities.",
    reminder: "Expression varies widely between children."
  },
  23: {
    emergingSkills: [
      "Coordination improves",
      "May enjoy navigating uneven surfaces or steps with less help"
    ],
    communication: [
      "Understands simple instructions",
      "May express preferences with words or gestures"
    ],
    playCuriosity: [
      "Enjoys early role play",
      "Such as caring for dolls or stuffed animals"
    ],
    tribalTip: "Parallel play is common. Toddlers play near other children before playing with them.",
    reminder: "There is no single timeline for imaginative play."
  },
  24: {
    emergingSkills: [
      "Jumping, kicking, and climbing grow more coordinated",
      "Many toddlers run with better balance"
    ],
    communication: [
      "Vocabulary often grows rapidly",
      "Begins forming simple sentences like 'want more water'"
    ],
    playCuriosity: [
      "Pretend play becomes more layered",
      "May start simple make-believe scenarios"
    ],
    tribalTip: "Naming new experiences as they happen supports language growth.",
    reminder: "Toddlers between 18 and 30 months can follow very different timelines while still being completely typical."
  }
};

export const getMilestonesForAge = (ageInWeeks: number): MilestoneSet | null => {
  // For weeks 0-16, use weekly milestones
  if (ageInWeeks <= 16) {
    return weeklyMilestones[ageInWeeks] || weeklyMilestones[Math.min(ageInWeeks, 16)];
  }
  
  // For older babies, convert to months and use monthly milestones
  const ageInMonths = Math.floor(ageInWeeks / 4.33);
  if (monthlyMilestones[ageInMonths]) {
    return monthlyMilestones[ageInMonths];
  }
  
  // Cap at 24 months if older
  if (ageInMonths > 24) {
    return monthlyMilestones[24];
  }
  
  // Return the latest weekly milestone if no monthly data
  return weeklyMilestones[16];
};
