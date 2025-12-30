import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName, ZodiacSign } from "@/lib/zodiac";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChartIntroOverlayProps {
  name: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  onComplete: () => void;
}

interface SignInfo {
  type: 'sun' | 'moon' | 'rising';
  sign: ZodiacSign;
  title: string;
  subtitle: string;
  description: string;
}

const getSunDescription = (sign: ZodiacSign, name: string): string => {
  const descriptions: Record<ZodiacSign, string> = {
    aries: `${name} approaches life with bold initiative and natural leadership. Their core self thrives on action, challenge, and pioneering new paths.`,
    taurus: `${name}'s essential nature is grounded, patient, and sensory-oriented. They build security through persistence and appreciate life's tangible pleasures.`,
    gemini: `${name}'s core identity centers on curiosity, communication, and mental agility. They process the world through ideas, questions, and connections.`,
    cancer: `${name}'s essential self is deeply nurturing and emotionally intuitive. Their identity is woven with family, memory, and creating safe spaces.`,
    leo: `${name} radiates warmth, creativity, and natural confidence. Their core self seeks to express, create, and be recognized for their unique gifts.`,
    virgo: `${name}'s essential nature is analytical, helpful, and detail-oriented. They find purpose through service, improvement, and practical problem-solving.`,
    libra: `${name}'s core identity seeks harmony, beauty, and balanced relationships. They navigate the world through partnership and aesthetic sensibility.`,
    scorpio: `${name} possesses depth, intensity, and transformative power at their core. Their essential self seeks truth, emotional authenticity, and profound connection.`,
    sagittarius: `${name}'s core identity is expansive, philosophical, and adventure-seeking. They're driven by meaning, exploration, and the pursuit of wisdom.`,
    capricorn: `${name}'s essential nature is ambitious, responsible, and structured. They build their identity through achievement, mastery, and long-term goals.`,
    aquarius: `${name}'s core self is innovative, independent, and humanitarian. Their identity centers on originality, community, and progressive thinking.`,
    pisces: `${name}'s essential nature is imaginative, compassionate, and spiritually attuned. They experience the world through empathy, creativity, and intuition.`,
  };
  return descriptions[sign];
};

const getMoonDescription = (sign: ZodiacSign, name: string): string => {
  const descriptions: Record<ZodiacSign, string> = {
    aries: `Emotionally, ${name} needs independence and quick resolution. They process feelings through action and may need outlets for emotional energy.`,
    taurus: `${name}'s emotional world craves stability, comfort, and sensory soothing. They feel secure through routine, touch, and predictable environments.`,
    gemini: `${name} processes emotions through talking and thinking. They need mental stimulation and variety to feel emotionally balanced.`,
    cancer: `${name}'s emotional needs run deep—security, nurturing, and family connection are essential. They're highly attuned to emotional atmospheres.`,
    leo: `${name} needs emotional recognition and warm attention. Their heart opens through play, creativity, and feeling appreciated.`,
    virgo: `${name} finds emotional security through order and helpfulness. They may process feelings analytically and need gentle reassurance.`,
    libra: `${name}'s emotional wellbeing depends on harmony and connection. They need peaceful environments and feel unsettled by conflict.`,
    scorpio: `${name} experiences emotions intensely and needs deep trust. They're emotionally private and require authentic, loyal connections.`,
    sagittarius: `${name} needs emotional freedom and optimism. They process feelings through adventure, humor, and philosophical perspective.`,
    capricorn: `${name} may appear emotionally reserved but feels deeply. They need structure and achievement to feel emotionally secure.`,
    aquarius: `${name}'s emotional nature is unique and independent. They need space for individuality and may process feelings intellectually.`,
    pisces: `${name} is emotionally porous and highly empathic. They need creative outlets, rest, and protection from overwhelming environments.`,
  };
  return descriptions[sign];
};

