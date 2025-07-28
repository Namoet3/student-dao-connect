import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';

export const useAcceptedProjects = (applicantAddress: string | null) => {
  return useQuery({
    queryKey: ['accepted-projects', applicantAddress],
    queryFn: async () => {
      if (!applicantAddress) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          project_id,
          projects!inner (*)
        `)
        .eq('applicant_id', applicantAddress)
        .eq('status', 'accepted');

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item: any) => item.projects).filter(Boolean) as Project[];
    },
    enabled: !!applicantAddress,
  });
};