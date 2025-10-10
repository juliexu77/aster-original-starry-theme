-- Create a function to check if a user is already a parent in any household
CREATE OR REPLACE FUNCTION public.user_is_parent_in_household(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM collaborators 
    WHERE user_id = _user_id AND role = 'parent'
  );
$$;

-- Create a function to prevent multiple parent roles per user
CREATE OR REPLACE FUNCTION public.prevent_multiple_parent_households()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only check if the role being set is 'parent'
  IF NEW.role = 'parent' THEN
    -- Check if user is already a parent in another household
    IF EXISTS (
      SELECT 1 
      FROM collaborators 
      WHERE user_id = NEW.user_id 
        AND role = 'parent' 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND household_id != NEW.household_id
    ) THEN
      RAISE EXCEPTION 'User can only be a parent in one household. They are already a parent in another household.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT operations
CREATE TRIGGER enforce_one_parent_household_insert
  BEFORE INSERT ON public.collaborators
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_multiple_parent_households();

-- Create trigger for UPDATE operations  
CREATE TRIGGER enforce_one_parent_household_update
  BEFORE UPDATE ON public.collaborators
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_multiple_parent_households();