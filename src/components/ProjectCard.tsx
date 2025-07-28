import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, User } from 'lucide-react';
import { Project } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onApply?: (projectId: string) => void;
}

export const ProjectCard = ({ project, onApply }: ProjectCardProps) => {
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

  return (
    <Card className={cn(
      "h-full hover:shadow-lg transition-all duration-200 cursor-pointer",
      "hover:scale-[1.02] hover:shadow-xl"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>{formatAddress(project.owner_id)}</span>
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-primary">{formatBudget(project.budget_min, project.budget_max)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {project.status === 'open' && onApply && (
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onApply(project.id);
            }}
          >
            Apply Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};