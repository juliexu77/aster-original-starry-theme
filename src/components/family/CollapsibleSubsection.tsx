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
    <div className={cn("", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-foreground/30 hover:text-foreground/50 transition-colors w-full text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-2.5 h-2.5" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="w-2.5 h-2.5" strokeWidth={1.5} />
        )}
        <span className="text-[12px] tracking-[0.3px] uppercase">{title}</span>
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-150 ease-out",
          isExpanded ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};
