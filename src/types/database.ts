export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  topic: string | null;
  expertise_level: string | null;
  mandatory_skills: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  status: 'open' | 'active' | 'completed';
  created_at: string;
  people_count: number;
}

export interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  feedback?: string | null;
}

export interface ProjectWithApplications extends Project {
  applications?: Application[];
}