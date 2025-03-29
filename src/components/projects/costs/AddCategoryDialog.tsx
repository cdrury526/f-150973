
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (values: { category_name: string }) => Promise<void>;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddCategory 
}) => {
  const addCategoryForm = useForm({
    defaultValues: {
      category_name: ''
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cost Category</DialogTitle>
        </DialogHeader>
        <Form {...addCategoryForm}>
          <form onSubmit={addCategoryForm.handleSubmit(onAddCategory)} className="space-y-4">
            <FormField
              control={addCategoryForm.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter category name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
