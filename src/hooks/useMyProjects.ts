import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/database';

export const useMyProjects = (ownerAddress: string | null) => {
  return useQuery({
    queryKey: ['my-projects', ownerAddress],
    queryFn: async () => {
      if (!ownerAddress) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', ownerAddress)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Project[];
    },
    enabled: !!ownerAddress,
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};