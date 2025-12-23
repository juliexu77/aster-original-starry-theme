-- Add birthday field to profiles for zodiac compatibility
ALTER TABLE public.profiles ADD COLUMN birthday date NULL;