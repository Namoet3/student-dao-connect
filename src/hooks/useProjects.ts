import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectWithApplications } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export interface ProjectFilters {
  search?: string;
  status?: 'open' | 'active' | 'completed' | 'all';
  budgetMin?: number;
  budgetMax?: number;
}

const PROJECTS_PER_PAGE = 10;

export const useProjects = (filters: ProjectFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['projects', filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * PROJECTS_PER_PAGE, (pageParam + 1) * PROJECTS_PER_PAGE - 1);

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.budgetMin !== undefined) {
        query = query.gte('budget_min', filters.budgetMin);
      }

      if (filters.budgetMax !== undefined) {
        query = query.lte('budget_max', filters.budgetMax);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        projects: data as Project[],
        nextPage: data.length === PROJECTS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          applications (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as ProjectWithApplications;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Project;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project posted 🎉',
        description: 'Your project has been successfully posted!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error posting project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};