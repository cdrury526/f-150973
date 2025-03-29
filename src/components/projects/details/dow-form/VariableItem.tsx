
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DOWVariable } from '../types';
import { validateValue, formatValueForType } from './utils/validationUtils';
import VariableNameInput from './variable-inputs/VariableNameInput';
import VariableInputControl from './variable-inputs/VariableInputControl';
import RemoveButton from './variable-inputs/RemoveButton';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      
      if (validateAndSave()) {
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    }
  };

  const validateAndSave = (): boolean => {
    // For string type, we don't need to validate
    setValidationError(null);
    return true;
  };

  const handleBlur = () => {
    validateAndSave();
  };

  return (
    <Card className={`overflow-hidden ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <VariableNameInput
              value={variable.name}
              onChange={(newValue) => onUpdate(variable.id, 'name', newValue)}
            />
            <RemoveButton onClick={() => onRemove(variable.id)} />
          </div>
          
          <VariableInputControl 
            variable={variable}
            validationError={validationError}
            onValueChange={handleValueChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            validateAndSave={validateAndSave}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableItem;
