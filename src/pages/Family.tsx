import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBabies } from "@/hooks/useBabies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";
import { FamilyNav } from "@/components/family/FamilyNav";
import { ChildView } from "@/components/family/ChildView";
import { FamilyView } from "@/components/family/FamilyView";
import { CosmosView } from "@/components/cosmos/CosmosView";

type ViewMode = 'child' | 'family' | 'cosmos';

const Family = () => {
  const { user, loading: authLoading } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<ViewMode>('child');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (babies.length === 0) return;
    
    const storedId = localStorage.getItem('chart-selected-member-id');
    const isValidBabyId = storedId && babies.some(b => b.id === storedId && b.birthday);
    const isValidParentId = storedId === 'parent' || storedId === 'partner';
    const storedIdIsValid = isValidBabyId || isValidParentId;
    
    if (storedIdIsValid) {
      setSelectedMemberId(storedId);
    } else {
      const firstWithBirthday = babies.find(b => b.birthday);
      if (firstWithBirthday) {
        setSelectedMemberId(firstWithBirthday.id);
        localStorage.setItem('chart-selected-member-id', firstWithBirthday.id);
      }
    }
  }, [babies]);

  useEffect(() => {
    if (selectedMemberId) {
      localStorage.setItem('chart-selected-member-id', selectedMemberId);
    }
  }, [selectedMemberId]);

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
    <div className="min-h-screen">
      <NightSkyBackground>
        <div className="space-y-3 pb-24">
          {/* Header with Toggle */}
          <div className="px-5 pt-8 pb-2">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] text-center mb-6">
              Your Chart
            </p>
            
            {/* View Toggle - Now with 3 options */}
            <div className="flex items-center justify-center gap-6">
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
              <button
                onClick={() => setViewMode('cosmos')}
                className={`text-[13px] uppercase tracking-[0.1em] pb-1 transition-all border-b ${
                  viewMode === 'cosmos' 
                    ? 'text-amber-300/80 border-amber-300/40' 
                    : 'text-foreground/30 border-transparent hover:text-foreground/50'
                }`}
              >
                Cosmos
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'child' ? (
            <ChildView
              babies={babies}
              userProfile={userProfile}
              selectedMemberId={selectedMemberId}
              onSelectMember={setSelectedMemberId}
              onAddChild={handleAddChild}
            />
          ) : viewMode === 'family' ? (
            <FamilyView
              babies={babies}
              userProfile={userProfile}
              onBirthdaySaved={handleBirthdaySaved}
            />
          ) : (
            <CosmosView
              babies={babies}
              userProfile={userProfile}
              selectedMemberId={selectedMemberId}
              onSelectMember={setSelectedMemberId}
            />
          )}

          {/* Minimal Footer */}
          <div className="pt-8 text-center px-5">
            <p className="text-[10px] text-foreground/20 tracking-[0.2em]">
              Stars illuminate. Love defines.
            </p>
          </div>
        </div>
      </NightSkyBackground>

      <FamilyNav />
    </div>
  );
};

export default Family;
