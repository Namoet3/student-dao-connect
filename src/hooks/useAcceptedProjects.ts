import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';

export const useAcceptedProjects = (applicantAddress: string | null) => {
  return useQuery({
    queryKey: ['projects', 'accepted', applicantAddress],
    queryFn: async () => {
      if (!applicantAddress) return [];
      
      // Get projects where user has accepted applications
      const { data: acceptedApplications, error: appError } = await supabase
        .from('applications')
        .select('project_id')
        .eq('applicant_id', applicantAddress)
        .eq('status', 'accepted');

      if (appError) {
        throw new Error(appError.message);
      }

      if (!acceptedApplications || acceptedApplications.length === 0) {
        return [];
      }

      const projectIds = acceptedApplications.map(app => app.project_id);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Project[];
    },
    enabled: !!applicantAddress,
  });
};