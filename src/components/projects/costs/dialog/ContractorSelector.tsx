
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return contractorOptions;
    
    return contractorOptions.filter((option) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contractorOptions, searchQuery]);

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
                  type="button"
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
            <PopoverContent 
              className="w-[300px] p-0" 
              align="start" 
              sideOffset={4} 
              style={{ zIndex: 9999 }}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="overflow-hidden rounded-md border border-input bg-popover text-popover-foreground">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input 
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search contractor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div 
                  className="max-h-[300px] overflow-y-auto p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm">No contractor found.</div>
                  ) : (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          field.onChange(option.value);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          option.value === field.value ? "bg-accent text-accent-foreground" : ""
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option.value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
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
