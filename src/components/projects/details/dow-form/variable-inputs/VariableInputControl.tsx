
import React from 'react';
import { DOWVariable } from '../../types';
import NumberInput from './NumberInput';
import DateInput from './DateInput';
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
  const renderInputControl = () => {
    switch (variable.type) {
      case 'number':
        return (
          <NumberInput
            value={variable.value}
            onChange={onValueChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            hasError={!!validationError}
          />
        );
      
      case 'date':
        return (
          <DateInput
            value={variable.value}
            onChange={onValueChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            hasError={!!validationError}
          />
        );
      
      default: // 'string' or any other type
        return (
          <StringInput
            value={variable.value}
            onChange={onValueChange}
            onKeyDown={onKeyDown}
          />
        );
    }
  };

  return (
    <div>
      {renderInputControl()}
      <ValidationError errorMessage={validationError} />
    </div>
  );
};

export default VariableInputControl;
