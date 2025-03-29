
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';

interface ContractorSelectorProps {
  control: Control<any>;
  contractors: Contractor[];
  isLoading: boolean;
}

const ContractorSelector: React.FC<ContractorSelectorProps> = ({ 
  control, 
  contractors,
  isLoading 
}) => {
  return (
    <FormField
      control={control}
      name="contractor_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contractor</FormLabel>
          <FormControl>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {contractors.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.companyName} - {contractor.contractorType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            The contractor assigned to this work
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ContractorSelector;
