
import React, { useMemo, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Contractor } from '@/components/projects/contractors/types';
import { Control } from 'react-hook-form';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
  const [open, setOpen] = useState(false);

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
        <FormItem className="flex flex-col">
          <FormLabel>Contractor</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {field.value
                    ? contractorOptions.find(
                        (option) => option.value === field.value
                      )?.label
                    : "Select a contractor"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start" sideOffset={4} style={{ zIndex: 9999 }}>
              <Command>
                <CommandInput 
                  placeholder="Search contractor..." 
                  className="h-9"
                  startIcon={<Search className="h-3 w-3" />}
                />
                <CommandList>
                  <CommandEmpty>No contractor found.</CommandEmpty>
                  <CommandGroup>
                    {contractorOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
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
          <FormDescription>
            The contractor assigned to this work
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ContractorSelector;
