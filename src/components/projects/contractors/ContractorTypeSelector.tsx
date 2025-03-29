
import React, { useState, useMemo } from 'react';
import { Info, Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContractorType, contractorTypeDescriptions } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  // Filter types based on search
  const filteredTypes = useMemo(() => {
    if (!searchQuery) return contractorTypes;
    
    return contractorTypes.filter((type) => 
      type.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contractorTypeDescriptions[type].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contractorTypes, searchQuery]);
  
  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
            disabled={disabled}
            type="button"
          >
            {value || "Select contractor type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
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
                placeholder="Search contractor type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div 
              className="max-h-[300px] overflow-y-auto p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredTypes.length === 0 ? (
                <div className="py-6 text-center text-sm">No contractor type found.</div>
              ) : (
                filteredTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      onChange(type);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      type === value ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        type === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{type}</span>
                      <span className="text-xs text-muted-foreground">
                        {contractorTypeDescriptions[type]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const contractorTypes = Object.keys(contractorTypeDescriptions) as ContractorType[];
  
  // Filter types based on search
  const filteredTypes = useMemo(() => {
    if (!searchQuery) return contractorTypes;
    
    return contractorTypes.filter((type) => 
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contractorTypes, searchQuery]);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] h-8 px-3 py-1 justify-between"
          disabled={disabled}
          type="button"
        >
          {value || "Select type"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[250px] p-0" 
        align="start" 
        sideOffset={4} 
        style={{ zIndex: 9999 }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="overflow-hidden rounded-md border border-input bg-popover text-popover-foreground">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input 
              className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div 
            className="max-h-[300px] overflow-y-auto p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredTypes.length === 0 ? (
              <div className="py-6 text-center text-sm">No type found.</div>
            ) : (
              filteredTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    onChange(type);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    type === value ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      type === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
