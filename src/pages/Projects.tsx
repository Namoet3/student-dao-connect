import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilters } from '@/components/ProjectFilters';
import { EmptyState } from '@/components/EmptyState';
import { MyProjectsTab } from '@/components/MyProjectsTab';
import { useProjects, ProjectFilters as FilterType } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterType>(() => {
    const status = searchParams.get('status') as FilterType['status'] || 'all';
    const search = searchParams.get('q') || undefined;
    const budgetMin = searchParams.get('min') ? parseFloat(searchParams.get('min')!) : undefined;
    const budgetMax = searchParams.get('max') ? parseFloat(searchParams.get('max')!) : undefined;
    
    return { status, search, budgetMin, budgetMax };
  });
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useProjects(filters);

  const projects = data?.pages.flatMap(page => page.projects) || [];

  const handleApply = (projectId: string) => {
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

  const handlePostProject = () => {
    navigate('/projects/new');
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      params.set('status', filters.status);
    }
    if (filters.search) {
      params.set('q', filters.search);
    }
    if (filters.budgetMin !== undefined) {
      params.set('min', filters.budgetMin.toString());
    }
    if (filters.budgetMax !== undefined) {
      params.set('max', filters.budgetMax.toString());
    }
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Projects</h1>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Discover and apply to exciting projects from the community
          </p>
        </div>
        <Button onClick={handlePostProject} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProjectFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Projects Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <EmptyState
                  title="No projects found"
                  description="No projects match your current filters. Try adjusting your search criteria or post the first project!"
                  actionLabel="Create Project"
                  onAction={handlePostProject}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <Link key={project.id} to={`/projects/${project.id}`}>
                        <ProjectCard
                          project={project}
                          onApply={handleApply}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasNextPage && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="gap-2"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Projects'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-projects">
          <MyProjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};