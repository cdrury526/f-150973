
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { DOWVariable } from '../types';

interface VariableItemProps {
  variable: DOWVariable;
  activeVariableName: string | null;
  onUpdate: (id: string, field: 'name' | 'value' | 'type', newValue: string) => void;
  onRemove: (id: string) => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  activeVariableName,
  onUpdate,
  onRemove
}) => {
  const isLongValue = variable.value && variable.value.length > 50;
  const [localValue, setLocalValue] = useState(variable.value || '');
  const [error, setError] = useState<string | null>(null);

  // Update local value when the variable changes (e.g., from parent component)
  useEffect(() => {
    setLocalValue(variable.value || '');
  }, [variable.value]);

  // Detect type based on variable name pattern
  useEffect(() => {
    // Try to detect type from variable name pattern
    if (variable.name) {
      const name = variable.name.toUpperCase();
      
      // Detect date variables
      if (name.includes('DATE') || name.includes('DAY') || name.includes('MONTH') || name.includes('YEAR')) {
        onUpdate(variable.id, 'type', 'date');
      }
      // Detect number variables 
      else if (
        name.includes('COUNT') || 
        name.includes('NUMBER') || 
        name.includes('PRICE') || 
        name.includes('COST') || 
        name.includes('AMOUNT') ||
        name.includes('QTY') ||
        name.includes('SIZE') ||
        name.includes('HEIGHT') ||
        name.includes('WIDTH') ||
        name.includes('ALLOWANCE')
      ) {
        onUpdate(variable.id, 'type', 'number');
      } else {
        onUpdate(variable.id, 'type', 'string');
      }
    }
  }, [variable.name, onUpdate, variable.id]);

  const validateInput = (value: string): boolean => {
    const type = variable.type || 'string';
    
    if (value.trim() === '') {
      setError('Value cannot be empty');
      return false;
    }
    
    if (type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        setError('Must be a valid number');
        return false;
      }
      if (num < 0) {
        setError('Number cannot be negative');
        return false;
      }
    } else if (type === 'date') {
      const date = new Date(value);
      if (date.toString() === 'Invalid Date') {
        setError('Must be a valid date');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    validateInput(newValue);
  };

  const handleInputBlur = () => {
    if (validateInput(localValue)) {
      onUpdate(variable.id, 'value', localValue);
    }
  };

  const getInputType = () => {
    switch (variable.type) {
      case 'date':
        return 'date';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  };

  return (
    <div 
      className={`p-2 border rounded-md hover:bg-muted/50 relative transition-all
        ${activeVariableName === variable.name ? 'border-primary bg-primary/5' : ''}
        ${error ? 'border-red-300' : ''}`}
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
        <label className="text-xs text-muted-foreground mb-1 block">
          Value:
          {variable.type && <span className="ml-2 text-xs text-muted-foreground">({variable.type})</span>}
        </label>
        {isLongValue ? (
          <Textarea
            placeholder={`Enter ${variable.type || 'text'} value`}
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`text-sm min-h-[60px] w-full 
              ${activeVariableName === variable.name ? 'ring-2 ring-primary' : ''}
              ${error ? 'border-red-300 focus:border-red-500' : ''}`}
            data-variable-name={variable.name}
          />
        ) : (
          <Input
            placeholder={`Enter ${variable.type || 'text'} value`}
            type={getInputType()}
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`text-sm h-8 w-full 
              ${activeVariableName === variable.name ? 'ring-2 ring-primary' : ''}
              ${error ? 'border-red-300 focus:border-red-500' : ''}`}
            data-variable-name={variable.name}
          />
        )}
        {error && (
          <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
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
