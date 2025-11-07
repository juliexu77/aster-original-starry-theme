import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHousehold } from "@/hooks/useHousehold";

export const SyncIndicator = () => {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [lastActivity, setLastActivity] = useState<{
    type: string;
    userName: string;
    time: Date;
  } | null>(null);

  useEffect(() => {
    const fetchLastActivity = async () => {
      if (!household?.id) return;

      const { data: activities } = await supabase
        .from('activities')
        .select('*, profiles(full_name)')
        .eq('household_id', household.id)
        .order('logged_at', { ascending: false })
        .limit(1);

      if (activities && activities.length > 0) {
        const activity = activities[0];
        const profile = activity.profiles as any;
        setLastActivity({
          type: activity.type,
          userName: profile?.full_name || 'Someone',
          time: new Date(activity.logged_at)
        });
      }
    };

    fetchLastActivity();

    // Subscribe to activity changes
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
          fetchLastActivity();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [household?.id]);

  if (!lastActivity) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 py-2">
        <RefreshCw className="h-3 w-3" />
        <span>No activities yet</span>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(lastActivity.time, { addSuffix: true });
  const activityLabel = lastActivity.type === 'nap' ? 'sleep' : lastActivity.type;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 py-2">
      <RefreshCw className="h-3 w-3" />
      <span>
        Last activity: {activityLabel} by {lastActivity.userName} {timeAgo}
      </span>
    </div>
  );
};
