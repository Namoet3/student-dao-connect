import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useWithdrawApplication, useUpdateApplication } from '@/hooks/useApplications';
import { Application } from '@/types/database';
import { Edit, Trash2 } from 'lucide-react';

interface ApplicationActionsProps {
  application: Application;
  isApplicant: boolean;
}

export const ApplicationActions = ({ application, isApplicant }: ApplicationActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState(application.cover_letter || '');
  const withdrawApplication = useWithdrawApplication();
  const updateApplication = useUpdateApplication();

  const handleWithdraw = async () => {
    await withdrawApplication.mutateAsync(application.id);
  };

  const handleUpdate = async () => {
    if (editedCoverLetter.trim().length < 10) {
      return;
    }
    
    await updateApplication.mutateAsync({
      applicationId: application.id,
      coverLetter: editedCoverLetter.trim(),
    });
    setIsEditOpen(false);
  };

  if (!isApplicant || application.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Edit Application */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update your cover letter for this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cover-letter">Cover Letter</Label>
              <Textarea
                id="cover-letter"
                placeholder="Explain why you're the perfect fit for this project..."
                value={editedCoverLetter}
                onChange={(e) => setEditedCoverLetter(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editedCoverLetter.length}/1000 characters
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditedCoverLetter(application.cover_letter || '');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateApplication.isPending || editedCoverLetter.trim().length < 10}
              >
                {updateApplication.isPending ? 'Updating...' : 'Update Application'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Application */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Withdraw
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Withdraw Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};