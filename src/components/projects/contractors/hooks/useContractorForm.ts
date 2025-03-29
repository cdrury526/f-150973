
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Contractor } from '../types';
import { updateContractor } from '../api/contractorsApi';
import { contractorFormSchema, ContractorFormValues } from '../forms/contractor-form-schema';

export function useContractorForm(
  contractor: Contractor | null,
  onOpenChange: (open: boolean) => void
) {
  const queryClient = useQueryClient();
  const [isArchiving, setIsArchiving] = useState(false);
  
  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: {
      companyName: contractor?.companyName || '',
      companyPhone: contractor?.companyPhone || '',
      companyEmail: contractor?.companyEmail || '',
      contactName: contractor?.contactName || '',
      status: (contractor?.status as 'Active' | 'Inactive' | 'On Hold') || 'Active',
      contractorType: contractor?.contractorType || 'General Contractor'
    }
  });
  
  // Update form values when contractor changes
  useEffect(() => {
    if (contractor) {
      form.reset({
        companyName: contractor.companyName,
        companyPhone: contractor.companyPhone,
        companyEmail: contractor.companyEmail,
        contactName: contractor.contactName,
        status: contractor.status,
        contractorType: contractor.contractorType
      });
    }
  }, [contractor, form]);
  
  const onSubmit = async (data: ContractorFormValues) => {
    if (!contractor) return;
    
    try {
      await updateContractor(contractor.id, {
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        contactName: data.contactName,
        status: data.status as 'Active' | 'Inactive' | 'On Hold',
        contractorType: data.contractorType as any
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
  
  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    isArchiving,
    handleSubmit: form.handleSubmit(onSubmit),
    handleArchive
  };
}
