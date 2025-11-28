import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card Component - Rare Beauty Aesthetic
 * - Tactile, object-like containers
 * - Soft matte top-light gradient
 * - Diffused cinematic shadows (8% opacity)
 * - Generous padding and rounded corners
 */

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Shape: Large radius, feels like a physical object
      "rounded-[28px] text-card-foreground",
      // Border: Very soft, barely visible
      "border border-[hsl(18,28%,85%)]/40",
      // Background: Unified rose-clay tone with soft matte top-light effect
      "bg-gradient-to-b from-[hsl(22,45%,94%)] via-[hsl(18,40%,90%)] to-[hsl(16,36%,87%)]",
      // Inner highlight: Top-lit soft glow for depth
      "shadow-[inset_0_1px_0_0_hsla(30,60%,98%,0.6),inset_0_0_16px_0_hsla(30,50%,95%,0.25),0_2px_4px_-1px_hsla(18,45%,40%,0.04),0_8px_20px_-4px_hsla(18,45%,45%,0.1),0_0_30px_-8px_hsla(15,45%,65%,0.12)]",
      // Hover: Enhanced glow
      "transition-shadow duration-300",
      // Dark mode: Clean flat design
      "dark:rounded-xl dark:shadow-none dark:bg-card dark:border-border/40",
      className
    )} 
    {...props} 
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    // Generous vertical padding for tactile feel
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 pb-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    // Weight 600, tracking -0.02em per Rare Beauty typography
    <h3 ref={ref} className={cn("text-lg font-semibold leading-tight tracking-[-0.02em]", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    // Body weight 400, increased line-height
    <p ref={ref} className={cn("text-sm text-muted-foreground font-normal leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    // Generous horizontal padding
    <div ref={ref} className={cn("px-6 pb-2", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center px-6 pb-6 pt-2", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
