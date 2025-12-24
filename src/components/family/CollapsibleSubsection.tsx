import { useState, ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSubsectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleSubsection = ({
  title,
  children,
  defaultExpanded = false,
  className
}: CollapsibleSubsectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("border-t border-border/10 pt-3 mt-3", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground/70 transition-colors w-full text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        <span className="text-[13px] tracking-[0.2px]">{title}</span>
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          isExpanded ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};
