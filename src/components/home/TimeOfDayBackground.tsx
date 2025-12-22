import { useMemo } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const gradients: Record<TimeOfDay, string> = {
  morning: "from-amber-100/80 via-orange-50/60 to-rose-100/40",
  afternoon: "from-sky-100/60 via-blue-50/40 to-indigo-100/30",
  evening: "from-orange-200/70 via-rose-100/50 to-purple-200/40",
  night: "from-indigo-900/80 via-slate-900/70 to-purple-900/60",
};

interface TimeOfDayBackgroundProps {
  children: React.ReactNode;
}

export const TimeOfDayBackground = ({ children }: TimeOfDayBackgroundProps) => {
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const gradient = gradients[timeOfDay];

  return (
    <div className="relative min-h-screen">
      {/* Dynamic gradient overlay */}
      <div 
        className={`fixed inset-0 bg-gradient-to-b ${gradient} pointer-events-none transition-all duration-1000`}
        style={{ zIndex: -1 }}
      />
      
      {/* Ambient glow effect */}
      {timeOfDay === "morning" && (
        <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-radial from-amber-200/30 to-transparent rounded-full blur-3xl pointer-events-none" style={{ zIndex: -1 }} />
      )}
      {timeOfDay === "afternoon" && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-radial from-sky-200/25 to-transparent rounded-full blur-3xl pointer-events-none" style={{ zIndex: -1 }} />
      )}
      {timeOfDay === "evening" && (
        <div className="fixed bottom-40 left-0 w-80 h-80 bg-gradient-radial from-orange-300/30 to-transparent rounded-full blur-3xl pointer-events-none" style={{ zIndex: -1 }} />
      )}
      {timeOfDay === "night" && (
        <>
          <div className="fixed top-10 right-10 w-2 h-2 bg-white/40 rounded-full pointer-events-none" style={{ zIndex: -1 }} />
          <div className="fixed top-32 left-20 w-1 h-1 bg-white/30 rounded-full pointer-events-none" style={{ zIndex: -1 }} />
          <div className="fixed top-48 right-32 w-1.5 h-1.5 bg-white/25 rounded-full pointer-events-none" style={{ zIndex: -1 }} />
        </>
      )}
      
      {children}
    </div>
  );
};