-- Create table to cache family dynamics insights
CREATE TABLE public.family_dynamics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  member_signatures TEXT NOT NULL, -- Hash of member IDs + birthdays for cache invalidation
  dynamics JSONB NOT NULL,
  member_profiles JSONB,
  element_balance JSONB,
  modality_balance JSONB,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_dynamics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view family dynamics for their household"
ON public.family_dynamics FOR SELECT
USING (EXISTS (
  SELECT 1 FROM household_members
  WHERE household_members.household_id = family_dynamics.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Users can create family dynamics for their household"
ON public.family_dynamics FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM household_members
  WHERE household_members.household_id = family_dynamics.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Users can update family dynamics for their household"
ON public.family_dynamics FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM household_members
  WHERE household_members.household_id = family_dynamics.household_id
  AND household_members.user_id = auth.uid()
));

CREATE POLICY "Users can delete family dynamics for their household"
ON public.family_dynamics FOR DELETE
USING (EXISTS (
  SELECT 1 FROM household_members
  WHERE household_members.household_id = family_dynamics.household_id
  AND household_members.user_id = auth.uid()
));

-- Index for faster lookups
CREATE INDEX idx_family_dynamics_household ON public.family_dynamics(household_id);
CREATE INDEX idx_family_dynamics_signatures ON public.family_dynamics(household_id, member_signatures);

-- Trigger for updated_at
CREATE TRIGGER update_family_dynamics_updated_at
BEFORE UPDATE ON public.family_dynamics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();