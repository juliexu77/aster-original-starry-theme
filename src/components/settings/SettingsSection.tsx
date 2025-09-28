import { ReactNode } from "react";

interface SettingsSectionProps {
  title?: string;
  children: ReactNode;
}

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-muted/30">
          <h3 className="text-label font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="divide-y divide-border/50">
        {children}
      </div>
    </div>
  );
};