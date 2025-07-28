-- Create activities view for recent activity feed (without RLS)
CREATE VIEW public.activities AS
  SELECT 
    id,
    owner_id as user_id,
    'posted_project' as kind,
    title as description,
    created_at
  FROM projects
  UNION ALL
  SELECT 
    id,
    applicant_id as user_id,
    status || '_application' as kind,
    'Application ' || status as description,
    created_at
  FROM applications;

-- Add to realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Set replica identity for realtime
ALTER TABLE projects REPLICA IDENTITY FULL;
ALTER TABLE applications REPLICA IDENTITY FULL;