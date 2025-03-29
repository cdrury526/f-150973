
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  hasError: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  hasError
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={hasError ? "border-red-500" : ""}
      placeholder="Enter a number value"
    />
  );
};

export default NumberInput;
