import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Calendar, Globe, Check } from "lucide-react";
import { ReadingPeriod, ZodiacSystem, ReadingOptions } from "./types";

interface CosmosOptionsStepProps {
  onComplete: (options: ReadingOptions) => void;
  onBack: () => void;
}

export const CosmosOptionsStep = ({
  onComplete,
  onBack
}: CosmosOptionsStepProps) => {
  const [period, setPeriod] = useState<ReadingPeriod>('month');
  const [zodiacSystem, setZodiacSystem] = useState<ZodiacSystem>('western');

  const periodOptions: { value: ReadingPeriod; label: string; description: string }[] = [
    { value: 'month', label: 'Monthly', description: 'Detailed guidance for this month' },
    { value: 'year', label: 'Yearly', description: 'Overview themes for the full year' }
  ];

  const zodiacOptions: { value: ZodiacSystem; label: string; description: string }[] = [
    { value: 'western', label: 'Western', description: 'Sun, Moon & Rising signs' },
    { value: 'eastern', label: 'Chinese', description: 'Year animal & element' },
    { value: 'both', label: 'Both', description: 'Western + Chinese combined' }
  ];

  const handleGenerate = () => {
    onComplete({ period, zodiacSystem });
  };

  return (
    <div className="min-h-[60vh] flex flex-col px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/50" />
        </button>
        <div className="w-9" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-[16px] font-serif text-foreground/90 mb-2">
          Choose your reading style
        </h3>
        <p className="text-[12px] text-foreground/50">
          How would you like the stars to speak to you?
        </p>
      </motion.div>

      <div className="flex-1 space-y-6">
        {/* Period Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-amber-300/60" />
            <span className="text-[11px] text-foreground/40 uppercase tracking-wider">Time Period</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  period === option.value
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                }`}
              >
                {period === option.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-amber-300" />
                  </div>
                )}
                <p className="text-[14px] font-medium text-foreground/80">{option.label}</p>
                <p className="text-[11px] text-foreground/40 mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Zodiac System Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <Globe className="w-4 h-4 text-purple-300/60" />
            <span className="text-[11px] text-foreground/40 uppercase tracking-wider">Zodiac System</span>
          </div>
          <div className="space-y-2">
            {zodiacOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setZodiacSystem(option.value)}
                className={`relative w-full p-4 rounded-xl border text-left transition-all ${
                  zodiacSystem === option.value
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : 'border-foreground/10 bg-foreground/5 hover:border-foreground/20'
                }`}
              >
                {zodiacSystem === option.value && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-4">
                    <Check className="w-4 h-4 text-purple-300" />
                  </div>
                )}
                <p className="text-[14px] font-medium text-foreground/80">{option.label}</p>
                <p className="text-[11px] text-foreground/40 mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Generate button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-background hover:from-amber-500 hover:to-amber-600"
        >
          <Sparkles className="w-4 h-4" />
          Generate Reading
        </button>
      </motion.div>
    </div>
  );
};
