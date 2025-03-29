
import React, { useMemo } from 'react';
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
  // Process contractor options
  const contractorOptions = useMemo(() => {
    // Initialize with the "None" option
    const options: SearchableSelectOption[] = [
      { value: "", label: "None" }
    ];
    
    // Add contractor options if available
    if (Array.isArray(contractors)) {
      contractors.forEach((contractor) => {
        if (contractor && contractor.id) {
          options.push({
            value: contractor.id,
            label: `${contractor.companyName || 'Unknown'} - ${contractor.contractorType || 'Unknown'}`
          });
        }
      });
    }
    
    return options;
  }, [contractors]);

  return (
    <FormField
      control={control}
      name="contractor_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contractor</FormLabel>
          <FormControl>
            <SearchableSelect
              options={contractorOptions}
              value={field.value || ''}
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
      )}
    />
  );
};

export default ContractorSelector;
