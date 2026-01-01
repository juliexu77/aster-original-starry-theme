interface TimeOfDayBackgroundProps {
  children: React.ReactNode;
}

export const TimeOfDayBackground = ({ children }: TimeOfDayBackgroundProps) => {
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
};