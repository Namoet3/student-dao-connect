-- Update projects table to use text for owner_id instead of uuid
ALTER TABLE public.projects 
ALTER COLUMN owner_id TYPE text;

-- Update applications table to use text for applicant_id instead of uuid  
ALTER TABLE public.applications 
ALTER COLUMN applicant_id TYPE text;