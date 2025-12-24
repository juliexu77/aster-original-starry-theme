import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, Circle, Minus } from "lucide-react";
import { DomainData, getStagesForDomain } from "./DevelopmentTable";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface DomainDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: DomainData | null | undefined;
  ageInWeeks: number;
  birthday?: string;
  allDomains: DomainData[];
  onNavigate: (domainId: string) => void;
}

// Get zodiac sign for astrological flavor
const getZodiacSign = (birthday?: string): string => {
  if (!birthday) return "Aries";
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Astrological flavor text by domain and sign (2-3 sentences)
const getAstroFlavor = (domainId: string, sign: string): string => {
  const flavors: Record<string, Record<string, string>> = {
    physical: {
      Aries: "Aries energy brings bold, fearless movement. Your little one dives into new physical skills without hesitation, often surprising you with their daring. They lead with action and learn by doing.",
      Taurus: "Taurus energy creates a steady, deliberate mover. Your child builds physical skills with patience, preferring to master each step before moving forward. Consistency is their superpower.",
      Gemini: "Gemini energy drives curious physical exploration. Your baby tries many movements and experiments constantly, rarely sitting still. Their body is always discovering something new.",
      Cancer: "Cancer energy brings cautious but determined movement. Your child gains physical confidence through familiar routines and the security of your presence. Comfort leads to courage.",
      Leo: "Leo energy creates a confident physical performer. Your little one loves showing off new skills and thrives on your applause. They move with natural confidence and flair.",
      Virgo: "Virgo energy produces precise, methodical movement. Your child practices physical skills with focus until they're perfected. Quality matters more than speed to them.",
      Libra: "Libra energy brings grace and balance to movement. Your baby seeks coordination and harmony in all physical activities. They move with natural elegance.",
      Scorpio: "Scorpio energy creates intense physical determination. Your child focuses deeply on mastering challenges and doesn't give up easily. Their persistence is remarkable.",
      Sagittarius: "Sagittarius energy drives adventurous physical exploration. Your little one is always ready to run, jump, and discover. The world is their playground.",
      Capricorn: "Capricorn energy produces a determined, goal-oriented mover. Your child works steadily toward physical milestones with quiet persistence. They climb mountains one step at a time.",
      Aquarius: "Aquarius energy brings unique approaches to movement. Your baby often surprises you with unconventional physical skills. They do things their own way.",
      Pisces: "Pisces energy creates fluid, intuitive movement. Your child moves with natural rhythm and grace, almost dancing through their milestones. Their body follows their imagination.",
    },
    fine_motor: {
      Aries: "Aries energy brings eager, enthusiastic hands. Your little one grabs, builds, and manipulates with gusto. Patience for detailed work grows with time.",
      Taurus: "Taurus energy creates patient, sensory-focused hands. Your child enjoys the textures and materials of detailed tasks. They take their time and do it right.",
      Gemini: "Gemini energy produces quick, curious fingers. Puzzles, buttons, and anything interactive captivate your baby. Their hands are always busy exploring.",
      Cancer: "Cancer energy brings gentle, attached touch. Your child often bonds with comfort objects and specific textures. Their hands seek familiar, soothing things.",
      Leo: "Leo energy creates proud, creative hands. Your little one loves making and showing their creations. Art and building bring great joy.",
      Virgo: "Virgo energy produces precise, careful manipulation. Your child excels at detailed tasks and notices small differences. Precision comes naturally.",
      Libra: "Libra energy draws hands to beautiful things. Drawing, arranging, and creating aesthetically pleasing work appeals to your baby. They have an artistic eye.",
      Scorpio: "Scorpio energy brings intense focus to hand skills. Your child masters complex manipulations through determined practice. They don't give up until it's right.",
      Sagittarius: "Sagittarius energy prefers big movements to fine details. Your little one may rush through detailed tasks to get to the big picture. Patience develops with time.",
      Capricorn: "Capricorn energy produces determined, tool-focused hands. Your child wants to master utensils and tools properly. They practice until they get it.",
      Aquarius: "Aquarius energy creates inventive, creative hands. Your baby uses their hands in unexpected, original ways. They're natural innovators.",
      Pisces: "Pisces energy brings artistic, imaginative touch. Your child's fine motor activities often become creative expressions. Their hands follow their dreams.",
    },
    language: {
      Aries: "Aries energy produces confident, direct communication. Your little one speaks up boldly and is often first to try new words. They say what they mean.",
      Taurus: "Taurus energy creates thoughtful, purposeful speech. Your child may take time before speaking but communicates with clarity. Words are chosen carefully.",
      Gemini: "Gemini energy makes natural talkers. Your baby is often an early speaker with lots to say about everything. Conversations flow easily.",
      Cancer: "Cancer energy brings emotionally expressive language. Your child loves familiar songs, stories, and sharing feelings. Words carry emotional weight.",
      Leo: "Leo energy creates dramatic, audience-focused speech. Your little one loves having listeners for their words. Storytelling is a natural gift.",
      Virgo: "Virgo energy produces precise, articulate language. Your child chooses words carefully and often speaks accurately early. Details matter in their speech.",
      Libra: "Libra energy brings charming social language. Your baby learns conversational skills quickly and communicates with natural grace. They know how to connect.",
      Scorpio: "Scorpio energy creates meaningful, weighted speech. Your child may be quieter, but their words carry significance. They speak with purpose.",
      Sagittarius: "Sagittarius energy produces enthusiastic, curious language. Your little one loves asking questions and telling stories. Learning is verbal adventure.",
      Capricorn: "Capricorn energy brings purposeful, action-oriented speech. Your child may prefer doing to talking. Words are practical tools.",
      Aquarius: "Aquarius energy creates unique, original expression. Your baby has their own vocabulary and way of saying things. Their words surprise you.",
      Pisces: "Pisces energy produces imaginative, poetic language. Your child expresses themselves with emotional depth. Words carry feeling and fantasy.",
    },
    social: {
      Aries: "Aries energy creates natural leaders in play. Your little one initiates interactions with confidence and energy. They bring others into their adventures.",
      Taurus: "Taurus energy produces loyal, selective socializers. Your child prefers small groups and familiar playmates. Deep bonds over wide circles.",
      Gemini: "Gemini energy makes social butterflies. Your baby connects easily with many different children. Friendships form quickly everywhere.",
      Cancer: "Cancer energy brings deep attachment and shy warmth. Your child may hold back at first but becomes nurturing with close friends. Trust builds slowly.",
      Leo: "Leo energy loves social attention. Your little one thrives at the center of groups and gives generously to friends. They light up the room.",
      Virgo: "Virgo energy creates helpful, observant friends. Your child notices what others need and often helps. They're thoughtful companions.",
      Libra: "Libra energy produces natural peacemakers. Your baby seeks harmony in all relationships and distresses at conflict. Balance matters to them.",
      Scorpio: "Scorpio energy creates intense, loyal bonds. Your child forms deep connections with chosen friends. Their loyalty runs deep.",
      Sagittarius: "Sagittarius energy brings friendly, open sociability. Your little one gets along with everyone and makes any gathering more fun. Joy is contagious.",
      Capricorn: "Capricorn energy produces reliable, serious friends. Your child takes friendships seriously and can be counted on. Quality over quantity.",
      Aquarius: "Aquarius energy creates friendly but independent socializers. Your baby is warm with all but maintains their unique style. They march to their own drum.",
      Pisces: "Pisces energy brings empathetic, sensitive connection. Your child feels what others feel and responds with kindness. Compassion comes naturally.",
    },
    cognitive: {
      Aries: "Aries energy produces quick, independent learners. Your little one loves figuring things out themselves. Discovery is an adventure.",
      Taurus: "Taurus energy creates hands-on, repetitive learners. Your child absorbs through practice and sensory experience. Learning is tangible.",
      Gemini: "Gemini energy brings curious, quick-jumping minds. Your baby absorbs information rapidly and moves between interests. Curiosity drives everything.",
      Cancer: "Cancer energy produces strong emotional memory. Your child remembers experiences that touched their heart. Feelings anchor learning.",
      Leo: "Leo energy creates confident learners. Your little one enjoys being recognized for their intelligence. Pride motivates growth.",
      Virgo: "Virgo energy produces analytical, detail-focused minds. Your child notices what others miss. Precision in thinking comes naturally.",
      Libra: "Libra energy learns through comparison and relationship. Your baby understands by seeing connections between things. Everything relates.",
      Scorpio: "Scorpio energy creates deep, persistent thinkers. Your child loves mysteries and puzzles, diving deep into problems. Surface answers don't satisfy.",
      Sagittarius: "Sagittarius energy produces big-picture thinkers. Your little one wants to understand the wider world. Why questions never stop.",
      Capricorn: "Capricorn energy builds knowledge systematically. Your child learns step by step, building solid foundations. Progress is steady.",
      Aquarius: "Aquarius energy creates original, inventive thinkers. Your baby has unique perspectives and ideas. Their thoughts surprise you.",
      Pisces: "Pisces energy learns intuitively through imagination. Your child absorbs information almost magically. Learning flows like dreams.",
    },
    emotional: {
      Aries: "Aries energy produces quick, passing emotions. Your little one feels intensely but recovers fast. Storms pass quickly.",
      Taurus: "Taurus energy creates steady but stubborn feelings. Your child maintains emotional equilibrium but can dig in when upset. Patience helps.",
      Gemini: "Gemini energy brings changeable, distractible moods. Your baby's emotions shift quickly, and redirection works well. Flexibility helps.",
      Cancer: "Cancer energy produces deep, lasting feelings. Your child needs lots of emotional connection and comfort. Security is everything.",
      Leo: "Leo energy creates big, visible emotions. Your little one's feelings need to be seen and validated. Acknowledgment heals.",
      Virgo: "Virgo energy may produce worry and sensitivity. Your child benefits from reassurance and predictable routines. Order calms anxiety.",
      Libra: "Libra energy seeks emotional balance. Your baby is upset by conflict and unfairness. Harmony soothes.",
      Scorpio: "Scorpio energy creates intense, private emotions. Your child feels everything deeply but may not show it. Create safe space.",
      Sagittarius: "Sagittarius energy produces optimistic resilience. Your little one bounces back from disappointments. Hope springs eternal.",
      Capricorn: "Capricorn energy may hold emotions in. Your child needs safe space to express feelings. Quiet support helps.",
      Aquarius: "Aquarius energy processes feelings differently. Your baby may seem emotionally independent. Respect their unique style.",
      Pisces: "Pisces energy creates highly sensitive emotions. Your child absorbs feelings from the environment. Calm spaces help.",
    },
    sleep: {
      Aries: "Aries energy: Resists winding down, fights sleep like it's a challenge to conquer. Once asleep, sleeps deeply until ready to charge into the day.",
      Taurus: "Taurus energy: Creature of comfort who loves routine and cozy sleep environments. Once settled into a good schedule, resists change.",
      Gemini: "Gemini energy: Active mind makes winding down difficult. Needs variety in bedtime routines and may have inconsistent sleep patterns.",
      Cancer: "Cancer energy: Sensitive sleeper who needs emotional security and comfort. Thrives on consistent routines and soothing environments.",
      Leo: "Leo energy: Wants attention even at bedtime. Once asleep, rests like royalty and wakes ready to shine.",
      Virgo: "Virgo energy: Benefits from precise routines and ordered sleep environment. May be sensitive to disruptions in schedule.",
      Libra: "Libra energy: Needs balance and harmony for good sleep. May resist extremes - neither overly rigid nor chaotic schedules.",
      Scorpio: "Scorpio energy: Intense about sleep needs. All or nothing - either fights sleep hard or crashes completely.",
      Sagittarius: "Sagittarius energy: Free spirit who resists constraints of sleep schedules. Dreams big and wakes ready for adventure.",
      Capricorn: "Capricorn energy: Appreciates structure and consistent sleep schedules. Once routine is established, maintains it reliably.",
      Aquarius: "Aquarius energy: Unique sleep patterns that may not match the books. Independent sleeper who does things their own way.",
      Pisces: "Pisces energy: Dreamy sleeper who needs gentle transitions and soothing bedtime rituals. May be sensitive to environment and emotions.",
    },
    feeding: {
      Aries: "Aries energy: Enthusiastic eater who dives into new foods fearlessly. May eat quickly and messily, always ready for the next adventure.",
      Taurus: "Taurus energy: Sensory-oriented eater who savors textures and flavors. May be particular about preferences but enjoys quality foods.",
      Gemini: "Gemini energy: Curious taster who wants variety. May be easily distracted during meals and prefer grazing to structured eating.",
      Cancer: "Cancer energy: Comfort-oriented eater who associates food with security and love. Prefers familiar foods and family meal times.",
      Leo: "Leo energy: Enjoys the performance of eating and wants attention during meals. May be dramatic about likes and dislikes.",
      Virgo: "Virgo energy: Particular about food textures and presentation. May have clear preferences and notices details others miss.",
      Libra: "Libra energy: Social eater who enjoys company during meals. May be influenced by others' food choices and preferences.",
      Scorpio: "Scorpio energy: Intense relationship with food. Either loves or refuses things - no middle ground. Deeply commits to favorites.",
      Sagittarius: "Sagittarius energy: Adventurous eater willing to try anything once. May eat enthusiastically but lose interest in routine foods.",
      Capricorn: "Capricorn energy: Steady, reliable eater who appreciates routine meal times. May be cautious with new foods but eventually accepts them.",
      Aquarius: "Aquarius energy: Unconventional eater with unique preferences. May surprise you with food choices that defy expectations.",
      Pisces: "Pisces energy: Intuitive eater who responds to emotional atmosphere at meals. May be sensitive to food textures and family dynamics.",
    },
  };

  return flavors[domainId]?.[sign] || `${sign} brings unique qualities to this developmental area.`;
};

// Support tips by domain
const getSupportTips = (domainId: string): string[] => {
  const tips: Record<string, string[]> = {
    physical: [
      "Provide safe spaces for movement and exploration",
      "Create opportunities for practice at their current level",
      "Celebrate effort and progress, not just achievement",
      "Let them practice without rushing to help",
    ],
    fine_motor: [
      "Offer age-appropriate objects to manipulate",
      "Let mealtimes get messy—it's learning",
      "Provide varied textures and materials to explore",
      "Resist the urge to do things for them",
    ],
    language: [
      "Narrate your day and their activities",
      "Read together every day, even briefly",
      "Wait and give time to respond",
      "Expand on their words and sounds",
    ],
    social: [
      "Model kind interactions and sharing",
      "Provide opportunities for peer observation and play",
      "Respect their pace with new people",
      "Role-play social situations through play",
    ],
    cognitive: [
      "Follow their interests and curiosity",
      "Ask open-ended questions",
      "Provide appropriate challenges without frustration",
      "Let them figure things out before helping",
    ],
    emotional: [
      "Name emotions as they happen",
      "Stay calm during big feelings",
      "Validate their experience before redirecting",
      "Create consistent, predictable routines",
    ],
    sleep: [
      "Maintain consistent bedtime routine even when sleep is disrupted",
      "Respond to night wakings calmly and briefly",
      "Ensure good daytime naps to prevent overtiredness",
      "Create a dark, quiet, and comfortable sleep environment",
    ],
    feeding: [
      "Offer new foods alongside familiar favorites",
      "Let them explore food with hands - mess is learning",
      "Keep mealtimes pleasant, not battles",
      "Respect their hunger and fullness cues",
    ],
  };

  return tips[domainId] || [];
};

export const DomainDetailModal = ({
  isOpen,
  onClose,
  domain,
  ageInWeeks,
  birthday,
  allDomains,
  onNavigate,
}: DomainDetailModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (domain) {
      const index = allDomains.findIndex(d => d.id === domain.id);
      if (index >= 0) setCurrentIndex(index);
    }
  }, [domain, allDomains]);

  if (!domain) return null;

  const zodiacSign = getZodiacSign(birthday);
  const astroFlavor = getAstroFlavor(domain.id, zodiacSign);
  const supportTips = getSupportTips(domain.id);
  const stages = getStagesForDomain(domain.id);
  
  // Find current and next stage info
  const currentStageInfo = stages.find(s => s.stage === domain.currentStage);
  const nextStageInfo = stages.find(s => s.stage === domain.currentStage + 1);

  // Calculate estimated time to next stage
  const getTimeToNextStage = (): string => {
    if (!nextStageInfo) return "";
    const weeksUntilNextStageEnd = nextStageInfo.ageRangeWeeks[0] - ageInWeeks;
    if (weeksUntilNextStageEnd <= 0) return "any time now";
    if (weeksUntilNextStageEnd <= 2) return "1-2 weeks";
    if (weeksUntilNextStageEnd <= 4) return "2-4 weeks";
    if (weeksUntilNextStageEnd <= 8) return "1-2 months";
    return "a few months";
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < allDomains.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      onNavigate(allDomains[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(allDomains[currentIndex + 1].id);
    }
  };

  // Stop touch events from propagating to parent to prevent child switching
  const handleTouchEvent = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div 
          className="flex flex-col h-full max-h-[85vh]"
          onTouchStart={handleTouchEvent}
          onTouchMove={handleTouchEvent}
          onTouchEnd={handleTouchEvent}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{domain.icon}</span>
              <h2 className="text-lg font-serif text-foreground">{domain.label}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Astrological Flavor */}
            <div className="bg-muted/30 rounded-lg px-4 py-3">
              <p className="text-sm text-foreground/80 italic leading-relaxed">
                {astroFlavor}
              </p>
            </div>

            {/* Current Stage */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Current Stage
              </h3>
              <div className="bg-primary/5 rounded-lg px-4 py-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-light text-primary">{domain.currentStage}</span>
                  <span className="text-lg font-serif text-foreground">{domain.stageName}</span>
                  {domain.isEmerging && (
                    <span className="text-xs text-amber-500 uppercase tracking-wider">emerging to next</span>
                  )}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {currentStageInfo?.description}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Progress
              </h3>
              <div className="flex items-center gap-1.5">
                {stages.map((stage, i) => (
                  <div
                    key={stage.stage}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      stage.stage < domain.currentStage 
                        ? "bg-primary" 
                        : stage.stage === domain.currentStage 
                          ? domain.isEmerging ? "bg-primary/60" : "bg-primary"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">Stage 1</span>
                <span className="text-[10px] text-muted-foreground">Stage {stages.length}</span>
              </div>
            </div>

            {/* Next Stage */}
            {nextStageInfo && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Next Stage
                </h3>
                <div className="border border-border/30 rounded-lg px-4 py-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-light text-muted-foreground">{nextStageInfo.stage}</span>
                    <span className="text-base font-serif text-foreground/80">{nextStageInfo.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Likely emerging in {getTimeToNextStage()}
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {nextStageInfo.description}
                  </p>
                </div>
              </div>
            )}

            {/* How to Support */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                How to Support
              </h3>
              <ul className="space-y-2.5">
                {supportTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/30">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoPrev 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Prev</span>
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {allDomains.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => onNavigate(d.id)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                canGoNext 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
