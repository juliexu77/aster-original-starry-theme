-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can create households" ON public.households;

-- Create a proper permissive policy for creating households
CREATE POLICY "Anyone can create households"
ON public.households
FOR INSERT
TO authenticated
WITH CHECK (true);