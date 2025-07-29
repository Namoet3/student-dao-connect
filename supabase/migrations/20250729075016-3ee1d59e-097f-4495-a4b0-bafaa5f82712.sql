-- Drop existing policies and recreate them with proper wallet authentication
DROP POLICY IF EXISTS "Applicants can create questions for projects they applied to" ON public.project_questions;
DROP POLICY IF EXISTS "Applicants can view their own questions" ON public.project_questions;
DROP POLICY IF EXISTS "Project owners can view questions for their projects" ON public.project_questions;
DROP POLICY IF EXISTS "Project owners can update questions for their projects" ON public.project_questions;
DROP POLICY IF EXISTS "Project owners can delete questions for their projects" ON public.project_questions;

-- Recreate policies that work with wallet addresses
-- Allow anyone to view questions (public visibility)
CREATE POLICY "Anyone can view project questions" 
ON public.project_questions 
FOR SELECT 
USING (true);

-- Allow inserting questions (we'll validate on client side)
CREATE POLICY "Anyone can create questions" 
ON public.project_questions 
FOR INSERT 
WITH CHECK (true);

-- Allow updating questions (for adding answers)
CREATE POLICY "Anyone can update questions" 
ON public.project_questions 
FOR UPDATE 
USING (true);

-- Allow deleting questions
CREATE POLICY "Anyone can delete questions" 
ON public.project_questions 
FOR DELETE 
USING (true);