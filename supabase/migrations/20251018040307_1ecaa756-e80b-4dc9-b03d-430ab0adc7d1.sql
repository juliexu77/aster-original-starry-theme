-- Drop the old constraint
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_type_check;

-- Add new constraint with measure and photo types
ALTER TABLE public.activities ADD CONSTRAINT activities_type_check 
CHECK (type = ANY (ARRAY['feed'::text, 'diaper'::text, 'nap'::text, 'note'::text, 'measure'::text, 'photo'::text]))