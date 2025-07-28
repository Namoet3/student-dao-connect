import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface ApplicationModalProps {
  projectId: string;
  projectTitle: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  projectId,
  projectTitle,
  disabled = false,
  children
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user?.address) {
      toast({
        title: 'Authentication Required',
        description: 'Please connect your wallet to apply',
        variant: 'destructive',
      });
      return;
    }

    if (coverLetter.trim().length < 50) {
      toast({
        title: 'Cover Letter Too Short',
        description: 'Please write at least 50 characters explaining why you\'re a good fit',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          project_id: projectId,
          applicant_id: user.address,
          cover_letter: coverLetter.trim(),
          status: 'pending'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Already Applied',
            description: 'You have already applied to this project',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      // Invalidate and refetch project data to update applications list
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });

      toast({
        title: 'Application Sent! 🚀',
        description: 'Your application has been sent to the project owner',
      });

      setCoverLetter('');
      setOpen(false);
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: 'Application Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply to "{projectTitle}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              placeholder="Explain why you're the perfect fit for this project. Highlight your relevant skills, experience, and what value you can bring... (minimum 50 characters)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[150px] mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {coverLetter.length}/50 characters minimum
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || coverLetter.trim().length < 50}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};