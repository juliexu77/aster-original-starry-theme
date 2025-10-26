-- Backfill historical activities to fix UTC timezone issues
-- This will convert activities with UTC timestamps (+00) to local time based on displayTime/startTime

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
BEGIN
  -- Loop through all activities that have a timezone suffix (indicating old UTC format)
  FOR activity_record IN 
    SELECT id, logged_at, details, type
    FROM activities
    WHERE logged_at::TEXT LIKE '%+00'
       OR logged_at::TEXT LIKE '%Z'
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
    
    -- Get the base date from the current logged_at (in UTC)
    base_date := activity_record.logged_at::DATE;
    
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
    
    -- If the converted time suggests it's before midnight but base_date is the next day,
    -- it means the UTC conversion pushed it to the next day - adjust back
    IF hour_val < 12 AND EXTRACT(HOUR FROM activity_record.logged_at) >= 12 THEN
      -- This was likely evening previous day, adjust date back by 1
      base_date := base_date - INTERVAL '1 day';
    END IF;
    
    -- Create new timestamp without timezone suffix (local time)
    new_logged_at := base_date + (hour_val || ' hours')::INTERVAL + (minute_val || ' minutes')::INTERVAL;
    
    -- Update the activity
    UPDATE activities
    SET logged_at = new_logged_at
    WHERE id = activity_record.id;
    
    RAISE NOTICE 'Updated activity % from % to %', 
      activity_record.id, 
      activity_record.logged_at, 
      new_logged_at;
  END LOOP;
  
  -- Summary
  RAISE NOTICE 'Backfill complete. All UTC timestamps have been converted to local time.';
END $$;