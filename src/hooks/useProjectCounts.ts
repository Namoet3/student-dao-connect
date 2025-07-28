import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface ProjectCounts {
  posted: number;
  active: number;
  completed: number;
}

export const useProjectCounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['project-counts', user?.address],
    queryFn: async (): Promise<ProjectCounts> => {
      if (!user?.address) {
        return { posted: 0, active: 0, completed: 0 };
      }

      const { data, error } = await supabase.functions.invoke('project-counts', {
        body: { user_id: user.address }
      });

      if (error) {
        console.error('Error fetching project counts:', error);
        throw new Error('Failed to fetch project counts');
      }

      return data;
    },
    enabled: !!user?.address,
  });

  // Set up realtime subscription for projects table
  useEffect(() => {
    if (!user?.address) return;

    const channel = supabase
      .channel('project-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `owner_id=eq.${user.address}`
        },
        (payload) => {
          console.log('Project change detected:', payload);
          // Invalidate project counts to refetch
          queryClient.invalidateQueries({ queryKey: ['project-counts', user.address] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.address, queryClient]);

  return query;
};