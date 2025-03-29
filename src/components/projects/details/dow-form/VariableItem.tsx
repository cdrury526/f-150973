
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DOWVariable } from '../types';

interface VariableItemProps {
  variable: DOWVariable;
  activeVariableName: string | null;
  onUpdate: (id: string, field: 'name' | 'value', newValue: string) => void;
  onRemove: (id: string) => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  activeVariableName,
  onUpdate,
  onRemove
}) => {
  const isLongValue = variable.value && variable.value.length > 50;
  
  return (
    <div 
      className={`p-2 border rounded-md hover:bg-muted/50 relative transition-all
        ${activeVariableName === variable.name ? 'border-primary bg-primary/5' : ''}`}
    >
      <div className="mb-1">
        <label className="text-xs text-muted-foreground mb-1 block">Variable Name:</label>
        <Input
          placeholder="VARIABLE_NAME"
          value={variable.name}
          onChange={(e) => onUpdate(variable.id, 'name', e.target.value.toUpperCase())}
          className="text-xs h-8 font-mono w-full"
        />
      </div>
      <div className="mb-1">
        <label className="text-xs text-muted-foreground mb-1 block">Value:</label>
        {isLongValue ? (
          <Textarea
            placeholder="Variable value"
            value={variable.value || ''}
            onChange={(e) => onUpdate(variable.id, 'value', e.target.value)}
            className={`text-sm min-h-[60px] w-full ${activeVariableName === variable.name ? 'ring-2 ring-primary' : ''}`}
            data-variable-name={variable.name}
          />
        ) : (
          <Input
            placeholder="Variable value"
            value={variable.value || ''}
            onChange={(e) => onUpdate(variable.id, 'value', e.target.value)}
            className={`text-sm h-8 w-full ${activeVariableName === variable.name ? 'ring-2 ring-primary' : ''}`}
            data-variable-name={variable.name}
          />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(variable.id)}
        className="text-destructive hover:text-destructive/90 h-6 w-6 absolute top-1 right-1"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default VariableItem;
