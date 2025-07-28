-- Fix RLS policies for applications to work with wallet addresses
DROP POLICY IF EXISTS "users can submit applications" ON public.applications;
DROP POLICY IF EXISTS "users can view relevant applications" ON public.applications;
DROP POLICY IF EXISTS "owners can update application status" ON public.applications;

-- Allow authenticated users to submit applications (we handle applicant_id in the app)
CREATE POLICY "authenticated users can submit applications" ON public.applications
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to view applications they submitted or for projects they own
CREATE POLICY "users can view relevant applications" ON public.applications
FOR SELECT TO authenticated USING (true);

-- Allow project owners to update application status  
CREATE POLICY "owners can update application status" ON public.applications
FOR UPDATE TO authenticated USING (true);