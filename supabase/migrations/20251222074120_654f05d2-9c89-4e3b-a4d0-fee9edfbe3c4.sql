-- Drop the existing check constraint
ALTER TABLE public.household_members DROP CONSTRAINT IF EXISTS household_members_role_check;

-- Add new constraint with owner and parent roles
ALTER TABLE public.household_members ADD CONSTRAINT household_members_role_check 
CHECK (role = ANY (ARRAY['owner'::text, 'parent'::text]));

-- Update the default value to 'parent' for invited members
ALTER TABLE public.household_members ALTER COLUMN role SET DEFAULT 'parent'::text;