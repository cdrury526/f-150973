
import React from 'react';
import { DOWVariable } from '../../types';
import StringInput from './StringInput';
import ValidationError from './ValidationError';

interface VariableInputControlProps {
  variable: DOWVariable;
  validationError: string | null;
  onValueChange: (newValue: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  validateAndSave: () => boolean;
}

const VariableInputControl: React.FC<VariableInputControlProps> = ({
  variable,
  validationError,
  onValueChange,
  onBlur,
  onKeyDown,
  validateAndSave
}) => {
  return (
    <div className="w-full">
      <StringInput
        value={variable.value}
        onChange={onValueChange}
        onKeyDown={onKeyDown}
      />
      {validationError && (
        <ValidationError errorMessage={validationError} />
      )}
    </div>
  );
};

export default VariableInputControl;
