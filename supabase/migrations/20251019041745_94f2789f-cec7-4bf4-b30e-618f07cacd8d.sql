-- Add daily recap settings to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_recap_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS daily_recap_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS daily_recap_include_notes BOOLEAN DEFAULT false;