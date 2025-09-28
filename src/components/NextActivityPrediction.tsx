import { useState } from "react";
import { Activity } from "./ActivityCard";
import { Clock, Baby, Moon, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BabyCarePredictionEngine } from "@/utils/predictionEngine";
import { useHousehold } from "@/hooks/useHousehold";

interface NextActivityPredictionProps {
  activities: Activity[];
}

// Keep the original time utility functions for UI compatibility
const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const getTimeInMinutes = (timeString: string): number => {
  const startTime = timeString.includes(' - ') ? timeString.split(' - ')[0] : timeString;
  const [time, period] = startTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = (hours % 12) * 60 + minutes;
  if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
  if (period === 'AM' && hours === 12) totalMinutes = minutes;
  return totalMinutes;
};

const addMinutesToTime = (timeString: string, minutes: number): string => {
  const timeInMinutes = getTimeInMinutes(timeString);
  let totalMinutes = timeInMinutes + minutes;
  
  while (totalMinutes < 0) {
    totalMinutes += (24 * 60);
  }
  totalMinutes = totalMinutes % (24 * 60);
  
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

export const NextActivityPrediction = ({ activities }: NextActivityPredictionProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const { household } = useHousehold();
  
  // Use the new prediction engine but adapt to old UI format
  const predictNextActivity = () => {
    const engine = new BabyCarePredictionEngine(activities, household?.baby_birthday || undefined);
    const prediction = engine.getNextAction();
    
    const currentTime = getCurrentTime();
    
    // Convert the new prediction format to the old UI format
    let type: "feed" | "nap";
    let anticipatedTime: string | undefined;
    let confidence: "high" | "medium" | "low";
    let reason: string;
    let details: any;

    // Map new actions to old types
    if (prediction.next_action === "FEED_NOW") {
      type = "feed";
      anticipatedTime = addMinutesToTime(currentTime, prediction.reevaluate_in_minutes);
      reason = `t_since_last_feed (~${Math.floor((prediction.rationale.t_since_last_feed_min || 0) / 60)}h ${(prediction.rationale.t_since_last_feed_min || 0) % 60}m)`;
    } else if (prediction.next_action === "START_WIND_DOWN") {
      type = "nap";
      anticipatedTime = addMinutesToTime(currentTime, prediction.reevaluate_in_minutes);
      reason = `wake window (~${Math.round((prediction.rationale.t_awake_now_min || 0) / 60 * 10) / 10}h awake)`;
    } else if (prediction.next_action === "LET_SLEEP_CONTINUE") {
      type = "nap";
      anticipatedTime = undefined;
      reason = "currently sleeping";
    } else {
      // INDEPENDENT_TIME or HOLD - default to feed
      type = "feed";
      anticipatedTime = addMinutesToTime(currentTime, prediction.reevaluate_in_minutes * 2);
      reason = `continue current activity`;
    }

    // Map confidence scores
    if (prediction.confidence >= 0.8) confidence = "high";
    else if (prediction.confidence >= 0.6) confidence = "medium";
    else confidence = "low";

    // Create details object for expanded view
    const rationale = prediction.rationale;
    details = {
      description: `Based on recent patterns and current state`,
      data: [
        {
          activity: { type: "analysis", time: currentTime },
          value: `Feed pressure: ${Math.round(rationale.scores.feed * 100)}%`,
          calculation: "Based on time since last feed and patterns"
        },
        {
          activity: { type: "analysis", time: currentTime },
          value: `Sleep pressure: ${Math.round(rationale.scores.sleep * 100)}%`,
          calculation: "Based on wake windows and sleep needs"
        },
        {
          activity: { type: "analysis", time: currentTime },
          value: `Day sleep: ${Math.round(rationale.cumulative_day_sleep_min / 60 * 10) / 10}h`,
          calculation: `Target: ${Math.round(rationale.day_sleep_target_min / 60 * 10) / 10}h`
        }
      ],
      calculation: `${prediction.next_action} with ${Math.round(prediction.confidence * 100)}% confidence`
    };

    return { type, anticipatedTime, confidence, reason, details };
  };

  const prediction = predictNextActivity();

  const getIcon = (type: string) => {
    switch (type) {
      case "feed":
        return <Baby className="h-5 w-5 text-blue-600" />;
      case "nap":
        return <Moon className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPredictionText = () => {
    if (prediction.anticipatedTime) {
      return `${prediction.type === "feed" ? "Feeding" : "Nap"} around ${prediction.anticipatedTime}`;
    }
    return `${prediction.type === "feed" ? "Consider feeding" : "Watch for sleepy cues"}`;
  };

  return (
    <div className="next-action-card bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="font-semibold text-lg">Next Predicted Action</h3>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            {getIcon(prediction.type)}
            <span className="font-medium">{getPredictionText()}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{prediction.reason}</p>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Prediction Analysis:</h4>
            <p className="text-sm text-muted-foreground mb-2">{prediction.details.description}</p>
            
            {prediction.details.data.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Recent patterns:</p>
                {prediction.details.data.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    • {item.value} ({item.calculation})
                  </div>
                ))}
                {prediction.details.calculation && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-200">
                    <strong>Calculation:</strong> {prediction.details.calculation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};