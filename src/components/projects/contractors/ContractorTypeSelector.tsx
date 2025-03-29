
import React, { useEffect, useState } from 'react';
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
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  
  // Process contractor types into options safely
  useEffect(() => {
    try {
      // Ensure we have a valid contractorTypeDescriptions object
      if (!contractorTypeDescriptions || typeof contractorTypeDescriptions !== 'object') {
        console.error('Invalid contractorTypeDescriptions:', contractorTypeDescriptions);
        setOptions([]);
        return;
      }
      
      // Convert contractor types to options format with strong safeguards
      const typeOptions: SearchableSelectOption[] = 
        Object.keys(contractorTypeDescriptions)
          .filter(key => key && typeof key === 'string') // Ensure keys are valid strings
          .map((type) => ({
            value: type,
            label: type,
            description: (contractorTypeDescriptions as Record<string, string>)[type] || ''
          }));
      
      setOptions(typeOptions);
    } catch (error) {
      console.error('Error processing contractor types:', error);
      setOptions([]);
    }
  }, []);
  
  // Ensure value is always valid
  const safeValue = (value && typeof value === 'string') ? value : '';
  
  // Get description from the type safely
  const getDescriptionSafely = () => {
    try {
      return contractorTypeDescriptions && typeof contractorTypeDescriptions === 'object' && value
        ? (contractorTypeDescriptions as Record<string, string>)[value as string] || 'Select a contractor type'
        : 'Select a contractor type';
    } catch (error) {
      return 'Select a contractor type';
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <SearchableSelect
        options={options}
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
            <p className="max-w-xs">{getDescriptionSafely()}</p>
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
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  
  // Process contractor types into options safely
  useEffect(() => {
    try {
      // Ensure we have a valid contractorTypeDescriptions object
      if (!contractorTypeDescriptions || typeof contractorTypeDescriptions !== 'object') {
        console.error('Invalid contractorTypeDescriptions:', contractorTypeDescriptions);
        setOptions([]);
        return;
      }
      
      // Convert contractor types to options format with strong safeguards
      const typeOptions: SearchableSelectOption[] = 
        Object.keys(contractorTypeDescriptions)
          .filter(key => key && typeof key === 'string') // Ensure keys are valid strings
          .map((type) => ({
            value: type,
            label: type,
            description: (contractorTypeDescriptions as Record<string, string>)[type] || ''
          }));
      
      setOptions(typeOptions);
    } catch (error) {
      console.error('Error processing contractor types:', error);
      setOptions([]);
    }
  }, []);
  
  // Ensure value is always valid
  const safeValue = (value && typeof value === 'string') ? value : '';
  
  return (
    <SearchableSelect
      options={options}
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
