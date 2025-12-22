// Simplified HomeTab - now using DailyCoach
import { DailyCoach } from "@/components/home/DailyCoach";

interface Activity {
  id: string;
  type: string;
  time: string;
  loggedAt?: string;
  timezone?: string;
  createdBy?: string;
  details?: any;
}

interface HomeTabProps {
  activities?: Activity[];
  babyName?: string;
  userName?: string;
  babyBirthday?: string;
  onAddActivity?: (type?: 'feed' | 'nap' | 'diaper', prefillActivity?: Activity) => void;
  onEditActivity?: (activity: Activity) => void;
  onEndNap?: () => void;
  ongoingNap?: Activity | null;
  userRole?: string;
  showBadge?: boolean;
  percentile?: number | null;
  addActivity?: (type: string, details?: any, activityDate?: Date, activityTime?: string) => Promise<void>;
}

export const HomeTab = ({ babyName, babyBirthday }: HomeTabProps) => {
  return <DailyCoach babyName={babyName} babyBirthday={babyBirthday} />;
};
