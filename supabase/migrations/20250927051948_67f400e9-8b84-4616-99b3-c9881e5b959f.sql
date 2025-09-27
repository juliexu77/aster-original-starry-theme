-- Fix infinite recursion in baby_profiles RLS policies
-- Create security definer functions to break circular references

-- Function to check if user has access to baby profile
CREATE OR REPLACE FUNCTION public.user_has_baby_profile_access(_user_id uuid, _baby_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- User is the owner
    SELECT 1 FROM baby_profiles 
    WHERE id = _baby_profile_id AND created_by = _user_id
    
    UNION
    
    -- User is a collaborator
    SELECT 1 FROM collaborators 
    WHERE baby_profile_id = _baby_profile_id AND user_id = _user_id
  );
$$;

-- Function to get baby profile IDs accessible to user
CREATE OR REPLACE FUNCTION public.get_accessible_baby_profile_ids(_user_id uuid)
RETURNS TABLE(baby_profile_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Profiles owned by user
  SELECT id FROM baby_profiles WHERE created_by = _user_id
  
  UNION
  
  -- Profiles where user is collaborator
  SELECT baby_profile_id FROM collaborators WHERE user_id = _user_id;
$$;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view baby profiles they have access to" ON baby_profiles;
DROP POLICY IF EXISTS "Users can view collaborators for accessible profiles" ON collaborators;

-- Create new non-recursive policies for baby_profiles
CREATE POLICY "Users can view baby profiles they have access to" 
ON baby_profiles 
FOR SELECT 
USING (public.user_has_baby_profile_access(auth.uid(), id));

-- Create new non-recursive policy for collaborators
CREATE POLICY "Users can view collaborators for accessible profiles" 
ON collaborators 
FOR SELECT 
USING (baby_profile_id IN (SELECT baby_profile_id FROM public.get_accessible_baby_profile_ids(auth.uid())));