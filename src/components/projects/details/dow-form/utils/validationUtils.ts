
import { format, isValid, parse } from 'date-fns';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export const validateValue = (value: string, type: string): ValidationResult => {
  switch (type) {
    case 'number':
      if (value === '') return { isValid: true, errorMessage: null }; // Allow empty for optional fields
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return {
          isValid: false,
          errorMessage: 'Please enter a valid non-negative number'
        };
      }
      return { isValid: true, errorMessage: null };
    
    case 'date':
      if (value === '') return { isValid: true, errorMessage: null }; // Allow empty for optional fields
      try {
        const dateObj = parse(value, 'yyyy-MM-dd', new Date());
        if (!isValid(dateObj)) {
          return {
            isValid: false,
            errorMessage: 'Please enter a valid date (YYYY-MM-DD)'
          };
        }
        return { isValid: true, errorMessage: null };
      } catch {
        return {
          isValid: false,
          errorMessage: 'Please enter a valid date (YYYY-MM-DD)'
        };
      }
    
    default: // 'string' or any other type
      return { isValid: true, errorMessage: null }; // No validation needed for string type
  }
};

export const formatValueForType = (value: string, type: string): string => {
  switch (type) {
    case 'date':
      try {
        const dateObj = parse(value, 'yyyy-MM-dd', new Date());
        if (isValid(dateObj)) {
          return format(dateObj, 'yyyy-MM-dd');
        }
        return value;
      } catch {
        return value;
      }
    default:
      return value;
  }
};
