import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNightSleepWindow } from "@/hooks/useNightSleepWindow";

interface TodaysStoryProps {
  onClick: () => void;
}

export function TodaysStory({ onClick }: TodaysStoryProps) {
  const [hasClicked, setHasClicked] = useState(() => {
    const clicked = localStorage.getItem('todaysStoryClicked');
    const clickedDate = localStorage.getItem('todaysStoryClickedDate');
    const today = new Date().toDateString();
    
    // Reset if it's a new day
    if (clickedDate !== today) {
      localStorage.removeItem('todaysStoryClicked');
      localStorage.removeItem('todaysStoryClickedDate');
      return false;
    }
    
    return clicked === 'true';
  });
  const { nightSleepStartHour } = useNightSleepWindow();

  // Check if it's past bedtime
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const bedtimeTotalMinutes = nightSleepStartHour * 60;
  const isPastBedtime = currentTotalMinutes >= bedtimeTotalMinutes;

  const handleClick = () => {
    if (!isPastBedtime) return; // Don't allow clicks before bedtime
    
    if (!hasClicked) {
      setHasClicked(true);
      localStorage.setItem('todaysStoryClicked', 'true');
      localStorage.setItem('todaysStoryClickedDate', new Date().toDateString());
    }
    onClick();
  };

  return (
    <button 
      onClick={handleClick}
      disabled={!isPastBedtime}
      className={`group inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full transition-all duration-300 ${
        isPastBedtime 
          ? 'bg-[hsl(320_40%_92%)] dark:bg-[hsl(320_40%_25%)] hover:bg-[hsl(320_40%_88%)] dark:hover:bg-[hsl(320_40%_30%)] animate-story-breathe cursor-pointer'
          : 'bg-muted/50 cursor-not-allowed opacity-60'
      }`}
    >
      <Sparkles className={`w-2.5 h-2.5 ${
        isPastBedtime 
          ? `text-[hsl(320_45%_55%)] dark:text-[hsl(320_60%_70%)] ${!hasClicked ? 'animate-story-shimmer' : ''}`
          : 'text-muted-foreground'
      }`} />
      <span className={`text-[10px] font-medium leading-none ${
        isPastBedtime
          ? 'text-[hsl(320_45%_40%)] dark:text-[hsl(320_60%_85%)] animate-story-fade-in'
          : 'text-muted-foreground'
      }`}>
        {isPastBedtime ? "Today's Story" : "Available at bedtime"}
      </span>
    </button>
  );
}
