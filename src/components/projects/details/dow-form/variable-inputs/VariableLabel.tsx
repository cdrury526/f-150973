
import React from 'react';
import { Label } from "@/components/ui/label";

interface VariableLabelProps {
  name: string;
}

const VariableLabel: React.FC<VariableLabelProps> = ({ name }) => {
  return (
    <Label className="font-mono text-xs text-muted-foreground">
      {name || "UNNAMED_VARIABLE"}
    </Label>
  );
};

export default VariableLabel;
