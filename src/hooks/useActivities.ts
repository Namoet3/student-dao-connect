import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface Activity {
  id: string;
  user_id: string;
  kind: string;
  description: string;
  created_at: string;
}

export const useActivities = (limit = 10) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['activities', user?.address, limit],
    queryFn: async (): Promise<Activity[]> => {
      if (!user?.address) return [];

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.address)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        throw new Error('Failed to fetch activities');
      }

      return data || [];
    },
    enabled: !!user?.address,
  });

  // Set up realtime subscriptions for both projects and applications
  useEffect(() => {
    if (!user?.address) return;

    const projectsChannel = supabase
      .channel('user-projects-activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `owner_id=eq.${user.address}`
        },
        (payload) => {
          console.log('User project change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['activities', user.address] });
        }
      )
      .subscribe();

    const applicationsChannel = supabase
      .channel('user-applications-activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `applicant_id=eq.${user.address}`
        },
        (payload) => {
          console.log('User application change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['activities', user.address] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(applicationsChannel);
    };
  }, [user?.address, queryClient]);

  return query;
};