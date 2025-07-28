-- Create activities view for recent activity feed
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

-- Add applications to realtime publication (if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'applications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE applications;
  END IF;
END $$;

-- Set replica identity for realtime
ALTER TABLE applications REPLICA IDENTITY FULL;