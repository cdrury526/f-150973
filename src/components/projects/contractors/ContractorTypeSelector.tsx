
import React from 'react';
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
import { ChevronDown, Info } from "lucide-react";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  // For regular form use, Select component is better
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange as any} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select contractor type" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px] overflow-y-auto">
          {Object.entries(contractorTypeDescriptions).map(([type, description]) => (
            <SelectItem key={type} value={type}>
              <div className="flex flex-col">
                <span>{type}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="ghost" className="h-8 justify-start p-2 w-full">
          <span className="truncate flex-1 text-left">{value}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] max-h-[400px] overflow-y-auto">
        {Object.entries(contractorTypeDescriptions).map(([type, description]) => (
          <DropdownMenuItem 
            key={type} 
            onClick={() => onChange(type as ContractorType)}
            className="flex flex-col items-start"
          >
            <span className="font-medium">{type}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
