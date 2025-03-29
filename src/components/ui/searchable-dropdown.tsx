
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

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          type="button"
        >
          {selectedOption ? selectedOption.label : triggerPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          popoverClassName
        )}
        style={{ zIndex: 9999 }}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>{emptyStateText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
