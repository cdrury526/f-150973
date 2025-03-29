
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectCost, CostCategory } from './costs/types';
import ProjectCostsDataTable from './costs/ProjectCostsDataTable';
import ProjectCostEditDialog from './costs/ProjectCostEditDialog';
import AddCategoryDialog from './costs/AddCategoryDialog';
import DeleteCategoryDialog from './costs/DeleteCategoryDialog';

interface ProjectCostsTableProps {
  projectId: string;
}

const fetchProjectCosts = async (projectId: string) => {
  // Fetch cost categories first
  const { data: categories, error: categoriesError } = await supabase
    .from('cost_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  // Fetch existing costs for this project
  const { data: costs, error: costsError } = await supabase
    .from('project_costs')
    .select(`
      id, 
      category_id, 
      quote_price, 
      actual_price, 
      notes,
      cost_categories (name)
    `)
    .eq('project_id', projectId);

  if (costsError) {
    throw new Error(costsError.message);
  }

  // Transform the costs data
  const transformedCosts = costs?.map(cost => ({
    id: cost.id,
    category_id: cost.category_id,
    category_name: cost.cost_categories?.name || '',
    quote_price: cost.quote_price,
    actual_price: cost.actual_price,
    notes: cost.notes
  })) || [];

  // For categories that don't have costs yet, create empty entries
  const allCosts = categories.map(category => {
    const existingCost = transformedCosts.find(cost => cost.category_id === category.id);
    if (existingCost) {
      return existingCost;
    }
    return {
      id: '',
      category_id: category.id,
      category_name: category.name,
      quote_price: 0,
      actual_price: null,
      notes: null
    };
  });

  return {
    costs: allCosts,
    categories: categories as CostCategory[]
  };
};

const ProjectCostsTable: React.FC<ProjectCostsTableProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [editingCost, setEditingCost] = useState<ProjectCost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProjectCost | null>(null);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projectCosts', projectId],
    queryFn: () => fetchProjectCosts(projectId),
    enabled: !!projectId,
  });

  const handleEditClick = (cost: ProjectCost) => {
    setEditingCost(cost);
    setDialogOpen(true);
  };

  const handleDeleteClick = (cost: ProjectCost) => {
    setCategoryToDelete(cost);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
  }) => {
    if (!editingCost) return;

    try {
      if (editingCost.id) {
        // Update existing cost
        const { error } = await supabase
          .from('project_costs')
          .update({
            quote_price: values.quote_price,
            actual_price: values.actual_price || null,
            notes: values.notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCost.id);

        if (error) throw error;
      } else {
        // Insert new cost
        const { error } = await supabase
          .from('project_costs')
          .insert({
            project_id: projectId,
            category_id: editingCost.category_id,
            quote_price: values.quote_price,
            actual_price: values.actual_price || null,
            notes: values.notes || null
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Project cost updated successfully',
      });

      refetch();
      setDialogOpen(false);
    } catch (err) {
      console.error('Error saving cost:', err);
      toast({
        title: 'Error',
        description: 'Failed to update project cost',
        variant: 'destructive',
      });
    }
  };

  const handleAddCategory = async (values: { category_name: string }) => {
    try {
      // Add new category to cost_categories table
      const { data: newCategory, error: categoryError } = await supabase
        .from('cost_categories')
        .insert({
          name: values.category_name,
          display_order: data ? data.categories.length + 1 : 1,
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      toast({
        title: 'Success',
        description: 'Cost category added successfully',
      });

      setAddCategoryDialogOpen(false);
      refetch();
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
      // If there's an existing cost record, delete it first
      if (categoryToDelete.id) {
        const { error: costError } = await supabase
          .from('project_costs')
          .delete()
          .eq('id', categoryToDelete.id);

        if (costError) throw costError;
      }

      toast({
        title: 'Success',
        description: 'Cost category removed from project',
      });

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err) {
      console.error('Error removing category:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove cost category',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading project costs: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Project Costs</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddCategoryDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </CardHeader>
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
