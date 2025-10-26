-- Clean up duplicate dream feeds on October 24, 2025
-- These were created incorrectly during the backfill migration

-- Delete the two duplicate 10:00 PM dream feeds, keeping only the oldest
DELETE FROM activities 
WHERE id IN (
  '71044f32-0b78-4f97-88a3-e6e269f824b4',  -- Created 2025-10-25 (newer duplicate)
  'fd27eb9c-f536-4a73-b082-85f90c492fa3'   -- Created 2025-10-24 15:19 (middle duplicate)
)
-- Keep id: 60bac60f-bf31-4691-aff1-1ab035785dde (oldest, created 2025-10-24 15:18)
;