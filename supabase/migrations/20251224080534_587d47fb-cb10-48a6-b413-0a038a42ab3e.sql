-- Add birth_location column to babies table
ALTER TABLE public.babies 
ADD COLUMN IF NOT EXISTS birth_location TEXT;

-- Add birth_location column to profiles table (for parent)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_location TEXT;