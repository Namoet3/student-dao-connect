import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  User, 
  MessageCircle, 
  Star,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationModal } from '@/components/ApplicationModal';
import { ApplicationsPanel } from '@/components/ApplicationsPanel';
import ProjectQuestions from '@/components/ProjectQuestions';
import { supabase } from '@/integrations/supabase/client';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useProject } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: project, isLoading, error, refetch } = useProject(id!);

  // Set up realtime subscription for applications
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel('project-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `project_id=eq.${id}`
        },
        () => {
          // Refetch project data when applications change
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetch]);


  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Budget negotiable';
    if (min && max) return `${min}-${max} ETH`;
    if (min) return `${min}+ ETH`;
    if (max) return `Up to ${max} ETH`;
    return 'Budget negotiable';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const shortTitle = project?.title ? 
    (project.title.length > 30 ? project.title.substring(0, 30) + '...' : project.title) 
    : 'Project';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-64" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <>
        <Helmet>
          <title>Project Not Found - UniversityDAO</title>
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </>
    );
  }

  const isOwner = user?.address === project.owner_id;
  const canApply = project.status === 'open' && !isOwner;
  const userApplication = project.applications?.find(app => app.applicant_id === user?.address);

  return (
    <>
      <Helmet>
        <title>{project.title} - UniversityDAO</title>
        <meta name="description" content={project.description.substring(0, 160)} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description.substring(0, 160)} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/projects">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{shortTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-4">{project.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{formatAddress(project.owner_id)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-primary">
                            {formatBudget(project.budget_min, project.budget_max)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {project.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Button - Only for non-owners who haven't applied */}
              {canApply && !userApplication && (
                <div className="flex justify-center">
                  <ApplicationModal projectId={project.id} projectTitle={project.title}>
                    <Button size="lg" className="w-full lg:w-auto">
                      Apply to this Project
                    </Button>
                  </ApplicationModal>
                </div>
              )}

              {/* Applications Panel - Shows user's own application or all applications for owner */}
              {(isOwner || userApplication || (user && project.applications && project.applications.length > 0)) && (
                <ApplicationsPanel 
                  applications={project.applications || []} 
                  isOwner={isOwner}
                  projectId={project.id}
                />
              )}

              {/* Q&A Section */}
              <ProjectQuestions 
                projectId={project.id} 
                isOwner={isOwner} 
                hasApplied={!!userApplication} 
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Users className="h-4 w-4" />
                      People Needed
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      {project.people_count}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <DollarSign className="h-4 w-4" />
                      Budget Range
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      {formatBudget(project.budget_min, project.budget_max)}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Status</div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Posted</div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {project.applications && project.applications.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Users className="h-4 w-4" />
                          Applications
                        </div>
                        <p className="text-lg font-semibold">
                          {project.applications.length}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Owner Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{formatAddress(project.owner_id)}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>4.8 reputation</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Other Projects</p>
                    <div className="space-y-2">
                      <div className="text-sm p-2 bg-muted/50 rounded">
                        <p className="font-medium">DeFi Analytics Dashboard</p>
                        <p className="text-xs text-muted-foreground">Completed • 2.5 ETH</p>
                      </div>
                      <div className="text-sm p-2 bg-muted/50 rounded">
                        <p className="font-medium">Smart Contract Audit</p>
                        <p className="text-xs text-muted-foreground">Active • 1.8 ETH</p>
                      </div>
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        +5 more projects
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approved Team Members */}
              {project.applications && project.applications.some(app => app.status === 'accepted') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Approved Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.applications
                      .filter(app => app.status === 'accepted')
                      .map((application) => (
                        <div key={application.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{formatAddress(application.applicant_id)}</p>
                            <p className="text-xs text-muted-foreground">
                              Accepted {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Approved
                          </Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => navigate('/projects')}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};