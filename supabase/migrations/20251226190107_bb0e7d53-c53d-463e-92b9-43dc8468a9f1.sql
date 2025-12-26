-- Create baby_calibrations table to store developmental baseline data
CREATE TABLE public.baby_calibrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  
  -- Sleep domain
  sleep_naps TEXT, -- '3+', '2', '1', 'irregular'
  
  -- Feeding domain
  feeding_solids TEXT, -- 'not_started', 'starting', 'regular', 'confident'
  
  -- Physical domain (multi-select stored as array)
  physical_skills TEXT[], -- ['sit', 'crawl', 'pull_stand', 'stand', 'cruise', 'none']
  
  -- Language domain
  language_sounds TEXT, -- 'coos', 'babbling', 'intentional', 'words_few', 'words_many'
  
  -- Social-emotional domain
  social_separation TEXT, -- 'unaware', 'calm', 'upset', 'follows'
  
  -- Challenge anchor (optional)
  current_challenge TEXT, -- 'sleep', 'feeding', 'fussiness', 'milestones', 'none'
  
  -- Computed flags for "emerging early" domains
  emerging_early_flags JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- One calibration per baby
  UNIQUE(baby_id)
);

-- Enable RLS
ALTER TABLE public.baby_calibrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view calibrations in their households"
ON public.baby_calibrations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.household_members
  WHERE household_members.household_id = baby_calibrations.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Users can insert calibrations in their households"
ON public.baby_calibrations
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.household_members
  WHERE household_members.household_id = baby_calibrations.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Users can update calibrations in their households"
ON public.baby_calibrations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.household_members
  WHERE household_members.household_id = baby_calibrations.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Owners can delete calibrations"
ON public.baby_calibrations
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.household_members
  WHERE household_members.household_id = baby_calibrations.household_id
  AND household_members.user_id = auth.uid()
  AND household_members.role = 'owner'
));

-- Add updated_at trigger
CREATE TRIGGER update_baby_calibrations_updated_at
BEFORE UPDATE ON public.baby_calibrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();