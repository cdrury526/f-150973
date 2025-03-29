
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DOWVariable } from '../types';

interface BuilderProfile {
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
}

interface UseDOWFormProps {
  initialVariables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
}

// Helper to match a variable name to a company field with best effort
const findMatchingBuilderField = (
  variableName: string, 
  builderProfile: BuilderProfile
): string | null => {
  const name = variableName.toLowerCase();
  
  if (name.includes('company') || name.includes('business') || name.includes('builder')) {
    return builderProfile.company_name;
  }
  
  if (name.includes('address') && !name.includes('city') && !name.includes('state') && !name.includes('zip')) {
    return builderProfile.address;
  }
  
  if (name.includes('city')) {
    return builderProfile.city;
  }
  
  if (name.includes('state')) {
    return builderProfile.state;
  }
  
  if (name.includes('zip') || name.includes('postal')) {
    return builderProfile.zip_code;
  }
  
  if (name.includes('phone') || name.includes('tel')) {
    return builderProfile.phone;
  }
  
  if (name.includes('website') || name.includes('url') || name.includes('site')) {
    return builderProfile.website;
  }
  
  return null;
};

export const useDOWForm = ({ initialVariables, onSave }: UseDOWFormProps) => {
  const [variables, setVariables] = useState<DOWVariable[]>(initialVariables);
  const [autoSave, setAutoSave] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [autoPopulated, setAutoPopulated] = useState(false);
  
  // Update variables when initialVariables change (e.g., when fetched from API)
  useEffect(() => {
    setVariables(initialVariables);
  }, [initialVariables]);
  
  const validate = useCallback((): string[] => {
    const newErrors: string[] = [];
    
    // Check for duplicate variable names
    const names = variables.map(v => v.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      duplicates.forEach(name => {
        newErrors.push(`Duplicate variable name: ${name}`);
      });
    }
    
    // Check for empty names or values
    variables.forEach(variable => {
      if (!variable.name.trim()) {
        newErrors.push('Variable names cannot be empty');
      }
    });
    
    return newErrors;
  }, [variables]);
  
  const addVariable = useCallback(() => {
    const newVariable: DOWVariable = {
      id: uuidv4(),
      name: '',
      value: '',
      type: 'string'
    };
    
    setVariables(prevVars => [...prevVars, newVariable]);
  }, []);
  
  const removeVariable = useCallback((id: string) => {
    setVariables(prevVars => prevVars.filter(v => v.id !== id));
    
    if (autoSave) {
      setTimeout(() => {
        saveVariables();
      }, 0);
    }
  }, [autoSave]);
  
  const updateVariable = useCallback((id: string, field: 'name' | 'value', value: string) => {
    setVariables(prevVars => 
      prevVars.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    );
    
    if (autoSave) {
      setTimeout(() => {
        saveVariables();
      }, 500);
    }
  }, [autoSave]);
  
  const saveVariables = useCallback((force = false) => {
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0 || force) {
      onSave(variables);
      return true;
    }
    return false;
  }, [variables, validate, onSave]);
  
  const handleSave = useCallback(() => {
    saveVariables(true);
  }, [saveVariables]);
  
  const prepopulateCompanyInfo = useCallback((builderProfile: BuilderProfile) => {
    if (!builderProfile.company_name) return;
    
    setVariables(prevVars => 
      prevVars.map(variable => {
        const matchingValue = findMatchingBuilderField(variable.name, builderProfile);
        if (matchingValue !== null) {
          return { ...variable, value: matchingValue };
        }
        return variable;
      })
    );
    
    setAutoPopulated(true);
    
    // Save the changes if auto-save is enabled
    if (autoSave) {
      setTimeout(() => {
        saveVariables();
      }, 0);
    }
  }, [autoSave, saveVariables]);
  
  return {
    variables,
    autoSave,
    errors,
    autoPopulated,
    setAutoSave,
    setAutoPopulated,
    addVariable,
    removeVariable,
    updateVariable,
    handleSave,
    saveVariables,
    prepopulateCompanyInfo,
  };
};
