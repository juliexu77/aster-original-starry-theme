-- Fix RLS policy for baby_profiles INSERT to ensure created_by is properly handled
DROP POLICY IF EXISTS "Users can create baby profiles" ON public.baby_profiles;

CREATE POLICY "Users can create baby profiles" ON public.baby_profiles
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);