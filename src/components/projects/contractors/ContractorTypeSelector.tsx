
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";

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
  // Ensure we have a valid contractorTypeDescriptions object
  const typeDescriptions = contractorTypeDescriptions || {};
  
  // Convert contractor types to options format - safeguard against undefined
  const contractorTypeOptions: SearchableSelectOption[] = 
    Object.keys(typeDescriptions).map((type) => ({
      value: type,
      label: type,
      description: typeDescriptions[type as ContractorType] || ''
    }));
  
  return (
    <div className="flex items-center gap-2">
      <SearchableSelect
        options={contractorTypeOptions}
        value={value || ""}
        onChange={(newValue) => onChange(newValue as ContractorType)}
        placeholder="Select contractor type"
        searchPlaceholder="Search contractor type..."
        emptyMessage="No contractor type found."
        disabled={disabled}
        width="300px"
      />

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
            <p className="max-w-xs">{typeDescriptions[value as ContractorType] || 'Select a contractor type'}</p>
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
  // Ensure we have a valid contractorTypeDescriptions object
  const typeDescriptions = contractorTypeDescriptions || {};
  
  // Convert contractor types to options format
  const contractorTypeOptions: SearchableSelectOption[] = 
    Object.keys(typeDescriptions).map((type) => ({
      value: type,
      label: type,
      description: typeDescriptions[type as ContractorType] || ''
    }));
  
  return (
    <SearchableSelect
      options={contractorTypeOptions}
      value={value || ""}
      onChange={(newValue) => onChange(newValue as ContractorType)}
      placeholder="Select type"
      searchPlaceholder="Search..."
      emptyMessage="No contractor type found."
      disabled={disabled}
      className="h-8 p-2"
      width="250px"
    />
  );
};
