import { motion } from "framer-motion";
import { Moon, Calendar, Sparkles } from "lucide-react";
import { WeeklyReading } from "@/hooks/useWeeklyReading";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { getZodiacName, ZodiacSign } from "@/lib/zodiac";

interface WeeklyReadingCardProps {
  reading: WeeklyReading;
  memberName: string;
}

export const WeeklyReadingCard = ({ reading, memberName }: WeeklyReadingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl mx-5">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-black/40" />
        
        {/* Subtle star effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative p-5 space-y-3">
          {/* Week label */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.2em] font-sans flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {reading.weekRange}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/40">
              <span>{reading.lunarEmoji}</span>
              <span>{reading.lunarPhase}</span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-[11px] text-foreground/40 uppercase tracking-[0.15em] font-sans">
            This Week for {memberName}
          </h2>
          
          <h3 className="text-lg font-serif text-foreground/90">
            {reading.headline}
          </h3>

          {/* Sign badge */}
          <div className="flex items-center gap-2 pt-1">
            <ZodiacIcon sign={reading.sunSign as ZodiacSign} size={16} className="text-amber-300/60" />
            <span className="text-[11px] text-foreground/50">
              {getZodiacName(reading.sunSign as ZodiacSign)}
              {reading.moonSign && ` • ${getZodiacName(reading.moonSign as ZodiacSign)} Moon`}
            </span>
          </div>
        </div>
      </div>

      {/* Lunar Context */}
      <div className="px-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-foreground/[0.03] border border-foreground/5">
          <Moon className="w-4 h-4 text-purple-300/50 mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-foreground/60 leading-relaxed font-serif">
            {reading.lunarContext}
          </p>
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="px-5 space-y-3">
        {reading.weeklyInsight.split('\n\n').map((paragraph, i) => (
          paragraph.trim() && (
            <p key={i} className="text-[14px] text-foreground/75 leading-relaxed font-serif">
              {paragraph}
            </p>
          )
        ))}
      </div>

      {/* Focus Area & Reminder */}
      <div className="px-5 space-y-3">
        {/* Focus Area */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.15em] mb-2 font-sans flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            This Week's Focus
          </p>
          <p className="text-[13px] text-foreground/70 font-serif">
            {reading.focusArea}
          </p>
        </div>

        {/* Gentle Reminder */}
        <div className="text-center py-3">
          <p className="text-[12px] text-foreground/40 italic font-serif">
            {reading.gentleReminder}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
