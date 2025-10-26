-- Improved backfill: Use created_at timestamp to determine the correct date
-- This handles cases where UTC conversion put activities on the wrong day

DO $$
DECLARE
  activity_record RECORD;
  display_time TEXT;
  time_parts TEXT[];
  hour_val INTEGER;
  minute_val INTEGER;
  period TEXT;
  new_logged_at TIMESTAMP;
  base_date DATE;
  created_date DATE;
BEGIN
  -- Loop through all activities
  FOR activity_record IN 
    SELECT id, logged_at, created_at, details, type
    FROM activities
  LOOP
    -- Extract the display time from details
    IF activity_record.type = 'nap' AND activity_record.details ? 'startTime' THEN
      display_time := activity_record.details->>'startTime';
    ELSIF activity_record.details ? 'displayTime' THEN
      display_time := activity_record.details->>'displayTime';
    ELSE
      -- No display time found, skip this record
      CONTINUE;
    END IF;
    
    -- Skip if display time is null or empty
    IF display_time IS NULL OR display_time = '' THEN
      CONTINUE;
    END IF;
    
    -- Use created_at date as the base (convert to local date, assuming PST/PDT UTC-7/-8)
    -- Subtract 8 hours from created_at to get the local date
    created_date := (activity_record.created_at - INTERVAL '8 hours')::DATE;
    
    -- Parse the display time (format: "7:00 AM" or "11:30 PM")
    -- Handle range times like "7:00 AM - 8:00 AM" by taking first part
    IF display_time LIKE '% - %' THEN
      display_time := SPLIT_PART(display_time, ' - ', 1);
    END IF;
    
    -- Split into time and period
    time_parts := STRING_TO_ARRAY(display_time, ' ');
    IF array_length(time_parts, 1) != 2 THEN
      CONTINUE; -- Invalid format
    END IF;
    
    period := time_parts[2];
    
    -- Split time into hours and minutes
    hour_val := SPLIT_PART(time_parts[1], ':', 1)::INTEGER;
    minute_val := SPLIT_PART(time_parts[1], ':', 2)::INTEGER;
    
    -- Convert to 24-hour format
    IF period = 'PM' AND hour_val != 12 THEN
      hour_val := hour_val + 12;
    ELSIF period = 'AM' AND hour_val = 12 THEN
      hour_val := 0;
    END IF;
    
    -- Create new timestamp: use created_date with the display time
    new_logged_at := created_date + (hour_val || ' hours')::INTERVAL + (minute_val || ' minutes')::INTERVAL;
    
    -- Only update if the new timestamp is different from current
    IF activity_record.logged_at != new_logged_at THEN
      UPDATE activities
      SET logged_at = new_logged_at
      WHERE id = activity_record.id;
      
      RAISE NOTICE 'Updated activity % (type: %, display: %) from % to %', 
        activity_record.id, 
        activity_record.type,
        display_time,
        activity_record.logged_at, 
        new_logged_at;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Backfill complete. All activities now use correct local dates based on created_at and displayTime.';
END $$;