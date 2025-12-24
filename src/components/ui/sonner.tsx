import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground/70 group-[.toaster]:border-border/50 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          title: "group-[.toast]:text-[13px] group-[.toast]:font-normal",
          description: "group-[.toast]:text-[11px] group-[.toast]:text-foreground/40",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-[11px]",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-foreground/40 group-[.toast]:text-[11px]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
