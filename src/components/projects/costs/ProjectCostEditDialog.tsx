
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px]">
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
                  <FormLabel>Quote Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-0 flex h-10 items-center pl-3 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="pl-8 text-right font-medium"
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The estimated price quoted to the client
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={costForm.control}
              name="actual_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-0 flex h-10 items-center pl-3 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="pl-8 text-right font-medium"
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The actual amount paid
                  </FormDescription>
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
                    <Textarea 
                      {...field} 
                      placeholder="Add any relevant details about this cost"
                      className="resize-none min-h-[80px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCostEditDialog;
