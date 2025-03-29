
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useProjectCosts } from '@/hooks/useProjectCosts';
import ProjectCostsDataTable from './costs/ProjectCostsDataTable';
import ProjectCostEditDialog from './costs/ProjectCostEditDialog';
import AddCategoryDialog from './costs/AddCategoryDialog';
import DeleteCategoryDialog from './costs/DeleteCategoryDialog';
import ProjectCostsHeader from './costs/ProjectCostsHeader';

interface ProjectCostsTableProps {
  projectId: string;
}

const ProjectCostsTable: React.FC<ProjectCostsTableProps> = ({ projectId }) => {
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
      <ProjectCostsHeader onAddCategoryClick={() => setAddCategoryDialogOpen(true)} />
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading project costs...</div>
        ) : (
          <ProjectCostsDataTable 
            costs={data?.costs || []}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        {/* Edit dialog */}
        <ProjectCostEditDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingCost={editingCost}
          onSave={handleSave}
        />

        {/* Add Category dialog */}
        <AddCategoryDialog 
          open={addCategoryDialogOpen}
          onOpenChange={setAddCategoryDialogOpen}
          onAddCategory={handleAddCategory}
        />

        {/* Delete confirmation dialog */}
        <DeleteCategoryDialog 
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          categoryToDelete={categoryToDelete}
          onDelete={handleDeleteCategory}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCostsTable;
