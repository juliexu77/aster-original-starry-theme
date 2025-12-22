import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/60 backdrop-blur-xl",
        "border border-border/30",
        "shadow-lg shadow-black/5",
        // Inner glow effect
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};