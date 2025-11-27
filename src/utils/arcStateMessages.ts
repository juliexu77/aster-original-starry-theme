import { Activity } from "@/components/ActivityCard";
import { differenceInMinutes } from "date-fns";
import { getDurationString, getMostRecentActivity } from "./arcCalculations";
import { getActivityEventDate } from "./activityDate";

// Get the current state line based on activities and time
export const getCurrentState = (
  activities: Activity[],
  ongoingNap: Activity | null,
  nightSleepStartHour: number,
  nightSleepEndHour: number
): string => {
  const now = new Date();
  const currentHour = now.getHours();
  const isDay = isDaytime(currentHour, nightSleepStartHour, nightSleepEndHour);
  
  if (ongoingNap) {
    const startTime = ongoingNap.details?.startTime;
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date(now);
      startDate.setHours(hours, minutes, 0, 0);
      const napMinutes = differenceInMinutes(now, startDate);
      
      const isInNightWindow = !isDay;
      
      if (napMinutes < 5) {
        if (isInNightWindow) {
          return "Down for the night";
        }
        return "Just fell asleep";
      }
      
      if (isInNightWindow) {
        return "Soundly asleep";
      }
      
      const todayNaps = activities.filter(a => {
        const activityDate = new Date(a.loggedAt || '');
        const today = new Date();
        return a.type === 'nap' && 
          activityDate.toDateString() === today.toDateString() &&
          a.details?.endTime;
      });
      
      const isFirstNap = todayNaps.length === 0;
      
      if (isFirstNap) {
        return "First nap";
      }
      
      if (napMinutes < 20) {
        return "Quick snooze";
      } else if (napMinutes > 90) {
        return "Long snooze";
      }
      
      // Cat nap: only between 4:30 PM and 6:30 PM
      const nowMinutes = now.getMinutes();
      const currentTimeMinutes = currentHour * 60 + nowMinutes;
      const catNapStart = 16 * 60 + 30; // 4:30 PM
      const catNapEnd = 18 * 60 + 30; // 6:30 PM
      
      if (currentTimeMinutes >= catNapStart && currentTimeMinutes < catNapEnd) {
        return "Cat nap";
      } else if (currentHour >= 12 && currentHour < 17) {
        return "Afternoon nap";
      } else {
        return "Nap in progress";
      }
    }
    return "Nap in progress";
  }
  
  const recentActivity = getMostRecentActivity(activities);
  if (!recentActivity) {
    return "Awake";
  }
  
  const activityTime = new Date(recentActivity.loggedAt || '');
  const minutesSince = differenceInMinutes(now, activityTime);
  
  if (recentActivity.type === 'nap') {
    const endTime = recentActivity.details?.endTime;
    const startTime = recentActivity.details?.startTime;
    const isNightTime = currentHour >= 19 || currentHour < 5;
    
    if (endTime) {
      if (startTime) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const startDate = new Date(now);
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date(now);
        endDate.setHours(endHours, endMinutes, 0, 0);
        const napDuration = differenceInMinutes(endDate, startDate);
        
        if (minutesSince < 10) {
          if (isNightTime) {
            if (minutesSince < 3) {
              return "Just woke up";
            } else if (napDuration < 30) {
              return "Quick wake-up";
            } else {
              return "Little midnight moment";
            }
          }
          
          if (napDuration < 20) {
            return "Just woke up from quick snooze";
          } else if (napDuration > 90) {
            return "Just woke up from long snooze";
          }
          return "Just woke up";
        }
      }
      
      if (minutesSince < 10) {
        if (isNightTime) {
          return "Late-night wake";
        }
        return "Just woke up";
      } else if (minutesSince < 30) {
        return "Nap just ended";
      }
    } else if (!ongoingNap) {
      if (minutesSince < 10) {
        return "Just woke up";
      }
    }
  }
  
  if (recentActivity.type === 'feed') {
    const quantity = recentActivity.details?.quantity;
    const unit = recentActivity.details?.unit;
    const minutesLeft = recentActivity.details?.minutesLeft;
    const minutesRight = recentActivity.details?.minutesRight;
    const isNightTime = currentHour >= 19 || currentHour < 5;
    
    const todayFeeds = activities.filter(a => {
      const activityDate = new Date(a.loggedAt || '');
      const today = new Date();
      return a.type === 'feed' && 
        activityDate.toDateString() === today.toDateString();
    }).length;
    
    if (minutesSince < 10) {
      if (isNightTime) {
        if (minutesSince < 3) {
          return "Just had a night feed";
        } else if (minutesSince < 6) {
          return "Night feed wrapped up";
        } else {
          return "Topped up for the night";
        }
      }
      
      if (todayFeeds === 3) {
        return "Third feed today! 🎉";
      } else if (todayFeeds === 5) {
        return "Fifth feed today! 🌟";
      }
      
      const quantityNum = quantity ? parseFloat(quantity) : 0;
      const nursingMinutes = (minutesLeft ? parseInt(minutesLeft) : 0) + (minutesRight ? parseInt(minutesRight) : 0);
      
      const isLargeFeed = (unit === 'ml' && quantityNum >= 150) || 
                         (unit === 'oz' && quantityNum >= 5) ||
                         nursingMinutes >= 20;
      
      if (isLargeFeed) {
        if (nursingMinutes > 0) {
          return `Full belly · ${nursingMinutes}min`;
        } else if (quantity && unit) {
          return `Full belly · ${quantity}${unit}`;
        }
      }
      
      const feedType = recentActivity.details?.feedType;
      if (feedType === 'bottle') {
        return "Just had a bottle";
      } else if (feedType === 'nursing') {
        return "Just nursed";
      }
      return "Finished a feed";
    }
  }
  
  if (recentActivity.type === 'solids') {
    const foodDescription = recentActivity.details?.solidDescription;
    if (minutesSince < 15) {
      if (foodDescription) {
        const previousSolids = activities.filter(a => 
          a.type === 'solids' && 
          a.id !== recentActivity.id &&
          new Date(a.loggedAt || '') < activityTime
        );
        const isFirstTime = !previousSolids.some(a => a.details?.solidDescription === foodDescription);
        
        if (isFirstTime) {
          return `First taste of ${foodDescription}!`;
        }
        return `Ate solids · ${foodDescription}`;
      }
      return "Just ate solids";
    }
  }
  
  if (recentActivity.type === 'diaper') {
    if (minutesSince < 10) {
      const diaperType = recentActivity.details?.diaperType;
      if (diaperType === 'poopy' || diaperType === 'both') {
        return "Just pooped";
      }
      return "Fresh diaper";
    }
  }
  
  const lastSleep = activities
    .filter(a => a.type === 'nap')
    .sort((a, b) => {
      const aTime = new Date(a.loggedAt || '').getTime();
      const bTime = new Date(b.loggedAt || '').getTime();
      return bTime - aTime;
    })[0];
  
  if (lastSleep && lastSleep.details?.endTime) {
    const endTime = lastSleep.details.endTime;
    const [hours, minutes] = endTime.split(':').map(Number);
    const wakeDate = getActivityEventDate(lastSleep);
    wakeDate.setHours(hours, minutes, 0, 0);
    const awakeMinutes = differenceInMinutes(now, wakeDate);
    
    if (!isNaN(awakeMinutes) && awakeMinutes >= 0) {
      if (awakeMinutes < 15) {
        return "Just started awake time";
      } else if (awakeMinutes > 150) {
        return `Long stretch awake · ${getDurationString(awakeMinutes)}`;
      } else if (awakeMinutes > 120) {
        return "Getting sleepy";
      } else if (awakeMinutes > 60) {
        return `Awake · ${getDurationString(awakeMinutes)}`;
      }
      return `Awake · ${getDurationString(awakeMinutes)}`;
    }
  }
  
  return "Awake";
};

// Helper function copied from arcCalculations
const isDaytime = (currentHour: number, nightSleepStartHour: number, nightSleepEndHour: number): boolean => {
  if (nightSleepStartHour > nightSleepEndHour) {
    return currentHour >= nightSleepEndHour && currentHour < nightSleepStartHour;
  } else {
    return currentHour < nightSleepStartHour || currentHour >= nightSleepEndHour;
  }
};
