-- Add new fields to projects table
ALTER TABLE public.projects 
ADD COLUMN topic TEXT,
ADD COLUMN expertise_level TEXT,
ADD COLUMN mandatory_skills TEXT[];