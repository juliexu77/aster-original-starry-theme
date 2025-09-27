import { useLanguage } from "@/contexts/LanguageContext";
import { useHousehold } from "@/hooks/useHousehold";

export const BabyAge = () => {
  const { t } = useLanguage();
  const { household } = useHousehold();

  // Calculate age if birthday exists
  const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    const ageInMs = today.getTime() - birth.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 30) {
      return `${ageInDays} days old`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(ageInDays / 365);
      const months = Math.floor((ageInDays % 365) / 30);
      return `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : ''} old`.trim();
    }
  };

  if (!household || !household.baby_name) {
    return null;
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        {household.baby_name}
      </h1>
      {household.baby_birthday && (
        <p className="text-sm text-muted-foreground">
          {calculateAge(household.baby_birthday)}
        </p>
      )}
    </div>
  );
};