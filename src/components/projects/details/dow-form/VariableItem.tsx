
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DOWVariable } from '../types';
import { validateValue, formatValueForType } from './utils/validationUtils';
import VariableNameInput from './variable-inputs/VariableNameInput';
import TypeSelector from './variable-inputs/TypeSelector';
import StringInput from './variable-inputs/StringInput';
import NumberInput from './variable-inputs/NumberInput';
import DateInput from './variable-inputs/DateInput';
import RemoveButton from './variable-inputs/RemoveButton';
import ValidationError from './variable-inputs/ValidationError';

interface VariableItemProps {
  variable: DOWVariable;
  activeVariableName: string | null;
  onUpdate: (id: string, field: 'name' | 'value' | 'type', newValue: string) => void;
  onRemove: (id: string) => void;
  onSaveRequested?: () => boolean; // Updated to return boolean success status
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  activeVariableName,
  onUpdate,
  onRemove,
  onSaveRequested
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const isActive = activeVariableName === variable.name;

  const handleValueChange = (newValue: string) => {
    onUpdate(variable.id, 'value', newValue);
  };

  const handleTypeChange = (newType: string) => {
    setValidationError(null);
    
    let formattedValue = variable.value;
    
    if (newType === 'date' && variable.type !== 'date') {
      try {
        const dateObj = new Date(variable.value);
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
          formattedValue = formatValueForType(variable.value, 'date');
        } else {
          formattedValue = '';
        }
      } catch {
        formattedValue = '';
      }
    }
    
    if (newType === 'number' && variable.type !== 'number') {
      const numericValue = variable.value.replace(/[^0-9.]/g, '');
      formattedValue = numericValue || '';
    }
    
    onUpdate(variable.id, 'type', newType);
    onUpdate(variable.id, 'value', formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && variable.type !== 'string') {
      e.preventDefault();
      
      if (validateAndSave()) {
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    }

    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && variable.type === 'string') {
      e.preventDefault();
      
      if (validateAndSave()) {
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    }
  };

  const validateAndSave = (): boolean => {
    const result = validateValue(variable.value, variable.type || 'string');
    setValidationError(result.errorMessage);
    return result.isValid;
  };

  const handleBlur = () => {
    validateAndSave();
  };

  const renderInputControl = () => {
    switch (variable.type) {
      case 'number':
        return (
          <NumberInput
            value={variable.value}
            onChange={handleValueChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            hasError={!!validationError}
          />
        );
      
      case 'date':
        return (
          <DateInput
            value={variable.value}
            onChange={handleValueChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            hasError={!!validationError}
          />
        );
      
      default: // 'string' or any other type
        return (
          <StringInput
            value={variable.value}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <Card className={`overflow-hidden ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-3">
            <VariableNameInput
              value={variable.name}
              onChange={(newValue) => onUpdate(variable.id, 'name', newValue)}
            />
          </div>
          
          <div className="col-span-2">
            <TypeSelector
              value={variable.type || 'string'}
              onChange={handleTypeChange}
            />
          </div>
          
          <div className="col-span-6">
            {renderInputControl()}
            <ValidationError errorMessage={validationError} />
          </div>
          
          <div className="col-span-1 flex justify-end">
            <RemoveButton onClick={() => onRemove(variable.id)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableItem;
