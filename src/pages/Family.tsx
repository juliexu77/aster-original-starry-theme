import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimeOfDayBackground } from "@/components/home/TimeOfDayBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { ChildView } from "@/components/family/ChildView";
import { FamilyView } from "@/components/family/FamilyView";

type ViewMode = 'child' | 'family';

const Family = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('family-view-mode');
    return (saved as ViewMode) || 'child';
  });
  
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(() => {
    return localStorage.getItem('family-selected-baby-id');
  });

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('family-view-mode', viewMode);
  }, [viewMode]);

  // Persist selected baby
  useEffect(() => {
    if (selectedBabyId) {
      localStorage.setItem('family-selected-baby-id', selectedBabyId);
    }
  }, [selectedBabyId]);

  // Set initial baby if none selected
  useEffect(() => {
    if (!selectedBabyId && babies.length > 0) {
      setSelectedBabyId(babies[0].id);
    }
  }, [babies, selectedBabyId]);

  const handleBirthdaySaved = () => {
    fetchUserProfile();
  };

  const handleAddChild = () => {
    navigate('/baby-setup');
  };

  if (authLoading || babiesLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TimeOfDayBackground>
        <div className="space-y-3 pb-24">
          {/* Header with Toggle */}
          <div className="px-5 pt-8 pb-2">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] text-center mb-6">
              Your Family
            </p>
            
            {/* View Toggle */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setViewMode('child')}
                className={`text-[13px] uppercase tracking-[0.1em] pb-1 transition-all border-b ${
                  viewMode === 'child' 
                    ? 'text-foreground/80 border-foreground/40' 
                    : 'text-foreground/30 border-transparent hover:text-foreground/50'
                }`}
              >
                Child
              </button>
              <button
                onClick={() => setViewMode('family')}
                className={`text-[13px] uppercase tracking-[0.1em] pb-1 transition-all border-b ${
                  viewMode === 'family' 
                    ? 'text-foreground/80 border-foreground/40' 
                    : 'text-foreground/30 border-transparent hover:text-foreground/50'
                }`}
              >
                Family
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'child' ? (
            <ChildView
              babies={babies}
              selectedBabyId={selectedBabyId}
              onSelectBaby={setSelectedBabyId}
              onAddChild={handleAddChild}
            />
          ) : (
            <FamilyView
              babies={babies}
              userProfile={userProfile}
              onBirthdaySaved={handleBirthdaySaved}
            />
          )}

          {/* Minimal Footer */}
          <div className="pt-8 text-center px-5">
            <p className="text-[10px] text-foreground/20 tracking-[0.2em]">
              Stars illuminate. Love defines.
            </p>
          </div>
        </div>
      </TimeOfDayBackground>

      <FamilyNav />
    </div>
  );
};

export default Family;
