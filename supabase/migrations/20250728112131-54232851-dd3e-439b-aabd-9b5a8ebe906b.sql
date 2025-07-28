-- Fix RLS policies with correct syntax
DROP POLICY IF EXISTS "authenticated users can submit applications" ON public.applications;
DROP POLICY IF EXISTS "users can view relevant applications" ON public.applications;
DROP POLICY IF EXISTS "owners can update application status" ON public.applications;

-- Allow all users to submit applications
CREATE POLICY "allow application submissions" ON public.applications
FOR INSERT WITH CHECK (true);

-- Allow all users to view applications  
CREATE POLICY "allow viewing applications" ON public.applications
FOR SELECT USING (true);

-- Allow all users to update application status
CREATE POLICY "allow updating applications" ON public.applications
FOR UPDATE USING (true);