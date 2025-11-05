-- Create table to store daily schedule predictions
CREATE TABLE IF NOT EXISTS public.daily_schedule_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  predicted_schedule JSONB NOT NULL,
  accuracy_score DECIMAL(5,2),
  last_accuracy_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(household_id, prediction_date)
);

-- Enable RLS
ALTER TABLE public.daily_schedule_predictions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view predictions for their household
CREATE POLICY "Users can view their household predictions"
ON public.daily_schedule_predictions
FOR SELECT
USING (
  household_id IN (
    SELECT household_id FROM public.collaborators WHERE user_id = auth.uid()
  )
);

-- Policy: System can insert predictions (for edge functions)
CREATE POLICY "System can insert predictions"
ON public.daily_schedule_predictions
FOR INSERT
WITH CHECK (true);

-- Policy: System can update predictions (for edge functions)
CREATE POLICY "System can update predictions"
ON public.daily_schedule_predictions
FOR UPDATE
USING (true);

-- Add index for faster lookups
CREATE INDEX idx_daily_predictions_household_date 
ON public.daily_schedule_predictions(household_id, prediction_date DESC);