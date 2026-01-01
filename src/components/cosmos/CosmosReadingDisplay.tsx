import { motion } from "framer-motion";
import { Moon, Sun, Star, RefreshCw } from "lucide-react";
import { CosmosReading as CosmosReadingType } from "./types";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName } from "@/lib/zodiac";
import { ShareCosmosSheet } from "./ShareCosmosSheet";

const getChineseZodiacEmoji = (animal: string): string => {
  const emojiMap: Record<string, string> = {
    'Rat': '🐀',
    'Ox': '🐂',
    'Tiger': '🐅',
    'Rabbit': '🐇',
    'Dragon': '🐉',
    'Snake': '🐍',
    'Horse': '🐴',
    'Goat': '🐐',
    'Monkey': '🐒',
    'Rooster': '🐓',
    'Dog': '🐕',
    'Pig': '🐷'
  };
  return emojiMap[animal] || '✨';
};

interface CosmosReadingProps {
  reading: CosmosReadingType;
  onRefresh?: () => void;
}

export const CosmosReadingDisplay = ({
  reading,
  onRefresh
}: CosmosReadingProps) => {
  const formatMonthYear = (monthYear: string) => {
    // Handle yearly readings (just year like "2026")
    if (!monthYear.includes('-')) {
      return monthYear;
    }
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const isYearly = reading.readingPeriod === 'year';
  const hasChineseZodiac = reading.chineseZodiac && reading.chineseElement;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl mx-5"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-black/40" />
        
        {/* Star field effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative p-6 text-center space-y-3">
          {/* Share button */}
          <div className="absolute top-4 right-4">
            <ShareCosmosSheet reading={reading} />
          </div>

          {/* Month and season */}
          <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.3em]">
            {formatMonthYear(reading.monthYear)}
          </p>
          
          <h2 className="text-xl font-serif text-foreground/90">
            {reading.astrologicalSeason}
          </h2>
          
          {/* Lunar phase */}
          <div className="flex items-center justify-center gap-2 text-[12px] text-foreground/50">
            <Moon className="w-4 h-4 text-purple-300/60" />
            {reading.lunarPhase}
          </div>

          {/* Signs display */}
          <div className="flex items-center justify-center gap-6 pt-3">
            {/* Western zodiac signs */}
            {reading.zodiacSystem !== 'eastern' && (
              <>
                <div className="flex flex-col items-center gap-1">
                  <ZodiacIcon sign={reading.sunSign} size={24} className="text-amber-300/70" />
                  <span className="text-[10px] text-foreground/40">{getZodiacName(reading.sunSign)}</span>
                </div>
                {reading.moonSign && (
                  <div className="flex flex-col items-center gap-1">
                    <ZodiacIcon sign={reading.moonSign} size={24} className="text-purple-300/70" />
                    <span className="text-[10px] text-foreground/40">{getZodiacName(reading.moonSign)} Moon</span>
                  </div>
                )}
                {reading.risingSign && (
                  <div className="flex flex-col items-center gap-1">
                    <ZodiacIcon sign={reading.risingSign} size={24} className="text-indigo-300/70" />
                    <span className="text-[10px] text-foreground/40">{getZodiacName(reading.risingSign)} Rising</span>
                  </div>
                )}
              </>
            )}
            
            {/* Chinese zodiac */}
            {hasChineseZodiac && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{getChineseZodiacEmoji(reading.chineseZodiac!)}</span>
                <span className="text-[10px] text-foreground/40">
                  {reading.chineseElement} {reading.chineseZodiac}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Opening */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-5"
      >
        <h3 className="text-[11px] text-amber-300/60 uppercase tracking-[0.2em] mb-3">
          {isYearly ? `${reading.memberName}'s Year Ahead` : `This Month for ${reading.memberName}`}
        </h3>
        <p className="text-[14px] text-foreground/80 leading-relaxed font-serif">
          {reading.opening}
        </p>
      </motion.div>

      {/* Content Sections */}
      {(reading.sections || []).map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          className="px-5"
        >
          {/* Section divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <Star className="w-3 h-3 text-amber-300/40" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </div>

          <h4 className="text-[12px] text-purple-300/70 uppercase tracking-[0.15em] mb-3">
            {section.title}
          </h4>
          
          <div className="space-y-3">
            {(section.content || '').split('\n\n').map((paragraph, pIndex) => (
              paragraph.trim() && (
                <p key={pIndex} className="text-[13px] text-foreground/70 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </motion.div>
      ))}

      {/* Significant Dates */}
      {(reading.significantDates || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="px-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <Star className="w-3 h-3 text-amber-300/40" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </div>

          <h4 className="text-[12px] text-purple-300/70 uppercase tracking-[0.15em] mb-3">
            Significant Dates
          </h4>
          
          <ul className="space-y-2">
            {(reading.significantDates || []).map((date, i) => (
              <li key={i} className="text-[13px] text-foreground/70 flex items-start gap-2">
                <span className="text-amber-300/50">•</span>
                {date}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-5 pt-4"
      >
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-full py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/50 text-[12px] flex items-center justify-center gap-2 hover:bg-foreground/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Update my reading
          </button>
        )}
      </motion.div>

      {/* Footer */}
      <div className="pt-4 text-center px-5">
        <p className="text-[10px] text-foreground/20 tracking-[0.2em]">
          Reading generated {new Date(reading.generatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
