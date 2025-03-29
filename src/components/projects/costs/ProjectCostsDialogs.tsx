
import React from 'react';
import ProjectCostEditDialog from './ProjectCostEditDialog';
import AddCategoryDialog from './AddCategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';
import { ProjectCost, CostCategory } from './types';

interface ProjectCostsDialogsProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingCost: ProjectCost | null;
  handleSave: (values: any) => Promise<void>;
  addCategoryDialogOpen: boolean;
  setAddCategoryDialogOpen: (open: boolean) => void;
  handleAddCategory: (values: any) => Promise<void>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  categoryToDelete: CostCategory | null;
  handleDeleteCategory: () => Promise<void>;
}

const ProjectCostsDialogs: React.FC<ProjectCostsDialogsProps> = ({
  dialogOpen,
  setDialogOpen,
  editingCost,
  handleSave,
  addCategoryDialogOpen,
  setAddCategoryDialogOpen,
  handleAddCategory,
  deleteDialogOpen,
  setDeleteDialogOpen,
  categoryToDelete,
  handleDeleteCategory
}) => {
  return (
    <>
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
    </>
  );
};

export default ProjectCostsDialogs;
