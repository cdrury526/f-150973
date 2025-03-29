
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { createContractor } from '../api/contractorsApi';
import { contractorFormSchema, ContractorFormValues } from '../forms/contractor-form-schema';
import { ContractorType } from '../types';

export function useContractorCreateForm(onOpenChange: (open: boolean) => void) {
  const queryClient = useQueryClient();
  
  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: {
      companyName: '',
      companyPhone: '',
      companyEmail: '',
      contactName: '',
      status: 'Active', // Default to Active
      contractorType: 'General Contractor'
    }
  });
  
  const onSubmit = async (data: ContractorFormValues) => {
    try {
      await createContractor({
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        contactName: data.contactName,
        status: 'Active', // Ensure we always set new contractors to Active
        contractorType: data.contractorType as ContractorType
      });
      
      // Invalidate contractors query to refresh data
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      
      toast.success('Contractor created successfully');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create contractor');
      console.error('Error creating contractor:', error);
    }
  };
  
  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(onSubmit)
  };
}
