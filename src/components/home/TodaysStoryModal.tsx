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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0 gap-0">
        {/* Header with gradient background */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-background to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2.5">
              <span className="text-3xl animate-story-shimmer">✨</span>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {babyName ? `${babyName}'s Day` : "Today's Story"}
              </span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] pb-6">
          <div className="space-y-8">
            {/* 1. HERO MOMENT - Full-width photo with overlay */}
            {heroMoment && heroMoment.details.photoUrl ? (
              <div className="relative w-full aspect-[4/3] overflow-hidden animate-story-hero-enter">
                <img 
                  src={heroMoment.details.photoUrl} 
                  alt="Today's moment" 
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-lg font-semibold tracking-wide drop-shadow-lg animate-story-shimmer-text">
                    {getSummaryLine()}
                  </p>
                  {heroMoment.details.note && (
                    <p className="text-sm mt-2 font-light tracking-wide drop-shadow-md opacity-90">
                      {heroMoment.details.note}
                    </p>
                  )}
                  <p className="text-xs mt-3 font-light uppercase tracking-wider opacity-75">
                    {heroMoment.time}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 pt-2 animate-story-hero-enter">
                <p className="text-xl font-semibold text-foreground leading-relaxed tracking-tight">
                  {getSummaryLine()}
                </p>
              </div>
            )}

            {/* 2. SUPPORTING STATS - Quick scan with refined styling */}
            <div className="px-6 animate-story-stats-enter">
              <div className="flex gap-8 justify-center py-4 border-y border-border/30">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">{feedCount}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-light mt-1">Feeds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">{napCount}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-light mt-1">Naps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">{diaperCount}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-light mt-1">Changes</div>
                </div>
              </div>
            </div>

            {/* 3. HIGHLIGHTS - Elevated cards with staggered animation */}
            {highlights.length > 0 && (
              <div className="px-6 space-y-3">
                {highlights.map((activity, index) => (
                  <button
                    key={activity.id}
                    className="w-full text-left group"
                    onClick={() => {}}
                    style={{
                      animation: `storyCardEnter 0.5s ease-out ${0.3 + index * 0.1}s both`
                    }}
                  >
                    <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-muted/30 hover:bg-muted/50 border-border/40">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 text-muted-foreground group-hover:text-foreground transition-colors">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-foreground tracking-tight">
                            {getActivityLabel(activity)}
                          </p>
                          {activity.details.note && (
                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 font-light leading-relaxed">
                              {activity.details.note}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider font-light">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            )}

            {/* 4. OUTRO REFLECTION - Graceful closing with animation */}
            <div className="px-6 pt-2 pb-2 animate-story-outro-enter">
              <div className="relative py-6 px-5 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/20">
                <p className="text-sm text-muted-foreground leading-relaxed italic text-center font-light tracking-wide">
                  {getOutroReflection()}
                </p>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-background border border-border/20 flex items-center justify-center">
                    <span className="text-xs">💫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {!heroMoment && highlights.length === 0 && todayActivities.length === 0 && (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl opacity-40">📸</span>
                </div>
                <p className="text-base text-muted-foreground font-light">
                  No moments captured yet today.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2 font-light">
                  Start logging to build {babyName ? `${babyName}'s` : "your baby's"} story
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
