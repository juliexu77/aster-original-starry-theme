import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  full_name?: string | null; // Alias for display_name
  email: string | null;
  avatar_url: string | null;
  photo_url?: string | null; // Alias for avatar_url
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Map fields with aliases
      const profile: UserProfile | null = data ? {
        ...data,
        full_name: data.display_name,
        photo_url: data.avatar_url
      } : null;
      
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: { display_name?: string; avatar_url?: string; full_name?: string; photo_url?: string }) => {
    if (!user) throw new Error('User not authenticated');

    // Map aliases to actual column names
    const mappedUpdates: { display_name?: string; avatar_url?: string } = {};
    if (updates.display_name !== undefined) mappedUpdates.display_name = updates.display_name;
    if (updates.full_name !== undefined) mappedUpdates.display_name = updates.full_name;
    if (updates.avatar_url !== undefined) mappedUpdates.avatar_url = updates.avatar_url;
    if (updates.photo_url !== undefined) mappedUpdates.avatar_url = updates.photo_url;

    const { data, error } = await supabase
      .from('profiles')
      .update(mappedUpdates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    const profile: UserProfile = {
      ...data,
      full_name: data.display_name,
      photo_url: data.avatar_url
    };

    setUserProfile(profile);
    return profile;
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  return {
    userProfile,
    loading,
    fetchUserProfile,
    updateUserProfile,
    createUserProfile: updateUserProfile
  };
};
