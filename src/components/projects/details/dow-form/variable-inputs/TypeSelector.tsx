
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="string">Text</SelectItem>
        <SelectItem value="number">Number</SelectItem>
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TypeSelector;