const getRisingDescription = (sign: ZodiacSign, name: string): string => {
  const descriptions: Record<ZodiacSign, string> = {
    aries: `${name} enters new situations with confidence and directness. Others see them as energetic, brave, and ready to lead.`,
    taurus: `${name} presents as calm, steady, and approachable. First impressions convey reliability, groundedness, and gentle warmth.`,
    gemini: `${name} appears curious, communicative, and quick-witted. They enter spaces with mental agility and social adaptability.`,
    cancer: `${name} presents as nurturing, approachable, and emotionally present. Others sense their caring nature and protective instincts.`,
    leo: `${name} enters rooms with natural presence and warmth. They appear confident, creative, and magnetically engaging.`,
    virgo: `${name} presents as thoughtful, modest, and observant. Others see their helpful nature and attention to detail.`,
    libra: `${name} appears graceful, diplomatic, and socially skilled. First impressions convey charm, fairness, and aesthetic awareness.`,
    scorpio: `${name} presents with intensity and mystery. Others sense their depth, determination, and magnetic presence.`,
    sagittarius: `${name} appears enthusiastic, friendly, and adventurous. They enter situations with optimism and philosophical curiosity.`,
    capricorn: `${name} presents as mature, capable, and responsible. Others see their ambition, structure, and quiet authority.`,
    aquarius: `${name} appears unique, friendly, and intellectually engaging. First impressions convey originality and humanitarian spirit.`,
    pisces: `${name} presents as gentle, dreamy, and empathic. Others sense their artistic nature and spiritual sensitivity.`,
  };
  return descriptions[sign];
};

export const ChartIntroOverlay = ({ 
  name, 
  sunSign, 
  moonSign, 
  risingSign, 
  onComplete 
}: ChartIntroOverlayProps) => {
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const signs: SignInfo[] = [
    {
      type: 'sun',
      sign: sunSign,
      title: `${getZodiacName(sunSign)} Sun`,
      subtitle: "Core Identity & Essence",
      description: getSunDescription(sunSign, name),
    },
    ...(moonSign ? [{
      type: 'moon' as const,
      sign: moonSign,
      title: `${getZodiacName(moonSign)} Moon`,
      subtitle: "Emotional World & Inner Needs",
      description: getMoonDescription(moonSign, name),
    }] : []),
    ...(risingSign ? [{
      type: 'rising' as const,
      sign: risingSign,
      title: `${getZodiacName(risingSign)} Rising`,
      subtitle: "First Impressions & Outer Self",
      description: getRisingDescription(risingSign, name),
    }] : []),
  ];

  // Initial delay before showing overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentIndex < signs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsExiting(true);
      setTimeout(onComplete, 600);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentSign = signs[currentIndex];

  if (!isReady) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="flex-1 flex items-center justify-center w-full px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center max-w-sm"
              >
                {/* Glowing icon container */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative w-20 h-20 mx-auto mb-5"
                >
                  {/* Outer glow rings */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle, hsl(var(--foreground) / 0.3) 0%, transparent 70%)`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-full border border-foreground/10"
                    style={{ animation: 'pulse 2s ease-in-out infinite 0.3s' }}
                  />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ZodiacIcon 
                      sign={currentSign.sign} 
                      size={40} 
                      strokeWidth={1} 
                      className="text-foreground/70"
                    />
                  </div>
                </motion.div>

                {/* Sign type label */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] mb-2"
                >
                  {currentSign.type === 'sun' ? 'Sun Sign' : 
                   currentSign.type === 'moon' ? 'Moon Sign' : 'Rising Sign'}
                </motion.p>

                {/* Sign name */}
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[22px] font-serif text-foreground/90 mb-1"
                >
                  {currentSign.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-[11px] text-foreground/50 uppercase tracking-wider mb-5"
                >
                  {currentSign.subtitle}
                </motion.p>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[14px] text-foreground/60 leading-relaxed"
                >
                  {currentSign.description}
                </motion.p>

                {/* Progress dots */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-2 mt-8"
                >
                  {signs.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex 
                          ? 'bg-foreground/50 scale-125' 
                          : i < currentIndex 
                            ? 'bg-foreground/30' 
                            : 'bg-foreground/10'
                      }`}
                    />
                  ))}
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons - larger touch targets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between w-full px-6 pb-12 pt-4"
          >
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                currentIndex === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5 active:bg-foreground/10'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            >
              {currentIndex === signs.length - 1 ? 'Done' : 'Next'}
              {currentIndex < signs.length - 1 && <ChevronRight size={20} />}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
