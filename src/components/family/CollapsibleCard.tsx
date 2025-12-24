import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  preview: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleCard = ({
  icon,
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
        "rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Header - Always visible, clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary/80">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground text-base">
              {title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </p>
          
          {/* Preview text - only shown when collapsed */}
          {!isExpanded && (
            <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
              {preview}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
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
