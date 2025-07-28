import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';

export const useAcceptedProjects = (applicantAddress: string | null) => {
  return useQuery({
    queryKey: ['projects', 'accepted', applicantAddress],
    queryFn: async () => {
      if (!applicantAddress) return [];
      
      // Optimized single query with inner join
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          applications!inner (
            status
          )
        `)
        .eq('applications.applicant_id', applicantAddress)
        .eq('applications.status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Project[];
    },
    enabled: !!applicantAddress,
  });
};