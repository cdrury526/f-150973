
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProjectEditForm from './project-edit/ProjectEditForm';
import { ProjectEditDialogProps } from './project-edit/types';

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  open,
  onOpenChange,
  project,
  onProjectUpdated,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
        </DialogHeader>
        <ProjectEditForm 
          open={open}
          onOpenChange={onOpenChange}
          project={project}
          onProjectUpdated={onProjectUpdated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
