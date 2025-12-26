-- Add dismiss count tracking to baby_calibrations
ALTER TABLE public.baby_calibrations 
ADD COLUMN IF NOT EXISTS prompt_dismiss_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_prompt_dismissed_at timestamp with time zone;