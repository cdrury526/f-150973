
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { sampleProjects } from '@/components/projects/ProjectList';
import { useAuth } from '@/context/AuthContext';

const Projects = () => {
  const { userRole } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState(sampleProjects);
  
  const canCreateProject = userRole === 'builder' || userRole === 'admin';

  const handleCreateProject = () => {
    setIsCreateDialogOpen(false);
    // In a real application, we would save the project to the database
    // For now, we'll just close the dialog
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description={canCreateProject 
              ? "Create your first construction project to get started" 
              : "You don't have any home building projects yet"}
            icon={<Plus className="h-10 w-10" />}
            actionText={canCreateProject ? "Create Project" : undefined}
            onAction={canCreateProject ? () => setIsCreateDialogOpen(true) : undefined}
          />
        ) : (
          <ProjectList projects={projects} columns={3} />
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Project creation form would go here. For now, this is just a placeholder.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Projects;
