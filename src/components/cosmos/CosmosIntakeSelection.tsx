import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mic, Settings2 } from "lucide-react";
import { FamilyMember, ReadingPeriod, ZodiacSystem, ReadingOptions } from "./types";
import { CosmosOptionsSheet } from "./CosmosOptionsSheet";

interface CosmosIntakeSelectionProps {
  member: FamilyMember;
  onSelectQuestions: (options: ReadingOptions) => void;
  onSelectVoice: (options: ReadingOptions) => void;
}

export const CosmosIntakeSelection = ({
  member,
  onSelectQuestions,
  onSelectVoice
}: CosmosIntakeSelectionProps) => {
  const [period, setPeriod] = useState<ReadingPeriod>('month');
  const [zodiacSystem, setZodiacSystem] = useState<ZodiacSystem>('western');
  const [showOptions, setShowOptions] = useState(false);

  const options: ReadingOptions = { period, zodiacSystem };

  const getPeriodLabel = () => period === 'month' ? 'Monthly' : 'Yearly';
  const getZodiacLabel = () => {
    if (zodiacSystem === 'western') return 'Western';
    if (zodiacSystem === 'eastern') return 'Chinese';
    return 'Western + Chinese';
  };

  return (
    <div className="space-y-8 px-5 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.3em]">
          {period === 'month' ? 'Monthly' : 'Yearly'} Cosmic Guidance
        </p>
        <h2 className="text-xl font-serif text-foreground/90">
          Before we look at the stars together...
        </h2>
        <p className="text-[13px] text-foreground/50 max-w-[280px] mx-auto">
          Tell us what's in your heart so we can personalize {member.type === 'child' ? `${member.name}'s` : 'your'} reading
        </p>
      </motion.div>

      {/* Options Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        onClick={() => setShowOptions(true)}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-foreground/10 bg-foreground/5 hover:border-foreground/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-foreground/40" />
          <span className="text-[13px] text-foreground/60">Reading options</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-foreground/40">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/70">{getPeriodLabel()}</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300/70">{getZodiacLabel()}</span>
        </div>
      </motion.button>

      {/* Selection Cards */}
      <div className="space-y-4">
        {/* Quick Questions Card */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => onSelectQuestions(options)}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-purple-950/20 to-transparent backdrop-blur-sm p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-300/70" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-[15px] font-medium text-foreground/90">
                  Quick Questions
                </h3>
                <p className="text-[12px] text-foreground/50">
                  Answer a few questions
                </p>
                <p className="text-[11px] text-amber-300/50 mt-2">
                  ~90 seconds
                </p>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Voice Message Card */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => onSelectVoice(options)}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-transparent backdrop-blur-sm p-6 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-300/70" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-[15px] font-medium text-foreground/90">
                  Voice Message
                </h3>
                <p className="text-[12px] text-foreground/50">
                  Tell me what's happening
                </p>
                <p className="text-[11px] text-purple-300/50 mt-2">
                  Speak for 60-90 seconds
                </p>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-[10px] text-foreground/30 text-center px-4"
      >
        Your responses personalize this reading and remain private.
      </motion.p>

      {/* Options Sheet */}
      <CosmosOptionsSheet
        open={showOptions}
        onOpenChange={setShowOptions}
        period={period}
        zodiacSystem={zodiacSystem}
        onPeriodChange={setPeriod}
        onZodiacSystemChange={setZodiacSystem}
      />
    </div>
  );
};
