-- Remove overly permissive policies that allow anyone to view photos
DROP POLICY IF EXISTS "Public can view baby photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view baby photos" ON storage.objects;

-- The remaining policies ensure only household collaborators can view:
-- - "Users can view their own baby photos" (household access check)
-- - "Users can view their own photos" (user's own folder check)