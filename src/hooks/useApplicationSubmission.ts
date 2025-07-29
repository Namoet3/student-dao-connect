import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Application } from '@/types/database';

export const useApplicationSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      projectId, 
      applicantId, 
      coverLetter 
    }: { 
      projectId: string; 
      applicantId: string; 
      coverLetter: string; 
    }) => {
      // Input validation
      if (!projectId || !applicantId || !coverLetter) {
        throw new Error('All fields are required');
      }

      const trimmedCoverLetter = coverLetter.trim();
      if (trimmedCoverLetter.length < 20) {
        throw new Error('Cover letter must be at least 20 characters long');
      }

      if (trimmedCoverLetter.length > 2000) {
        throw new Error('Cover letter must be less than 2000 characters');
      }

      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(applicantId)) {
        throw new Error('Invalid wallet address format');
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([{
          project_id: projectId,
          applicant_id: applicantId,
          cover_letter: trimmedCoverLetter,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already applied to this project');
        }
        throw error;
      }

      return data as Application;
    },
    onMutate: async ({ projectId, applicantId, coverLetter }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['project', projectId] });

      // Snapshot the previous value
      const previousProject = queryClient.getQueryData(['project', projectId]);

      // Optimistically update the cache
      queryClient.setQueryData(['project', projectId], (old: any) => {
        if (!old) return old;
        
        const newApplication: Application = {
          id: `temp-${Date.now()}`, // Temporary ID
          project_id: projectId,
          applicant_id: applicantId,
          cover_letter: coverLetter.trim(),
          status: 'pending',
          created_at: new Date().toISOString(),
          feedback: null
        };

        return {
          ...old,
          applications: [...(old.applications || []), newApplication]
        };
      });

      return { previousProject };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousProject) {
        queryClient.setQueryData(['project', variables.projectId], context.previousProject);
      }

      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (data, variables) => {
      // Update the cache with the real data
      queryClient.setQueryData(['project', variables.projectId], (old: any) => {
        if (!old) return old;
        
        const applications = old.applications || [];
        const filteredApplications = applications.filter((app: Application) => 
          !app.id.startsWith('temp-')
        );

        return {
          ...old,
          applications: [...filteredApplications, data]
        };
      });

      toast({
        title: 'Application Sent! 🚀',
        description: 'Your application has been sent to the project owner',
      });
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};