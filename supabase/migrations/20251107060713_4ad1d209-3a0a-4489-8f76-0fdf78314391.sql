-- Make baby-photos bucket public so all household collaborators can view photos
UPDATE storage.buckets 
SET public = true 
WHERE id = 'baby-photos';