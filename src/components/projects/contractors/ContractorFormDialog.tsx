
import React from 'react';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContractorFormFields } from './forms/ContractorFormFields';
import { ContractorCreateFooter } from './forms/ContractorCreateFooter';
import { useContractorCreateForm } from './hooks/useContractorCreateForm';

export function ContractorFormDialog() {
  const [open, setOpen] = React.useState(false);
  const { form, isSubmitting, handleSubmit } = useContractorCreateForm(setOpen);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Contractor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contractor</DialogTitle>
          <DialogDescription>
            Create a new contractor by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ContractorFormFields form={form} showStatus={false} />
            
            <ContractorCreateFooter
              onCancel={() => setOpen(false)}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
