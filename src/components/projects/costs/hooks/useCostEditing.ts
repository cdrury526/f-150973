
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectCost } from '@/components/projects/costs/types';
import { useProjectUpdates } from '@/hooks/useProjectUpdates';

export const useCostEditing = (projectId: string, refetchData: () => void) => {
  const { toast } = useToast();
  const { addUpdate } = useProjectUpdates(projectId);
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
      // Track changes between original and updated values
      const changes: Record<string, any> = {};
      
      // Only include fields that have changed in the details
      if (editingCost.quote_price !== values.quote_price) {
        changes.quote_price = {
          from: editingCost.quote_price,
          to: values.quote_price
        };
      }
      
      if ((editingCost.actual_price || 0) !== values.actual_price) {
        changes.actual_price = {
          from: editingCost.actual_price || 0,
          to: values.actual_price
        };
      }
      
      if (editingCost.notes !== values.notes) {
        changes.notes = {
          from: editingCost.notes || 'None',
          to: values.notes || 'None'
        };
      }
      
      if (editingCost.contractor_id !== values.contractor_id) {
        changes.contractor = {
          from: editingCost.contractor_id || 'None',
          to: values.contractor_id || 'None'
        };
      }

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

        // Create update details object with formatted changes
        const updateDetails: Record<string, any> = {};
        
        if (changes.quote_price) {
          updateDetails.quotePrice = `${formatCurrency(changes.quote_price.from)} → ${formatCurrency(changes.quote_price.to)}`;
        }
        
        if (changes.actual_price) {
          updateDetails.actualPrice = `${formatCurrency(changes.actual_price.from)} → ${formatCurrency(changes.actual_price.to)}`;
        }
        
        // Log the update with details
        await addUpdate(
          `Updated ${editingCost.category_name} costs`, 
          "cost_update",
          updateDetails
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

        // Log the addition with details
        await addUpdate(
          `Added costs for ${editingCost.category_name}`,
          "cost_update",
          {
            quotePrice: formatCurrency(values.quote_price),
            actualPrice: values.actual_price ? formatCurrency(values.actual_price) : 'Not set'
          }
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

  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return {
    editingCost,
    dialogOpen,
    setDialogOpen,
    handleEditClick,
    handleSave
  };
};
