import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Moon } from "lucide-react";
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

interface NapClassification {
  type: 'all-short' | 'all-long' | 'mix' | 'single-short' | 'single-long';
  description: string;
}

interface DayStats {
  feeds: number;
  volume: number;
  unit: string;
  naps: number;
  napDuration: number;
  bedtime: string | null;
  notes: Activity[];
  photos: string[];
}

// Age norms in months
const AGE_NORMS = {
  '0-2': { feeds: [8, 12], naps: [4, 6], napTime: [4, 6] },
  '3-4': { feeds: [6, 10], naps: [4, 5], napTime: [4, 5] },
  '5-6': { feeds: [5, 8], naps: [3, 4], napTime: [3, 4] },
  '7-9': { feeds: [4, 7], naps: [2, 3], napTime: [2.5, 3.5] },
  '10-12': { feeds: [3, 6], naps: [2, 3], napTime: [2, 3] },
  '12+': { feeds: [3, 5], naps: [1, 2], napTime: [1.5, 2.5] }
};

// Sentence library for varied responses
const SENTENCE_LIBRARY = {
  feeds: [
    "{baby_name} had {feed_count} feeds today (about {feed_total_ml} ml).",
    "He finished {feed_count} feeds in total, around {feed_total_ml} ml altogether.",
    "Today's tally: {feed_count} feeds, adding up to about {feed_total_ml} ml.",
    "He got in {feed_count} feeds, for roughly {feed_total_ml} ml overall."
  ],
  naps: {
    'all-short': [
      "All of his naps were on the shorter side, ~30 minutes each.",
      "He only managed catnaps today, nothing longer than half an hour.",
      "Every nap was brief, closer to 30 minutes."
    ],
    'all-long': [
      "He took two solid stretches, each well over an hour.",
      "All of his naps today were longer, more than an hour each.",
      "Nice long naps throughout — each lasting over an hour."
    ],
    'mix': [
      "It was a mix — two short naps and one long stretch in the late morning.",
      "He balanced a long nap with a couple of shorter ones.",
      "Today had variety: one good long nap and two quicker ones."
    ]
  },
  bedtime: [
    "Bedtime was {bedtime}.",
    "He settled for the night at {bedtime}.",
    "Down for sleep at {bedtime}, right on schedule.",
    "He was asleep for the night by {bedtime}."
  ],
  notes: [
    "You mentioned {note_reference} — that could explain {note_related_effect}.",
    "Since you noted {note_reference}, that likely played a role today.",
    "You wrote about {note_reference}; it makes sense that {note_related_effect}.",
    "Noticing {note_reference} probably affected how his day unfolded."
  ],
  comparison: {
    feeds: [
      "He drank about {diff} ml more than yesterday.",
      "That's {diff} ml less than yesterday's intake.",
      "Slightly {more_less} hungry compared to yesterday."
    ],
    naps: [
      "He got about {diff} minutes more daytime sleep than yesterday.",
      "That's {diff} minutes less nap time than the day before.",
      "Compared to yesterday, naps were {shorter_longer}."
    ],
    bedtime: [
      "He went down {diff} minutes earlier than yesterday.",
      "Tonight's bedtime was a little later than yesterday's.",
      "Bedtime shifted {earlier_later} compared to last night."
    ]
  },
  peer: [
    "For his age, most babies nap 3–4 times with at least one long nap — so he's right in range.",
    "Babies his age typically feed 5–8 times a day, so today's {feed_count} feeds are right on track.",
    "It's common at this age to see one or two long naps anchoring the day, which he managed today.",
    "This nap pattern is very normal for {baby_age} months."
  ],
  insight: [
    "Taken together, this points to a growth spurt.",
    "This rhythm often means he'll be extra tired tomorrow morning.",
    "That extra intake is a great sign he's fueling up for growth.",
    "Consistency like this sets a solid foundation.",
    "He may be catching up on rest, which is completely normal."
  ],
  encouragement: [
    "You're doing a wonderful job keeping his rhythm steady.",
    "He's thriving, and you're guiding him beautifully.",
    "Days like this really show how well you're supporting him.",
    "Keep trusting your instincts — they're serving him so well.",
    "You're giving him exactly what he needs."
  ]
};

