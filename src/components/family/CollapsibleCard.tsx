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
        "rounded-lg border border-foreground/5 bg-foreground/[0.02] overflow-hidden",
        className
      )}
    >
      {/* Header - Always visible, clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] text-foreground/80 tracking-[0.3px]">
            {title}
          </h3>
          <p className="text-[12px] text-foreground/40 mt-0.5 tracking-wide">
            {subtitle}
          </p>
          
          {/* Preview text - only shown when collapsed */}
          {!isExpanded && (
            <p className="text-[13px] text-foreground/50 mt-3 leading-[1.6] line-clamp-2">
              {preview}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 text-foreground/20 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
          )}
        </div>
      </button>
      
      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-5 pt-0 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};
