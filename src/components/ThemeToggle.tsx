import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-8 px-3 bg-background/80 backdrop-blur-sm border-border/50"
    >
      <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="ml-1 text-xs font-medium">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </Button>
  );
}