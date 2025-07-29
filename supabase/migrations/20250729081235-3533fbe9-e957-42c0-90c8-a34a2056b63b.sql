-- Fix the security definer view by dropping and recreating it properly
DROP VIEW IF EXISTS public.activities;

-- Recreate the activities view without SECURITY DEFINER
CREATE VIEW public.activities AS
SELECT 
  'project_created' as kind,
  p.owner_id as user_id,
  p.id,
  'Created project: ' || p.title as description,
  p.created_at
FROM public.projects p
WHERE p.owner_id IS NOT NULL

UNION ALL

SELECT 
  'application_submitted' as kind,
  a.applicant_id as user_id,
  a.id,
  'Applied to project' as description,
  a.created_at
FROM public.applications a
WHERE a.applicant_id IS NOT NULL

UNION ALL

SELECT 
  'application_accepted' as kind,
  a.applicant_id as user_id,
  a.id,
  'Application accepted' as description,
  a.created_at
FROM public.applications a
WHERE a.applicant_id IS NOT NULL AND a.status = 'accepted';