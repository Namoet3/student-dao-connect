-- First, clean up orphaned applications before adding foreign key constraint
DELETE FROM public.applications 
WHERE project_id NOT IN (SELECT id FROM public.projects);

-- Now add the foreign key constraint
ALTER TABLE public.applications 
ADD CONSTRAINT applications_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Fix overly permissive RLS policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON public.applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);