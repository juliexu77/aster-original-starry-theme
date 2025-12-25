-- Add partner birth information fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN partner_name text,
ADD COLUMN partner_birthday date,
ADD COLUMN partner_birth_time time without time zone,
ADD COLUMN partner_birth_location text;