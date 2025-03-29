
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractorTypeSelectorProps {
  value: ContractorType;
  onChange: (value: ContractorType) => void;
  disabled?: boolean;
}

export const ContractorTypeSelector: React.FC<ContractorTypeSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[300px] justify-between"
            disabled={disabled}
          >
            {value || "Select contractor type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search contractor type..." />
            <CommandEmpty>No contractor type found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {contractorTypes.map((type) => (
                <CommandItem
                  key={type}
                  value={type}
                  onSelect={() => onChange(type)}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{type}</span>
                    <span className="text-xs text-muted-foreground">
                      {contractorTypeDescriptions[type]}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              disabled={disabled}
              type="button"
            >
              <Info size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {value ? contractorTypeDescriptions[value] : 'Select a contractor type'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// For table cell use where space might be limited
export const ContractorTypeCell: React.FC<ContractorTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[250px] h-8 p-2 justify-between"
          disabled={disabled}
        >
          {value || "Select type"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No contractor type found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {contractorTypes.map((type) => (
              <CommandItem
                key={type}
                value={type}
                onSelect={() => onChange(type)}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === type ? "opacity-100" : "opacity-0"
                  )}
                />
                {type}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
