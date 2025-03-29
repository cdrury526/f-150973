
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info, Search } from "lucide-react";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value || "Select contractor type"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search contractor type..." className="h-9" />
            <CommandEmpty>No contractor type found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {Object.entries(contractorTypeDescriptions).map(([type, description]) => (
                <CommandItem
                  key={type}
                  value={type}
                  onSelect={() => {
                    onChange(type as ContractorType);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-2"
                >
                  <span className="font-medium">{type}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled}>
              <Info size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{contractorTypeDescriptions[value] || 'Select a contractor type'}</p>
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
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant="ghost" className="h-8 justify-start p-2 w-full">
          <span className="truncate flex-1 text-left">{value}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No contractor type found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {Object.entries(contractorTypeDescriptions).map(([type, description]) => (
              <CommandItem
                key={type}
                value={type}
                onSelect={() => {
                  onChange(type as ContractorType);
                  setOpen(false);
                }}
                className="flex flex-col items-start py-2"
              >
                <span className="font-medium">{type}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
