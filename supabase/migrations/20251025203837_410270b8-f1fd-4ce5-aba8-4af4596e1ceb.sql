-- Add configurable night sleep window settings to profiles table
ALTER TABLE profiles 
ADD COLUMN night_sleep_start_hour INTEGER DEFAULT 19 CHECK (night_sleep_start_hour >= 0 AND night_sleep_start_hour <= 23),
ADD COLUMN night_sleep_end_hour INTEGER DEFAULT 7 CHECK (night_sleep_end_hour >= 0 AND night_sleep_end_hour <= 23);

COMMENT ON COLUMN profiles.night_sleep_start_hour IS 'Hour (0-23) when overnight sleep typically starts, default 19 (7 PM)';
COMMENT ON COLUMN profiles.night_sleep_end_hour IS 'Hour (0-23) when overnight sleep typically ends, default 7 (7 AM)';