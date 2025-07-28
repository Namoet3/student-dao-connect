-- Allow applicants to update only their own application's cover_letter
CREATE POLICY "applicant can edit own application"
ON public.applications 
FOR UPDATE 
USING (auth.uid()::text = applicant_id)
WITH CHECK (auth.uid()::text = applicant_id);