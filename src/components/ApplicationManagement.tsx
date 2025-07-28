import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { Application } from '@/types/database';

interface ApplicationManagementProps {
  applications: Application[];
  isOwner: boolean;
}

export const ApplicationManagement = ({ applications, isOwner }: ApplicationManagementProps) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
    await updateStatus.mutateAsync({ 
      applicationId, 
      status, 
      feedback: feedback.trim() || undefined 
    });
    setFeedback('');
    setIsDialogOpen(false);
    setSelectedApplication(null);
  };

  const openFeedbackDialog = (application: Application, status: 'accepted' | 'rejected') => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!applications.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No applications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  Application from {application.applicant_id.slice(0, 6)}...{application.applicant_id.slice(-4)}
                </CardTitle>
                <CardDescription>
                  Applied on {new Date(application.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.cover_letter && (
              <div>
                <Label className="text-sm font-medium">Cover Letter</Label>
                <p className="text-sm text-muted-foreground mt-1">{application.cover_letter}</p>
              </div>
            )}
            
            {application.feedback && (
              <div>
                <Label className="text-sm font-medium">Feedback</Label>
                <p className="text-sm text-muted-foreground mt-1">{application.feedback}</p>
              </div>
            )}

            {isOwner && application.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openFeedbackDialog(application, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openFeedbackDialog(application, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Feedback Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback for this application (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Enter your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setFeedback('');
                  setSelectedApplication(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedApplication && 
                  handleStatusUpdate(selectedApplication.id, 'accepted')}
                disabled={updateStatus.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept Application
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedApplication && 
                  handleStatusUpdate(selectedApplication.id, 'rejected')}
                disabled={updateStatus.isPending}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};