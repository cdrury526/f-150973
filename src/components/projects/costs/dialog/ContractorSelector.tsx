import React, { useMemo } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';

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
  // Process contractor options with safety checks
  const contractorOptions = useMemo(() => {
    // Initialize with the "None" option
    const options = [
      { value: "", label: "None" }
    ];
    
    // Add contractor options if available
    if (Array.isArray(contractors) && contractors.length > 0) {
      contractors.forEach((contractor) => {
        if (contractor && contractor.id) {
          options.push({
            value: contractor.id,
            label: `${contractor.companyName || 'Unknown'} - ${contractor.contractorType || 'Unknown'}`
          });
        }
      });
    }
    
    console.log("Contractor options:", options);
    return options;
  }, [contractors]);

  return (
    <FormField
      control={control}
      name="contractor_id"
      render={({ field }) => {
        console.log("Form field value:", field.value);
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Contractor</FormLabel>
            <FormControl>
              <SearchableDropdown
                options={contractorOptions}
                value={field.value}
                onChange={(value) => {
                  console.log("Contractor selected:", value);
                  field.onChange(value);
                }}
                placeholder="Search contractor..."
                triggerPlaceholder="Select a contractor"
                emptyStateText="No contractor found."
                disabled={isLoading}
              />
            </FormControl>
            <FormDescription>
              The contractor assigned to this work
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

export default ContractorSelector;
