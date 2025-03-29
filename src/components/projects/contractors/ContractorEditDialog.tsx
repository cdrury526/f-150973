
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Contractor } from './types';
import { ContractorFormFields } from './forms/ContractorFormFields';
import { ContractorFormFooter } from './forms/ContractorFormFooter';
import { useContractorForm } from './hooks/useContractorForm';

interface ContractorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: Contractor | null;
}

export function ContractorEditDialog({ 
  open, 
  onOpenChange, 
  contractor 
}: ContractorEditDialogProps) {
  const {
    form,
    isSubmitting,
    isArchiving,
    handleSubmit,
    handleArchive
  } = useContractorForm(contractor, onOpenChange);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Contractor</DialogTitle>
          <DialogDescription>
            Update contractor information by editing the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ContractorFormFields form={form} />
            
            <ContractorFormFooter
              onCancel={() => onOpenChange(false)}
              onArchive={handleArchive}
              isSubmitting={isSubmitting}
              isArchiving={isArchiving}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
