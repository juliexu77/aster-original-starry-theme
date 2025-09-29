import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useHousehold } from "@/hooks/useHousehold";

interface Activity {
  id: string;
  type: string;
  logged_at: string;
  details: any;
}

interface NightDoulaReviewProps {
  activities: Activity[];
  babyName?: string;
}

export const NightDoulaReview = ({ activities, babyName }: NightDoulaReviewProps) => {
  const { household } = useHousehold();
  const [showReview, setShowReview] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [persistedReview, setPersistedReview] = useState<string | null>(null);
  const [showFeedbackQuestion, setShowFeedbackQuestion] = useState(false);
  const [userFeedback, setUserFeedback] = useState<string | null>(null);
  const [doulaResponse, setDoulaResponse] = useState<string | null>(null);

  // Load persisted review on mount
  useEffect(() => {
    const saved = localStorage.getItem('nightDoulaReview');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        setPersistedReview(parsed.text);
        setShowReview(true);
        setTypedText(parsed.text);
        if (parsed.feedback) {
          setUserFeedback(parsed.feedback);
          setDoulaResponse(parsed.response);
        }
      } else {
        // Clear old review
        localStorage.removeItem('nightDoulaReview');
      }
    }
  }, []);

  // Check if it's evening and show review prompt
  useEffect(() => {
    if (persistedReview) return; // Don't show prompt if already has review
    
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const hasActivitiesToday = activities.some(activity => {
        const activityDate = new Date(activity.logged_at);
        return activityDate.toDateString() === now.toDateString();
      });
      
      setShowPrompt(hour >= 19 && hasActivitiesToday && !showReview); // 7 PM or later
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [activities, showReview, persistedReview]);

  const generatePersonalizedReview = (): string => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    
    // Get today's activities
    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.logged_at);
      return activityDate.toDateString() === today.toDateString();
    });

    // Get yesterday's activities for comparison
    const yesterdayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.logged_at);
      return activityDate.toDateString() === yesterday.toDateString();
    });

    const feeds = todayActivities.filter(a => a.type === "feed");
    const naps = todayActivities.filter(a => a.type === "nap");
    const diapers = todayActivities.filter(a => a.type === "diaper");
    const notes = todayActivities.filter(a => a.type === "note");

    const yesterdayFeeds = yesterdayActivities.filter(a => a.type === "feed");
    const yesterdayNaps = yesterdayActivities.filter(a => a.type === "nap");

    const name = babyName || household?.baby_name || "your little one";
    const totalIntake = feeds.reduce((sum, f) => {
      const quantity = f.details?.quantity || 0;
      return sum + (parseFloat(quantity as string) || 0);
    }, 0);

    const yesterdayIntake = yesterdayFeeds.reduce((sum, f) => {
      const quantity = f.details?.quantity || 0;
      return sum + (parseFloat(quantity as string) || 0);
    }, 0);

    let review = `Good evening! Let me share how ${name}'s day went. `;

    // Feeding insights with comparisons
    if (feeds.length > 0) {
      review += `${name} had ${feeds.length} feeds today`;
      
      if (yesterdayFeeds.length > 0) {
        if (feeds.length > yesterdayFeeds.length + 1) {
          review += ` - that's more than usual! This could signal a growth spurt coming, so don't be surprised if ${name} seems extra hungry over the next few days. `;
        } else if (feeds.length < yesterdayFeeds.length - 1) {
          review += ` - fewer than yesterday. ${name} might be spacing out feeds more or could be feeling a bit under the weather. Keep an eye on their energy levels. `;
        } else {
          review += ` and took in ${totalIntake.toFixed(1)}${feeds.some(f => f.details?.unit === 'ml') ? 'ml' : 'oz'} total. ${name} seems to be settling into a nice rhythm. `;
        }
      } else {
        review += ` and took in ${totalIntake.toFixed(1)}${feeds.some(f => f.details?.unit === 'ml') ? 'ml' : 'oz'} total. `;
      }

      // Compare intake amounts
      if (yesterdayIntake > 0 && totalIntake > yesterdayIntake * 1.2) {
        review += `They ate significantly more than yesterday - definitely watch for growth spurt signs like increased fussiness or wanting to feed more frequently. `;
      } else if (yesterdayIntake > 0 && totalIntake < yesterdayIntake * 0.8) {
        review += `They ate less than yesterday, which might mean they're going through a lighter phase or could be fighting something off. `;
      }
    }

    // Sleep insights with comparisons
    if (naps.length > 0) {
      const totalNapTime = naps.reduce((sum, n) => {
        if (n.details?.startTime && n.details?.endTime) {
          const start = new Date(`1970-01-01 ${n.details.startTime}`);
          const end = new Date(`1970-01-01 ${n.details.endTime}`);
          return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        }
        return sum;
      }, 0);

      const yesterdayNapTime = yesterdayNaps.reduce((sum, n) => {
        if (n.details?.startTime && n.details?.endTime) {
          const start = new Date(`1970-01-01 ${n.details.startTime}`);
          const end = new Date(`1970-01-01 ${n.details.endTime}`);
          return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        }
        return sum;
      }, 0);

      if (totalNapTime > 0) {
        const napHours = Math.floor(totalNapTime / 60);
        const napMins = totalNapTime % 60;
        review += `For sleep, ${name} napped for ${napHours}h ${napMins}m today`;
        
        if (yesterdayNapTime > 0) {
          if (totalNapTime < yesterdayNapTime * 0.7) {
            review += ` - much shorter than yesterday. They might be overtired, so watch for early bedtime cues or extra crankiness tonight. `;
          } else if (totalNapTime > yesterdayNapTime * 1.4) {
            review += ` - longer than yesterday! They might have needed the extra rest or could be going through a developmental leap. `;
          } else {
            review += `. Nice consistent sleep patterns emerging! `;
          }
        } else {
          review += `. `;
        }
      }
    }

    // Diaper insights
    if (diapers.length > 0) {
      review += `You changed ${diapers.length} diapers today`;
      if (diapers.length >= 6) {
        review += ` - excellent hydration signs! `;
      } else if (diapers.length < 4) {
        review += ` - keep an eye on hydration, especially if ${name} seems fussy. `;
      } else {
        review += ` - good signs of healthy intake. `;
      }
    }

    // Notes appreciation
    if (notes.length > 0) {
      review += `I also noticed you made ${notes.length} special note${notes.length > 1 ? 's' : ''} about ${name} today - these observations help track their development beautifully. `;
    }

    // Encouraging conclusion with feedback question
    review += `You're doing wonderfully with ${name}. Every day teaches you more about their unique needs and rhythms.`;

    return review;
  };

  const generateFeedbackResponse = (feedback: string): string => {
    const name = babyName || household?.baby_name || "your little one";
    const responses = {
      great: [
        `I'm so glad to hear that! Those wonderful days remind us why this journey is so special. ${name} is lucky to have someone so attentive.`,
        `That's beautiful! Days like these are gifts. You're clearly in tune with ${name}'s needs and it shows.`,
        `How lovely! These golden days are exactly what parenting is about. You should feel proud of how well you're caring for ${name}.`
      ],
      good: [
        `I'm happy things went well! Steady, peaceful days are such a blessing with little ones.`,
        `That sounds like a really solid day. You're finding your rhythm with ${name} and it's working beautifully.`,
        `Wonderful! Those good days give us energy for the trickier ones. You're doing great with ${name}.`
      ],
      okay: [
        `Some days are just like that, and that's completely normal. You still showed up for ${name} and that's what matters most.`,
        `I hear you. Not every day feels perfect, but you're still doing all the important things for ${name}. Tomorrow is a fresh start.`,
        `Those in-between days are part of the journey. ${name} doesn't need perfect days, just your loving presence.`
      ],
      tough: [
        `Oh honey, I hear you. Hard days are so draining, but please know you're not alone in feeling this way. ${name} is fortunate to have someone who cares so deeply.`,
        `Difficult days are part of this journey, even though they're exhausting. Your dedication to ${name} shines through even on the hardest days.`,
        `I'm sending you extra support tonight. These challenging days don't reflect your parenting - they reflect how demanding caring for ${name} can be. Rest if you can.`
      ]
    };

    let category = 'okay';
    const lowerFeedback = feedback.toLowerCase();
    
    if (lowerFeedback.includes('great') || lowerFeedback.includes('amazing') || lowerFeedback.includes('wonderful') || lowerFeedback.includes('perfect')) {
      category = 'great';
    } else if (lowerFeedback.includes('good') || lowerFeedback.includes('nice') || lowerFeedback.includes('well')) {
      category = 'good';
    } else if (lowerFeedback.includes('hard') || lowerFeedback.includes('difficult') || lowerFeedback.includes('tough') || lowerFeedback.includes('exhausting') || lowerFeedback.includes('overwhelming')) {
      category = 'tough';
    }

    const categoryResponses = responses[category as keyof typeof responses];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const startReview = () => {
    if (persistedReview) {
      setShowReview(true);
      setShowPrompt(false);
      setTypedText(persistedReview);
      return;
    }

    const reviewText = generatePersonalizedReview();
    setShowReview(true);
    setShowPrompt(false);
    setIsTyping(true);
    setTypedText("");
    
    // Faster typing effect like ChatGPT
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < reviewText.length) {
        setTypedText(reviewText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setShowFeedbackQuestion(true);
        
        // Save to localStorage
        const reviewData = {
          text: reviewText,
          date: new Date().toDateString()
        };
        localStorage.setItem('nightDoulaReview', JSON.stringify(reviewData));
      }
    }, 12); // Much faster typing speed (was 25ms, now 12ms)
  };

  const handleFeedbackSubmit = (feedback: string) => {
    setUserFeedback(feedback);
    const response = generateFeedbackResponse(feedback);
    setDoulaResponse(response);
    setShowFeedbackQuestion(false);

    // Update localStorage with feedback
    const saved = localStorage.getItem('nightDoulaReview');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.feedback = feedback;
      parsed.response = response;
      localStorage.setItem('nightDoulaReview', JSON.stringify(parsed));
    }
  };

  // Don't show anything if it's not evening or no activities today, unless we have a persisted review
  if (!showPrompt && !showReview && !persistedReview) {
    return null;
  }

  if (showPrompt && !showReview) {
    return (
      <Card className="mb-4 bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Want to hear about your day?
              </span>
            </div>
            <Button 
              onClick={startReview}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Yes, please
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Your Day Together
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowReview(false);
              setShowPrompt(false);
              setTypedText("");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="text-foreground leading-relaxed">
          {typedText}
          {isTyping && (
            <span className="inline-flex items-center ml-1">
              <span className="w-1 h-1 bg-foreground rounded-full animate-pulse"></span>
              <span className="w-1 h-1 bg-foreground rounded-full animate-pulse ml-0.5" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 h-1 bg-foreground rounded-full animate-pulse ml-0.5" style={{ animationDelay: '0.4s' }}></span>
            </span>
          )}
          
          {/* Feedback Question */}
          {showFeedbackQuestion && !userFeedback && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">How did today feel for you?</p>
              <div className="flex flex-wrap gap-2">
                {["It was great!", "Pretty good", "Just okay", "Really tough"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFeedbackSubmit(option)}
                    className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded-full transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Doula Response to Feedback */}
          {doulaResponse && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">{doulaResponse}</p>
              <p className="text-xs text-muted-foreground mt-2">Rest well tonight! 💙</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};