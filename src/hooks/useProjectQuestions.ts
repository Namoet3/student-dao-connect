import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectQuestion {
  id: string;
  project_id: string;
  applicant_id: string;
  question: string;
  answer?: string;
  created_at: string;
  answered_at?: string;
}

export const useProjectQuestions = (projectId: string) => {
  return useQuery({
    queryKey: ['project-questions', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_questions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ProjectQuestion[];
    },
  });
};

export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, question, userId }: { projectId: string; question: string; userId: string }) => {
      const { data, error } = await supabase
        .from('project_questions')
        .insert({
          project_id: projectId,
          question,
          applicant_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-questions', variables.projectId] });
      toast({
        title: "Success",
        description: "Your question has been submitted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAnswerQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ questionId, answer, projectId }: { questionId: string; answer: string; projectId: string }) => {
      const { data, error } = await supabase
        .from('project_questions')
        .update({
          answer,
          answered_at: new Date().toISOString()
        })
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-questions', variables.projectId] });
      toast({
        title: "Success",
        description: "Answer submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ questionId, projectId }: { questionId: string; projectId: string }) => {
      const { error } = await supabase
        .from('project_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-questions', variables.projectId] });
      toast({
        title: "Success",
        description: "Question deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};