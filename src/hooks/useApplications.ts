import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: 'accepted' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
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