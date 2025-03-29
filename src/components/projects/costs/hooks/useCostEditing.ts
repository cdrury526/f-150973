
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectCost } from '@/components/projects/costs/types';
import { logProjectUpdate } from '@/hooks/useProjectUpdates';

export const useCostEditing = (projectId: string, refetchData: () => void) => {
  const { toast } = useToast();
  const [editingCost, setEditingCost] = useState<ProjectCost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditClick = (cost: ProjectCost) => {
    setEditingCost(cost);
    setDialogOpen(true);
  };

  const handleSave = async (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
    contractor_id?: string;
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
            contractor_id: values.contractor_id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCost.id);

        if (error) throw error;

        // Log the update
        await logProjectUpdate(
          projectId,
          `Updated ${editingCost.category_name} costs`, 
          "cost_update"
        );
      } else {
        // Insert new cost
        const { error } = await supabase
          .from('project_costs')
          .insert({
            project_id: projectId,
            category_id: editingCost.category_id,
            quote_price: values.quote_price,
            actual_price: values.actual_price || null,
            notes: values.notes || null,
            contractor_id: values.contractor_id || null
          });

        if (error) throw error;

        // Log the addition
        await logProjectUpdate(
          projectId,
          `Added costs for ${editingCost.category_name}`,
          "cost_update"
        );
      }

      toast({
        title: 'Success',
        description: 'Project cost updated successfully',
      });

      refetchData();
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

  return {
    editingCost,
    dialogOpen,
    setDialogOpen,
    handleEditClick,
    handleSave
  };
};
