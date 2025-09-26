-- Fix the handle_new_user trigger function to work properly with RLS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a proper handle_new_user function with security definer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the signup process
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the RLS policy to allow the trigger to insert profiles
DROP POLICY IF EXISTS "Allow signup trigger to insert profiles" ON public.profiles;
CREATE POLICY "Allow signup trigger to insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);