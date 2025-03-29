
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
        const [open, setOpen] = useState(false);
        
        // Find the selected contractor to display
        const selectedContractor = field.value 
          ? contractors.find(c => c.id === field.value) 
          : null;
        
        return (
          <FormItem>
            <FormLabel>Contractor</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={isLoading}
                    type="button"
                  >
                    {selectedContractor 
                      ? `${selectedContractor.companyName} - ${selectedContractor.contractorType}`
                      : "Select a contractor"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search contractors..." className="h-9" />
                    <CommandEmpty>No contractors found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      <CommandItem
                        key="none"
                        value="none"
                        onSelect={() => {
                          field.onChange("");
                          setOpen(false);
                        }}
                      >
                        <span>None</span>
                      </CommandItem>
                      {contractors.map((contractor) => (
                        <CommandItem
                          key={contractor.id}
                          value={contractor.companyName.toLowerCase()}
                          onSelect={() => {
                            field.onChange(contractor.id);
                            setOpen(false);
                          }}
                        >
                          <span>{contractor.companyName} - {contractor.contractorType}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
