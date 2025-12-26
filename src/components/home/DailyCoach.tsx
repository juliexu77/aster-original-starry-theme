import { useState, useMemo } from "react";
import { BabyProfileCard } from "./BabyProfileCard";
import { DevelopmentTable } from "./DevelopmentTable";
import { FocusThisMonth } from "./FocusThisMonth";
import { TimeOfDayBackground } from "./TimeOfDayBackground";
import { useCalibration } from "@/hooks/useCalibration";
import { useCalibrationPrompt, isCalibrationStale } from "@/hooks/useCalibrationPrompt";
import { CalibrationCheckInModal } from "@/components/calibration/CalibrationCheckInModal";
import { RecalibrationSheet } from "@/components/calibration/RecalibrationSheet";
import { CalibrationData } from "@/components/calibration/CalibrationFlow";
import { useHousehold } from "@/hooks/useHousehold";

interface Baby {
  id: string;
  name: string;
  birthday: string | null;
}

interface DailyCoachProps {
  babyName?: string;
  babyBirthday?: string;
  babyId?: string;
  babies?: Baby[];
  activeBabyId?: string;
  onSwitchBaby?: (babyId: string) => void;
}

const getAgeInWeeks = (birthday?: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getAgeInMonths = (birthday?: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
    (today.getMonth() - birthDate.getMonth());
  return Math.max(0, months);
};

export const DailyCoach = ({ 
  babyName, 
  babyBirthday,
  babyId,
  babies = [],
  activeBabyId,
  onSwitchBaby
}: DailyCoachProps) => {
  const ageInWeeks = getAgeInWeeks(babyBirthday);
  const ageInMonths = getAgeInMonths(babyBirthday);
  const displayName = babyName || "your baby";
  
  // Fetch calibration data for this baby
  const { calibration, saveCalibration, dismissPrompt, refetch } = useCalibration(babyId);
  const { household } = useHousehold();
  
  // Check if we should show the age-based prompt
  const { shouldShowPrompt } = useCalibrationPrompt(calibration, babyBirthday, ageInMonths);
  
  // Modal states
  const [showCheckInModal, setShowCheckInModal] = useState(shouldShowPrompt);
  const [showRecalibrationSheet, setShowRecalibrationSheet] = useState(false);
  
  // Update check-in modal visibility when prompt status changes
  useMemo(() => {
    if (shouldShowPrompt && !showRecalibrationSheet) {
      setShowCheckInModal(true);
    }
  }, [shouldShowPrompt, showRecalibrationSheet]);

  const handleMaybeLater = async () => {
    await dismissPrompt();
    setShowCheckInModal(false);
  };

  const handleUpdateFromModal = () => {
    setShowCheckInModal(false);
    setShowRecalibrationSheet(true);
  };

  const handleTapProfile = () => {
    setShowRecalibrationSheet(true);
  };

  const handleRecalibrationComplete = async (data: CalibrationData, emergingFlags: Record<string, boolean>) => {
    if (!babyId || !household?.id) return;
    await saveCalibration(babyId, household.id, data, emergingFlags);
    await refetch();
  };

  const staleCalibration = isCalibrationStale(calibration);

  if (!babyBirthday) {
    return (
      <TimeOfDayBackground>
        <div className="px-5 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-serif text-foreground">Welcome</h1>
            <p className="text-muted-foreground">
              Add a birthday in settings to see their portrait.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>
    );
  }

  return (
    <div className="relative min-h-screen">
      <TimeOfDayBackground>
        {/* Sticky Profile Card */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-foreground/5">
          <BabyProfileCard 
            babyName={displayName} 
            babyBirthday={babyBirthday}
            babies={babies}
            activeBabyId={activeBabyId}
            onSwitchBaby={onSwitchBaby}
            onTapProfile={handleTapProfile}
            isCalibrationStale={staleCalibration}
          />
        </div>

        <div className="pb-24 space-y-4 pt-4">
          {/* Development Domains */}
          <DevelopmentTable 
            ageInWeeks={ageInWeeks} 
            birthday={babyBirthday} 
            babyName={displayName}
            calibration={calibration}
          />

          {/* Focus This Month */}
          <FocusThisMonth 
            babyName={displayName} 
            ageInWeeks={ageInWeeks} 
            birthday={babyBirthday} 
          />

          {/* Footer */}
          <div className="pt-4 text-center px-5">
            <p className="text-[10px] text-foreground/20 tracking-wide">
              You know your child best.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>

      {/* Age-based check-in modal */}
      <CalibrationCheckInModal
        open={showCheckInModal}
        onOpenChange={setShowCheckInModal}
        babyName={displayName}
        ageInMonths={ageInMonths}
        onUpdateChart={handleUpdateFromModal}
        onMaybeLater={handleMaybeLater}
      />

      {/* Recalibration sheet (from header tap) */}
      {babyBirthday && (
        <RecalibrationSheet
          open={showRecalibrationSheet}
          onOpenChange={setShowRecalibrationSheet}
          babyName={displayName}
          babyBirthday={babyBirthday}
          calibration={calibration}
          onComplete={handleRecalibrationComplete}
        />
      )}
    </div>
  );
};
