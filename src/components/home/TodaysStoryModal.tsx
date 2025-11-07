import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity } from "@/components/ActivityCard";
import { format } from "date-fns";
import { Camera, StickyNote, Baby, Moon, Droplet, Ruler, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TodaysStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  babyName?: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "feed": return <Baby className="h-4 w-4" />;
    case "diaper": return <Droplet className="h-4 w-4" />;
    case "nap": return <Moon className="h-4 w-4" />;
    case "note": return <StickyNote className="h-4 w-4" />;
    case "measure": return <Ruler className="h-4 w-4" />;
    case "photo": return <Camera className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getActivityLabel = (activity: Activity): string => {
  switch (activity.type) {
    case "feed":
      if (activity.details.feedType === "nursing") {
        return "Nursed";
      } else if (activity.details.feedType === "solid") {
        return "Ate solids";
      } else {
        return `Fed ${activity.details.quantity}${activity.details.unit || "oz"}`;
      }
    case "diaper":
      return `Diaper change (${activity.details.diaperType})`;
    case "nap":
      if (activity.details.isNightSleep) {
        return "Went to bed";
      } else if (activity.details.startTime && activity.details.endTime) {
        return `Napped ${activity.details.startTime} - ${activity.details.endTime}`;
      }
      return "Nap";
    case "measure":
      return "Growth check";
    case "note":
      return "Note";
    case "photo":
      return "Photo";
    default:
      return activity.type;
  }
};

export function TodaysStoryModal({ isOpen, onClose, activities, babyName }: TodaysStoryModalProps) {
  // Filter today's activities
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(activity => {
    if (!activity.loggedAt) return false;
    const activityDate = new Date(activity.loggedAt);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === today.getTime();
  });

  // Get photos with notes
  const photosWithNotes = todayActivities.filter(a => 
    a.type === "photo" && (a.details.photoUrl || a.details.note)
  );

  // Hero moment - most recent photo with note, or most recent photo
  const heroMoment = photosWithNotes[photosWithNotes.length - 1] || 
                     todayActivities.filter(a => a.type === "photo")[0];

  // Get interesting activities (not routine diapers) - limit to 2-3
  const allHighlights = todayActivities.filter(a => 
    a.type === "note" || 
    a.type === "measure" ||
    (a.type === "feed" && a.details.feedType === "solid") ||
    (a.type === "nap" && a.details.isNightSleep)
  );
  const highlights = allHighlights.slice(0, 3); // Only 2-3 highlights

  // Calculate summary stats
  const feedCount = todayActivities.filter(a => a.type === "feed").length;
  const napCount = todayActivities.filter(a => a.type === "nap" && !a.details.isNightSleep).length;
  const diaperCount = todayActivities.filter(a => a.type === "diaper").length;

  // Generate summary sentence based on the day
  const getSummaryLine = () => {
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
    
    if (napCount >= 3) {
      return `${babyName || "Baby"} had a restful ${timeOfDay} with plenty of sleep.`;
    } else if (feedCount >= 6) {
      return `${babyName || "Baby"} was hungry today — lots of good eating!`;
    } else if (allHighlights.some(a => a.details.feedType === "solid")) {
      return `${babyName || "Baby"} tried some solids and had a full ${timeOfDay}.`;
    } else if (todayActivities.length > 10) {
      return `It was a busy ${timeOfDay} full of moments together.`;
    } else {
      return `${babyName || "Baby"} had a sweet, steady ${timeOfDay}.`;
    }
  };

  // Generate outro reflection
  const getOutroReflection = () => {
    const hasPhotos = photosWithNotes.length > 0;
    const hasNotes = todayActivities.some(a => a.details.note);
    
    if (hasPhotos && hasNotes) {
      return "You captured the moments that matter — these little days make up the big picture.";
    } else if (hasPhotos) {
      return "Every photo tells a story. These are the days you'll look back on.";
    } else if (todayActivities.length > 8) {
      return "You're doing an amazing job keeping track of it all.";
    } else {
      return "The small routines add up to something beautiful.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">✨</span>
            {babyName ? `${babyName}'s Day` : "Today's Story"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* 1. HERO MOMENT - Photo + Summary */}
          {heroMoment ? (
            <div className="space-y-3">
              {heroMoment.details.photoUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={heroMoment.details.photoUrl} 
                    alt="Today's moment" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-base text-foreground leading-relaxed font-medium">
                {getSummaryLine()}
              </p>
              {heroMoment.details.note && (
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{heroMoment.details.note}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-base text-foreground leading-relaxed font-medium">
              {getSummaryLine()}
            </p>
          )}

          {/* 2. SUPPORTING STATS - Quick scan */}
          <div className="flex gap-6 justify-center py-2 border-y border-border/40">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground tabular-nums">{feedCount}</div>
              <div className="text-xs text-muted-foreground">feeds</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground tabular-nums">{napCount}</div>
              <div className="text-xs text-muted-foreground">naps</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground tabular-nums">{diaperCount}</div>
              <div className="text-xs text-muted-foreground">diapers</div>
            </div>
          </div>

          {/* 3. HIGHLIGHTS - 2-3 key moments */}
          {highlights.length > 0 && (
            <div className="space-y-2">
              {highlights.map((activity) => (
                <button
                  key={activity.id}
                  className="w-full text-left group"
                  onClick={() => {}}
                >
                  <Card className="p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {getActivityLabel(activity)}
                        </p>
                        {activity.details.note && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {activity.details.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}

          {/* 4. OUTRO REFLECTION - Graceful closing */}
          <div className="pt-2 border-t border-border/40">
            <p className="text-sm text-muted-foreground leading-relaxed italic text-center">
              {getOutroReflection()}
            </p>
          </div>

          {/* Empty State */}
          {!heroMoment && highlights.length === 0 && todayActivities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No special moments captured yet today.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Start logging to build {babyName ? `${babyName}'s` : "your baby's"} daily story!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
