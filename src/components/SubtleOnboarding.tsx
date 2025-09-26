import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

interface SubtleOnboardingProps {
  target: HTMLElement | null;
  onDismiss: () => void;
}

export const SubtleOnboarding = ({ target, onDismiss }: SubtleOnboardingProps) => {
  const { t } = useLanguage();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    // Show hint after a brief delay
    const hintTimer = setTimeout(() => setShowHint(true), 500);
    
    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 8000);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearTimeout(hintTimer);
      clearTimeout(dismissTimer);
    };
  }, [target, onDismiss]);

  if (!target) return null;

  return (
    <>
      {/* Pulsing ring animation around the + button */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" 
             style={{ width: '80px', height: '80px', margin: '-40px' }} />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse delay-300" 
             style={{ width: '60px', height: '60px', margin: '-30px' }} />
        
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/40" 
             style={{ width: '70px', height: '70px', margin: '-35px' }} />
      </div>

      {/* Floating hint text */}
      {showHint && (
        <div
          className="fixed z-30 pointer-events-none"
          style={{
            top: position.top - 80,
            left: position.left,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
            <div className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              <span>{t('tapToAddFirst')}</span>
            </div>
            
            {/* Arrow pointing down */}
            <div className="absolute w-2 h-2 bg-primary transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      )}

      {/* Invisible clickable area to dismiss */}
      <div 
        className="fixed inset-0 z-20 cursor-pointer"
        onClick={onDismiss}
      />
    </>
  );
};