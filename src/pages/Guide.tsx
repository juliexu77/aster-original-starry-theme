import { Baby, Moon, Sparkles, Coffee, BookOpen } from "lucide-react";

export const Guide = () => {
  return (
    <div className="px-5 py-6 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-serif text-foreground">Reference Guide</h1>
        <p className="text-sm text-muted-foreground">
          Quick answers for common questions
        </p>
      </div>

      {/* Sleep Guide */}
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

      {/* Development Guide */}
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

      {/* Activities Guide */}
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
        </div>
      </section>

      {/* Feeding Guide */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Feeding</h2>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/40 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">0–6 months</p>
            <p className="text-sm text-muted-foreground">Breast milk or formula only. Feed on demand.</p>
          </div>
          <div className="pt-2 border-t border-border/20">
            <p className="text-sm font-medium text-foreground mb-1">Around 6 months</p>
            <p className="text-sm text-muted-foreground">Introduce solids when showing readiness signs. Milk remains primary nutrition.</p>
          </div>
          <div className="pt-2 border-t border-border/20">
            <p className="text-sm font-medium text-foreground mb-1">6–12 months</p>
            <p className="text-sm text-muted-foreground">Gradually increase solids variety. Continue milk feeds.</p>
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground/70 italic">
          When in doubt, trust your instincts and consult your pediatrician.
        </p>
      </div>
    </div>
  );
};

export default Guide;
