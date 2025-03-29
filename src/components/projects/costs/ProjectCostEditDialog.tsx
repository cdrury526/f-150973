
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCost } from './types';

interface ProjectCostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCost: ProjectCost | null;
  onSave: (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
  }) => Promise<void>;
}

const ProjectCostEditDialog: React.FC<ProjectCostEditDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingCost, 
  onSave 
}) => {
  const costForm = useForm({
    defaultValues: {
      quote_price: editingCost?.quote_price || 0,
      actual_price: editingCost?.actual_price || 0,
      notes: editingCost?.notes || ''
    }
  });

  React.useEffect(() => {
    if (editingCost) {
      costForm.reset({
        quote_price: editingCost.quote_price,
        actual_price: editingCost.actual_price || 0,
        notes: editingCost.notes || ''
      });
    }
  }, [editingCost, costForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {editingCost?.category_name} Costs</DialogTitle>
        </DialogHeader>
        <Form {...costForm}>
          <form onSubmit={costForm.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={costForm.control}
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
              control={costForm.control}
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
              control={costForm.control}
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
  );
};

export default ProjectCostEditDialog;
