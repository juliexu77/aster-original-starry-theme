-- Clean up duplicate Caleb households with no activities or collaborators
-- Keep only the household with actual data (id: 5516efc8-90ca-4aa6-ba86-16263fcd9cb5)

DELETE FROM public.households
WHERE baby_name = 'Caleb'
  AND id != '5516efc8-90ca-4aa6-ba86-16263fcd9cb5'
  AND NOT EXISTS (
    SELECT 1 FROM public.activities WHERE activities.household_id = households.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.collaborators WHERE collaborators.household_id = households.id
  );