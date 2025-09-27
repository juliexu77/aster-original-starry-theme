-- Drop all policies that depend on the old columns first
DROP POLICY IF EXISTS "Collaborators can view accessible households" ON public.households;
DROP POLICY IF EXISTS "Collaborators can update accessible households" ON public.households;
DROP POLICY IF EXISTS "Anyone can create households" ON public.households;

-- Drop old columns
ALTER TABLE public.collaborators DROP COLUMN IF EXISTS baby_profile_id;
ALTER TABLE public.invite_links DROP COLUMN IF EXISTS baby_profile_id;
ALTER TABLE public.activities DROP COLUMN IF EXISTS baby_profile_id;

-- Add foreign key constraints
ALTER TABLE public.activities ADD CONSTRAINT activities_household_id_fkey 
FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;

ALTER TABLE public.collaborators ADD CONSTRAINT collaborators_household_id_fkey 
FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;

ALTER TABLE public.invite_links ADD CONSTRAINT invite_links_household_id_fkey 
FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;

-- Now add the proper policies for households
CREATE POLICY "Collaborators can view accessible households" ON public.households
FOR SELECT 
USING (
  id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Collaborators can update accessible households" ON public.households
FOR UPDATE 
USING (
  id IN (
    SELECT household_id FROM public.collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can create households" ON public.households
FOR INSERT 
WITH CHECK (true);