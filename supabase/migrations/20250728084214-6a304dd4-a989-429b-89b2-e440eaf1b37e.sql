-- Drop existing RLS policies that reference owner_id and applicant_id
DROP POLICY IF EXISTS "owner can manage project" ON public.projects;
DROP POLICY IF EXISTS "applicant can manage own application" ON public.applications;
DROP POLICY IF EXISTS "project owner can read applications" ON public.applications;

-- Update projects table to use text for owner_id instead of uuid
ALTER TABLE public.projects 
ALTER COLUMN owner_id TYPE text;

-- Update applications table to use text for applicant_id instead of uuid  
ALTER TABLE public.applications 
ALTER COLUMN applicant_id TYPE text;

-- Recreate RLS policies with text-based comparisons
CREATE POLICY "owner can manage project" ON public.projects
FOR ALL USING (owner_id = auth.jwt() ->> 'wallet_address');

CREATE POLICY "applicant can manage own application" ON public.applications  
FOR ALL USING (applicant_id = auth.jwt() ->> 'wallet_address');

CREATE POLICY "project owner can read applications" ON public.applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = applications.project_id 
    AND owner_id = auth.jwt() ->> 'wallet_address'
  )
);