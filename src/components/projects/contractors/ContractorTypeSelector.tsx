import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  // Filter types based on search
  const filteredTypes = useMemo(() => {
    if (!searchQuery) return contractorTypes;
    
    return contractorTypes.filter((type) => 
      type.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contractorTypeDescriptions[type].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contractorTypes, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.getElementById('contractor-search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 10);
      }
    }
  }, [isOpen]);

  const handleSelect = (type: ContractorType) => {
    onChange(type);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-[300px]" ref={dropdownRef}>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value || "Select contractor type"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-50">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input 
                id="contractor-search-input"
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none"
                placeholder="Search contractor type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredTypes.length === 0 ? (
                <div className="py-6 text-center text-sm">No contractor type found.</div>
              ) : (
                <div className="p-1">
                  {filteredTypes.map((type) => (
                    <div
                      key={type}
                      className={cn(
                        "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 rounded-sm",
                        type === value ? "bg-gray-100" : ""
                      )}
                      onClick={() => handleSelect(type)}
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            type === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{type}</span>
                      </div>
                      <div className="ml-6 text-xs text-gray-500 mt-1">
                        {contractorTypeDescriptions[type]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
              <Search size={16} />
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

export const ContractorTypeCell: React.FC<ContractorTypeSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  const filteredTypes = useMemo(() => {
    if (!searchQuery) return contractorTypes;
    return contractorTypes.filter(type => 
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contractorTypes, searchQuery]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.getElementById('contractor-cell-search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 10);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative w-[180px]" ref={dropdownRef}>
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between h-8 px-3 py-1 text-xs"
        disabled={disabled}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || "Select type"}</span>
        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
      </Button>
      
      {isOpen && (
        <div className="absolute mt-1 w-[220px] rounded-md border border-gray-200 bg-white shadow-lg z-50">
          <div className="flex items-center border-b px-2">
            <Search className="mr-1 h-3 w-3 shrink-0 opacity-50" />
            <input 
              id="contractor-cell-search-input"
              className="flex h-7 w-full bg-transparent py-1 text-xs outline-none"
              placeholder="Search type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredTypes.length === 0 ? (
              <div className="py-4 text-center text-xs">No type found.</div>
            ) : (
              <div className="p-1">
                {filteredTypes.map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "flex items-center cursor-pointer px-2 py-1.5 text-xs hover:bg-gray-100 rounded-sm",
                      type === value ? "bg-gray-100" : ""
                    )}
                    onClick={() => {
                      onChange(type);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-1 h-3 w-3",
                        type === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
