
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
  
  // Convert contractor types to options format with strong safeguards
  const contractorTypeOptions: SearchableSelectOption[] = 
    Object.keys(typeDescriptions)
      .filter(key => key && typeof key === 'string') // Ensure keys are valid strings
      .map((type) => ({
        value: type,
        label: type,
        description: typeDescriptions[type as ContractorType] || ''
      }));
  
  // Ensure value is always valid
  const safeValue = (value && typeof value === 'string') ? value : '';
  
  return (
    <div className="flex items-center gap-2">
      <SearchableSelect
        options={contractorTypeOptions}
        value={safeValue}
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
  
  // Convert contractor types to options format with strong safeguards
  const contractorTypeOptions: SearchableSelectOption[] = 
    Object.keys(typeDescriptions)
      .filter(key => key && typeof key === 'string') // Ensure keys are valid strings
      .map((type) => ({
        value: type,
        label: type,
        description: typeDescriptions[type as ContractorType] || ''
      }));
  
  // Ensure value is always valid
  const safeValue = (value && typeof value === 'string') ? value : '';
  
  return (
    <SearchableSelect
      options={contractorTypeOptions}
      value={safeValue}
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
