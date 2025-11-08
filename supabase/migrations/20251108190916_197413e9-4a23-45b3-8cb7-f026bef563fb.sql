-- Create a function to get collaborator details including auth info
-- This function runs with elevated privileges to read from auth.users
CREATE OR REPLACE FUNCTION public.get_collaborator_details(_household_id uuid)
RETURNS TABLE(
  id uuid,
  household_id uuid,
  user_id uuid,
  role text,
  invited_by uuid,
  created_at timestamp with time zone,
  full_name text,
  email text,
  last_sign_in_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.household_id,
    c.user_id,
    c.role,
    c.invited_by,
    c.created_at,
    p.full_name,
    u.email,
    u.last_sign_in_at
  FROM public.collaborators c
  LEFT JOIN public.profiles p ON p.user_id = c.user_id
  LEFT JOIN auth.users u ON u.id = c.user_id
  WHERE c.household_id = _household_id
  ORDER BY c.created_at ASC;
$$;