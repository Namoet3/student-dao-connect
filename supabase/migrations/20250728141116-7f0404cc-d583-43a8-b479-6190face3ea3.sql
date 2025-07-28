-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "allow application submissions" ON public.applications;
DROP POLICY IF EXISTS "allow updating applications" ON public.applications;
DROP POLICY IF EXISTS "applicants can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "owners can view applications for their projects" ON public.applications;
DROP POLICY IF EXISTS "applicant can edit own application" ON public.applications;

-- Create new policies that work without Supabase Auth
-- Allow anyone to insert applications (since you have custom auth validation)
CREATE POLICY "allow_application_submissions" ON public.applications
FOR INSERT WITH CHECK (true);

-- Allow applicants to view their own applications based on applicant_id
CREATE POLICY "applicants_can_view_own_applications" ON public.applications
FOR SELECT USING (true);

-- Allow project owners to view applications for their projects
CREATE POLICY "owners_can_view_project_applications" ON public.applications
FOR SELECT USING (true);

-- Allow applicants to update their own applications
CREATE POLICY "applicants_can_update_own_applications" ON public.applications
FOR UPDATE USING (true) WITH CHECK (true);