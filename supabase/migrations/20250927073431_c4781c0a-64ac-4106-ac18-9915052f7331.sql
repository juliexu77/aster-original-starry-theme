-- Step 1: Create households table
CREATE TABLE public.households (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'My Household',
  baby_name TEXT,
  baby_birthday DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on households
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- Create trigger for households updated_at
CREATE TRIGGER update_households_updated_at
BEFORE UPDATE ON public.households
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();