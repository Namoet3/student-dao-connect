-- Update the trigger function to set project status to 'active' when enough people are accepted
CREATE OR REPLACE FUNCTION public.check_and_activate_project()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
    
    -- If we've reached the required number of people, set project to active
    IF accepted_count >= project_people_count THEN
      UPDATE public.projects
      SET status = 'active'
      WHERE id = NEW.project_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Drop the old trigger
DROP TRIGGER IF EXISTS check_and_close_project_trigger ON applications;

-- Create the new trigger
CREATE TRIGGER check_and_activate_project_trigger
  AFTER INSERT OR UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION check_and_activate_project();

-- Add a new function to manually complete projects
CREATE OR REPLACE FUNCTION public.complete_project(project_id_param UUID)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Only the project owner can complete their project
  UPDATE public.projects
  SET status = 'completed'
  WHERE id = project_id_param 
    AND owner_id IS NOT NULL
    AND status = 'active';
END;
$function$;