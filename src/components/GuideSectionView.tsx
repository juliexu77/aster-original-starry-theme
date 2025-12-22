import { useEffect, useRef } from "react";
import { Baby, Moon, Sparkles, Coffee, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideSectionViewProps {
  sectionId: string;
  onBack: () => void;
}

export const GuideSectionView = ({ sectionId, onBack }: GuideSectionViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when section changes
    containerRef.current?.scrollTo(0, 0);
  }, [sectionId]);

  const renderContent = () => {
    switch (sectionId) {
      case "sleep":
        return (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Sleep by Age</h2>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/40 space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">0–2 months</p>
                <p className="text-sm text-muted-foreground">4–5 naps, 45–75 min wake windows</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground">2–4 months</p>
                <p className="text-sm text-muted-foreground">4 naps, 60–90 min wake windows</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground">4–6 months</p>
                <p className="text-sm text-muted-foreground">3 naps, 1.5–2 hour wake windows</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground">6–9 months</p>
                <p className="text-sm text-muted-foreground">2–3 naps, 2–2.5 hour wake windows</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground">9–12 months</p>
                <p className="text-sm text-muted-foreground">2 naps, 2.5–3.5 hour wake windows</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground">12–18 months</p>
                <p className="text-sm text-muted-foreground">1–2 naps, 3–4 hour wake windows</p>
              </div>
            </div>
          </section>
        );

      case "development":
        return (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Development</h2>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/40 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">
                Every baby develops at their own pace. Milestones are guides, not deadlines.
              </p>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground">First smiles</p>
                  <p className="text-xs text-muted-foreground">Usually 6–8 weeks</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Rolling over</p>
                  <p className="text-xs text-muted-foreground">Usually 4–6 months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sitting independently</p>
                  <p className="text-xs text-muted-foreground">Usually 6–8 months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Crawling</p>
                  <p className="text-xs text-muted-foreground">Usually 7–10 months (some skip it)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">First words</p>
                  <p className="text-xs text-muted-foreground">Usually 10–14 months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Walking</p>
                  <p className="text-xs text-muted-foreground">Usually 9–15 months</p>
                </div>
              </div>
            </div>
          </section>
        );

      case "activities":
        return (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Activity Ideas</h2>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/40 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Tummy time</p>
                <p className="text-sm text-muted-foreground">Start from day one. Short sessions throughout the day build strength.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Reading</p>
                <p className="text-sm text-muted-foreground">It's never too early. Your voice is what matters most.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Singing and talking</p>
                <p className="text-sm text-muted-foreground">Narrate your day. Babies learn language through repetition.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Outdoor time</p>
                <p className="text-sm text-muted-foreground">Fresh air and changing scenery stimulate development.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Mirror play</p>
                <p className="text-sm text-muted-foreground">Babies love seeing their reflection. Great for tummy time too.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">High-contrast visuals</p>
                <p className="text-sm text-muted-foreground">Black and white patterns help develop vision in early months.</p>
              </div>
            </div>
          </section>
        );

      case "feeding":
        return (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Feeding</h2>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/40 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">0–6 months</p>
                <p className="text-sm text-muted-foreground">Breast milk or formula only. Feed on demand. Expect 8–12 feeds per day initially.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Around 6 months</p>
                <p className="text-sm text-muted-foreground">Introduce solids when showing readiness signs: sitting with support, interest in food, loss of tongue-thrust reflex. Milk remains primary nutrition.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">6–12 months</p>
                <p className="text-sm text-muted-foreground">Gradually increase solids variety. Continue milk feeds. Introduce allergens early unless advised otherwise.</p>
              </div>
              <div className="pt-2 border-t border-border/20">
                <p className="text-sm font-medium text-foreground mb-1">Common concerns</p>
                <p className="text-sm text-muted-foreground">Growth spurts cause temporary increased feeding. Cluster feeding in evenings is normal. Trust your baby's hunger cues.</p>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (sectionId) {
      case "sleep": return "Sleep by Age";
      case "development": return "Development";
      case "activities": return "Activity Ideas";
      case "feeding": return "Feeding";
      default: return "Guide";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="px-2 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-serif text-foreground">{getSectionTitle()}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-6">
        {renderContent()}
        
        {/* Reassurance */}
        <div className="pt-8 text-center">
          <p className="text-xs text-muted-foreground/70 italic">
            When in doubt, trust your instincts and consult your pediatrician.
          </p>
        </div>
      </main>
    </div>
  );
};
