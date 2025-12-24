-- Add birth_time column to profiles table for moon sign calculation
ALTER TABLE public.profiles
ADD COLUMN birth_time TIME WITHOUT TIME ZONE DEFAULT NULL;

-- Add birth_time column to babies table for moon sign calculation
ALTER TABLE public.babies
ADD COLUMN birth_time TIME WITHOUT TIME ZONE DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.birth_time IS 'Time of birth for moon sign calculation (optional)';
COMMENT ON COLUMN public.babies.birth_time IS 'Time of birth for moon sign calculation (optional)';