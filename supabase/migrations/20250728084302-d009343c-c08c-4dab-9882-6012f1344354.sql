-- Drop existing RLS policies
DROP POLICY IF EXISTS "owner can manage project" ON public.projects;
DROP POLICY IF EXISTS "applicant can manage own application" ON public.applications;
DROP POLICY IF EXISTS "project owner can read applications" ON public.applications;

-- Drop foreign key constraints
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_owner_id_fkey;
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_applicant_id_fkey;
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_project_id_fkey;

-- Update column types to text
ALTER TABLE public.projects ALTER COLUMN owner_id TYPE text;
ALTER TABLE public.applications ALTER COLUMN applicant_id TYPE text;

-- Recreate RLS policies (simplified for now)
CREATE POLICY "anyone can manage projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "anyone can manage applications" ON public.applications FOR ALL USING (true);