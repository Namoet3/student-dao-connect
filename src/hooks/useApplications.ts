import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status, feedback }: { applicationId: string; status: 'accepted' | 'rejected'; feedback?: string }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, feedback })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate project query to refresh applications list
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      
      const statusText = data.status === 'accepted' ? 'accepted' : 'rejected';
      toast({
        title: `Application ${statusText}`,
        description: `The application has been ${statusText}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast({
        title: 'Application withdrawn',
        description: 'Your application has been withdrawn',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to withdraw application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, coverLetter }: { applicationId: string; coverLetter: string }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ cover_letter: coverLetter })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast({
        title: 'Application updated',
        description: 'Your application has been updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};