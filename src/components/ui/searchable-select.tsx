
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  
  // Always ensure options is an array and never undefined
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Find the selected option
  const selectedOption = safeOptions.find(option => option.value === value);

  // Filter options based on search query
  const filteredOptions = safeOptions.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    console.log("Selection made:", optionValue);
    onChange(optionValue);
    setSearchQuery('');
    setOpen(false);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle if the dropdown is open
      if (!open) return;
      
      // Check if click is outside the dropdown elements
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* Semi-transparent overlay when dropdown is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-[90]" 
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <Popover open={open} onOpenChange={setOpen}>
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
          className="p-0 border shadow-md" 
          style={{ width: typeof width === 'number' ? `${width}px` : width }}
          align="start"
          sideOffset={4}
          avoidCollisions={true}
        >
          <div className="overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md z-[200]">
            <div className="flex items-center border-b px-3">
              <input 
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-autocomplete="list"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div 
              className="overflow-y-auto" 
              style={{ maxHeight: `${maxHeight}px` }} 
              ref={listRef}
              onClick={(e) => e.stopPropagation()}
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm">{emptyMessage}</div>
              ) : (
                <div className="p-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={`option-${option.value}`}
                      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${value === option.value ? 'bg-accent text-accent-foreground' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      role="option"
                      aria-selected={value === option.value}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(option.value);
                        }
                      }}
                    >
                      <div className={option.description ? 'flex flex-col items-start' : ''}>
                        <span className={option.description ? 'font-medium' : ''}>{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
