
import React, { useMemo } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {field.value
                    ? contractorOptions.find((option) => option.value === field.value)?.label
                    : "Select a contractor"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search contractors..." />
                  <CommandList>
                    <CommandEmpty>No contractors found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {contractorOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            field.onChange(option.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
