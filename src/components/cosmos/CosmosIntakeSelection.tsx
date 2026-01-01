import { motion } from "framer-motion";
import { MessageSquare, Mic } from "lucide-react";
import { FamilyMember } from "./types";

interface CosmosIntakeSelectionProps {
  member: FamilyMember;
  onSelectQuestions: () => void;
  onSelectVoice: () => void;
}

export const CosmosIntakeSelection = ({
  member,
  onSelectQuestions,
  onSelectVoice
}: CosmosIntakeSelectionProps) => {
  return (
    <div className="space-y-8 px-5 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.3em]">
          Cosmic Guidance
        </p>
        <h2 className="text-xl font-serif text-foreground/90">
          Before we look at the stars together...
        </h2>
        <p className="text-[13px] text-foreground/50 max-w-[280px] mx-auto">
          Tell us what's in your heart so we can personalize {member.type === 'child' ? `${member.name}'s` : 'your'} reading
        </p>
      </motion.div>

      {/* Selection Cards */}
      <div className="space-y-4">
        {/* Quick Questions Card */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={onSelectQuestions}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.07]">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-foreground/60" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-[15px] font-medium text-foreground/90">
                  Quick Questions
                </h3>
                <p className="text-[12px] text-foreground/50">
                  Answer a few questions
                </p>
                <p className="text-[11px] text-foreground/40 mt-2">
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
          onClick={onSelectVoice}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.07]">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center">
                <Mic className="w-5 h-5 text-foreground/60" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-[15px] font-medium text-foreground/90">
                  Voice Message
                </h3>
                <p className="text-[12px] text-foreground/50">
                  Tell me what's happening
                </p>
                <p className="text-[11px] text-foreground/40 mt-2">
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
    </div>
  );
};
