import { useState } from "react";
import { Menu, X, Moon, Baby, Sparkles, Coffee, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const guideSections: GuideSection[] = [
  { id: "sleep", title: "Sleep by Age", icon: <Moon className="w-5 h-5" /> },
  { id: "development", title: "Development", icon: <Baby className="w-5 h-5" /> },
  { id: "activities", title: "Activity Ideas", icon: <Sparkles className="w-5 h-5" /> },
  { id: "feeding", title: "Feeding", icon: <Coffee className="w-5 h-5" /> },
];

interface GuideMenuProps {
  onSelectSection: (sectionId: string) => void;
}

export const GuideMenu = ({ onSelectSection }: GuideMenuProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectSection = (sectionId: string) => {
    onSelectSection(sectionId);
    setOpen(false);
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-5 border-b border-border/40">
          <SheetTitle className="text-left font-serif">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="py-2">
          {/* Guide Section */}
          <div className="px-5 py-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reference Guide</p>
          </div>
          
          {guideSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSelectSection(section.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="text-muted-foreground">{section.icon}</span>
              <span className="flex-1 text-sm font-medium text-foreground">{section.title}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-border/40" />

          {/* Settings */}
          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors text-left"
          >
            <span className="text-muted-foreground"><Settings className="w-5 h-5" /></span>
            <span className="flex-1 text-sm font-medium text-foreground">Settings</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
