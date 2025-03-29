
import React from 'react';
import { Card } from "@/components/ui/card";
import { useProjectCosts } from '@/hooks/useProjectCosts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProjectCostsHeader from './ProjectCostsHeader';
import ProjectCostsContent from './ProjectCostsContent';
import ProjectCostsDialogs from './ProjectCostsDialogs';

interface ProjectCostsContainerProps {
  projectId: string;
}

const fetchProjectName = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('project_name')
    .eq('id', projectId)
    .single();
  
  if (error) {
    console.error("Error fetching project name:", error);
    return null;
  }
  
  return data?.project_name;
};

const ProjectCostsContainer: React.FC<ProjectCostsContainerProps> = ({ projectId }) => {
  const {
    data,
    isLoading,
    error,
    editingCost,
    dialogOpen,
    setDialogOpen,
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,
    handleEditClick,
    handleDeleteClick,
    handleSave,
    handleAddCategory,
    handleDeleteCategory
  } = useProjectCosts(projectId);

  const { data: projectName } = useQuery({
    queryKey: ['projectName', projectId],
    queryFn: () => fetchProjectName(projectId),
    enabled: !!projectId,
  });

  if (error) {
    return <div className="text-red-500">Error loading project costs: {error.message}</div>;
  }

  return (
    <Card>
      <ProjectCostsHeader 
        onAddCategoryClick={() => setAddCategoryDialogOpen(true)} 
        costs={data?.costs || []}
        projectName={projectName || undefined}
      />
      
      <ProjectCostsContent 
        isLoading={isLoading}
        costs={data?.costs || []}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <ProjectCostsDialogs 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingCost={editingCost}
        handleSave={handleSave}
        addCategoryDialogOpen={addCategoryDialogOpen}
        setAddCategoryDialogOpen={setAddCategoryDialogOpen}
        handleAddCategory={handleAddCategory}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        categoryToDelete={categoryToDelete}
        handleDeleteCategory={handleDeleteCategory}
      />
    </Card>
  );
};

export default ProjectCostsContainer;
