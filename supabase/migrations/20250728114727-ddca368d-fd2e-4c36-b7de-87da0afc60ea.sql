-- Add people_count field to projects table
ALTER TABLE public.projects 
ADD COLUMN people_count INTEGER DEFAULT 1 CHECK (people_count > 0);

-- Update applications RLS policies to hide details from other applicants
DROP POLICY IF EXISTS "allow viewing applications" ON public.applications;

-- Policy to allow project owners to see all applications for their projects
CREATE POLICY "owners can view applications for their projects" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = applications.project_id 
    AND projects.owner_id = auth.uid()::text
  )
);

-- Policy to allow applicants to see only their own applications
CREATE POLICY "applicants can view their own applications" 
ON public.applications 
FOR SELECT 
USING (applicant_id = auth.uid()::text);

-- Add function to automatically close projects when enough people are accepted
CREATE OR REPLACE FUNCTION public.check_and_close_project()
RETURNS TRIGGER AS $$
DECLARE
  project_people_count INTEGER;
  accepted_count INTEGER;
BEGIN
  -- Only proceed if status is 'accepted'
  IF NEW.status = 'accepted' THEN
    -- Get the people count for this project
    SELECT people_count INTO project_people_count
    FROM public.projects
    WHERE id = NEW.project_id;
    
    -- Count accepted applications for this project
    SELECT COUNT(*) INTO accepted_count
    FROM public.applications
    WHERE project_id = NEW.project_id AND status = 'accepted';
    
    -- If we've reached the required number of people, close the project
    IF accepted_count >= project_people_count THEN
      UPDATE public.projects
      SET status = 'completed'
      WHERE id = NEW.project_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically close projects
DROP TRIGGER IF EXISTS auto_close_project_trigger ON public.applications;
CREATE TRIGGER auto_close_project_trigger
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_close_project();