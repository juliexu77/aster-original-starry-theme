-- Add minute columns for night sleep times
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS night_sleep_start_minute integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS night_sleep_end_minute integer DEFAULT 0;