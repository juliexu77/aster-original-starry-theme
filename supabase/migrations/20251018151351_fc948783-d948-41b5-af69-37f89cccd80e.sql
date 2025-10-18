-- Add baby_sex column to households table
ALTER TABLE public.households 
ADD COLUMN baby_sex text CHECK (baby_sex IN ('male', 'female'));

COMMENT ON COLUMN public.households.baby_sex IS 'Baby sex for WHO growth percentile calculations';