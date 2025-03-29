
export interface Project {
  id: string;
  title: string;
  client: string;
  location: string;
  status: string;
  progress: number;
  dueDate: string;
  projectType: string;
}

export interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onProjectUpdated: () => void;
}
