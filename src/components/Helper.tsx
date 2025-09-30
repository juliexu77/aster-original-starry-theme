import { NightDoulaReview } from "@/components/NightDoulaReview";
import { ParentingChat } from "@/components/ParentingChat";
import { useHousehold } from "@/hooks/useHousehold";

interface Activity {
  id: string;
  type: string;
  logged_at: string;
  details: any;
}

interface HelperProps {
  activities: Activity[];
  babyBirthDate?: Date;
}

export const Helper = ({ activities, babyBirthDate }: HelperProps) => {
  const { household } = useHousehold();
  
  const calculateBabyAge = () => {
    if (!household?.baby_birthday) return 0;
    const birthDate = new Date(household.baby_birthday);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
  };

  return (
    <div className="space-y-6 p-4">
      <NightDoulaReview 
        activities={activities} 
        babyName={household?.baby_name} 
      />
      
      <ParentingChat 
        activities={activities}
        babyName={household?.baby_name}
        babyAge={calculateBabyAge()}
      />
    </div>
  );
};