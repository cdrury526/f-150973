
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CostCategory } from '@/components/projects/costs/types';
import { logProjectUpdate } from '@/hooks/useProjectUpdates';

export const useCategoryManagement = (projectId: string, refetchData: () => void) => {
  const { toast } = useToast();
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CostCategory | null>(null);

  const handleAddCategory = async (values: { category_name: string }) => {
    try {
      // Add new category to cost_categories table
      const { data: newCategory, error: categoryError } = await supabase
        .from('cost_categories')
        .insert({
          name: values.category_name,
          display_order: 999, // Will be adjusted when fetching
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Log the category addition
      await logProjectUpdate(
        projectId,
        `Added new category: ${values.category_name}`,
        "category_add"
      );

      toast({
        title: 'Success',
        description: 'Cost category added successfully',
      });

      setAddCategoryDialogOpen(false);
      refetchData();
    } catch (err) {
      console.error('Error adding category:', err);
      toast({
        title: 'Error',
        description: 'Failed to add cost category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      // Find any costs associated with this category
      const { data: costsData } = await supabase
        .from('project_costs')
        .select('id')
        .eq('project_id', projectId)
        .eq('category_id', categoryToDelete.id);
      
      const costsForCategory = costsData || [];
      
      // If there are existing cost records, delete them
      for (const cost of costsForCategory) {
        if (cost.id) {
          const { error: costError } = await supabase
            .from('project_costs')
            .delete()
            .eq('id', cost.id);

          if (costError) throw costError;
        }
      }

      // Log the category deletion
      await logProjectUpdate(
        projectId,
        `Removed category: ${categoryToDelete.name}`,
        "category_delete"
      );

      toast({
        title: 'Success',
        description: 'Cost category removed from project',
      });

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetchData();
    } catch (err) {
      console.error('Error removing category:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove cost category',
        variant: 'destructive',
      });
    }
  };

  return {
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,
    setCategoryToDelete,
    handleAddCategory,
    handleDeleteCategory
  };
};
