-- First, drop the RLS policy that depends on the old function
DROP POLICY IF EXISTS "Users can view baby profiles they have access to" ON public.baby_profiles;

-- Now drop the old functions
DROP FUNCTION IF EXISTS public.user_has_baby_profile_access(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_accessible_baby_profile_ids(uuid);

-- Update the accept_invite function to work with households
CREATE OR REPLACE FUNCTION public.accept_invite(invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  invite_record public.invite_links%ROWTYPE;
  household_id_var UUID;
BEGIN
  -- Get the invite
  SELECT * INTO invite_record 
  FROM public.invite_links 
  WHERE code = invite_code 
    AND expires_at > now() 
    AND used_at IS NULL;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;
  
  household_id_var := invite_record.household_id;
  
  -- Add user as collaborator
  INSERT INTO public.collaborators (household_id, user_id, role, invited_by)
  VALUES (household_id_var, auth.uid(), invite_record.role, invite_record.created_by)
  ON CONFLICT (household_id, user_id) DO NOTHING;
  
  -- Mark invite as used
  UPDATE public.invite_links 
  SET used_at = now(), used_by = auth.uid()
  WHERE id = invite_record.id;
  
  RETURN household_id_var;
END;
$$;

-- Create function to check if user has access to a household
CREATE OR REPLACE FUNCTION public.user_has_household_access(_user_id uuid, _household_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    -- User is a collaborator in the household
    SELECT 1 FROM collaborators 
    WHERE household_id = _household_id AND user_id = _user_id
  );
$$;

-- Create function to get accessible household IDs for a user
CREATE OR REPLACE FUNCTION public.get_accessible_household_ids(_user_id uuid)
RETURNS TABLE(household_id uuid)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- Households where user is collaborator
  SELECT household_id FROM collaborators WHERE user_id = _user_id;
$$;