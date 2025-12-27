import { ReactNode } from "react";

interface SettingsSectionProps {
  title?: string;
  children: ReactNode;
}

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="space-y-1">
      {title && (
        <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] px-1 mb-2">
          {title}
        </p>
      )}
      <div className="bg-card/50 rounded-xl divide-y divide-border/30">
        {children}
      </div>
    </div>
  );
};