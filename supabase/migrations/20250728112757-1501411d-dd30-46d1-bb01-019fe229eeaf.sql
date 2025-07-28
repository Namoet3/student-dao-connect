-- Add feedback column to applications table
ALTER TABLE public.applications 
ADD COLUMN feedback TEXT;

-- Add unique constraint to prevent duplicate applications from same user to same project
ALTER TABLE public.applications 
ADD CONSTRAINT unique_applicant_project UNIQUE (applicant_id, project_id);

-- Add indexes for better performance
CREATE INDEX idx_applications_project_id ON public.applications(project_id);
CREATE INDEX idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);