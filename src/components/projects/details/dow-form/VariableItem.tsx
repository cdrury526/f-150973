import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DOWVariable } from '../types';
import VariableNameInput from './variable-inputs/VariableNameInput';
import VariableInputControl from './variable-inputs/VariableInputControl';
import RemoveButton from './variable-inputs/RemoveButton';
import VariableLabel from './variable-inputs/VariableLabel';

interface VariableItemProps {
  variable: DOWVariable;
  activeVariableName: string | null;
  onUpdate: (id: string, field: 'name' | 'value' | 'type', newValue: string) => void;
  onRemove: (id: string) => void;
  onSaveRequested?: () => boolean;
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
  const [isEditing, setIsEditing] = useState(false);
  
  // Debug logs
  useEffect(() => {
    console.log('VariableItem rendered:', variable.name, 'isActive:', isActive);
  }, [variable.name, isActive]);

  const handleValueChange = (newValue: string) => {
    console.log('handleValueChange called:', variable.name, newValue);
    onUpdate(variable.id, 'value', newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('handleKeyDown called:', variable.name, e.key);
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
    console.log('handleBlur called:', variable.name);
    validateAndSave();
    setIsEditing(false);
  };

  const handleFocus = () => {
    console.log('handleFocus called:', variable.name);
    setIsEditing(true);
  };

  return (
    <Card 
      className={`variable-item ${isActive ? 'border-primary' : ''} ${isEditing ? 'ring-2 ring-primary' : ''}`}
      data-variable-name={variable.name}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <VariableLabel name={variable.name} displayName="Variable Name" />
            <VariableNameInput
              value={variable.name}
              onChange={(newValue) => onUpdate(variable.id, 'name', newValue)}
            />
          </div>
          <RemoveButton onClick={() => onRemove(variable.id)} />
        </div>
        
        <div className="space-y-2">
          <VariableLabel name={variable.name} displayName="Value" />
          <VariableInputControl
            variable={variable}
            validationError={validationError}
            onValueChange={handleValueChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            validateAndSave={validateAndSave}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableItem;
