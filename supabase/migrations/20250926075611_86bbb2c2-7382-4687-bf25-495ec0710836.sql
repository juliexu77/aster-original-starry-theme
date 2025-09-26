-- Add photo_url column to baby_profiles table
ALTER TABLE public.baby_profiles 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for baby photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('baby-photos', 'baby-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for baby photos storage
CREATE POLICY "Users can view baby photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'baby-photos');

CREATE POLICY "Users can upload baby photos for their profile" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'baby-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their baby photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'baby-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their baby photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'baby-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);