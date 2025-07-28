-- Drop the problematic view and recreate without security definer
DROP VIEW IF EXISTS public.activities;

-- Create activities view with security invoker (default)
CREATE VIEW public.activities AS
  SELECT 
    projects.id,
    projects.owner_id as user_id,
    'posted_project' as kind,
    projects.title as description,
    projects.created_at
  FROM projects
  UNION ALL
  SELECT 
    applications.id,
    applications.applicant_id as user_id,
    applications.status || '_application' as kind,
    'Application ' || applications.status as description,
    applications.created_at
  FROM applications;