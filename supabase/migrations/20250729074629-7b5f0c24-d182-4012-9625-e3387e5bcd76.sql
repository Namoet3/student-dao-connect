-- Create questions table for project Q&A
CREATE TABLE public.project_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  applicant_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answered_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.project_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Applicants can create questions for projects they applied to
CREATE POLICY "Applicants can create questions for projects they applied to" 
ON public.project_questions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE project_id = project_questions.project_id 
    AND applicant_id = project_questions.applicant_id
  )
);

-- Applicants can view their own questions
CREATE POLICY "Applicants can view their own questions" 
ON public.project_questions 
FOR SELECT 
USING (applicant_id IS NOT NULL);

-- Project owners can view questions for their projects
CREATE POLICY "Project owners can view questions for their projects" 
ON public.project_questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_questions.project_id 
    AND owner_id IS NOT NULL
  )
);

-- Project owners can update questions for their projects (to add answers)
CREATE POLICY "Project owners can update questions for their projects" 
ON public.project_questions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_questions.project_id 
    AND owner_id IS NOT NULL
  )
);

-- Project owners can delete questions for their projects
CREATE POLICY "Project owners can delete questions for their projects" 
ON public.project_questions 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_questions.project_id 
    AND owner_id IS NOT NULL
  )
);

-- Add foreign key constraint
ALTER TABLE public.project_questions 
ADD CONSTRAINT fk_project_questions_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;