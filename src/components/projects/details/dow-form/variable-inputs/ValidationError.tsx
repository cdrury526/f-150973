
import React from 'react';

interface ValidationErrorProps {
  errorMessage: string | null;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;
  
  return (
    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
  );
};

export default ValidationError;
