
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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

export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
  width?: number | string;
  showSelectedLabel?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className = '',
  maxHeight = 300,
  width = 300,
  showSelectedLabel = true,
}) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Ensure options is always a valid array with valid objects
  const safeOptions = Array.isArray(options) 
    ? options.filter(opt => opt && typeof opt === 'object' && 'value' in opt && 'label' in opt)
    : [];
  
  // Find the selected option to display with additional safety checks
  const selectedOption = value && safeOptions.length > 0
    ? safeOptions.find(option => option && option.value === value)
    : null;

  // Close dropdown if we encounter errors
  useEffect(() => {
    const handleError = () => {
      if (open) setOpen(false);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [open]);

  // Prevent rendering if we don't have valid options
  useEffect(() => {
    if (open && !Array.isArray(options)) {
      console.warn('SearchableSelect: options is not an array', options);
      setOpen(false);
    }
  }, [open, options]);

  // Ensure we always have a valid array before opening the popover
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && (!Array.isArray(options) || options.length === 0)) {
      console.warn('SearchableSelect: Cannot open with invalid options', options);
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
          disabled={disabled}
          type="button"
        >
          {showSelectedLabel && selectedOption 
            ? selectedOption.label
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="p-0" 
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        align="start"
      >
        {Array.isArray(safeOptions) && safeOptions.length > 0 ? (
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
              {safeOptions.map((option, index) => (
                <CommandItem
                  key={`option-${option.value || index}`}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className={`py-2 ${option.description ? 'flex flex-col items-start' : ''}`}
                >
                  <span className={option.description ? 'font-medium' : ''}>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        ) : (
          <div className="p-2 text-sm text-muted-foreground">No options available</div>
        )}
      </PopoverContent>
    </Popover>
  );
};
