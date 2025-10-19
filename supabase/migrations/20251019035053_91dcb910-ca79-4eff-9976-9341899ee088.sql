-- Create function to safely transfer parent role between households
CREATE OR REPLACE FUNCTION public.transfer_parent_role(
  _target_user_id uuid,
  _to_household_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only a parent in the destination household can initiate
  IF NOT EXISTS (
    SELECT 1 FROM public.collaborators 
    WHERE household_id = _to_household_id 
      AND user_id = auth.uid()
      AND role = 'parent'
  ) THEN
    RAISE EXCEPTION 'Only a parent in the household can transfer parent role';
  END IF;

  -- Demote any existing parent roles the target user has in other households
  UPDATE public.collaborators
  SET role = 'caregiver'
  WHERE user_id = _target_user_id
    AND role = 'parent'
    AND household_id != _to_household_id;

  -- Ensure the target user has a collaborator row in the destination household as parent
  INSERT INTO public.collaborators (household_id, user_id, role, invited_by)
  VALUES (_to_household_id, _target_user_id, 'parent', auth.uid())
  ON CONFLICT (household_id, user_id) DO UPDATE SET role = 'parent';
END;
$$;