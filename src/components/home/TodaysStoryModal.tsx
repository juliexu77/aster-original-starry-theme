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
  // Calculate daily averages for comparison
  const avgFeedsPerDay = 6;
  const avgNapsPerDay = 3;
  const totalNapMinutes = todayActivities
    .filter(a => a.type === "nap" && !a.details.isNightSleep)
    .reduce((sum, a) => {
      if (a.details.startTime && a.details.endTime) {
        const start = new Date(`2000-01-01 ${a.details.startTime}`);
        const end = new Date(`2000-01-01 ${a.details.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60);
      }
      return sum + 90; // Default 90 min if no times
    }, 0);
  const totalSleepHours = (totalNapMinutes / 60).toFixed(1);
  const avgSleepHours = 14;

  // Detect day tone with theme
  const getDayTone = () => {
    const feedDiff = feedCount - avgFeedsPerDay;
    const napDiff = napCount - avgNapsPerDay;
    const sleepDiff = parseFloat(totalSleepHours) - avgSleepHours;

    if (feedDiff >= 2) return { emoji: "🍼", theme: "feed", color: "hsl(var(--pp-terracotta))" };
    if (napDiff >= 2 || sleepDiff >= 2) return { emoji: "😴", theme: "sleep", color: "hsl(var(--pp-lavender))" };
    if (allHighlights.some(a => a.details.feedType === "solid")) return { emoji: "🥑", theme: "growth", color: "hsl(var(--pp-mint))" };
    if (Math.abs(feedDiff) <= 1 && Math.abs(napDiff) <= 1) return { emoji: "✨", theme: "balanced", color: "hsl(var(--accent-1))" };
    return { emoji: "🌙", theme: "calm", color: "hsl(var(--muted-foreground))" };
  };

  const dayTone = getDayTone();

  // Generate Oura-style "Day Summary Signal" - ONE clear emotionally-weighted line
  const getHeadlineSignal = () => {
    const feedDiff = feedCount - avgFeedsPerDay;
    const napDiff = napCount - avgNapsPerDay;
    const sleepDiff = parseFloat(totalSleepHours) - avgSleepHours;

    // Growth day
    if (feedDiff >= 2) {
      return "More feeds than usual — a growth day!";
    }
    
    // Sleep heavy
    if (napDiff >= 2) {
      return "Extra rest today — their body knew what it needed.";
    }
    
    // Slightly off but okay
    if (sleepDiff < -1 && napDiff < 0) {
      return "Slightly shorter naps, but total sleep still on track. You're doing great.";
    }
    
    // New milestone
    if (allHighlights.some(a => a.details.feedType === "solid")) {
      return "New foods explored — another milestone reached naturally.";
    }
    
    // Perfect balance
    if (Math.abs(feedDiff) <= 1 && Math.abs(napDiff) <= 1 && Math.abs(sleepDiff) <= 1) {
      return "A steady rhythm today — well-fed, well-rested, and content.";
    }
    
    // Busy but good
    if (todayActivities.length > 12) {
      return "The rhythm stayed smooth all day. You kept pace beautifully.";
    }
    
    // Default positive
    return "Everything unfolded naturally. You're in sync.";
  };

  // Calculate balance metrics
  const getBalanceMetrics = () => {
    const feedDiff = feedCount - avgFeedsPerDay;
    const napDiff = napCount - avgNapsPerDay;
    const sleepDiff = parseFloat(totalSleepHours) - avgSleepHours;

    return {
      feeds: {
        value: feedCount,
        fillPercent: Math.min((feedCount / 8) * 100, 100),
        comparison: feedDiff > 0 ? `+${feedDiff} above usual` : feedDiff < 0 ? `${feedDiff} below usual` : "steady"
      },
      sleep: {
        value: `${totalSleepHours}h`,
        fillPercent: Math.min((parseFloat(totalSleepHours) / 16) * 100, 100),
        comparison: sleepDiff > 0 ? `+${sleepDiff.toFixed(1)}h vs typical` : sleepDiff < 0 ? `${sleepDiff.toFixed(1)}h vs typical` : "on track"
      },
      awake: {
        value: napCount,
        fillPercent: Math.min((napCount / 5) * 100, 100),
        comparison: napDiff > 0 ? "more active" : napDiff < 0 ? "more rest" : "steady"
      }
    };
  };

  const balanceMetrics = getBalanceMetrics();

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0 gap-0 bg-background">
        {/* Minimal header */}
        <div className="relative px-6 pt-8 pb-3">
          <DialogHeader>
            <DialogTitle className="text-sm font-light tracking-widest uppercase text-muted-foreground/60">
              {babyName ? `${babyName}'s Day` : "Today's Story"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] pb-8">
          <div className="space-y-10">
            {/* 1. HERO MOMENT with overlaid headline */}
            {heroMoment && heroMoment.details.photoUrl ? (
              <div className="relative w-full aspect-[4/3] overflow-hidden animate-story-hero-enter">
                <img 
                  src={heroMoment.details.photoUrl} 
                  alt="Today's moment" 
                  className="w-full h-full object-cover animate-story-photo-zoom"
                />
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Headline Signal overlaid on photo */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="text-3xl animate-story-breathe flex-shrink-0" 
                      style={{ color: 'white' }}
                    >
                      {dayTone.emoji}
                    </div>
                    <p className="text-2xl font-light text-white leading-relaxed tracking-tight animate-story-text-reveal drop-shadow-lg" style={{ animationDelay: '0.2s', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {getHeadlineSignal()}
                    </p>
                  </div>
                  {heroMoment.details.note && (
                    <p className="text-sm text-white/80 font-light tracking-wide drop-shadow-md pl-[52px]">
                      {heroMoment.details.note}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // No photo: headline stands alone
              <div className="px-8 pt-4 animate-story-text-reveal">
                <div className="flex items-start gap-4">
                  <div 
                    className="text-4xl animate-story-breathe flex-shrink-0 mt-1" 
                    style={{ color: dayTone.color }}
                  >
                    {dayTone.emoji}
                  </div>
                  <p className="text-2xl font-light text-foreground leading-relaxed tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {getHeadlineSignal()}
                  </p>
                </div>
              </div>
            )}

            {/* 2. OURA-STYLE BALANCE BARS */}
            <div className="px-8 space-y-5 animate-story-stats-enter" style={{ animationDelay: '0.4s' }}>
              {/* Feeds */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍼</span>
                    <span className="font-light text-muted-foreground">Feeds</span>
                  </div>
                  <span className="text-xs font-light text-muted-foreground">{balanceMetrics.feeds.comparison}</span>
                </div>
                <div className="relative h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(var(--pp-terracotta))] to-[hsl(var(--pp-terracotta))]/80 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${balanceMetrics.feeds.fillPercent}%`, animationDelay: '0.5s' }}
                  />
                </div>
              </div>

              {/* Sleep */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">😴</span>
                    <span className="font-light text-muted-foreground">Sleep</span>
                  </div>
                  <span className="text-xs font-light text-muted-foreground">{balanceMetrics.sleep.comparison}</span>
                </div>
                <div className="relative h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(var(--pp-lavender))] to-[hsl(var(--pp-lavender))]/80 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${balanceMetrics.sleep.fillPercent}%`, animationDelay: '0.6s' }}
                  />
                </div>
              </div>

              {/* Awake periods */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌤</span>
                    <span className="font-light text-muted-foreground">Awake</span>
                  </div>
                  <span className="text-xs font-light text-muted-foreground">{balanceMetrics.awake.comparison}</span>
                </div>
                <div className="relative h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(var(--accent-1))] to-[hsl(var(--accent-1))]/80 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${balanceMetrics.awake.fillPercent}%`, animationDelay: '0.7s' }}
                  />
                </div>
              </div>
            </div>


            {/* 3. TODAY'S RHYTHM MOMENTS - Memory tiles */}
            {highlights.length > 0 && (
              <div className="px-8 space-y-4">
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
                        animationDelay: `${0.9 + index * 0.1}s`
                      }}
                    >
                      <div className="p-5 bg-muted/20 border-l-2 border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl mt-0.5 opacity-60">
                            {getActivityEmoji(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light text-muted-foreground/70 uppercase tracking-wider mb-1.5">
                              {activity.time}
                            </p>
                            <p className="text-base font-normal text-foreground leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                              {getActivityLabel(activity)}
                            </p>
                            {getMemoryNote(activity) && (
                              <p className="text-sm text-muted-foreground mt-2 font-light leading-relaxed italic">
                                {getMemoryNote(activity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. CLOSING AFFIRMATION - Minimal sign-off */}
            <div className="px-8 pt-6 pb-4 animate-story-outro-enter" style={{ animationDelay: `${1.2 + highlights.length * 0.1}s` }}>
              <div className="py-8 border-t border-border/10">
                <p className="text-base text-muted-foreground/80 leading-relaxed text-center font-light tracking-wide italic" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {getOutroReflection()}
                </p>
              </div>
            </div>

            {/* Empty State */}
            {todayActivities.length === 0 && (
              <div className="text-center py-16 px-8">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl opacity-30">🌙</span>
                </div>
                <p className="text-lg text-muted-foreground/70 font-light leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  No moments captured yet today.
                </p>
                <p className="text-sm text-muted-foreground/50 mt-3 font-light">
                  Start logging to see today's rhythm unfold
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
