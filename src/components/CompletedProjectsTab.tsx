import { useMyProjects } from '@/hooks/useMyProjects';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompletedProjectsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useMyProjects(user?.address || null);

  const completedProjects = projects?.filter(project => project.status === 'completed') || [];

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Budget not specified';
    if (!max) return `From $${min}`;
    if (!min) return `Up to $${max}`;
    return `$${min} - $${max}`;
  };

  const calculateProjectDuration = (createdAt: string) => {
    const start = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Same day';
    if (diffInDays === 1) return '1 day';
    return `${diffInDays} days`;
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

  if (!completedProjects.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Trophy className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-muted-foreground">No completed projects yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete your active projects to see them here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {completedProjects.map((project) => (
        <Card key={project.id} className="relative border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                  {project.title}
                  <Trophy className="w-4 h-4 text-green-600" />
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    Completed
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
            <div className="space-y-2">
              <div className="text-sm font-medium">
                {formatBudget(project.budget_min, project.budget_max)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Duration: {calculateProjectDuration(project.created_at)}
              </div>
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};