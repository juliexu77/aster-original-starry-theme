import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateText, shouldTranslate } from "@/utils/translate";
import { Languages } from "lucide-react";

interface TranslatedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const TranslatedTextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  rows = 3 
}: TranslatedTextAreaProps) => {
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateButton, setShowTranslateButton] = useState(false);

  useEffect(() => {
    // Check if translation button should be shown
    setShowTranslateButton(shouldTranslate(value, language));
  }, [value, language]);

  const handleTranslate = async () => {
    if (!value.trim()) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(value, language);
      onChange(translated);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        rows={rows}
      />
      {showTranslateButton && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="text-xs"
          >
            <Languages className="w-3 h-3 mr-1" />
            {isTranslating ? 'Translating...' : `Translate to ${language === 'zh' ? 'Chinese' : 'English'}`}
          </Button>
        </div>
      )}
    </div>
  );
};