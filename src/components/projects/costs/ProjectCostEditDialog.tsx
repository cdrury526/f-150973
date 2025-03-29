
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ProjectCost } from './types';
import { useContractors } from './dialog/useContractors';
import PriceInput from './dialog/PriceInput';
import ContractorSelector from './dialog/ContractorSelector';
import NotesInput from './dialog/NotesInput';
import DialogFooterButtons from './dialog/DialogFooterButtons';

interface ProjectCostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCost: ProjectCost | null;
  onSave: (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
    contractor_id?: string;
  }) => Promise<void>;
}

const ProjectCostEditDialog: React.FC<ProjectCostEditDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingCost, 
  onSave 
}) => {
  const { contractors, isLoading: isLoadingContractors } = useContractors(open);

  const costForm = useForm({
    defaultValues: {
      quote_price: editingCost?.quote_price || 0,
      actual_price: editingCost?.actual_price || 0,
      notes: editingCost?.notes || '',
      contractor_id: editingCost?.contractor_id || ''
    }
  });

  // Reset form when editing cost changes
  React.useEffect(() => {
    if (editingCost) {
      costForm.reset({
        quote_price: editingCost.quote_price,
        actual_price: editingCost.actual_price || 0,
        notes: editingCost.notes || '',
        contractor_id: editingCost.contractor_id || ''
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
            <PriceInput
              control={costForm.control}
              name="quote_price"
              label="Quote Price"
              description="The estimated price quoted to the client"
            />
            
            <PriceInput
              control={costForm.control}
              name="actual_price"
              label="Actual Price"
              description="The actual amount paid"
            />
            
            <ContractorSelector
              control={costForm.control}
              contractors={contractors}
              isLoading={isLoadingContractors}
            />
            
            <NotesInput control={costForm.control} />
            
            <DialogFooterButtons onCancel={() => onOpenChange(false)} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCostEditDialog;
