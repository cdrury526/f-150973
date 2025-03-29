import React from 'react';
import { DOWVariable } from '../../types';
import StringInput from './StringInput';
import ValidationError from './ValidationError';

interface VariableInputControlProps {
  variable: DOWVariable;
  validationError: string | null;
  onValueChange: (newValue: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  validateAndSave: () => boolean;
}

const VariableInputControl: React.FC<VariableInputControlProps> = ({
  variable,
  validationError,
  onValueChange,
  onBlur,
  onFocus,
  onKeyDown,
  validateAndSave
}) => {
  const handleChange = (newValue: string) => {
    console.log('VariableInputControl handleChange:', variable.name, newValue);
    onValueChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyDown(e);
  };

  const handleBlur = () => {
    validateAndSave();
    onBlur();
  };

  const handleFocus = () => {
    console.log('VariableInputControl handleFocus:', variable.name);
    onFocus();
  };

  return (
    <div className="w-full">
      <StringInput
        value={variable.value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        variableName={variable.name}
      />
      {validationError && (
        <ValidationError errorMessage={validationError} />
      )}
    </div>
  );
};

export default VariableInputControl;
