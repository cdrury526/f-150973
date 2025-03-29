
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  hasError: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  hasError
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`${hasError ? "border-red-500" : ""} pr-10`}
        placeholder="YYYY-MM-DD"
      />
      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export default DateInput;
