import { useAuth } from '@/contexts/AuthContext';
import { useAcceptedProjects } from '@/hooks/useAcceptedProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export const AcceptedProjectsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useAcceptedProjects(user?.address || null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'active':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  if (!user) {
    return (
      <div className="text-center text-muted-foreground">
        Please connect your wallet to view your accepted projects.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Failed to load your accepted projects. Please try again.
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">You haven't been accepted to any projects yet.</p>
        <Button onClick={() => navigate('/projects')}>
          Browse Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
              <Badge variant={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              People needed: {project.people_count}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {project.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Budget:</span> {formatBudget(project.budget_min, project.budget_max)}
              </div>
              <div className="text-sm text-muted-foreground">
                Posted: {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <Button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="w-full"
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Project
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};