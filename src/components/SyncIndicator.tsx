import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const SyncIndicator = () => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState<string>("just now");

  useEffect(() => {
    // Subscribe to all activity changes
    const channel = supabase
      .channel('sync-indicator')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        () => {
          setLastSync(new Date());
        }
      )
      .subscribe();
    
    // Update time ago text every 30 seconds
    const updateTimeAgo = () => {
      try {
        const distance = formatDistanceToNow(lastSync, { addSuffix: true });
        setTimeAgo(distance);
      } catch (error) {
        setTimeAgo("just now");
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [lastSync]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 py-2">
      <RefreshCw className="h-3 w-3" />
      <span>Synced {timeAgo}</span>
    </div>
  );
};
