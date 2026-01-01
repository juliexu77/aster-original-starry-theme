import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

interface TimeOfDayBackgroundProps {
  children: React.ReactNode;
}

export const TimeOfDayBackground = ({ children }: TimeOfDayBackgroundProps) => {
  return (
    <NightSkyBackground>
      {children}
    </NightSkyBackground>
  );
};