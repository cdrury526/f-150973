
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, CheckSquare, Clock, MapPin, User, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/components/projects/ProjectCard';
import ProjectCostsTable from '@/components/projects/ProjectCostsTable';

const statusIcons = {
  'In Progress': <Clock className="h-4 w-4 mr-1" />,
  'Completed': <CheckSquare className="h-4 w-4 mr-1" />,
  'Delayed': <AlertTriangle className="h-4 w-4 mr-1" />,
  'On Hold': <AlertTriangle className="h-4 w-4 mr-1" />,
  'Not Started': <Clock className="h-4 w-4 mr-1" />
};

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
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <Badge className="ml-2 flex items-center">
            {statusIcons[project.status as keyof typeof statusIcons]}
            {project.status}
          </Badge>
        </div>

        {project.thumbnail && (
          <div className="w-full h-64 overflow-hidden rounded-lg">
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Client:</span> 
                  <span className="ml-1 font-medium">{project.client}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span> 
                  <span className="ml-1 font-medium">{project.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Due Date:</span> 
                  <span className="ml-1 font-medium">{project.dueDate}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span> 
                  <span className="ml-1 font-medium">{project.projectType}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">Edit Project</Button>
                <Button variant="outline" className="w-full">Download Details</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <ProjectCostsTable projectId={project.id} />
              </TabsContent>
              <TabsContent value="timeline">
                <p className="text-muted-foreground py-4">Project timeline will be implemented in the next iteration.</p>
              </TabsContent>
              <TabsContent value="documents">
                <p className="text-muted-foreground py-4">Document management will be implemented in the next iteration.</p>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { update: "Milestone 3 completed", date: "Oct 15, 2023" },
                    { update: "Updated project timeline", date: "Oct 10, 2023" },
                    { update: "Added new material specifications", date: "Oct 5, 2023" },
                  ].map((item, i) => (
                    <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className="font-medium">{item.update}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
