-- Add DELETE policy for households
-- Allow collaborators with 'parent' role to delete households
CREATE POLICY "Parents can delete their households"
ON public.households
FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT household_id 
    FROM collaborators 
    WHERE user_id = auth.uid() AND role = 'parent'
  )
);

-- Delete the empty household
DELETE FROM public.households 
WHERE id = 'e74950ba-629e-4c01-9f44-4f8adbb87338';