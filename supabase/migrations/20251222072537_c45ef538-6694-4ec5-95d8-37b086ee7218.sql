-- Create security definer function to check household membership
CREATE OR REPLACE FUNCTION public.is_household_member(_user_id uuid, _household_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.household_members
    WHERE user_id = _user_id
      AND household_id = _household_id
  )
$$;

-- Create function to check if user is household owner
CREATE OR REPLACE FUNCTION public.is_household_owner(_user_id uuid, _household_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.household_members
    WHERE user_id = _user_id
      AND household_id = _household_id
      AND role = 'owner'
  )
$$;

-- Drop existing problematic policies on household_members
DROP POLICY IF EXISTS "Owners can manage household members" ON public.household_members;
DROP POLICY IF EXISTS "Users can view members of their households" ON public.household_members;
DROP POLICY IF EXISTS "Users can join households" ON public.household_members;

-- Create fixed policies using security definer functions
CREATE POLICY "Users can view members of their households"
ON public.household_members
FOR SELECT
USING (public.is_household_member(auth.uid(), household_id));

CREATE POLICY "Users can join households"
ON public.household_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete household members"
ON public.household_members
FOR DELETE
USING (public.is_household_owner(auth.uid(), household_id));

-- Also fix households table policies that have the same issue
DROP POLICY IF EXISTS "Users can view households they belong to" ON public.households;
DROP POLICY IF EXISTS "Owners can update their households" ON public.households;
DROP POLICY IF EXISTS "Owners can delete their households" ON public.households;

CREATE POLICY "Users can view households they belong to"
ON public.households
FOR SELECT
USING (public.is_household_member(auth.uid(), id));

CREATE POLICY "Owners can update their households"
ON public.households
FOR UPDATE
USING (public.is_household_owner(auth.uid(), id));

CREATE POLICY "Owners can delete their households"
ON public.households
FOR DELETE
USING (public.is_household_owner(auth.uid(), id));