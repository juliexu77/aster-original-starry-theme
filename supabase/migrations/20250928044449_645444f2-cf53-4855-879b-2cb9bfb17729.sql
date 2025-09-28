-- Storage policies for baby-photos bucket
-- Allow public read (already implied by public bucket, but explicit for clarity)
CREATE POLICY "Public can view baby photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'baby-photos');

-- Allow authenticated collaborators to upload into a folder named with their household_id
CREATE POLICY "Collaborators can upload baby photos to their household folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'baby-photos'
  AND user_has_household_access(auth.uid(), (storage.foldername(name))[1]::uuid)
);

-- Allow updates by collaborators for files in their household folder
CREATE POLICY "Collaborators can update baby photos in their household folder"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'baby-photos'
  AND user_has_household_access(auth.uid(), (storage.foldername(name))[1]::uuid)
)
WITH CHECK (
  bucket_id = 'baby-photos'
  AND user_has_household_access(auth.uid(), (storage.foldername(name))[1]::uuid)
);

-- Allow deletes by collaborators for files in their household folder
CREATE POLICY "Collaborators can delete baby photos in their household folder"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'baby-photos'
  AND user_has_household_access(auth.uid(), (storage.foldername(name))[1]::uuid)
);
