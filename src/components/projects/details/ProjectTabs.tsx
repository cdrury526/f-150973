import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCostsTable from '@/components/projects/ProjectCostsTable';
import RecentUpdatesCard from './RecentUpdatesCard';
import DOWContent from './DOWContent';
import { useQueryClient } from '@tanstack/react-query';
import { useSidebar } from '@/components/ui/sidebar';

interface ProjectTabsProps {
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const { setOpen } = useSidebar();
  const [activeTab, setActiveTab] = useState('build');

  // Invalidate updates query when the component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['projectUpdates', projectId] });
  }, [projectId, queryClient]);

  const handleTabChange = (value: string) => {
    // Set active tab
    setActiveTab(value);
    
    // Refresh data when switching tabs
    if (value === 'build') {
      queryClient.invalidateQueries({ queryKey: ['projectCosts', projectId] });
    } else if (value === 'dow') {
      // Collapse sidebar when DOW tab is selected
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['projectVariables', projectId] });
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
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="dow">DOW</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          <ProjectCostsTable projectId={projectId} />
        </TabsContent>
        <TabsContent value="tasks">
          <p className="text-muted-foreground py-4">Task management will be implemented in the next iteration.</p>
        </TabsContent>
        <TabsContent value="documents">
          <p className="text-muted-foreground py-4">Document management will be implemented in the next iteration.</p>
        </TabsContent>
        <TabsContent value="dow">
          <DOWContent projectId={projectId} />
        </TabsContent>
      </Tabs>
      
      {activeTab === 'build' && <RecentUpdatesCard projectId={projectId} />}
    </div>
  );
};

export default ProjectTabs;
