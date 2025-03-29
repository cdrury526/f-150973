
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ContractorType } from './types';
import { createContractor } from './api/contractorsApi';
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

export function ContractorFormDialog() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      companyPhone: '',
      companyEmail: '',
      contactName: '',
      status: 'Active',
      contractorType: 'General Contractor' as ContractorType
    }
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (data: FormValues) => {
    try {
      await createContractor({
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        contactName: data.contactName,
        status: data.status as 'Active' | 'Inactive' | 'On Hold',
        contractorType: data.contractorType as ContractorType
      });
      
      // Invalidate contractors query to refresh data
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      
      toast.success('Contractor created successfully');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create contractor');
      console.error('Error creating contractor:', error);
    }
  };
  
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
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Contractor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
