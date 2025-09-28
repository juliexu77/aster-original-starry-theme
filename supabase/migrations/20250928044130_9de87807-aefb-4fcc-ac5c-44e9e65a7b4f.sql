-- Add photo_url column to households table for baby photos
ALTER TABLE public.households 
ADD COLUMN baby_photo_url TEXT;