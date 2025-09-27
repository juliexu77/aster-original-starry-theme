-- Add missing columns to profiles table for user photo and role
ALTER TABLE public.profiles 
ADD COLUMN photo_url TEXT,
ADD COLUMN role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'nanny'));