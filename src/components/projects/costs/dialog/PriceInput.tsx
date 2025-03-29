
import React from 'react';
import { DollarSign } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';

interface PriceInputProps {
  control: Control<any>;
  name: string;
  label: string;
  description: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ 
  control, 
  name, 
  label, 
  description 
}) => {
  const formatNumberWithCommas = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-0 flex h-10 items-center pl-3 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </div>
              <Input 
                type="text"
                value={formatNumberWithCommas(field.value)}
                onChange={(e) => {
                  const rawValue = parseFormattedNumber(e.target.value);
                  field.onChange(rawValue);
                }}
                className="pl-8 text-right font-medium"
                placeholder="0.00"
                inputMode="numeric"
              />
            </div>
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default PriceInput;
