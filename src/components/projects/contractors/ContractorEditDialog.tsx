
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, ArchiveIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContractorTypeSelector } from './ContractorTypeSelector';
import { Contractor, ContractorType } from './types';
import { updateContractor } from './api/contractorsApi';
import { useQueryClient } from '@tanstack/react-query';

// Define the form schema
const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyPhone: z.string().min(1, 'Company phone is required'),
  companyEmail: z.string().email('Must be a valid email address'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['Active', 'Inactive', 'On Hold']),
  contractorType: z.string().min(1, 'Contractor type is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ContractorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: Contractor | null;
}

export function ContractorEditDialog({ open, onOpenChange, contractor }: ContractorEditDialogProps) {
  const queryClient = useQueryClient();
  const [isArchiving, setIsArchiving] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: contractor?.companyName || '',
      companyPhone: contractor?.companyPhone || '',
      companyEmail: contractor?.companyEmail || '',
      contactName: contractor?.contactName || '',
      status: (contractor?.status as 'Active' | 'Inactive' | 'On Hold') || 'Active',
      contractorType: contractor?.contractorType || 'General Contractor' as ContractorType
    }
  });
  
  // Update form values when contractor changes
  React.useEffect(() => {
    if (contractor && open) {
      form.reset({
        companyName: contractor.companyName,
        companyPhone: contractor.companyPhone,
        companyEmail: contractor.companyEmail,
        contactName: contractor.contactName,
        status: contractor.status,
        contractorType: contractor.contractorType
      });
    }
  }, [contractor, form, open]);
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (data: FormValues) => {
    if (!contractor) return;
    
    try {
      await updateContractor(contractor.id, {
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        contactName: data.contactName,
        status: data.status as 'Active' | 'Inactive' | 'On Hold',
        contractorType: data.contractorType as ContractorType
      });
      
      // Invalidate contractors query to refresh data
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      
      toast.success('Contractor updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update contractor');
      console.error('Error updating contractor:', error);
    }
  };
  
  const handleArchive = async () => {
    if (!contractor) return;
    
    setIsArchiving(true);
    try {
      await updateContractor(contractor.id, { archived: true });
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      toast.success('Contractor archived successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to archive contractor');
      console.error('Error archiving contractor:', error);
    } finally {
      setIsArchiving(false);
    }
  };
  
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full p-2 border rounded-md bg-background"
                      {...field}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contractorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractor Type</FormLabel>
                  <FormControl>
                    <ContractorTypeSelector 
                      value={field.value as ContractorType} 
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the type of contractor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-between items-center pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleArchive}
                disabled={isSubmitting || isArchiving}
                className="flex items-center gap-1"
              >
                {isArchiving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArchiveIcon className="h-4 w-4" />
                )}
                Archive Contractor
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isArchiving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isArchiving}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
