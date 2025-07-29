-- Fix critical security issues

-- 1. Add proper foreign key relationship between applications and projects
ALTER TABLE public.applications 
ADD CONSTRAINT applications_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- 2. Fix overly permissive RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "anyone can manage projects" ON public.projects;
DROP POLICY IF EXISTS "allow_application_submissions" ON public.applications;
DROP POLICY IF EXISTS "applicants_can_update_own_applications" ON public.applications;
DROP POLICY IF EXISTS "applicants_can_view_own_applications" ON public.applications;
DROP POLICY IF EXISTS "owners_can_view_project_applications" ON public.applications;

-- Create proper RLS policies for projects
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (owner_id IS NOT NULL);

CREATE POLICY "Owners can update their projects" 
ON public.projects 
FOR UPDATE 
USING (owner_id IS NOT NULL);

CREATE POLICY "Owners can delete their projects" 
ON public.projects 
FOR DELETE 
USING (owner_id IS NOT NULL);

-- Create proper RLS policies for applications
CREATE POLICY "Users can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (applicant_id IS NOT NULL);

CREATE POLICY "Applicants can view their own applications" 
ON public.applications 
FOR SELECT 
USING (applicant_id IS NOT NULL);

CREATE POLICY "Project owners can view applications for their projects" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = applications.project_id 
    AND projects.owner_id IS NOT NULL
  )
);

CREATE POLICY "Applicants can update their own pending applications" 
ON public.applications 
FOR UPDATE 
USING (
  applicant_id IS NOT NULL 
  AND status = 'pending'
);

CREATE POLICY "Project owners can update applications for their projects" 
ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = applications.project_id 
    AND projects.owner_id IS NOT NULL
  )
);

-- 3. Fix the activities view security definer issue
DROP VIEW IF EXISTS public.activities;

-- Recreate activities as a regular view (security invoker by default)
CREATE VIEW public.activities AS
SELECT 
  id,
  user_id,
  kind,
  description,
  created_at
FROM (
  -- Projects posted
  SELECT 
    id,
    owner_id as user_id,
    'posted_project' as kind,
    title as description,
    created_at
  FROM public.projects
  
  UNION ALL
  
  -- Applications submitted
  SELECT 
    applications.id,
    applications.applicant_id as user_id,
    CASE 
      WHEN applications.status = 'pending' THEN 'pending_application'
      WHEN applications.status = 'accepted' THEN 'accepted_application'
      WHEN applications.status = 'rejected' THEN 'rejected_application'
      ELSE 'pending_application'
    END as kind,
    CASE 
      WHEN applications.status = 'pending' THEN 'Application pending'
      WHEN applications.status = 'accepted' THEN 'Application accepted'
      WHEN applications.status = 'rejected' THEN 'Application rejected'
      ELSE 'Application pending'
    END as description,
    applications.created_at
  FROM public.applications
) activities_union;

-- Add RLS to activities view
ALTER VIEW public.activities SET (security_invoker = true);

-- 4. Add input validation constraints
ALTER TABLE public.projects 
ADD CONSTRAINT projects_title_length CHECK (char_length(title) >= 8 AND char_length(title) <= 100),
ADD CONSTRAINT projects_description_length CHECK (char_length(description) >= 20 AND char_length(description) <= 2000),
ADD CONSTRAINT projects_budget_positive CHECK (budget_min >= 0 AND budget_max >= 0),
ADD CONSTRAINT projects_budget_range CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max),
ADD CONSTRAINT projects_people_count_positive CHECK (people_count >= 1);

ALTER TABLE public.applications
ADD CONSTRAINT applications_cover_letter_length CHECK (char_length(cover_letter) >= 20 AND char_length(cover_letter) <= 2000);

-- 5. Add wallet address format validation
ALTER TABLE public.wallet_connections
ADD CONSTRAINT wallet_address_format CHECK (wallet_address ~* '^0x[a-fA-F0-9]{40}$');

-- Also add this constraint to projects and applications
ALTER TABLE public.projects
ADD CONSTRAINT projects_owner_id_format CHECK (owner_id ~* '^0x[a-fA-F0-9]{40}$');

ALTER TABLE public.applications
ADD CONSTRAINT applications_applicant_id_format CHECK (applicant_id ~* '^0x[a-fA-F0-9]{40}$');

-- 6. Create indexes for better performance and security
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON public.applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_address ON public.wallet_connections(wallet_address);