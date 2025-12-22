import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialLoadComplete = false;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (initialLoadComplete) {
          setLoading(false);
        }
        
        if (event === 'SIGNED_OUT' || !session) {
          clearAllUserData();
        }

        // Auto-create household for new users
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserHasHousehold(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await ensureUserHasHousehold(session.user.id);
      }
      
      initialLoadComplete = true;
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearAllUserData();
  };

  const ensureUserHasHousehold = async (userId: string) => {
    try {
      // Check if user already has a household membership
      const { data: memberData } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', userId)
        .limit(1);

      if (memberData && memberData.length > 0) {
        return; // User already has a household
      }

      // Create a new household
      const newHouseholdId = crypto.randomUUID();
      
      const { error: householdError } = await supabase
        .from('households')
        .insert([{
          id: newHouseholdId,
          name: 'My Household',
          created_by: userId
        }]);

      if (householdError) {
        console.error('Error creating household:', householdError);
        return;
      }

      // Add user as parent member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: newHouseholdId,
          user_id: userId,
          role: 'parent'
        }]);

      if (memberError) {
        console.error('Error adding household member:', memberError);
      }
    } catch (error) {
      console.error('Error ensuring user has household:', error);
    }
  };

  const clearAllUserData = () => {
    const keysToRemove = [
      'babyProfile',
      'babyProfileCompleted', 
      'babyProfileSkipped',
      'isCollaborator',
      'initialActivities',
      'hasSeenAddActivityTooltip',
      'hasSeenDemo',
      'lastUsedUnit',
      'lastFeedQuantity',
      'baby_tracker_offline_activities',
      'baby_tracker_sync_status',
      'active_household_id'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
