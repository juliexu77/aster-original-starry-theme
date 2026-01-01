-- Create cosmos_readings table to store monthly astrological readings
CREATE TABLE public.cosmos_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL, -- baby ID, 'parent', or 'partner'
  member_type TEXT NOT NULL CHECK (member_type IN ('child', 'parent', 'partner')),
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM' e.g. '2026-01'
  reading_content JSONB NOT NULL, -- Full reading with all sections
  intake_type TEXT NOT NULL CHECK (intake_type IN ('questions', 'voice')),
  intake_responses JSONB, -- Stored intake answers for reference
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_reading_per_member_per_month UNIQUE (household_id, member_id, month_year)
);

-- Enable Row Level Security
ALTER TABLE public.cosmos_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for household member access
CREATE POLICY "Users can view cosmos readings for their household" 
ON public.cosmos_readings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_members.household_id = cosmos_readings.household_id 
    AND household_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create cosmos readings for their household" 
ON public.cosmos_readings 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_members.household_id = cosmos_readings.household_id 
    AND household_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update cosmos readings for their household" 
ON public.cosmos_readings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_members.household_id = cosmos_readings.household_id 
    AND household_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete cosmos readings for their household" 
ON public.cosmos_readings 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_members.household_id = cosmos_readings.household_id 
    AND household_members.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cosmos_readings_updated_at
BEFORE UPDATE ON public.cosmos_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_cosmos_readings_household_month ON public.cosmos_readings(household_id, month_year);
CREATE INDEX idx_cosmos_readings_member ON public.cosmos_readings(member_id, month_year);