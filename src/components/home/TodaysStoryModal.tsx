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
  // Detect day tone
  const getDayTone = () => {
    if (feedCount >= 7) return { emoji: "🍼", label: "Feed-Heavy Day" };
    if (napCount >= 4) return { emoji: "😴", label: "Rest-Focused Day" };
    if (allHighlights.some(a => a.details.feedType === "solid")) return { emoji: "🥑", label: "New Foods Day" };
    if (todayActivities.length > 12) return { emoji: "✨", label: "Busy Day" };
    return { emoji: "🌙", label: "Balanced Day" };
  };

  const dayTone = getDayTone();

  // Generate parent-focused summary
  const getSummaryLine = () => {
    if (napCount >= 3) {
      return `You gave ${babyName || "your baby"} the rest they needed today — what a peaceful rhythm.`;
    } else if (feedCount >= 6) {
      return `You kept ${babyName || "your baby"} well-fed and happy today — what a solid rhythm.`;
    } else if (allHighlights.some(a => a.details.feedType === "solid")) {
      return `New foods, good feeding — you're helping ${babyName || "your baby"} explore beautifully.`;
    } else if (todayActivities.length > 10) {
      return `Another full day together. You're doing this beautifully.`;
    } else {
      return `Everything stayed on rhythm today — you've got this down.`;
    }
  };

  // Generate confidence insight based on data
  const getConfidenceInsight = () => {
    const avgFeedsPerDay = 6;
    const avgNapsPerDay = 3;
    
    if (Math.abs(feedCount - avgFeedsPerDay) <= 1 && Math.abs(napCount - avgNapsPerDay) <= 1) {
      return "Everything stayed on rhythm today — great consistency.";
    } else if (feedCount > avgFeedsPerDay + 1) {
      return "Feeds slightly above weekly average — likely a growth day.";
    } else if (napCount >= 4) {
      return "Extra rest today — their body knows what it needs.";
    } else if (todayActivities.some(a => a.type === "measure")) {
      return "Growth check logged — you're tracking the milestones that matter.";
    } else {
      return "Steady patterns, no surprises — exactly what you want to see.";
    }
  };

  // Generate affirming closure
  const getOutroReflection = () => {
    const hasPhotos = photosWithNotes.length > 0;
    const hasNotes = todayActivities.some(a => a.details.note);
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= 18;
    
    if (isEvening) {
      return "Everything points to a balanced day. Sleep well — tomorrow will build on this rhythm.";
    } else if (hasPhotos && hasNotes) {
      return "You're capturing the story as it unfolds. Keep trusting your rhythm.";
    } else if (napCount >= 3 && feedCount >= 5) {
      return "Solid feeding, good rest — you're in control. Baby's good. Keep going.";
    } else if (todayActivities.length > 8) {
      return "You're staying present through it all. That's what matters most.";
    } else {
      return "Steady, intentional care — exactly what they need from you.";
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
                  className="w-full h-full object-cover animate-story-photo-zoom"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-base font-medium tracking-wide drop-shadow-lg animate-story-text-reveal" style={{ animationDelay: '0.3s' }}>
                    {heroMoment.details.note || `${getActivityLabel(heroMoment)} — ${heroMoment.time}`}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 animate-story-shimmer">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* 2. DAY TONE CHIP + SUMMARY + CONFIDENCE INSIGHT */}
            <div className="px-6 space-y-4 animate-story-text-reveal" style={{ animationDelay: '0.5s' }}>
              {/* Tone chip */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-light tracking-wider">
                <span>{dayTone.emoji}</span>
                <span>{dayTone.label}</span>
                <span className="text-muted-foreground/30">•</span>
                <span>Consistent rhythm</span>
              </div>

              {/* Summary line */}
              <p className="text-xl font-semibold text-foreground leading-relaxed tracking-tight">
                {getSummaryLine()}
              </p>

              {/* Confidence insight */}
              <div className="pt-3 border-t border-border/20">
                <p className="text-sm text-muted-foreground italic font-light leading-relaxed">
                  {getConfidenceInsight()}
                </p>
              </div>
            </div>

            {/* 3. SUPPORTING STATS - Calm metrics with icons */}
            <div className="px-6 animate-story-stats-enter" style={{ animationDelay: '0.7s' }}>
              <div className="flex gap-6 justify-center py-3">
                <div className="text-center">
                  <div className="text-lg font-medium text-foreground/80 tabular-nums tracking-tight animate-story-count-up">
                    🍼 {feedCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-foreground/80 tabular-nums tracking-tight animate-story-count-up" style={{ animationDelay: '0.1s' }}>
                    😴 {napCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-foreground/80 tabular-nums tracking-tight animate-story-count-up" style={{ animationDelay: '0.2s' }}>
                    💧 {diaperCount}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. TODAY'S RHYTHM MOMENTS - Memory tiles with cause/effect */}
            {highlights.length > 0 && (
              <div className="px-6 space-y-3">
                {highlights.map((activity, index) => {
                  const getActivityEmoji = (type: string) => {
                    switch (type) {
                      case "feed": return activity.details.feedType === "solid" ? "🥑" : "🍼";
                      case "nap": return activity.details.isNightSleep ? "🌙" : "😴";
                      case "diaper": return "💧";
                      case "note": return "📝";
                      case "measure": return "📏";
                      default: return "✨";
                    }
                  };

                  const getMemoryNote = (activity: Activity): string => {
                    if (activity.details.note) return activity.details.note;
                    
                    switch (activity.type) {
                      case "feed":
                        if (activity.details.feedType === "solid") {
                          return "Exploring new tastes and textures beautifully.";
                        }
                        return "Fed well and content.";
                      case "nap":
                        if (activity.details.isNightSleep) {
                          return "Down easily after a full day together.";
                        }
                        return "Rested peacefully when needed.";
                      case "measure":
                        return "Growing strong — another milestone tracked.";
                      case "note":
                        return "A moment worth remembering.";
                      default:
                        return "";
                    }
                  };

                  return (
                    <div
                      key={activity.id}
                      className="animate-story-card-enter"
                      style={{
                        animationDelay: `${0.9 + index * 0.15}s`
                      }}
                    >
                      <Card className="p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] bg-gradient-to-br from-muted/40 to-muted/20 border-border/30 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="text-xl mt-0.5">
                            {getActivityEmoji(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-foreground tracking-tight flex items-center gap-2">
                              {getActivityLabel(activity)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1.5 font-light leading-relaxed">
                              {getMemoryNote(activity)}
                            </p>
                            <p className="text-[10px] text-muted-foreground/50 mt-2.5 uppercase tracking-wider font-light">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. CLOSING AFFIRMATION - Grounded sign-off */}
            <div className="px-6 pt-2 pb-2 animate-story-outro-enter" style={{ animationDelay: `${1.2 + highlights.length * 0.15}s` }}>
              <div className="relative py-8 px-6 rounded-2xl bg-gradient-to-b from-muted/30 via-muted/20 to-transparent border border-border/10 overflow-hidden">
                {/* Subtle dusk gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0 opacity-50" />
                
                <p className="relative text-sm text-foreground/90 leading-relaxed text-center font-light tracking-wide">
                  {getOutroReflection()}
                </p>
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-background border border-border/20 flex items-center justify-center shadow-sm">
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
