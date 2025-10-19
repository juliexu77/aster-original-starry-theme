-- Allow parents to update collaborator roles in their household
CREATE POLICY "Parents can update collaborator roles in their household"
ON public.collaborators
FOR UPDATE
TO authenticated
USING (
  household_id IN (
    SELECT household_id 
    FROM public.collaborators 
    WHERE user_id = auth.uid() 
    AND role = 'parent'
  )
);