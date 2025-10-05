-- Create baby-photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('baby-photos', 'baby-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for baby-photos bucket
CREATE POLICY "Users can view their own baby photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'baby-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT household_id::text 
    FROM collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload baby photos to their household"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'baby-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT household_id::text 
    FROM collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their household baby photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'baby-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT household_id::text 
    FROM collaborators 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their household baby photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'baby-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT household_id::text 
    FROM collaborators 
    WHERE user_id = auth.uid()
  )
);