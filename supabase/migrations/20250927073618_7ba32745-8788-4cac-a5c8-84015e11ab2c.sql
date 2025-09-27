-- Complete the column migrations that didn't happen
-- Update activities table
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS household_id UUID;

-- Migrate existing activity data if household_id is empty
UPDATE public.activities 
SET household_id = baby_profile_id
WHERE household_id IS NULL AND baby_profile_id IS NOT NULL;

-- Update collaborators table  
ALTER TABLE public.collaborators ADD COLUMN IF NOT EXISTS household_id UUID;

-- Migrate existing collaborator data if household_id is empty
UPDATE public.collaborators 
SET household_id = baby_profile_id
WHERE household_id IS NULL AND baby_profile_id IS NOT NULL;

-- Update invite_links table
ALTER TABLE public.invite_links ADD COLUMN IF NOT EXISTS household_id UUID;

-- Migrate existing invite data if household_id is empty
UPDATE public.invite_links 
SET household_id = baby_profile_id
WHERE household_id IS NULL AND baby_profile_id IS NOT NULL;