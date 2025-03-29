
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';
import { SearchableSelectOption, SearchableSelect } from "@/components/ui/searchable-select";

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
      render={({ field }) => {
        // Ensure contractors is always a valid array of objects
        const safeContractors = Array.isArray(contractors) 
          ? contractors.filter(c => c && typeof c === 'object') 
          : [];
        
        // Add strong safeguards for each contractor object and its properties
        const contractorOptions: SearchableSelectOption[] = safeContractors
          .filter(contractor => 
            contractor && 
            typeof contractor === 'object' && 
            'id' in contractor &&
            'companyName' in contractor
          )
          .map((contractor) => ({
            value: contractor.id || '',
            label: `${contractor.companyName || 'Unknown'} - ${contractor.contractorType || 'Unknown'}`
          }));

        // Add a "None" option
        const options = [
          { value: "", label: "None" },
          ...contractorOptions
        ];
        
        // Ensure field.value is always a string
        const safeValue = typeof field.value === 'string' ? field.value : '';
          
        return (
          <FormItem>
            <FormLabel>Contractor</FormLabel>
            <FormControl>
              <SearchableSelect
                options={options}
                value={safeValue}
                onChange={field.onChange}
                placeholder="Select a contractor"
                searchPlaceholder="Search contractors..."
                emptyMessage="No contractors found."
                disabled={isLoading}
                width="100%"
              />
            </FormControl>
            <FormDescription>
              The contractor assigned to this work
            </FormDescription>
          </FormItem>
        )
      }}
    />
  );
};

export default ContractorSelector;
