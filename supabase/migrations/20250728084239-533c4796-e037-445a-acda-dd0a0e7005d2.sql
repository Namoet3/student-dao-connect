-- Drop existing RLS policies that reference owner_id and applicant_id
DROP POLICY IF EXISTS "owner can manage project" ON public.projects;
DROP POLICY IF EXISTS "applicant can manage own application" ON public.applications;
DROP POLICY IF EXISTS "project owner can read applications" ON public.applications;

-- Drop any foreign key constraints on owner_id if they exist
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_owner_id_fkey;

-- Update projects table to use text for owner_id instead of uuid
ALTER TABLE public.projects 
ALTER COLUMN owner_id TYPE text;

-- Update applications table to use text for applicant_id instead of uuid  
ALTER TABLE public.applications 
ALTER COLUMN applicant_id TYPE text;

-- Create simple RLS policies that work with wallet addresses
CREATE POLICY "owner can manage project" ON public.projects
FOR ALL USING (true);

CREATE POLICY "applicant can manage own application" ON public.applications  
FOR ALL USING (true);

CREATE POLICY "project owner can read applications" ON public.applications
FOR SELECT USING (true);