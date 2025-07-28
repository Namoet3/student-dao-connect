-- Update RLS policies for applications
DROP POLICY IF EXISTS "anyone can manage applications" ON public.applications;

-- Users can view applications for projects they own or applications they submitted
CREATE POLICY "users can view relevant applications" ON public.applications
FOR SELECT USING (
  applicant_id = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid()::text)
);

-- Users can insert their own applications
CREATE POLICY "users can submit applications" ON public.applications
FOR INSERT WITH CHECK (applicant_id = auth.uid()::text);

-- Project owners can update application status
CREATE POLICY "owners can update application status" ON public.applications
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid()::text)
);

-- Enable realtime for applications table
ALTER TABLE public.applications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- Enable realtime for projects table
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;