import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiInput } from '@/components/ui/multi-input';
import { projectSchema, ProjectFormData } from '@/schemas/project';
import { useCreateProject } from '@/hooks/useProjects';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { PROJECT_TOPICS, EXPERTISE_LEVELS, COMMON_SKILLS } from '@/constants/projectOptions';

export const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createProject = useCreateProject();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      topic: '',
      expertise_level: '',
      mandatory_skills: [],
      budget_min: undefined,
      budget_max: undefined,
      people_count: 1,
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Connect wallet first',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Connect wallet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const project = await createProject.mutateAsync({
        owner_id: user.address,
        title: data.title,
        description: data.description,
        topic: data.topic,
        expertise_level: data.expertise_level,
        mandatory_skills: data.mandatory_skills || null,
        budget_min: data.budget_min || null,
        budget_max: data.budget_max || null,
        people_count: data.people_count,
        status: 'open',
      });

      navigate(`/projects/${project.id}`);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Post a New Project</CardTitle>
              <CardDescription>
                Create a project and find talented students to work with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a clear, descriptive title for your project"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail. Include requirements, goals, and what you're looking for in a collaborator..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Topic</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_TOPICS.map((topic) => (
                                <SelectItem key={topic.value} value={topic.value}>
                                  {topic.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expertise_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expertise Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select expertise level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EXPERTISE_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mandatory_skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mandatory Skills (Optional)</FormLabel>
                        <FormControl>
                          <MultiInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Add mandatory skills (e.g., React, Python, Figma)"
                            suggestions={COMMON_SKILLS}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="people_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of People Needed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? parseInt(value) : 1);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budget_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget (ETH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.5"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? parseFloat(value) : undefined);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget (ETH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="2.0"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? parseFloat(value) : undefined);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createProject.isPending}
                  >
                    {createProject.isPending ? 'Posting Project...' : 'Post Project'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};