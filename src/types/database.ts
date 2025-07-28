export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  status: 'open' | 'active' | 'completed';
  created_at: string;
}

export interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ProjectWithApplications extends Project {
  applications?: Application[];
}