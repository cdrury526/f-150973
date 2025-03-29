
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, MapPin, Calendar, CheckSquare, Clock, FileText, Briefcase, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProjectEditDialog from '@/components/projects/details/ProjectEditDialog';

interface ProjectDetailsSidebarProps {
  projectId: string;
}

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
    projectType: data.project_type
  };
};

const ProjectDetailsSidebar: React.FC<ProjectDetailsSidebarProps> = ({ projectId }) => {
  const { open } = useSidebar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId as string),
    enabled: !!projectId,
  });
  
  // Don't render anything if sidebar is collapsed
  if (!open) return null;
  
  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          Current Project
        </SidebarGroupLabel>
        <SidebarGroupContent className="space-y-3 px-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-2 w-full mt-2" />
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
  
  if (!project) return null;
  
  return (
    <SidebarGroup className="border-t border-sidebar-border pt-2">
      <SidebarGroupLabel className="flex items-center">
        <Briefcase className="h-4 w-4 mr-2" />
        Current Project
      </SidebarGroupLabel>
      <SidebarGroupContent className="space-y-3 px-1">
        <div className="bg-sidebar-accent/50 rounded-md p-2 border border-white/30 shadow-sm relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1 h-6 w-6 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit project</span>
          </Button>
          
          <h3 className="font-medium text-sm text-white truncate">{project.title}</h3>
          
          <div className="space-y-2 mt-2">
            <div className="flex items-center text-xs text-sidebar-foreground/70">
              <User className="h-3.5 w-3.5 mr-2 text-sidebar-foreground/50" />
              <span className="truncate">{project.client}</span>
            </div>
            
            <div className="flex items-center text-xs text-sidebar-foreground/70">
              <MapPin className="h-3.5 w-3.5 mr-2 text-sidebar-foreground/50" />
              <span className="truncate">{project.location}</span>
            </div>
            
            <div className="flex items-center text-xs text-sidebar-foreground/70">
              <Calendar className="h-3.5 w-3.5 mr-2 text-sidebar-foreground/50" />
              <span className="truncate">{project.dueDate}</span>
            </div>
            
            <div className="flex items-center text-xs text-sidebar-foreground/70">
              <FileText className="h-3.5 w-3.5 mr-2 text-sidebar-foreground/50" />
              <span className="truncate">{project.projectType}</span>
            </div>
            
            <div className="flex items-center text-xs text-sidebar-foreground/70">
              <Clock className="h-3.5 w-3.5 mr-2 text-sidebar-foreground/50" />
              <span className="truncate">{project.status}</span>
            </div>
          </div>
          
          <div className="pt-2 mt-1 border-t border-white/20">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-sidebar-foreground/70">Progress</span>
              <span className="text-sidebar-foreground/70 font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5 bg-sidebar-border/40" />
          </div>
        </div>
        
        <ProjectEditDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          project={project}
          onProjectUpdated={() => refetch()}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default ProjectDetailsSidebar;
