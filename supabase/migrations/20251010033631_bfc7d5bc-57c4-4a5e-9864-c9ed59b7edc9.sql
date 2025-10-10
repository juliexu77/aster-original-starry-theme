
-- Fix invalid time format (5:60 PM should be 6:00 PM)
UPDATE activities
SET details = jsonb_set(
  details,
  '{endTime}',
  '"6:00 PM"'::jsonb
)
WHERE id = '2d14131d-a498-4ddb-949d-7b01fb4272c8'
  AND details->>'endTime' = '5:60 PM';
