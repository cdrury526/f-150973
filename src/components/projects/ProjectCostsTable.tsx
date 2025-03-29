
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ProjectCost {
  id: string;
  category_id: string;
  category_name: string;
  quote_price: number;
  actual_price: number | null;
  notes: string | null;
}

interface CostCategory {
  id: string;
  name: string;
  display_order: number;
}

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
  
  const form = useForm({
    defaultValues: {
      quote_price: 0,
      actual_price: 0,
      notes: ''
    }
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projectCosts', projectId],
    queryFn: () => fetchProjectCosts(projectId),
    enabled: !!projectId,
  });

  const handleEditClick = (cost: ProjectCost) => {
    setEditingCost(cost);
    form.reset({
      quote_price: cost.quote_price,
      actual_price: cost.actual_price || 0,
      notes: cost.notes || ''
    });
    setDialogOpen(true);
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
            updated_at: new Date()
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

  if (error) {
    return <div className="text-red-500">Error loading project costs: {error.message}</div>;
  }

  // Calculate totals
  const quoteTotal = data?.costs.reduce((sum, cost) => sum + (cost.quote_price || 0), 0) || 0;
  const actualTotal = data?.costs.reduce((sum, cost) => sum + (cost.actual_price || 0), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading project costs...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Category</TableHead>
                  <TableHead className="text-right">Quote Price ($)</TableHead>
                  <TableHead className="text-right">Actual Price ($)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.costs.map((cost) => (
                  <TableRow key={cost.category_id}>
                    <TableCell className="font-medium">{cost.category_name}</TableCell>
                    <TableCell className="text-right">{cost.quote_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      {cost.actual_price !== null 
                        ? cost.actual_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(cost)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{quoteTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right">{actualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {editingCost?.category_name} Costs</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quote_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actual_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProjectCostsTable;
