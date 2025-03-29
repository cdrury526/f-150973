
import React from 'react';
import { Input } from "@/components/ui/input";

interface VariableNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const VariableNameInput: React.FC<VariableNameInputProps> = ({
  value,
  onChange
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value.toUpperCase())}
      placeholder="VARIABLE_NAME"
      className="font-mono uppercase"
    />
  );
};

export default VariableNameInput;
