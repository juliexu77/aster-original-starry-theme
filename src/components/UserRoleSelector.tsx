import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserRoleSelectorProps {
  value: "parent" | "nanny";
  onChange: (value: "parent" | "nanny") => void;
  className?: string;
}

export function UserRoleSelector({ value, onChange, className }: UserRoleSelectorProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-muted rounded-xl", className)}>
      <Button
        variant={value === "parent" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("parent")}
        className={cn(
          "flex-1 rounded-lg transition-all",
          value === "parent" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background"
        )}
      >
        Parent / Family
      </Button>
      <Button
        variant={value === "nanny" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("nanny")}
        className={cn(
          "flex-1 rounded-lg transition-all",
          value === "nanny" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background"
        )}
      >
        Child Care / Nanny
      </Button>
    </div>
  );
}