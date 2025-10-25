-- Add configurable night sleep window settings to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS night_sleep_start_hour INTEGER DEFAULT 19,
ADD COLUMN IF NOT EXISTS night_sleep_end_hour INTEGER DEFAULT 7;

-- Add constraints to ensure valid hour ranges (0-23)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_night_sleep_start_hour_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_night_sleep_start_hour_check 
    CHECK (night_sleep_start_hour >= 0 AND night_sleep_start_hour <= 23);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_night_sleep_end_hour_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_night_sleep_end_hour_check 
    CHECK (night_sleep_end_hour >= 0 AND night_sleep_end_hour <= 23);
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN public.profiles.night_sleep_start_hour IS 'Hour (0-23) when overnight sleep typically starts, default 19 (7 PM)';
COMMENT ON COLUMN public.profiles.night_sleep_end_hour IS 'Hour (0-23) when overnight sleep typically ends, default 7 (7 AM)';