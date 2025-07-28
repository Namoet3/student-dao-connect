import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock, DollarSign, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProject } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: project, isLoading, error } = useProject(id!);

  const handleApply = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Connect wallet first',
        variant: 'destructive',
      });
      return;
    }
    
    // TODO: Implement application logic
    toast({
      title: 'Application Feature',
      description: 'Application functionality will be implemented in the next sprint',
    });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{formatAddress(project.owner_id)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {project.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications Section */}
              {project.applications && project.applications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Applications ({project.applications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.applications.map((application) => (
                        <div key={application.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {formatAddress(application.applicant_id)}
                            </span>
                            <Badge variant="outline">
                              {application.status}
                            </Badge>
                          </div>
                          {application.cover_letter && (
                            <p className="text-sm text-muted-foreground">
                              {application.cover_letter}
                            </p>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </div>
                    <p className="text-lg font-semibold">
                      {formatBudget(project.budget_min, project.budget_max)}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Posted</div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {project.status === 'open' && user?.address !== project.owner_id && (
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleApply}
                    >
                      Apply to Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};