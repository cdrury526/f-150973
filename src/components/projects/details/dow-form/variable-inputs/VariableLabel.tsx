import React from 'react';
import { Label } from "@/components/ui/label";

interface VariableLabelProps {
  name: string;
  displayName?: string;
}

const VariableLabel: React.FC<VariableLabelProps> = ({ name, displayName }) => {
  // If displayName is provided, use that. Otherwise use the name.
  const textToDisplay = displayName || name || "UNNAMED_VARIABLE";
  
  return (
    <Label className="variable-name font-mono text-sm font-medium text-muted-foreground">
      {textToDisplay}
    </Label>
  );
};

export default VariableLabel;
