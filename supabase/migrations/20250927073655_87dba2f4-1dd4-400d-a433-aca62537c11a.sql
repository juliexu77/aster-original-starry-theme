-- Now complete the RLS policies and functions with household_id

-- Update RLS policies for activities to use household_id
DROP POLICY IF EXISTS "Users can create activities for accessible baby profiles" ON public.activities;
DROP POLICY IF EXISTS "Users can view activities for accessible baby profiles" ON public.activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can create activities for accessible households" ON public.activities;
DROP POLICY IF EXISTS "Users can view activities for accessible households" ON public.activities;

CREATE POLICY "Users can create activities for accessible households" ON public.activities
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND 
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view activities for accessible households" ON public.activities
FOR SELECT 
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own activities" ON public.activities
FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own activities" ON public.activities
FOR DELETE 
USING (created_by = auth.uid());

-- Update RLS policies for collaborators to use household_id
DROP POLICY IF EXISTS "Profile owners can manage collaborators" ON public.collaborators;
DROP POLICY IF EXISTS "Profile owners can remove collaborators" ON public.collaborators;
DROP POLICY IF EXISTS "Users can view collaborators for accessible profiles" ON public.collaborators;
DROP POLICY IF EXISTS "Users can view collaborators for accessible households" ON public.collaborators;
DROP POLICY IF EXISTS "Users can manage collaborators for their households" ON public.collaborators;
DROP POLICY IF EXISTS "Users can remove collaborators from their households" ON public.collaborators;

CREATE POLICY "Users can view collaborators for accessible households" ON public.collaborators
FOR SELECT 
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage collaborators for their households" ON public.collaborators
FOR INSERT 
WITH CHECK (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove collaborators from their households" ON public.collaborators
FOR DELETE 
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

-- Update RLS policies for invite_links to use household_id
DROP POLICY IF EXISTS "Profile owners can create invite links" ON public.invite_links;
DROP POLICY IF EXISTS "Profile owners can update invite links" ON public.invite_links;
DROP POLICY IF EXISTS "Users can view invite links for their baby profiles" ON public.invite_links;
DROP POLICY IF EXISTS "Anyone can view valid invite links for joining" ON public.invite_links;
DROP POLICY IF EXISTS "Collaborators can create invite links" ON public.invite_links;
DROP POLICY IF EXISTS "Collaborators can update invite links" ON public.invite_links;
DROP POLICY IF EXISTS "Users can view invite links for accessible households" ON public.invite_links;

CREATE POLICY "Collaborators can create invite links" ON public.invite_links
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Collaborators can update invite links" ON public.invite_links
FOR UPDATE 
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view invite links for accessible households" ON public.invite_links
FOR SELECT 
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view valid invite links for joining" ON public.invite_links
FOR SELECT 
USING ((expires_at > now()) AND (used_at IS NULL));