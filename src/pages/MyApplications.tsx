import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNow } from 'date-fns';
import { FileText, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationActions } from '@/components/ApplicationActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Application, Project } from '@/types/database';

interface ApplicationWithProject extends Application {
  projects?: Project;
}

export const MyApplications = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['my-applications', user?.address],
    queryFn: async () => {
      if (!user?.address) return [];

      // First get applications
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_id', user.address)
        .order('created_at', { ascending: false });

      if (appError) {
        throw new Error(appError.message);
      }

      // Then get project details for each application
      const applicationsWithProjects = await Promise.all(
        (appData || []).map(async (app) => {
          const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', app.project_id)
            .single();

          return {
            ...app,
            projects: project
          } as ApplicationWithProject;
        })
      );

      return applicationsWithProjects;
    },
    enabled: !!user?.address,
  });

  const filteredApplications = applications?.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  ) || [];

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

  const statusCounts = applications?.reduce((acc, app) => {
    const status = app.status as 'pending' | 'accepted' | 'rejected';
    acc[status] = (acc[status] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, { all: 0, pending: 0, accepted: 0, rejected: 0 }) || { all: 0, pending: 0, accepted: 0, rejected: 0 };

  if (!user) {
    return (
      <>
        <Helmet>
          <title>My Applications - UniversityDAO</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please connect your wallet to view your applications.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Applications - UniversityDAO</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your project applications</p>
          </div>

          <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                {statusCounts.all > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {statusCounts.all}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending
                {statusCounts.pending > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {statusCounts.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                Accepted
                {statusCounts.accepted > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {statusCounts.accepted}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                Rejected
                {statusCounts.rejected > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {statusCounts.rejected}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">Failed to load applications</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedStatus === 'all' ? 'No Applications Yet' : `No ${selectedStatus} Applications`}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedStatus === 'all' 
                      ? "You haven't applied to any projects yet. Start browsing available projects!"
                      : `You don't have any ${selectedStatus} applications.`
                    }
                  </p>
                  <Button asChild>
                    <Link to="/projects">Browse Projects</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              <Link 
                                to={`/projects/${application.project_id}`}
                                className="hover:text-primary transition-colors flex items-center gap-2"
                              >
                                {application.projects?.title || 'Unknown Project'}
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
                              <Badge className={getStatusColor(application.status)} variant="outline">
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {application.projects?.description && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Project Description</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.projects.description}
                            </p>
                          </div>
                        )}
                        
                        {application.cover_letter && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Your Cover Letter</h4>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm leading-relaxed">
                                {application.cover_letter}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {application.feedback && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Feedback</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm leading-relaxed text-blue-800">
                                {application.feedback}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <ApplicationActions 
                            application={application} 
                            isApplicant={true} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};