import { useEffect, useState } from "react";
import { Activity } from "./ActivityCard";
import { Progress } from "./ui/progress";
import { Sparkles } from "lucide-react";

interface LearningProgressProps {
  activities: Activity[];
  babyName?: string;
  onRhythmUnlocked?: () => void;
}

export const LearningProgress = ({ activities, babyName, onRhythmUnlocked }: LearningProgressProps) => {
  const [hasUnlocked, setHasUnlocked] = useState(() => {
    return localStorage.getItem('rhythm_unlocked') === 'true';
  });

  const naps = activities.filter(a => a.type === 'nap');
  const feeds = activities.filter(a => a.type === 'feed');
  
  // Determine first activity type
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
  );
  const firstActivity = sortedActivities[0];
  
  // If first activity was a feed, need 1 nap to show schedule
  // If first activity was a nap, schedule shows immediately
  const needsNapForSchedule = firstActivity?.type === 'feed' && naps.length === 0;
  
  const napsNeeded = Math.max(0, 4 - naps.length);
  const feedsNeeded = Math.max(0, 4 - feeds.length);
  const totalLogged = naps.length + feeds.length;
  const targetLogs = 8; // 4 naps + 4 feeds
  const progress = Math.min(100, (totalLogged / targetLogs) * 100);
  
  const isUnlocked = naps.length >= 4 && feeds.length >= 4;
  const name = babyName?.split(' ')[0] || 'Baby';

  // Trigger unlock animation
  useEffect(() => {
    if (isUnlocked && !hasUnlocked) {
      setHasUnlocked(true);
      localStorage.setItem('rhythm_unlocked', 'true');
      onRhythmUnlocked?.();
    }
  }, [isUnlocked, hasUnlocked, onRhythmUnlocked]);

  if (isUnlocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-500">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-xs font-medium text-primary">
          Active Rhythm — Learning from {totalLogged} logs
        </span>
      </div>
    );
  }

  // Special message if first activity was feed and no nap yet
  if (needsNapForSchedule) {
    return (
      <div className="space-y-2 px-4 py-3 rounded-xl bg-accent/20 border border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            Getting Started
          </span>
          <span className="text-xs text-muted-foreground">
            {totalLogged} log{totalLogged !== 1 ? 's' : ''}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Log a nap to see {name}'s predicted schedule
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4 py-3 rounded-xl bg-card/50 border border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">
          Early Days — Learning {name}'s rhythm
        </span>
        <span className="text-xs text-muted-foreground">
          {totalLogged} of {targetLogs} logs
        </span>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-1.5" />
        {/* Shimmer animation overlay */}
        <div 
          className="absolute inset-0 h-1.5 rounded-full overflow-hidden pointer-events-none"
          style={{ 
            background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.3) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
            width: `${progress}%`
          }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        {napsNeeded > 0 && feedsNeeded > 0 
          ? `${napsNeeded} more nap${napsNeeded > 1 ? 's' : ''} and ${feedsNeeded} more feed${feedsNeeded > 1 ? 's' : ''} for advanced predictions`
          : napsNeeded > 0
          ? `${napsNeeded} more nap${napsNeeded > 1 ? 's' : ''} for advanced predictions`
          : `${feedsNeeded} more feed${feedsNeeded > 1 ? 's' : ''} for advanced predictions`
        }
      </p>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
