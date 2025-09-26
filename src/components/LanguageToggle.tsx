import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <div className="flex border rounded-md overflow-hidden">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="rounded-none text-xs px-3 py-1 h-8"
        >
          EN
        </Button>
        <Button
          variant={language === 'zh' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('zh')}
          className="rounded-none text-xs px-3 py-1 h-8"
        >
          中文
        </Button>
      </div>
    </div>
  );
};