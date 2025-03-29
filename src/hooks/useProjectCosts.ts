
import { useQuery } from '@tanstack/react-query';
import { ProjectCost, CostCategory } from '@/components/projects/costs/types';
import { fetchProjectCosts } from '@/components/projects/costs/api/projectCostsApi';
import { useCostEditing } from '@/components/projects/costs/hooks/useCostEditing';
import { useCategoryManagement } from '@/components/projects/costs/hooks/useCategoryManagement';
import { supabase } from '@/integrations/supabase/client';

export { fetchProjectCosts };

// Helper function to log project updates
const logProjectUpdate = async (projectId: string, updateText: string, updateType: string) => {
  try {
    await supabase
      .from('project_updates')
      .insert({
        project_id: projectId,
        update_text: updateText,
        update_type: updateType
      });
  } catch (error) {
    console.error("Error logging project update:", error);
  }
};

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

  // Cost editing functionality with update logging
  const { 
    editingCost,
    dialogOpen,
    setDialogOpen,
    handleEditClick,
    handleSave: originalHandleSave
  } = useCostEditing(projectId, refetch);

  // Wrap the original handleSave to log updates
  const handleSave = async (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
    contractor_id?: string;
  }) => {
    await originalHandleSave(values);
    
    // Log the update
    const categoryName = editingCost?.category_name || "Unknown category";
    const updateText = editingCost?.id 
      ? `Updated ${categoryName} costs` 
      : `Added costs for ${categoryName}`;
    
    await logProjectUpdate(projectId, updateText, "cost_update");
  };

  // Category management functionality with update logging
  const {
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,
    setCategoryToDelete,
    handleAddCategory: originalHandleAddCategory,
    handleDeleteCategory: originalHandleDeleteCategory
  } = useCategoryManagement(projectId, refetch);

  // Wrap category management functions to log updates
  const handleAddCategory = async (values: { category_name: string }) => {
    await originalHandleAddCategory(values);
    await logProjectUpdate(
      projectId, 
      `Added new category: ${values.category_name}`, 
      "category_add"
    );
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    await originalHandleDeleteCategory();
    await logProjectUpdate(
      projectId, 
      `Removed category: ${categoryToDelete.name}`, 
      "category_delete"
    );
  };

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
