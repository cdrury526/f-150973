
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/ProjectCard';
import CreateProjectForm from '@/components/projects/CreateProjectForm';
import { useToast } from '@/hooks/use-toast';

// Fetch projects function
const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  // Transform the data to match the Project interface
  return data.map((project) => ({
    id: project.id,
    title: project.project_name,
    client: project.client || 'Not specified',
    location: project.location || 'Not specified',
    status: project.status || 'Not started',
    progress: project.progress || 0,
    dueDate: project.due_date ? new Date(project.due_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }) : 'No due date',
    thumbnail: project.thumbnail
  })) as Project[];
};

const Projects = () => {
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const canCreateProject = userRole === 'builder' || userRole === 'admin';

  // Query for fetching projects
  const { 
    data: projects = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: fetchProjects,
    enabled: !!user, // Only run query if user is logged in
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error loading projects',
        description: 'There was a problem loading your projects.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch(); // Refresh the project list
  };

  // Ensure the dialog opens when clicking the button
  const handleOpenCreateDialog = () => {
    console.log("Opening create project dialog");
    setIsCreateDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              {canCreateProject 
                ? 'Manage and track all your building projects' 
                : 'View and track all your home building projects'}
            </p>
          </div>
          {canCreateProject && (
            <Button 
              onClick={handleOpenCreateDialog}
              className="flex items-center"
              data-testid="create-project-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description={canCreateProject 
              ? "Create your first construction project to get started" 
              : "You don't have any home building projects yet"}
            icon={<Plus className="h-10 w-10" />}
            actionText={canCreateProject ? "Create Project" : undefined}
            onAction={canCreateProject ? handleOpenCreateDialog : undefined}
          />
        ) : (
          <ProjectList projects={projects} columns={3} />
        )}
      </div>

      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <CreateProjectForm 
            onSuccess={handleCreateSuccess} 
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Projects;
