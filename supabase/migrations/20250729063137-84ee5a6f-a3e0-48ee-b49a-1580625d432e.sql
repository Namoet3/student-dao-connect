-- Fix the remaining Security Definer view issue
-- Drop and recreate the activities view to ensure it's not SECURITY DEFINER
DROP VIEW IF EXISTS public.activities;

-- Recreate as a regular view (security invoker by default)
CREATE VIEW public.activities AS
SELECT 
  id,
  user_id,
  kind,
  description,
  created_at
FROM (
  -- Projects posted
  SELECT 
    id,
    owner_id as user_id,
    'posted_project' as kind,
    title as description,
    created_at
  FROM public.projects
  
  UNION ALL
  
  -- Applications submitted
  SELECT 
    applications.id,
    applications.applicant_id as user_id,
    CASE 
      WHEN applications.status = 'pending' THEN 'pending_application'
      WHEN applications.status = 'accepted' THEN 'accepted_application'
      WHEN applications.status = 'rejected' THEN 'rejected_application'
      ELSE 'pending_application'
    END as kind,
    CASE 
      WHEN applications.status = 'pending' THEN 'Application pending'
      WHEN applications.status = 'accepted' THEN 'Application accepted'
      WHEN applications.status = 'rejected' THEN 'Application rejected'
      ELSE 'Application pending'
    END as description,
    applications.created_at
  FROM public.applications
) activities_union;

-- Add input validation constraints (only if they don't exist)
DO $$
BEGIN
  -- Add project constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_title_length') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_title_length CHECK (char_length(title) >= 8 AND char_length(title) <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_description_length') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_description_length CHECK (char_length(description) >= 20 AND char_length(description) <= 2000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_budget_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_budget_positive CHECK (budget_min >= 0 AND budget_max >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_budget_range') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_budget_range CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_people_count_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_people_count_positive CHECK (people_count >= 1);
  END IF;
  
  -- Add application constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'applications_cover_letter_length') THEN
    ALTER TABLE public.applications ADD CONSTRAINT applications_cover_letter_length CHECK (char_length(cover_letter) >= 20 AND char_length(cover_letter) <= 2000);
  END IF;
  
  -- Add wallet address validation constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'wallet_address_format') THEN
    ALTER TABLE public.wallet_connections ADD CONSTRAINT wallet_address_format CHECK (wallet_address ~* '^0x[a-fA-F0-9]{40}$');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'projects_owner_id_format') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_owner_id_format CHECK (owner_id ~* '^0x[a-fA-F0-9]{40}$');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'applications_applicant_id_format') THEN
    ALTER TABLE public.applications ADD CONSTRAINT applications_applicant_id_format CHECK (applicant_id ~* '^0x[a-fA-F0-9]{40}$');
  END IF;
END
$$;