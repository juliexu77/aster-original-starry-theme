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
  birthday: string | null;
  birth_time: string | null;
  birth_location: string | null;
  partner_name: string | null;
  partner_birthday: string | null;
  partner_birth_time: string | null;
  partner_birth_location: string | null;
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
      
      // If profile exists but display_name is just the email handle, try to update with full name
      if (data && (!data.display_name || data.display_name === user.email?.split('@')[0])) {
        const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name;
        if (fullName && fullName !== data.display_name) {
          const { data: updatedData } = await supabase
            .from('profiles')
            .update({ display_name: fullName })
            .eq('user_id', user.id)
            .select()
            .single();
          
          if (updatedData) {
            const profile: UserProfile = {
              ...updatedData,
              full_name: updatedData.display_name,
              photo_url: updatedData.avatar_url
            };
            setUserProfile(profile);
            return profile;
          }
        }
      }
      
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

  const updateUserProfile = async (updates: { 
    display_name?: string; 
    avatar_url?: string; 
    full_name?: string; 
    photo_url?: string; 
    birthday?: string; 
    birth_time?: string; 
    birth_location?: string;
    partner_name?: string;
    partner_birthday?: string;
    partner_birth_time?: string;
    partner_birth_location?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    // Map aliases to actual column names
    const mappedUpdates: { 
      display_name?: string; 
      avatar_url?: string; 
      birthday?: string; 
      birth_time?: string; 
      birth_location?: string;
      partner_name?: string;
      partner_birthday?: string;
      partner_birth_time?: string;
      partner_birth_location?: string;
    } = {};
    if (updates.display_name !== undefined) mappedUpdates.display_name = updates.display_name;
    if (updates.full_name !== undefined) mappedUpdates.display_name = updates.full_name;
    if (updates.avatar_url !== undefined) mappedUpdates.avatar_url = updates.avatar_url;
    if (updates.photo_url !== undefined) mappedUpdates.avatar_url = updates.photo_url;
    if (updates.birthday !== undefined) mappedUpdates.birthday = updates.birthday;
    if (updates.birth_time !== undefined) mappedUpdates.birth_time = updates.birth_time;
    if (updates.birth_location !== undefined) mappedUpdates.birth_location = updates.birth_location;
    if (updates.partner_name !== undefined) mappedUpdates.partner_name = updates.partner_name;
    if (updates.partner_birthday !== undefined) mappedUpdates.partner_birthday = updates.partner_birthday;
    if (updates.partner_birth_time !== undefined) mappedUpdates.partner_birth_time = updates.partner_birth_time;
    if (updates.partner_birth_location !== undefined) mappedUpdates.partner_birth_location = updates.partner_birth_location;

    // Get display name from user metadata if not provided
    const displayName = mappedUpdates.display_name ?? 
      user.user_metadata?.full_name ?? 
      user.user_metadata?.name ??
      undefined;

    // Use upsert to handle case where profile doesn't exist yet
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        ...(displayName && { display_name: displayName }),
        ...mappedUpdates
      } as any, {
        onConflict: 'user_id'
      })
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
