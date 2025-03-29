
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContractorTypeSelector } from '../ContractorTypeSelector';
import { ContractorType } from '../types';
import { ContractorFormValues } from './contractor-form-schema';

interface ContractorFormFieldsProps {
  form: UseFormReturn<ContractorFormValues>;
}

export function ContractorFormFields({ form }: ContractorFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
