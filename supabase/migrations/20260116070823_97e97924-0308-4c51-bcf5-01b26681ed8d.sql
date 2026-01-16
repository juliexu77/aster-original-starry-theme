-- Create table for weekly auto-generated readings
CREATE TABLE public.weekly_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  member_type TEXT NOT NULL CHECK (member_type IN ('child', 'parent', 'partner')),
  week_start DATE NOT NULL,
  reading_content JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(household_id, member_id, week_start)
);

-- Enable Row Level Security
ALTER TABLE public.weekly_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for household member access
CREATE POLICY "Users can view their household weekly readings"
ON public.weekly_readings
FOR SELECT
USING (public.is_household_member(household_id, auth.uid()));

CREATE POLICY "Users can create weekly readings for their household"
ON public.weekly_readings
FOR INSERT
WITH CHECK (public.is_household_member(household_id, auth.uid()));

CREATE POLICY "Users can update weekly readings for their household"
ON public.weekly_readings
FOR UPDATE
USING (public.is_household_member(household_id, auth.uid()));

CREATE POLICY "Users can delete weekly readings for their household"
ON public.weekly_readings
FOR DELETE
USING (public.is_household_member(household_id, auth.uid()));

-- Index for efficient lookups
CREATE INDEX idx_weekly_readings_household_member_week 
ON public.weekly_readings(household_id, member_id, week_start DESC);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_readings_updated_at
BEFORE UPDATE ON public.weekly_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();