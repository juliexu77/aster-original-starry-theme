import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  title: string;
  subtitle: string;
  preview: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleCard = ({
  title,
  subtitle,
  preview,
  children,
  defaultExpanded = false,
  className
}: CollapsibleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className={cn(
        "rounded-xl border border-border/20 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Header - Always visible, clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] text-foreground tracking-[0.3px]">
            {title}
          </h3>
          <p className="text-[13px] text-muted-foreground/70 mt-0.5">
            {subtitle}
          </p>
          
          {/* Preview text - only shown when collapsed */}
          {!isExpanded && (
            <p className="text-[14px] text-foreground/60 mt-2.5 leading-[1.5] line-clamp-2">
              {preview}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 text-muted-foreground/50 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>
      
      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};
