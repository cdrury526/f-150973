
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCostsTable from '@/components/projects/ProjectCostsTable';
import RecentUpdatesCard from './RecentUpdatesCard';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectTabsProps {
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projectId }) => {
  const queryClient = useQueryClient();

  // Invalidate updates query when the component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['projectUpdates', projectId] });
  }, [projectId, queryClient]);

  const handleTabChange = (value: string) => {
    // Refresh data when switching tabs
    if (value === 'build') {
      queryClient.invalidateQueries({ queryKey: ['projectCosts', projectId] });
    }
    // Always invalidate updates when switching tabs
    queryClient.invalidateQueries({ queryKey: ['projectUpdates', projectId] });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="build" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          <ProjectCostsTable projectId={projectId} />
        </TabsContent>
        <TabsContent value="tasks">
          <p className="text-muted-foreground py-4">Task management will be implemented in the next iteration.</p>
        </TabsContent>
        <TabsContent value="timeline">
          <p className="text-muted-foreground py-4">Project timeline will be implemented in the next iteration.</p>
        </TabsContent>
        <TabsContent value="documents">
          <p className="text-muted-foreground py-4">Document management will be implemented in the next iteration.</p>
        </TabsContent>
      </Tabs>
      
      <RecentUpdatesCard projectId={projectId} />
    </div>
  );
};

export default ProjectTabs;
