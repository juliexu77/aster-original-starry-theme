import { useState, useEffect } from "react";
import { Activity } from "./ActivityCard";
import { useHousehold } from "@/hooks/useHousehold";
import { BabyCarePredictionEngine } from "@/utils/predictionEngine";
import { Clock, Baby, Moon, StickyNote, Image, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DailyReviewProps {
  activities: Activity[];
}

interface ReviewMessage {
  type: "text" | "image";
  content: string;
  imageUrl?: string;
  delay?: number;
}

export const DailyReview = ({ activities }: DailyReviewProps) => {
  const { household } = useHousehold();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);

  // Check if it's evening (after 7 PM) and show review button
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const hasActivitiesToday = activities.some(activity => {
        const activityDate = new Date(activity.loggedAt);
        return activityDate.toDateString() === now.toDateString();
      });
      
      setShowReviewButton(hour >= 19 && hasActivitiesToday); // 7 PM or later
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [activities]);

  const generateDailyReview = (): ReviewMessage[] => {
    const today = new Date();
    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.loggedAt);
      return activityDate.toDateString() === today.toDateString();
    });

    const feeds = todayActivities.filter(a => a.type === "feed");
    const naps = todayActivities.filter(a => a.type === "nap");
    const diapers = todayActivities.filter(a => a.type === "diaper");
    const notes = todayActivities.filter(a => a.type === "note");
    const photosActivities = todayActivities.filter(a => a.details?.note && a.details.note.includes('📸')); // Simplified photo detection

    const totalIntake = feeds.reduce((sum, f) => {
      const quantity = f.details?.quantity || 0;
      return sum + (parseFloat(quantity as string) || 0);
    }, 0);

    const totalNapTime = naps.reduce((sum, n) => {
      // Calculate from start/end times if available
      if (n.details?.startTime && n.details?.endTime) {
        const start = new Date(`1970-01-01 ${n.details.startTime}`);
        const end = new Date(`1970-01-01 ${n.details.endTime}`);
        return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      }
      return sum;
    }, 0);

    const babyName = household?.baby_name || "Baby";
    const messages: ReviewMessage[] = [];

    // Opening message
    messages.push({
      type: "text",
      content: `Good evening! 🌅 Let me share a quick review of ${babyName}'s day today.`,
      delay: 1000
    });

    // Feeding summary
    if (feeds.length > 0) {
      const avgInterval = feeds.length > 1 ? 
        Math.round((new Date().getTime() - new Date(feeds[feeds.length - 1].loggedAt || '').getTime()) / (feeds.length - 1) / (1000 * 60 * 60)) : 0;
      
      messages.push({
        type: "text",
        content: `🍼 **Feeding Summary**: ${babyName} had ${feeds.length} feeds today, with a total intake of ${totalIntake.toFixed(1)}${feeds.some(f => f.details?.unit === 'ml') ? 'ml' : 'oz'}. ${feeds.length >= 6 ? "Great feeding schedule!" : feeds.length >= 4 ? "Solid feeding day!" : "Fewer feeds than usual today."}`,
        delay: 2000
      });
    } else {
      messages.push({
        type: "text",
        content: `🍼 No feeds were logged today. Remember to track feedings for better insights!`,
        delay: 2000
      });
    }

    // Sleep summary
    if (naps.length > 0 && totalNapTime > 0) {
      const napHours = Math.floor(totalNapTime / 60);
      const napMins = totalNapTime % 60;
      messages.push({
        type: "text",
        content: `😴 **Sleep Summary**: ${babyName} took ${naps.length} nap${naps.length > 1 ? 's' : ''} today, totaling ${napHours}h ${napMins}m. ${totalNapTime > 180 ? "Excellent rest!" : totalNapTime > 120 ? "Good sleep patterns!" : "Consider encouraging more daytime sleep."}`,
        delay: 2000
      });
    } else if (naps.length > 0) {
      messages.push({
        type: "text",
        content: `😴 ${naps.length} nap${naps.length > 1 ? 's were' : ' was'} logged today. Remember to add start and end times for better sleep tracking!`,
        delay: 2000
      });
    }

    // Diaper summary
    if (diapers.length > 0) {
      messages.push({
        type: "text",
        content: `🍼 **Diaper Changes**: ${diapers.length} diaper changes today. ${diapers.length >= 6 ? "Right on track!" : "Consider tracking more changes if needed."}`,
        delay: 1500
      });
    }

    // Photos
    if (photosActivities.length > 0) {
      messages.push({
        type: "text",
        content: `📸 **Special Moments**: You captured some beautiful moments today! Here are the photos you took:`,
        delay: 1500
      });

      photosActivities.forEach(activity => {
        // For now, just show a placeholder for photos in notes
        messages.push({
          type: "text",
          content: `📸 Photo moment captured at ${activity.time}: ${activity.details?.note || 'Special moment'}`,
          delay: 1000
        });
      });
    }

    // Notes summary
    if (notes.length > 0) {
      messages.push({
        type: "text",
        content: `📝 **Notes & Observations**: You logged ${notes.length} note${notes.length > 1 ? 's' : ''} today. These observations help track ${babyName}'s development and patterns!`,
        delay: 1500
      });
    }

    // AI insights using prediction engine
    if (todayActivities.length >= 3) {
      const engine = new BabyCarePredictionEngine(activities, household?.baby_birthday);
      const prediction = engine.getNextAction();
      
      messages.push({
        type: "text",
        content: `🤖 **AI Insight**: Based on today's patterns, ${babyName} seems to be ${prediction.confidence > 0.7 ? 'following a consistent' : 'developing a'} routine. ${prediction.next_action === 'LET_SLEEP_CONTINUE' ? 'Currently sleeping peacefully.' : prediction.next_action === 'FEED_NOW' ? 'May be ready for a feeding soon.' : 'Enjoying some active time!'}`,
        delay: 2000
      });
    }

    // Closing message
    messages.push({
      type: "text",
      content: `That's a wrap for today! 🌙 Tomorrow is a new day full of possibilities with ${babyName}. Sweet dreams! ✨`,
      delay: 2000
    });

    return messages;
  };

  const startReview = () => {
    const reviewMessages = generateDailyReview();
    setMessages(reviewMessages);
    setCurrentMessageIndex(-1);
    setIsReviewOpen(true);
    setTypedText("");
    
    // Start the first message after a brief delay
    setTimeout(() => {
      showNextMessage(reviewMessages, 0);
    }, 500);
  };

  const showNextMessage = (allMessages: ReviewMessage[], index: number) => {
    if (index >= allMessages.length) return;

    setCurrentMessageIndex(index);
    const message = allMessages[index];

    if (message.type === "text") {
      setIsTyping(true);
      setTypedText("");
      
      // Simulate typing effect
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < message.content.length) {
          setTypedText(message.content.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Show next message after delay
          setTimeout(() => {
            showNextMessage(allMessages, index + 1);
          }, message.delay || 1500);
        }
      }, 30); // Typing speed
    } else {
      // For images, show immediately and move to next
      setTimeout(() => {
        showNextMessage(allMessages, index + 1);
      }, message.delay || 1000);
    }
  };

  if (!showReviewButton) return null;

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 animate-fade-in">
        <Button
          onClick={startReview}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Daily Review
        </Button>
      </div>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Daily Review
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
            {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
              <div key={index} className="animate-fade-in">
                {message.type === "text" ? (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="whitespace-pre-wrap">
                      {index === currentMessageIndex ? typedText : message.content}
                      {index === currentMessageIndex && isTyping && (
                        <span className="animate-pulse">|</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                    {message.imageUrl && (
                      <img 
                        src={message.imageUrl} 
                        alt="Daily moment" 
                        className="rounded-lg max-w-full h-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is typing...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};