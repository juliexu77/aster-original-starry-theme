-- Add auto_log_wake_enabled column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN auto_log_wake_enabled boolean DEFAULT false;