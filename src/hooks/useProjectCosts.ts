
import { useQuery } from '@tanstack/react-query';
import { ProjectCost, CostCategory } from '@/components/projects/costs/types';
import { fetchProjectCosts } from '@/components/projects/costs/api/projectCostsApi';
import { useCostEditing } from '@/components/projects/costs/hooks/useCostEditing';
import { useCategoryManagement } from '@/components/projects/costs/hooks/useCategoryManagement';

export { fetchProjectCosts };

export const useProjectCosts = (projectId: string) => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['projectCosts', projectId],
    queryFn: () => fetchProjectCosts(projectId),
    enabled: !!projectId,
  });

  // Cost editing functionality
  const { 
    editingCost,
    dialogOpen,
    setDialogOpen,
    handleEditClick,
    handleSave
  } = useCostEditing(projectId, refetch);

  // Category management functionality
  const {
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,
    setCategoryToDelete,
    handleAddCategory,
    handleDeleteCategory
  } = useCategoryManagement(projectId, refetch);

  const handleDeleteClick = (cost: ProjectCost) => {
    // Find the category that corresponds to this cost
    const category = data?.categories.find(cat => cat.id === cost.category_id) || null;
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return {
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
  };
};
