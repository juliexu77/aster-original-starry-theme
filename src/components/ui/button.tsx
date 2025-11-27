import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:rounded-lg dark:transition-all dark:duration-200",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsla(345,42%,36%,0.35)] hover:shadow-[0_6px_20px_-4px_hsla(345,42%,36%,0.45)] hover:translate-y-[-1px] active:translate-y-0 active:shadow-[0_2px_8px_-2px_hsla(345,42%,36%,0.3)] dark:shadow-none dark:hover:animate-bounce-in",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:animate-bounce-in",
        outline: "border border-border/60 bg-transparent hover:bg-accent/50 hover:border-primary/30 text-foreground dark:border-border dark:hover:bg-primary dark:hover:text-primary-foreground",
        secondary: "bg-secondary/60 text-secondary-foreground hover:bg-secondary/80 dark:hover:animate-bounce-in",
        ghost: "hover:bg-accent/40 hover:text-accent-foreground dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "bg-gradient-to-r from-[hsl(var(--cta-gradient-start))] to-[hsl(var(--cta-gradient-end))] text-white font-semibold shadow-[0_4px_20px_-4px_hsla(350,45%,33%,0.4)] hover:shadow-[0_8px_28px_-4px_hsla(350,45%,33%,0.5)] hover:translate-y-[-1px] active:translate-y-0",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
