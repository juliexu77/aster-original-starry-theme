import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "./GlassCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FocusThisMonthProps {
  babyName: string;
  ageInWeeks: number;
  birthday: string;
}

type DomainKey = 'all' | 'sleep' | 'feeding' | 'physical' | 'fine_motor' | 'language' | 'social' | 'cognitive' | 'emotional';

const DOMAIN_OPTIONS: { value: DomainKey; label: string }[] = [
  { value: 'all', label: 'Select…' },
  { value: 'sleep', label: 'SLEEP' },
  { value: 'feeding', label: 'FEEDING' },
  { value: 'physical', label: 'PHYSICAL' },
  { value: 'fine_motor', label: 'FINE MOTOR' },
  { value: 'language', label: 'LANGUAGE' },
  { value: 'social', label: 'SOCIAL' },
  { value: 'cognitive', label: 'COGNITIVE' },
  { value: 'emotional', label: 'EMOTIONAL' },
];

// Get approximate age in months from weeks
const getAgeInMonths = (ageInWeeks: number): number => {
  return Math.floor(ageInWeeks / 4.33);
};

// All domains synthesis content by age
const getAllDomainsContent = (ageInMonths: number, babyName: string): { summary: string; bullets: string[] } => {
  if (ageInMonths < 3) {
    return {
      summary: `At ${ageInMonths || 1} months, ${babyName} is building foundational connections. Expect lots of feeding (Stage 1), frequent sleep cycles (Stage 1), and the emergence of social smiles (Stage 1). This is a period of rapid brain development through simple interactions.`,
      bullets: [
        "Respond to cries promptly to build security",
        "Make eye contact and talk during feeds",
        "Don't worry about 'schedules' yet - follow baby's lead",
        "Tummy time builds strength for future milestones"
      ]
    };
  }
  if (ageInMonths < 5) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is becoming more interactive and alert. Sleep may consolidate into longer stretches (Stage 2), and you'll see more intentional reaching and batting at objects (Stage 2). Social engagement is blossoming with laughter and vocal play.`,
      bullets: [
        "Longer wake windows mean more playtime",
        "Introduce rattles and soft toys to grasp",
        "Respond to babbling with conversation",
        "Sleep patterns are improving but still evolving"
      ]
    };
  }
  if (ageInMonths < 7) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is entering a major developmental period. Starting solids (Stage 2) coincides with sitting independently (Stage 3) - these skills support each other. Stranger awareness is emerging as cognitive abilities grow.`,
      bullets: [
        "Sitting up enables self-feeding exploration",
        "Let baby explore food textures - it's messy but important",
        "New wariness of strangers is normal and healthy",
        "Sleep may temporarily regress as new skills emerge"
      ]
    };
  }
  if (ageInMonths < 9) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is experiencing a significant cognitive leap. Object permanence (Stage 3) changes everything - causing sleep regression (Stage 3) and separation anxiety (Stage 3), but enabling new play and problem-solving skills.`,
      bullets: [
        "Sleep disruptions are caused by brain growth, not regression",
        "Practice peek-a-boo to reinforce object permanence",
        "Stay consistent with routines during this unsettled period",
        "Finger foods (Stage 3) support developing pincer grasp (Stage 5)"
      ]
    };
  }
  if (ageInMonths < 11) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is increasingly mobile and independent. Pulling to stand (Stage 5) and cruising (Stage 6) create new perspectives. Sleep often stabilizes into two predictable naps (Stage 4). Self-feeding with finger foods becomes more intentional.`,
      bullets: [
        "Childproof as mobility increases dramatically",
        "Two-nap schedule provides rhythm to the day",
        "Encourage standing and cruising but let baby lead",
        "More confident self-feeding means more food intake"
      ]
    };
  }
  if (ageInMonths < 14) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is transitioning to toddlerhood. First words with meaning (Stage 4) emerge as language explodes. Walking may begin (Stage 7). Table foods (Stage 4) replace purees as baby joins family meals more fully.`,
      bullets: [
        "Language comprehension far exceeds expression",
        "Support wobbly walking without pressure",
        "Include baby in family mealtimes",
        "Attachment behaviors peak - stay close during transitions"
      ]
    };
  }
  if (ageInMonths < 17) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is asserting independence while still needing security. One nap transition (Stage 5) can make days unpredictable. Walking becomes confident. Self-feeding with utensils emerges (Stage 5). Word explosion begins.`,
      bullets: [
        "Nap transition creates temporary schedule chaos",
        "More mobility means more bumps and falls - stay calm",
        "Let toddler practice utensils even if messy",
        "Name everything to support vocabulary growth"
      ]
    };
  }
  if (ageInMonths < 20) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is a busy toddler with strong opinions. One predictable afternoon nap (Stage 6) provides structure. Two-word phrases (Stage 6) begin. Picky eating phase (Stage 6) can be frustrating but is developmentally normal.`,
      bullets: [
        "Consistent nap schedule supports nighttime sleep",
        "Food pickiness is about control, not actual preferences",
        "Two-word phrases show language is connecting",
        "Parallel play is normal - interactive play comes later"
      ]
    };
  }
  if (ageInMonths < 27) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is rapidly developing language and social skills. Simple sentences (Stage 7) enable better communication. Picky phase (Stage 6) may continue. Play becomes more imaginative. Emotional expression is big and dramatic.`,
      bullets: [
        "Language reduces frustration tantrums",
        "Don't engage in food battles during picky phase",
        "Imaginative play shows cognitive growth",
        "Big emotions need co-regulation, not punishment"
      ]
    };
  }
  if (ageInMonths < 33) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is developing self-awareness and independence. Language skills (Stage 7) are exploding. One nap (Stage 6) is well-established. Interactive play (Stage 8) with peers is emerging. Self-regulation is improving but still developing.`,
      bullets: [
        "More verbal ability doesn't equal emotional maturity",
        "Consistent boundaries help with big feelings",
        "Encourage peer interactions but stay nearby",
        "Let child make simple choices to build autonomy"
      ]
    };
  }
  if (ageInMonths < 40) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is becoming more independent and social. Nap may be dropping (Stage 7) which affects mood. Complex sentences (Stage 8) allow real conversations. Cooperative play (Stage 9) with other children begins. Self-regulation improves.`,
      bullets: [
        "Some days need nap, some don't - stay flexible",
        "Verbal skills don't mean emotional maturity",
        "Friendships are forming - support social skills",
        "Expanding palate (Stage 7) as pickiness often lessens"
      ]
    };
  }
  if (ageInMonths < 46) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is developing complex social and cognitive skills. Most children transitioning away from naps (Stage 7). Language is sophisticated (Stage 8). Cooperative play (Stage 9) and problem-solving (Stage 8) are strong. Emotional awareness deepening.`,
      bullets: [
        "Quiet time replaces nap on most days",
        "'Why' questions show active learning",
        "Can negotiate and compromise with peers",
        "Enjoys helping with household tasks"
      ]
    };
  }
  if (ageInMonths < 52) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is preschool-ready with developed language, social skills, and self-regulation. Most children done napping (Stage 8). Clear speech and complex grammar (Stage 9). Friendships deepen (Stage 10). Independent eating (Stage 8).`,
      bullets: [
        "Quiet rest time replaces nap",
        "'Why' questions show cognitive leaps",
        "Can manage conflicts with peers (with guidance)",
        "Helps with meal prep and cleanup"
      ]
    };
  }
  if (ageInMonths < 58) {
    return {
      summary: `At ${ageInMonths} months, ${babyName} is mastering preschool skills and preparing for kindergarten. No napping (Stage 8). Conversational language (Stage 9). Strong friendships (Stage 10). Pre-academic skills (Stage 9) emerging. Complex emotions (Stage 9) well-expressed.`,
      bullets: [
        "Consistent bedtime routine without nap",
        "Enjoys storytelling and complex conversations",
        "Friendships become very important",
        "Shows interest in letters, numbers, writing"
      ]
    };
  }
  // 5+ years
  return {
    summary: `At ${ageInMonths} months, ${babyName} is kindergarten-ready with strong skills across all domains. Sleep is consistent without naps (Stage 8). Language is clear and sophisticated (Stage 9). Deep friendships (Stage 10). Pre-academic skills (Stage 9) developed. Emotional regulation strong (Stage 9).`,
    bullets: [
      "Reads bedtime stories together",
      "Vocabulary supports academic learning",
      "Navigates social situations independently",
      "Shows pride in accomplishments and new skills"
    ]
  };
};

// Domain-specific stage data
const getDomainStageData = (domain: DomainKey, ageInMonths: number): { 
  stageName: string; 
  stageNumber: number; 
  description: string;
  whatsHappening: string;
  whatsNext: string;
  tips: string[];
} => {
  // Sleep stages
  if (domain === 'sleep') {
    if (ageInMonths < 3) return {
      stageName: "Newborn Sleep",
      stageNumber: 1,
      description: "Sleeps 14-17 hours in short bursts, wakes every 2-3 hours to feed, day/night confusion is normal.",
      whatsHappening: "Your baby is learning to adjust to life outside the womb. Sleep comes in short cycles with frequent wakings for feeding. Day and night may feel reversed.",
      whatsNext: "Stage 2: Longer Stretches (3-6 months) - Sleep will begin to consolidate with longer stretches at night.",
      tips: ["Follow baby's cues rather than a strict schedule", "Keep nighttime interactions calm and dark", "Expect frequent night wakings - this is normal"]
    };
    if (ageInMonths < 6) return {
      stageName: "Longer Stretches",
      stageNumber: 2,
      description: "Consolidating nighttime sleep, may sleep 6-8 hour stretches, 3-4 naps during day.",
      whatsHappening: "Night sleep is becoming more organized with longer stretches. Daytime naps are still frequent but may start to follow a pattern.",
      whatsNext: "Stage 3: Sleep Regression (6-10 months) - Developmental leaps may temporarily disrupt sleep patterns.",
      tips: ["Establish consistent bedtime routine", "Watch for sleepy cues to avoid overtiredness", "3-4 naps is still normal at this age"]
    };
    if (ageInMonths < 10) return {
      stageName: "Sleep Regression",
      stageNumber: 3,
      description: "Object permanence and separation anxiety disrupt sleep, wakes more frequently, 2-3 naps.",
      whatsHappening: "Brain development is affecting sleep. Your baby now knows you exist when you leave - this can make sleep harder.",
      whatsNext: "Stage 4: Two Naps (10-15 months) - Sleep will stabilize into more predictable patterns.",
      tips: ["Maintain consistent routines even when sleep is hard", "Respond calmly to night wakings", "Practice separation during the day with peek-a-boo"]
    };
    if (ageInMonths < 15) return {
      stageName: "Two Naps",
      stageNumber: 4,
      description: "Drops to two predictable naps (morning and afternoon), sleeps 10-12 hours at night.",
      whatsHappening: "Sleep is becoming more predictable with a morning and afternoon nap. Nighttime sleep is longer and more consolidated.",
      whatsNext: "Stage 5: One Nap Transition (15-18 months) - The morning nap will gradually phase out.",
      tips: ["Aim for naps around 9:30am and 2pm", "Keep wake windows around 3-3.5 hours", "Consistent schedule helps mood and sleep"]
    };
    if (ageInMonths < 18) return {
      stageName: "One Nap Transition",
      stageNumber: 5,
      description: "Transitioning from two naps to one afternoon nap, schedule can be erratic during shift.",
      whatsHappening: "The transition from two naps to one can take weeks. Some days need two naps, some only one.",
      whatsNext: "Stage 6: One Nap (18-36 months) - A consistent afternoon nap will emerge.",
      tips: ["Be flexible during the transition", "Earlier bedtime can help on one-nap days", "Don't force the transition - follow cues"]
    };
    if (ageInMonths < 36) return {
      stageName: "One Nap",
      stageNumber: 6,
      description: "Consistent single afternoon nap (1-3 hours), sleeps 10-12 hours at night.",
      whatsHappening: "One afternoon nap is well-established, usually after lunch. Nighttime sleep is consistent.",
      whatsNext: "Stage 7: Dropping Nap (3-4 years) - Some days may not need a nap anymore.",
      tips: ["Nap around 12:30-1pm works well", "Keep nap to 2-3 hours to protect nighttime", "Consistent routine is key"]
    };
    if (ageInMonths < 48) return {
      stageName: "Dropping Nap",
      stageNumber: 7,
      description: "Some days nap, some days don't, may need quiet time instead.",
      whatsHappening: "Naps are becoming inconsistent. Some days need one, others just need quiet rest time.",
      whatsNext: "Stage 8: No Nap (4-5 years) - Naps will phase out completely.",
      tips: ["Offer quiet time even without sleep", "Earlier bedtime on no-nap days", "Watch for overtired signs in late afternoon"]
    };
    return {
      stageName: "No Nap",
      stageNumber: 8,
      description: "Most children done napping, quiet rest time instead, sleeps 10-12 hours at night.",
      whatsHappening: "Naps are a thing of the past. Quiet time provides needed rest during the day.",
      whatsNext: "Sleep needs will continue to decrease gradually as your child grows.",
      tips: ["Maintain quiet time for rest", "Consistent bedtime routine remains important", "10-12 hours overnight is still needed"]
    };
  }

  // Feeding stages
  if (domain === 'feeding') {
    if (ageInMonths < 6) return {
      stageName: "Exclusive Milk",
      stageNumber: 1,
      description: "Breast milk or formula only, feeding every 2-4 hours, establishing rhythm.",
      whatsHappening: "All nutrition comes from milk. Feeding cues are developing and a rhythm is emerging.",
      whatsNext: "Stage 2: Starting Solids (6-9 months) - Introduction to first foods begins.",
      tips: ["Feed on demand following baby's cues", "Watch for hunger and fullness signs", "Milk is all baby needs right now"]
    };
    if (ageInMonths < 9) return {
      stageName: "Starting Solids",
      stageNumber: 2,
      description: "Introduction to purees and soft foods, exploring textures and tastes, milk still primary nutrition.",
      whatsHappening: "First foods are being explored. This is about taste and texture exposure, not nutrition.",
      whatsNext: "Stage 3: Finger Foods (9-12 months) - Self-feeding will begin.",
      tips: ["Start with single-ingredient purees", "Introduce new foods every 3-4 days", "Let baby explore - mess is learning"]
    };
    if (ageInMonths < 12) return {
      stageName: "Finger Foods",
      stageNumber: 3,
      description: "Self-feeding with hands, pincer grasp for small pieces, three meals plus milk feeds.",
      whatsHappening: "Baby is learning to self-feed with soft finger foods. Pincer grasp is developing.",
      whatsNext: "Stage 4: Table Foods (12-18 months) - Family meals become central.",
      tips: ["Offer soft foods cut into small pieces", "Expect mess - it's part of learning", "Supervise closely but let baby lead"]
    };
    if (ageInMonths < 18) return {
      stageName: "Table Foods",
      stageNumber: 4,
      description: "Eating modified family meals, using utensils with help, transitioning from bottles.",
      whatsHappening: "Baby is eating what the family eats with modifications. Bottles are phasing out.",
      whatsNext: "Stage 5: Self-Feeding (18-24 months) - Independent eating skills develop.",
      tips: ["Include baby in family meals", "Offer utensils even if clumsy", "Transition away from bottles to cups"]
    };
    if (ageInMonths < 24) return {
      stageName: "Self-Feeding",
      stageNumber: 5,
      description: "Uses spoon and fork independently, drinks from open cup, asserting food preferences.",
      whatsHappening: "Toddler is feeding themselves with increasing skill. Preferences are emerging.",
      whatsNext: "Stage 6: Picky Phase (24-36 months) - Food preferences may narrow.",
      tips: ["Let toddler practice utensils", "Offer open cup regularly", "Expect some food throwing"]
    };
    if (ageInMonths < 36) return {
      stageName: "Picky Phase",
      stageNumber: 6,
      description: "Common pickiness or food jags, may refuse previously liked foods, learning about hunger cues.",
      whatsHappening: "Pickiness is developmentally normal. Child is learning about control and preferences.",
      whatsNext: "Stage 7: Expanding Palate (3-4 years) - Adventurous eating returns.",
      tips: ["Don't engage in food battles", "Keep offering variety without pressure", "Division of responsibility: you provide, they decide"]
    };
    if (ageInMonths < 48) return {
      stageName: "Expanding Palate",
      stageNumber: 7,
      description: "Trying new foods more willingly, eating larger portions, developing food preferences.",
      whatsHappening: "Adventurous eating is returning. Child is more willing to try new things.",
      whatsNext: "Stage 8: Independent Eater (4-5 years) - Full independence with eating.",
      tips: ["Encourage trying new foods", "Involve child in meal planning", "Model healthy eating behaviors"]
    };
    return {
      stageName: "Independent Eater",
      stageNumber: 8,
      description: "Eats variety of foods, manages utensils well, can pour drinks, helps with meal prep.",
      whatsHappening: "Child is an independent eater with good table manners and varied diet.",
      whatsNext: "Eating habits continue to develop as your child grows.",
      tips: ["Include child in cooking", "Family meals remain important", "Continue offering variety"]
    };
  }

  // Physical stages
  if (domain === 'physical') {
    if (ageInMonths < 2) return {
      stageName: "Early Reflexes",
      stageNumber: 1,
      description: "Involuntary movements, head bobbing, reflexive grasping.",
      whatsHappening: "Movements are mostly reflexive. Head control is just beginning.",
      whatsNext: "Stage 2: Head Control - Strengthening neck muscles.",
      tips: ["Tummy time builds strength", "Support head during holds", "Let baby stretch freely"]
    };
    if (ageInMonths < 4) return {
      stageName: "Head Control",
      stageNumber: 2,
      description: "Lifting head during tummy time, steadier neck control.",
      whatsHappening: "Head and neck are getting stronger. Tummy time is paying off.",
      whatsNext: "Stage 3: Rolling - Mobility begins.",
      tips: ["Continue tummy time daily", "Practice in different positions", "Celebrate head lifting"]
    };
    if (ageInMonths < 6) return {
      stageName: "Rolling",
      stageNumber: 3,
      description: "Rolling front to back and back to front.",
      whatsHappening: "Baby is becoming mobile through rolling. Never leave unattended on surfaces.",
      whatsNext: "Stage 4: Sitting - Core strength develops.",
      tips: ["Always supervise on elevated surfaces", "Give floor time to practice", "Both directions may not happen at once"]
    };
    if (ageInMonths < 8) return {
      stageName: "Sitting",
      stageNumber: 4,
      description: "Sitting independently without support.",
      whatsHappening: "Core strength allows independent sitting. Hands are free to play.",
      whatsNext: "Stage 5: Pulling to Stand - Vertical world awaits.",
      tips: ["Surround with pillows at first", "Sitting opens new play options", "Core strength is building"]
    };
    if (ageInMonths < 10) return {
      stageName: "Pulling to Stand",
      stageNumber: 5,
      description: "Pulling up on furniture to standing position.",
      whatsHappening: "Baby is working toward standing. Furniture and legs become pull-up bars.",
      whatsNext: "Stage 6: Cruising - Moving while holding on.",
      tips: ["Secure furniture that could tip", "Let baby practice falling safely", "Standing builds leg strength"]
    };
    if (ageInMonths < 12) return {
      stageName: "Cruising",
      stageNumber: 6,
      description: "Walking while holding onto furniture or walls.",
      whatsHappening: "Baby is moving around the room while holding on. Walking is close.",
      whatsNext: "Stage 7: First Steps - Independent walking begins.",
      tips: ["Create safe cruising paths", "Encourage with toys just out of reach", "Falls are part of learning"]
    };
    if (ageInMonths < 18) return {
      stageName: "First Steps",
      stageNumber: 7,
      description: "Taking independent steps, wobbly walking.",
      whatsHappening: "Walking is happening! Balance is still developing so expect falls.",
      whatsNext: "Stage 8: Walking Confidently - Steady on their feet.",
      tips: ["Barefoot is best indoors", "Let them walk, don't carry everywhere", "Celebrate falls as learning"]
    };
    return {
      stageName: "Walking Confidently",
      stageNumber: 8,
      description: "Walking, running, and climbing with confidence.",
      whatsHappening: "Your child is steady on their feet and ready to run and climb.",
      whatsNext: "Continued development of coordination and athletic skills.",
      tips: ["Encourage outdoor play", "Running and climbing are normal", "Provide safe spaces to explore"]
    };
  }

  // Fine motor stages
  if (domain === 'fine_motor') {
    if (ageInMonths < 2) return {
      stageName: "Reflexive Grasp",
      stageNumber: 1,
      description: "Involuntary gripping reflex when palm is touched.",
      whatsHappening: "Grasp is reflexive, not intentional. Hands are often fisted.",
      whatsNext: "Stage 2: Batting - Intentional arm movement begins.",
      tips: ["Touch baby's palms to feel grasp", "This reflex is normal", "Hands will open more over time"]
    };
    if (ageInMonths < 4) return {
      stageName: "Batting",
      stageNumber: 2,
      description: "Swiping at objects, beginning hand-eye coordination.",
      whatsHappening: "Baby is starting to swipe at things intentionally. Hand-eye coordination is developing.",
      whatsNext: "Stage 3: Reaching - Deliberate reaching for objects.",
      tips: ["Hang toys within reach", "Play gyms are great now", "Encourage reaching"]
    };
    if (ageInMonths < 6) return {
      stageName: "Reaching",
      stageNumber: 3,
      description: "Deliberately reaching for and grasping objects.",
      whatsHappening: "Baby can reach for and grab objects intentionally.",
      whatsNext: "Stage 4: Raking Grasp - Whole hand grabbing develops.",
      tips: ["Offer objects to reach for", "Let baby explore with hands", "Vary textures of toys"]
    };
    if (ageInMonths < 8) return {
      stageName: "Raking Grasp",
      stageNumber: 4,
      description: "Using whole hand to pull objects toward self.",
      whatsHappening: "Baby rakes objects toward themselves with the whole hand.",
      whatsNext: "Stage 5: Pincer Grasp - Thumb and finger precision.",
      tips: ["Offer larger objects to grasp", "Let baby practice picking up", "Explore different textures"]
    };
    if (ageInMonths < 12) return {
      stageName: "Pincer Grasp",
      stageNumber: 5,
      description: "Picking up small objects with thumb and forefinger.",
      whatsHappening: "Baby can pick up small items with precision. Watch for choking hazards!",
      whatsNext: "Stage 6: Pointing - Communication through gesture.",
      tips: ["Offer small safe items to pick up", "Finger foods help practice", "Supervise closely around small objects"]
    };
    if (ageInMonths < 15) return {
      stageName: "Pointing",
      stageNumber: 6,
      description: "Using index finger to point at objects of interest.",
      whatsHappening: "Pointing emerges as communication. Baby shows you what interests them.",
      whatsNext: "Stage 7: Stacking - Building and problem-solving.",
      tips: ["Follow baby's points with your attention", "Name what they point to", "This is early communication"]
    };
    if (ageInMonths < 24) return {
      stageName: "Stacking",
      stageNumber: 7,
      description: "Building with blocks, stacking objects.",
      whatsHappening: "Stacking and building shows planning and coordination.",
      whatsNext: "Stage 8: Drawing - Pre-writing skills develop.",
      tips: ["Offer blocks and stacking toys", "Celebrate building and falling", "This builds problem-solving"]
    };
    return {
      stageName: "Drawing",
      stageNumber: 8,
      description: "Scribbling, drawing shapes, pre-writing skills.",
      whatsHappening: "Scribbling evolves toward recognizable shapes and letters.",
      whatsNext: "Writing skills will continue to develop.",
      tips: ["Provide crayons and paper", "Thick crayons are easier to hold", "Display artwork proudly"]
    };
  }

  // Language stages
  if (domain === 'language') {
    if (ageInMonths < 2) return {
      stageName: "Crying",
      stageNumber: 1,
      description: "Primary communication through different cries.",
      whatsHappening: "Crying communicates needs. Different cries mean different things.",
      whatsNext: "Stage 2: Cooing - Vowel sounds emerge.",
      tips: ["Respond to cries promptly", "Learn to distinguish cry types", "Talk to baby constantly"]
    };
    if (ageInMonths < 4) return {
      stageName: "Cooing",
      stageNumber: 2,
      description: "Vowel sounds like 'ooh' and 'aah'.",
      whatsHappening: "Baby is experimenting with voice. Coos and vowel sounds emerge.",
      whatsNext: "Stage 3: Babbling - Consonant sounds join in.",
      tips: ["Coo back to baby", "Have 'conversations'", "Respond enthusiastically to sounds"]
    };
    if (ageInMonths < 9) return {
      stageName: "Babbling",
      stageNumber: 3,
      description: "Consonant sounds, repetitive syllables like 'bababa'.",
      whatsHappening: "Babbling includes consonants. Repetitive syllables are practice for words.",
      whatsNext: "Stage 4: First Words - Meaningful words appear.",
      tips: ["Babble back", "Narrate your day", "Read books together"]
    };
    if (ageInMonths < 15) return {
      stageName: "First Words",
      stageNumber: 4,
      description: "A few words with meaning, like 'mama' and 'dada'.",
      whatsHappening: "First real words emerge with meaning. Understanding exceeds speaking.",
      whatsNext: "Stage 5: Word Explosion - Vocabulary grows rapidly.",
      tips: ["Celebrate all attempts at words", "Name everything", "Read, read, read"]
    };
    if (ageInMonths < 20) return {
      stageName: "Word Explosion",
      stageNumber: 5,
      description: "Rapid vocabulary growth, learning many new words.",
      whatsHappening: "Words are coming fast. Vocabulary is exploding.",
      whatsNext: "Stage 6: Two-Word Phrases - Combining words begins.",
      tips: ["Keep naming everything", "Expand on what child says", "Songs and rhymes help"]
    };
    if (ageInMonths < 30) return {
      stageName: "Two-Word Phrases",
      stageNumber: 6,
      description: "Combining words into simple phrases.",
      whatsHappening: "Two words are being combined: 'more milk', 'daddy go'.",
      whatsNext: "Stage 7: Simple Sentences - Grammar emerges.",
      tips: ["Model full sentences", "Expand their phrases", "Ask open-ended questions"]
    };
    if (ageInMonths < 42) return {
      stageName: "Simple Sentences",
      stageNumber: 7,
      description: "3-4 word sentences, basic grammar.",
      whatsHappening: "Sentences are forming with basic grammar. Communication is easier.",
      whatsNext: "Stage 8: Complex Language - Full conversations possible.",
      tips: ["Have real conversations", "Answer 'why' questions patiently", "Read longer stories"]
    };
    return {
      stageName: "Complex Language",
      stageNumber: 8,
      description: "Full sentences, complex grammar, storytelling.",
      whatsHappening: "Language is sophisticated with complex sentences and storytelling ability.",
      whatsNext: "Language will continue to become more nuanced and complex.",
      tips: ["Discuss abstract concepts", "Encourage storytelling", "Model rich vocabulary"]
    };
  }

  // Social stages
  if (domain === 'social') {
    if (ageInMonths < 2) return {
      stageName: "Social Smile",
      stageNumber: 1,
      description: "First intentional smiles in response to faces.",
      whatsHappening: "Baby smiles in response to your face. Social connection is forming.",
      whatsNext: "Stage 2: Eye Contact - Sustained attention to faces.",
      tips: ["Smile back enthusiastically", "Face-to-face time is crucial", "Talk while making eye contact"]
    };
    if (ageInMonths < 4) return {
      stageName: "Eye Contact",
      stageNumber: 2,
      description: "Sustained looking at faces and following movement.",
      whatsHappening: "Baby holds your gaze and follows your face with their eyes.",
      whatsNext: "Stage 3: Laughing - Social joy emerges.",
      tips: ["Hold baby close for eye contact", "Move slowly for tracking", "Make funny faces"]
    };
    if (ageInMonths < 6) return {
      stageName: "Laughing",
      stageNumber: 3,
      description: "Laughing in response to play and interaction.",
      whatsHappening: "Laughter shows baby finds things genuinely funny. Play is social.",
      whatsNext: "Stage 4: Attachment Behaviors - Clear preferences form.",
      tips: ["Find what makes baby laugh", "Repeat silly games", "Enjoy this joyful stage"]
    };
    if (ageInMonths < 9) return {
      stageName: "Attachment Behaviors",
      stageNumber: 4,
      description: "Clear preference for familiar caregivers, stranger wariness.",
      whatsHappening: "Baby clearly prefers familiar people and may be wary of strangers.",
      whatsNext: "Stage 5: Separation Anxiety - Strong reactions to separation.",
      tips: ["Stranger wariness is healthy", "Stay close when meeting new people", "Attachment is secure"]
    };
    if (ageInMonths < 12) return {
      stageName: "Separation Anxiety",
      stageNumber: 5,
      description: "Distress when primary caregiver leaves.",
      whatsHappening: "Separation causes real distress. Baby knows you exist when you leave.",
      whatsNext: "Stage 6: Parallel Play - Playing alongside others.",
      tips: ["Brief, confident goodbyes", "Always say goodbye, don't sneak away", "Return when you say you will"]
    };
    if (ageInMonths < 24) return {
      stageName: "Parallel Play",
      stageNumber: 6,
      description: "Playing alongside other children without direct interaction.",
      whatsHappening: "Child plays near other children but not truly with them. This is normal.",
      whatsNext: "Stage 7: Emerging Cooperation - First interactions with peers.",
      tips: ["Provide opportunities to be near other children", "Don't force sharing yet", "Parallel play is developmentally appropriate"]
    };
    if (ageInMonths < 36) return {
      stageName: "Emerging Cooperation",
      stageNumber: 7,
      description: "Beginning to play with others, simple turn-taking.",
      whatsHappening: "First true interactions with peers. Turn-taking and simple games emerge.",
      whatsNext: "Stage 8: Cooperative Play - True social play develops.",
      tips: ["Practice turn-taking", "Guide conflict resolution", "Stay nearby during play"]
    };
    return {
      stageName: "Cooperative Play",
      stageNumber: 8,
      description: "Playing together, sharing, negotiating, friendships forming.",
      whatsHappening: "True friendships form. Child can share, negotiate, and play cooperatively.",
      whatsNext: "Social skills will continue to deepen and mature.",
      tips: ["Support budding friendships", "Teach conflict resolution", "Model social skills"]
    };
  }

  // Cognitive stages
  if (domain === 'cognitive') {
    if (ageInMonths < 2) return {
      stageName: "Sensory Awareness",
      stageNumber: 1,
      description: "Learning through basic senses, focusing on faces.",
      whatsHappening: "Baby learns through senses. Faces and high-contrast patterns are most interesting.",
      whatsNext: "Stage 2: Tracking - Following objects with eyes.",
      tips: ["Show high-contrast images", "Hold baby 8-12 inches from face", "Talk during interactions"]
    };
    if (ageInMonths < 4) return {
      stageName: "Tracking",
      stageNumber: 2,
      description: "Following objects with eyes, turning toward sounds.",
      whatsHappening: "Baby can track moving objects and turn toward sounds.",
      whatsNext: "Stage 3: Object Permanence - Understanding things exist when hidden.",
      tips: ["Move toys slowly for tracking", "Make sounds from different directions", "Colorful toys catch attention"]
    };
    if (ageInMonths < 8) return {
      stageName: "Object Permanence",
      stageNumber: 3,
      description: "Understanding that objects exist when out of sight.",
      whatsHappening: "Baby learns that things (and people) still exist when not visible. Big cognitive leap!",
      whatsNext: "Stage 4: Cause and Effect - Understanding actions have results.",
      tips: ["Play peek-a-boo constantly", "Hide toys under blankets", "This causes separation anxiety"]
    };
    if (ageInMonths < 12) return {
      stageName: "Cause and Effect",
      stageNumber: 4,
      description: "Understanding actions produce results, like pressing buttons.",
      whatsHappening: "Baby learns that their actions cause things to happen. They repeat to test.",
      whatsNext: "Stage 5: Problem Solving - Figuring out simple challenges.",
      tips: ["Toys with buttons and sounds are perfect", "Let baby experiment", "Repeat actions to learn"]
    };
    if (ageInMonths < 18) return {
      stageName: "Problem Solving",
      stageNumber: 5,
      description: "Figuring out simple problems, like getting a toy from a container.",
      whatsHappening: "Baby can solve simple problems through trial and error.",
      whatsNext: "Stage 6: Symbolic Thinking - Using one thing to represent another.",
      tips: ["Offer age-appropriate puzzles", "Let baby work through frustration", "Celebrate problem-solving"]
    };
    if (ageInMonths < 30) return {
      stageName: "Symbolic Thinking",
      stageNumber: 6,
      description: "Using objects to represent other things in pretend play.",
      whatsHappening: "A block becomes a phone. A box becomes a car. Imagination is developing.",
      whatsNext: "Stage 7: Categorizing - Sorting and grouping objects.",
      tips: ["Encourage pretend play", "Provide open-ended toys", "Join in imaginary scenarios"]
    };
    if (ageInMonths < 42) return {
      stageName: "Categorizing",
      stageNumber: 7,
      description: "Sorting objects by color, shape, size; understanding groups.",
      whatsHappening: "Child can sort and categorize objects by different attributes.",
      whatsNext: "Stage 8: Logical Reasoning - Following rules and patterns.",
      tips: ["Sorting games are great", "Name categories while playing", "Ask 'what goes together?'"]
    };
    return {
      stageName: "Logical Reasoning",
      stageNumber: 8,
      description: "Understanding rules, patterns, and simple logic.",
      whatsHappening: "Child understands rules, patterns, and can follow logical sequences.",
      whatsNext: "Abstract thinking will continue to develop.",
      tips: ["Play pattern games", "Explain reasons for rules", "Encourage questioning"]
    };
  }

  // Emotional stages
  if (domain === 'emotional') {
    if (ageInMonths < 2) return {
      stageName: "Basic States",
      stageNumber: 1,
      description: "Content vs. distress states, building regulation through caregiving.",
      whatsHappening: "Baby experiences comfort and distress. Your response teaches regulation.",
      whatsNext: "Stage 2: Social Referencing - Looking to you for emotional cues.",
      tips: ["Respond to distress promptly", "Your calm regulates baby", "Comfort is building trust"]
    };
    if (ageInMonths < 6) return {
      stageName: "Social Referencing",
      stageNumber: 2,
      description: "Looking to caregivers for emotional cues about situations.",
      whatsHappening: "Baby looks to you to know if something is safe or scary.",
      whatsNext: "Stage 3: Separation Awareness - Strong feelings about caregiver leaving.",
      tips: ["Your reaction guides baby's response", "Stay calm in new situations", "Model emotional responses"]
    };
    if (ageInMonths < 12) return {
      stageName: "Separation Awareness",
      stageNumber: 3,
      description: "Strong emotional reactions to separation from primary caregivers.",
      whatsHappening: "Separation causes real emotional distress. Attachment is strong.",
      whatsNext: "Stage 4: Emerging Independence - Beginning to tolerate separation.",
      tips: ["Brief, confident goodbyes", "Return when you say you will", "Separation feelings are healthy"]
    };
    if (ageInMonths < 18) return {
      stageName: "Emerging Independence",
      stageNumber: 4,
      description: "Beginning to tolerate brief separations, exploring with secure base.",
      whatsHappening: "Brief separations are tolerated better. Baby explores but checks back.",
      whatsNext: "Stage 5: Big Feelings - Intense emotions with limited regulation.",
      tips: ["Be a secure base to return to", "Encourage exploration", "Celebrate independence"]
    };
    if (ageInMonths < 30) return {
      stageName: "Big Feelings",
      stageNumber: 5,
      description: "Intense emotions with limited self-regulation, tantrums common.",
      whatsHappening: "Emotions are huge but regulation skills are small. Tantrums are normal.",
      whatsNext: "Stage 6: Naming Feelings - Learning emotional vocabulary.",
      tips: ["Stay calm during tantrums", "Co-regulate by staying present", "Big feelings need big support"]
    };
    if (ageInMonths < 42) return {
      stageName: "Naming Feelings",
      stageNumber: 6,
      description: "Learning to identify and name different emotions.",
      whatsHappening: "Child can name feelings: happy, sad, mad, scared. Understanding grows.",
      whatsNext: "Stage 7: Empathy Emerging - Caring about others' feelings.",
      tips: ["Name feelings for them", "Read books about emotions", "Validate all feelings"]
    };
    if (ageInMonths < 54) return {
      stageName: "Empathy Emerging",
      stageNumber: 7,
      description: "Beginning to understand and care about others' feelings.",
      whatsHappening: "Child notices when others are sad and may try to comfort them.",
      whatsNext: "Stage 8: Self-Regulation - Managing emotions independently.",
      tips: ["Point out others' feelings", "Praise caring behaviors", "Model empathy"]
    };
    return {
      stageName: "Self-Regulation",
      stageNumber: 8,
      description: "Developing ability to manage and express emotions appropriately.",
      whatsHappening: "Child can often calm themselves and express feelings appropriately.",
      whatsNext: "Emotional intelligence will continue to mature.",
      tips: ["Teach coping strategies", "Praise regulation attempts", "Still need help sometimes"]
    };
  }

  // Default fallback
  return {
    stageName: "Developing",
    stageNumber: 1,
    description: "Development in progress.",
    whatsHappening: "Your child is developing at their own pace.",
    whatsNext: "New skills will emerge soon.",
    tips: ["Follow your child's lead", "Every child develops differently", "Trust the process"]
  };
};

const DOMAIN_LABELS: Record<DomainKey, string> = {
  all: "All Domains",
  sleep: "Sleep",
  feeding: "Feeding",
  physical: "Physical",
  fine_motor: "Fine Motor",
  language: "Language",
  social: "Social",
  cognitive: "Cognitive",
  emotional: "Emotional"
};

export const FocusThisMonth = ({ babyName, ageInWeeks, birthday }: FocusThisMonthProps) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>(() => {
    // Try to restore from session storage
    const saved = sessionStorage.getItem('focusDomainSelection');
    return (saved as DomainKey) || 'all';
  });

  const ageInMonths = getAgeInMonths(ageInWeeks);

  // Save selection to session storage
  useEffect(() => {
    sessionStorage.setItem('focusDomainSelection', selectedDomain);
  }, [selectedDomain]);

  const renderAllDomainsContent = () => {
    const content = getAllDomainsContent(ageInMonths, babyName);
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          {content.summary}
        </p>
        <ul className="space-y-2">
          {content.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <span className="text-primary mt-0.5">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderDomainContent = (domain: DomainKey) => {
    const data = getDomainStageData(domain, ageInMonths);
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {DOMAIN_LABELS[domain]} - Stage {data.stageNumber}: {data.stageName}
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {data.description}
          </p>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What's happening
          </h5>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {data.whatsHappening}
          </p>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            What's next
          </h5>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {data.whatsNext}
          </p>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            How to support
          </h5>
          <ul className="space-y-1.5">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="text-primary mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <GlassCard className="mx-5">
      <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Focus this month
        </p>
        <Select
          value={selectedDomain}
          onValueChange={(value) => setSelectedDomain(value as DomainKey)}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs bg-card border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOMAIN_OPTIONS.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-4">
        {selectedDomain === 'all' 
          ? renderAllDomainsContent() 
          : renderDomainContent(selectedDomain)
        }
      </div>
    </GlassCard>
  );
};
