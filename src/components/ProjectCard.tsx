import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, User } from 'lucide-react';
import { Project } from '@/types/database';
import { cn } from '@/lib/utils';
import { PROJECT_TOPICS, EXPERTISE_LEVELS } from '@/constants/projectOptions';

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

  const getTopicLabel = (topic: string | null) => {
    if (!topic) return null;
    const topicOption = PROJECT_TOPICS.find(t => t.value === topic);
    return topicOption?.label || topic;
  };

  const getExpertiseLabel = (level: string | null) => {
    if (!level) return null;
    const levelOption = EXPERTISE_LEVELS.find(l => l.value === level);
    return levelOption?.label || level;
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
            <div className="flex flex-wrap gap-2 mb-2">
              {getTopicLabel(project.topic) && (
                <Badge variant="secondary" className="text-xs">
                  {getTopicLabel(project.topic)}
                </Badge>
              )}
              {getExpertiseLabel(project.expertise_level) && (
                <Badge variant="outline" className="text-xs">
                  {getExpertiseLabel(project.expertise_level)}
                </Badge>
              )}
            </div>
            {project.mandatory_skills && project.mandatory_skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.mandatory_skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                    #{skill}
                  </Badge>
                ))}
                {project.mandatory_skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{project.mandatory_skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
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
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold text-primary">{formatBudget(project.budget_min, project.budget_max)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            People needed: {project.people_count}
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