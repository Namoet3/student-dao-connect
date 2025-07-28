-- Fix function search path security issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';