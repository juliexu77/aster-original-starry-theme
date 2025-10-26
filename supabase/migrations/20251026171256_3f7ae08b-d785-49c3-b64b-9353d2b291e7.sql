-- Add timezone column to activities table to preserve local context
ALTER TABLE public.activities 
ADD COLUMN timezone text NOT NULL DEFAULT 'America/Los_Angeles';

-- Add comment explaining the purpose
COMMENT ON COLUMN public.activities.timezone IS 'IANA timezone name (e.g., America/Los_Angeles, Asia/Tokyo) where the activity was logged. Used to display the activity in its original local time context regardless of user''s current location.';