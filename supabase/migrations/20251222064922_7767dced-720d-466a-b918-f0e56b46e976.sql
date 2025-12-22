-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create households table
CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Family',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create household members junction table
CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'caregiver' CHECK (role IN ('owner', 'caregiver')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(household_id, user_id)
);

-- Create babies table
CREATE TABLE public.babies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthday DATE,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sleep_activities table (simplified - only sleep)
CREATE TABLE public.sleep_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_night_sleep BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Households policies
CREATE POLICY "Users can view households they belong to"
  ON public.households FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create households"
  ON public.households FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners can update their households"
  ON public.households FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = id AND user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "Owners can delete their households"
  ON public.households FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Household members policies
CREATE POLICY "Users can view members of their households"
  ON public.household_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.household_members hm
    WHERE hm.household_id = household_id AND hm.user_id = auth.uid()
  ));

CREATE POLICY "Users can join households"
  ON public.household_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can manage household members"
  ON public.household_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.household_members hm
    WHERE hm.household_id = household_id AND hm.user_id = auth.uid() AND hm.role = 'owner'
  ));

-- Babies policies
CREATE POLICY "Users can view babies in their households"
  ON public.babies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = babies.household_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can add babies to their households"
  ON public.babies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = babies.household_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update babies in their households"
  ON public.babies FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = babies.household_id AND user_id = auth.uid()
  ));

CREATE POLICY "Owners can delete babies"
  ON public.babies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = babies.household_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Sleep activities policies
CREATE POLICY "Users can view sleep in their households"
  ON public.sleep_activities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = sleep_activities.household_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can log sleep in their households"
  ON public.sleep_activities FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = sleep_activities.household_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sleep in their households"
  ON public.sleep_activities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = sleep_activities.household_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete sleep in their households"
  ON public.sleep_activities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.household_members 
    WHERE household_id = sleep_activities.household_id AND user_id = auth.uid()
  ));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_babies_updated_at
  BEFORE UPDATE ON public.babies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sleep_activities_updated_at
  BEFORE UPDATE ON public.sleep_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();