import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, User, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Application } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateApplication } from '@/hooks/useApplications';
import { ApplicationManagement } from './ApplicationManagement';

interface ApplicationsPanelProps {
  applications: Application[];
  isOwner: boolean;
  projectId: string;
}

export const ApplicationsPanel: React.FC<ApplicationsPanelProps> = ({
  applications,
  isOwner,
  projectId
}) => {
  const { user } = useAuth();
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState('');
  const updateApplicationMutation = useUpdateApplication();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const filteredApplications = isOwner 
    ? applications 
    : applications.filter(app => app.applicant_id === user?.address);

  const handleEditClick = (application: Application) => {
    setEditingApplication(application);
    setEditedCoverLetter(application.cover_letter || '');
  };

  const handleUpdateApplication = () => {
    if (!editingApplication) return;

    updateApplicationMutation.mutate({
      applicationId: editingApplication.id,
      coverLetter: editedCoverLetter
    }, {
      onSuccess: () => {
        setEditingApplication(null);
        setEditedCoverLetter('');
      }
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect your wallet to view applications</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationManagement applications={applications} isOwner={isOwner} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            My Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't applied to this project yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{formatAddress(application.applicant_id)}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      {application.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(application)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Cover Letter:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {application.cover_letter || 'No cover letter provided'}
                    </p>
                  </div>

                  {application.status === 'rejected' && application.feedback && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Feedback:</p>
                      <p className="text-sm text-red-700 dark:text-red-300">{application.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Application Dialog */}
      <Dialog open={!!editingApplication} onOpenChange={() => setEditingApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCoverLetter">Cover Letter *</Label>
              <Textarea
                id="editCoverLetter"
                placeholder="Update your cover letter..."
                value={editedCoverLetter}
                onChange={(e) => setEditedCoverLetter(e.target.value)}
                className="min-h-[150px] mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {editedCoverLetter.length}/50 characters minimum
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingApplication(null)}
                disabled={updateApplicationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateApplication}
                disabled={updateApplicationMutation.isPending || editedCoverLetter.trim().length < 50}
              >
                {updateApplicationMutation.isPending ? 'Updating...' : 'Update Application'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};