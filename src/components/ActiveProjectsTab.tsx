import { useMyProjects } from '@/hooks/useMyProjects';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const ActiveProjectsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useMyProjects(user?.address || null);

  const activeProjects = projects?.filter(project => project.status === 'active') || [];

  const handleCompleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase.rpc('complete_project', { 
        project_id_param: projectId 
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Project completed',
        description: 'Your project has been marked as completed',
      });
    } catch (error) {
      toast({
        title: 'Failed to complete project',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Budget not specified';
    if (!max) return `From $${min}`;
    if (!min) return `Up to $${max}`;
    return `$${min} - $${max}`;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please connect your wallet to view your projects</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-destructive">Failed to load your projects</p>
        </CardContent>
      </Card>
    );
  }

  if (!activeProjects.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You don't have any active projects yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Projects become active when you accept enough applications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {activeProjects.map((project) => (
        <Card key={project.id} className="relative border-orange-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800">
                    Active
                  </Badge>
                  <span className="text-sm">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
            <div className="text-sm font-medium">
              {formatBudget(project.budget_min, project.budget_max)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${project.id}`)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleCompleteProject(project.id)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};