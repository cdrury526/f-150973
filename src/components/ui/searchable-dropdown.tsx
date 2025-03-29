import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the structure for dropdown options
export interface DropdownOption {
  value: string; // Unique identifier for the option
  label: string; // Display text for the option
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value?: string; // The currently selected value
  onChange: (value: string) => void; // Callback when an option is selected
  placeholder?: string; // Placeholder for the search input
  triggerPlaceholder?: string; // Placeholder for the trigger button
  emptyStateText?: string; // Text when no results found
  className?: string; // Optional class for the root Popover element
  popoverClassName?: string; // Optional class for the PopoverContent element
  disabled?: boolean; // Optional disabled state
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search options...",
  triggerPlaceholder = "Select an option...",
  emptyStateText = "No option found.",
  className,
  popoverClassName,
  disabled = false,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    return options.filter((option) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Handle option selection
  const handleSelect = React.useCallback((optionValue: string) => {
    console.log("Option selected:", optionValue);
    onChange(optionValue);
    setOpen(false);
    setSearchQuery("");
  }, [onChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            type="button"
            onClick={() => setOpen(true)}
          >
            {selectedOption ? selectedOption.label : triggerPlaceholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("p-0 pointer-events-auto", popoverClassName)}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          align="start"
          sideOffset={5}
        >
          <div className="overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md">
            <div className="flex items-center border-b px-3">
              <input
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyStateText}
                </div>
              ) : (
                <div className="p-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        value === option.value ? "bg-accent text-accent-foreground" : ""
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
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
}
