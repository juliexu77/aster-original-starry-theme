-- Optimize cosmos_readings query performance
-- Drop old partial index and create a composite index covering all query filters

DROP INDEX IF EXISTS public.idx_cosmos_readings_household_month;
DROP INDEX IF EXISTS public.idx_cosmos_readings_member;

-- Create optimal composite index for the query:
-- SELECT * FROM cosmos_readings WHERE household_id = ? AND member_id = ? AND month_year IN (?, ?)
CREATE INDEX idx_cosmos_readings_composite
  ON public.cosmos_readings(household_id, member_id, month_year);

-- Add index for weekly readings too
DROP INDEX IF EXISTS public.idx_weekly_readings_household_week;

CREATE INDEX idx_weekly_readings_composite
  ON public.weekly_readings(household_id, member_id, week_start);
