
import React from 'react';
import { Card } from "@/components/ui/card";
import { useProjectCosts } from '@/hooks/useProjectCosts';
import ProjectCostsHeader from './ProjectCostsHeader';
import ProjectCostsContent from './ProjectCostsContent';
import ProjectCostsDialogs from './ProjectCostsDialogs';

interface ProjectCostsContainerProps {
  projectId: string;
}

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

  if (error) {
    return <div className="text-red-500">Error loading project costs: {error.message}</div>;
  }

  return (
    <Card>
      <ProjectCostsHeader 
        onAddCategoryClick={() => setAddCategoryDialogOpen(true)} 
        costs={data?.costs || []}
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
