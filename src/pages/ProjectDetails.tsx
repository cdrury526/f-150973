
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/ProjectCard';
import ProjectHeader from '@/components/projects/details/ProjectHeader';
import ProjectDetailsCard from '@/components/projects/details/ProjectDetailsCard';
import ProjectTabs from '@/components/projects/details/ProjectTabs';

const fetchProject = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    title: data.project_name,
    client: data.client || 'Not specified',
    location: data.location || 'Not specified',
    status: data.status || 'Not started',
    progress: data.progress || 0,
    dueDate: data.due_date ? new Date(data.due_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }) : 'No due date',
    thumbnail: data.thumbnail,
    projectType: data.project_type
  } as Project & { projectType: string };
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    data: project, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id as string),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading project',
        description: 'Could not load the project details.',
        variant: 'destructive',
      });
      navigate('/projects');
    }
  }, [error, toast, navigate]);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button variant="outline" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6 space-y-6">
        <ProjectHeader project={project} />

        <div className="grid gap-6 md:grid-cols-3">
          <ProjectDetailsCard project={project} />
          
          <div className="md:col-span-2">
            <ProjectTabs projectId={project.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