export const NightDoulaReview = ({ activities, babyName }: NightDoulaReviewProps) => {
  const { household } = useHousehold();
  const [showReview, setShowReview] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [reviewGenerated, setReviewGenerated] = useState(false);
  const [fullReviewText, setFullReviewText] = useState("");
  const [isPulsing, setIsPulsing] = useState(false);

  // Check if review was already shown today
  useEffect(() => {
    const today = new Date().toDateString();
    const reviewShown = localStorage.getItem(`night-doula-${today}`);
    if (reviewShown) {
      setShowReview(true);
      setTypedText(reviewShown);
      setReviewGenerated(true);
    }
  }, []);

  // Calculate baby's age in months
  const getBabyAgeInMonths = (): number => {
    if (!household?.baby_birthday) return 6; // Default to 6 months
    const birthDate = new Date(household.baby_birthday);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
  };

  const getAgeNorms = (ageInMonths: number) => {
    if (ageInMonths <= 2) return AGE_NORMS['0-2'];
    if (ageInMonths <= 4) return AGE_NORMS['3-4'];
    if (ageInMonths <= 6) return AGE_NORMS['5-6'];
    if (ageInMonths <= 9) return AGE_NORMS['7-9'];
    if (ageInMonths <= 12) return AGE_NORMS['10-12'];
    return AGE_NORMS['12+'];
  };

  // Check trigger logic: after 7 PM with activities today
  useEffect(() => {
    const checkTrigger = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Show between 7 PM and 11 PM
      if (hour < 19 || hour > 23) return;
      
      const hasActivitiesToday = activities.some(activity => {
        const activityDate = new Date(activity.logged_at);
        return activityDate.toDateString() === now.toDateString();
      });
      
      if (hasActivitiesToday && !reviewGenerated) {
        setShowPrompt(true);
      }
    };

    checkTrigger();
    const interval = setInterval(checkTrigger, 60000);
    return () => clearInterval(interval);
  }, [activities, reviewGenerated]);

  // Classify naps by duration
  const classifyNaps = (napDurations: number[]): NapClassification => {
    if (napDurations.length === 0) {
      return { type: 'mix', description: 'no naps today' };
    }
    
    const shortNaps = napDurations.filter(d => d <= 40);
    const longNaps = napDurations.filter(d => d >= 60);
    
    if (napDurations.length === 1) {
      return {
        type: napDurations[0] <= 40 ? 'single-short' : 'single-long',
        description: napDurations[0] <= 40 ? 
          `one shorter nap around ${napDurations[0]} minutes` :
          `one solid stretch, just over ${Math.round(napDurations[0] / 60 * 10) / 10} hours`
      };
    }
    
    if (shortNaps.length === napDurations.length) {
      return {
        type: 'all-short',
        description: `all on the shorter side, around ${Math.round(napDurations.reduce((a, b) => a + b) / napDurations.length)} minutes each`
      };
    }
    
    if (longNaps.length === napDurations.length) {
      return {
        type: 'all-long',
        description: `${longNaps.length} solid stretches, each over an hour`
      };
    }
    
    return {
      type: 'mix',
      description: `a mix — ${shortNaps.length} short nap${shortNaps.length > 1 ? 's' : ''} and ${longNaps.length} long anchor nap${longNaps.length > 1 ? 's' : ''}`
    };
  };

  // Extract day stats
  const getDayStats = (date: Date): DayStats => {
    const activities_filtered = activities.filter(activity => {
      const activityDate = new Date(activity.logged_at);
      return activityDate.toDateString() === date.toDateString();
    });

    const feeds = activities_filtered.filter(a => a.type === 'feed');
    const naps = activities_filtered.filter(a => a.type === 'nap' && !a.details?.isNightSleep);
    const bedtimeNap = activities_filtered.find(a => a.type === 'nap' && a.details?.isNightSleep);
    const notes = activities_filtered.filter(a => a.type === 'note');

    const volume = feeds.reduce((sum, f) => {
      const qty = f.details?.quantity || 0;
      return sum + (parseFloat(qty as string) || 0);
    }, 0);

    const unit = feeds.find(f => f.details?.unit)?.details?.unit || 'ml';

    const napDuration = naps.reduce((sum, n) => {
      if (n.details?.startTime && n.details?.endTime) {
        const start = new Date(`1970-01-01 ${n.details.startTime}`);
        const end = new Date(`1970-01-01 ${n.details.endTime}`);
        return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      }
      return sum;
    }, 0);

    const bedtime = bedtimeNap?.details?.startTime || null;

    const photos = notes.flatMap(n => n.details?.photos || []);

    return {
      feeds: feeds.length,
      volume,
      unit,
      naps: naps.length,
      napDuration,
      bedtime,
      notes,
      photos
    };
  };

  // Random selection helper
  const randomChoice = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate the night doula message using sentence library
  const generateNightDoulaMessage = (): string => {
    const name = babyName || household?.baby_name || "your little one";
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    
    const todayStats = getDayStats(today);
    const yesterdayStats = getDayStats(yesterday);
    
    const ageInMonths = getBabyAgeInMonths();
    const norms = getAgeNorms(ageInMonths);
    
    let sentences: string[] = [];
    
    // 1. RECAP: Feeds
    if (todayStats.feeds > 0) {
      let feedSentence = randomChoice(SENTENCE_LIBRARY.feeds);
      feedSentence = feedSentence
        .replace('{baby_name}', name)
        .replace('{feed_count}', todayStats.feeds.toString())
        .replace('{feed_total_ml}', Math.round(todayStats.volume).toString());
      sentences.push(feedSentence);
    }
    
    // 2. RECAP: Naps
    if (todayStats.naps > 0) {
      const napDurations = activities
        .filter(a => a.type === 'nap' && !a.details?.isNightSleep && 
                new Date(a.logged_at).toDateString() === today.toDateString())
        .map(n => {
          if (n.details?.startTime && n.details?.endTime) {
            const start = new Date(`1970-01-01 ${n.details.startTime}`);
            const end = new Date(`1970-01-01 ${n.details.endTime}`);
            return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
          }
          return 0;
        })
        .filter(d => d > 0);
      
      const classification = classifyNaps(napDurations);
      const napSentence = randomChoice(SENTENCE_LIBRARY.naps[classification.type] || SENTENCE_LIBRARY.naps.mix);
      sentences.push(napSentence);
    }
    
    // 3. RECAP: Bedtime
    if (todayStats.bedtime) {
      let bedtimeSentence = randomChoice(SENTENCE_LIBRARY.bedtime);
      bedtimeSentence = bedtimeSentence.replace('{bedtime}', todayStats.bedtime);
      sentences.push(bedtimeSentence);
    }
    
    // 4. NOTES (if any)
    if (todayStats.notes.length > 0) {
      const noteContent = todayStats.notes[0].details?.content || "";
      if (noteContent.length > 0) {
        let noteSentence = randomChoice(SENTENCE_LIBRARY.notes);
        let noteRef = noteContent.slice(0, 20);
        let noteEffect = "his day patterns";
        
        if (noteContent.toLowerCase().includes('teeth')) {
          noteRef = "teething";
          noteEffect = "the shorter naps";
        } else if (noteContent.toLowerCase().includes('fuss')) {
          noteRef = "fussiness";
          noteEffect = "the extra feeds";
        }
        
        noteSentence = noteSentence
          .replace('{note_reference}', noteRef)
          .replace('{note_related_effect}', noteEffect);
        sentences.push(noteSentence);
      }
    }
    
    // 5. COMPARISON to Yesterday
    if (yesterdayStats.feeds > 0 || yesterdayStats.volume > 0) {
      const volumeDiff = Math.abs(todayStats.volume - yesterdayStats.volume);
      const napDiff = Math.abs(todayStats.napDuration - yesterdayStats.napDuration);
      
      if (volumeDiff > todayStats.volume * 0.1) {
        let compSentence = randomChoice(SENTENCE_LIBRARY.comparison.feeds);
        const moreLess = todayStats.volume > yesterdayStats.volume ? "more" : "less";
        compSentence = compSentence
          .replace('{diff}', Math.round(volumeDiff).toString())
          .replace('{more_less}', moreLess);
        sentences.push(compSentence);
      } else if (napDiff > 20) {
        let compSentence = randomChoice(SENTENCE_LIBRARY.comparison.naps);
        const shorterLonger = todayStats.napDuration > yesterdayStats.napDuration ? "longer" : "shorter";
        compSentence = compSentence
          .replace('{diff}', Math.round(napDiff).toString())
          .replace('{shorter_longer}', shorterLonger);
        sentences.push(compSentence);
      }
    }
    
    // 6. PEER Comparison (normalize)
    let peerSentence = randomChoice(SENTENCE_LIBRARY.peer);
    peerSentence = peerSentence
      .replace('{feed_count}', todayStats.feeds.toString())
      .replace('{baby_age}', ageInMonths.toString());
    sentences.push(peerSentence);
    
    // 7. INSIGHT / Interpretation
    const insightSentence = randomChoice(SENTENCE_LIBRARY.insight);
    sentences.push(insightSentence);
    
    // 8. ENCOURAGEMENT / Close
    const encouragementSentence = randomChoice(SENTENCE_LIBRARY.encouragement);
    sentences.push(encouragementSentence);
    
    return sentences.join(' ');
  };

  // ChatGPT-style streaming effect
  const startReview = useCallback(() => {
    const reviewText = generateNightDoulaMessage();
    setFullReviewText(reviewText);
    setShowReview(true);
    setShowPrompt(false);
    setIsTyping(true);
    setIsPulsing(true);
    setTypedText("");
    setCurrentCharIndex(0);
    
    // Store in localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`night-doula-${today}`, reviewText);
    
    setReviewGenerated(true);
  }, [activities, babyName, household]);

  // Streaming animation effect
  useEffect(() => {
    if (!isTyping || !fullReviewText) return;
    
    const targetWPM = 50; // 45-55 words per minute
    const avgCharsPerWord = 4.7;
    const charsPerMinute = targetWPM * avgCharsPerWord;
    const msPerChar = (60 * 1000) / charsPerMinute;
    
    const timer = setTimeout(() => {
      if (currentCharIndex < fullReviewText.length) {
        // Add slight jitter (3-6 chars per tick)
        const jitter = Math.floor(Math.random() * 4) + 3;
        const nextIndex = Math.min(currentCharIndex + jitter, fullReviewText.length);
        setTypedText(fullReviewText.substring(0, nextIndex));
        setCurrentCharIndex(nextIndex);
      } else {
        setIsTyping(false);
        setIsPulsing(false);
      }
    }, msPerChar * (Math.floor(Math.random() * 4) + 3)); // Jitter timing too
    
    return () => clearTimeout(timer);
  }, [currentCharIndex, fullReviewText, isTyping]);

  // Don't show if no trigger conditions met
  if (!showPrompt && !showReview) {
    return null;
  }

  // Show prompt
  if (showPrompt && !showReview) {
    return (
      <Card className="mb-6 bg-card border-border shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Moon className="w-5 h-5 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-medium text-foreground">
                Ready to hear how today went?
              </span>
            </div>
            <Button 
              onClick={startReview}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Yes please
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show review with streaming
  return (
    <Card className="mb-6 bg-card border-border shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Moon className="w-6 h-6 text-primary" />
            {isPulsing && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Night Doula
          </h3>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="text-foreground leading-relaxed text-base">
            {typedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>
            )}
          </div>
          
          {/* Photos appear after text is complete */}
          {!isTyping && getDayStats(new Date()).photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {getDayStats(new Date()).photos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt="Baby photo from today" 
                  className="w-20 h-20 object-cover rounded-lg border border-border"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};