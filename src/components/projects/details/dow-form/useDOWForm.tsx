
import React, { useState, useCallback } from 'react';
import { DOWVariable } from '../types';
import { v4 as uuidv4 } from 'uuid';

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

export const useDOWForm = ({ initialVariables, onSave }: UseDOWFormProps) => {
  const [variables, setVariables] = useState<DOWVariable[]>(initialVariables);
  const [autoSave, setAutoSave] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Add a new variable
  const addVariable = useCallback(() => {
    const newVariable: DOWVariable = {
      id: uuidv4(),
      name: `NEW_VARIABLE_${Math.floor(Math.random() * 1000)}`,
      value: '',
      type: 'string' // Default type for new variables
    };
    
    setVariables(prev => [...prev, newVariable]);
    
    if (autoSave) {
      onSave([...variables, newVariable]);
    }
  }, [variables, autoSave, onSave]);

  // Remove a variable
  const removeVariable = useCallback((id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
    
    if (autoSave) {
      onSave(variables.filter(v => v.id !== id));
    }
  }, [variables, autoSave, onSave]);

  // Update a variable
  const updateVariable = useCallback((id: string, field: keyof DOWVariable, value: string) => {
    setVariables(prev => 
      prev.map(v => v.id === id ? { ...v, [field]: value } : v)
    );
    
    if (autoSave) {
      saveVariables();
    }
  }, [variables, autoSave]);

  // Validate variables
  const validateVariables = useCallback((): boolean => {
    const newErrors: string[] = [];
    
    // Check for empty names
    variables.forEach(v => {
      if (!v.name.trim()) {
        newErrors.push(`Variable ID ${v.id} has an empty name`);
      }
    });
    
    // Check for duplicate names
    const names = variables.map(v => v.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      duplicates.forEach(name => {
        newErrors.push(`Duplicate variable name: ${name}`);
      });
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [variables]);

  // Prepopulate company info
  const prepopulateCompanyInfo = useCallback((profile: BuilderProfile) => {
    if (!profile) return;
    
    const updatedVariables = [...variables];
    let changed = false;
    
    // Map company profile fields to likely variable names
    const mappings: { [key: string]: (string | null)[] } = {
      'COMPANY_NAME': [profile.company_name],
      'COMPANY_ADDRESS': [profile.address],
      'COMPANY_CITY': [profile.city],
      'COMPANY_STATE': [profile.state],
      'COMPANY_ZIP': [profile.zip_code],
      'COMPANY_WEBSITE': [profile.website],
      'COMPANY_PHONE': [profile.phone],
      'PHONE': [profile.phone],
      'ADDRESS': [profile.address],
      'CITY': [profile.city],
      'STATE': [profile.state],
      'ZIP': [profile.zip_code],
      'WEBSITE': [profile.website]
    };
    
    // Try to find matching variables and update their values
    updatedVariables.forEach(variable => {
      // Look for variable names that match our mapping keys
      for (const [pattern, values] of Object.entries(mappings)) {
        if (variable.name.includes(pattern) && values[0]) {
          variable.value = values[0] || '';
          changed = true;
          break;
        }
      }
    });
    
    if (changed) {
      setVariables(updatedVariables);
      if (autoSave) {
        onSave(updatedVariables);
      }
    }
  }, [variables, autoSave, onSave]);

  // Save all variables
  const saveVariables = useCallback((force: boolean = false) => {
    if (validateVariables()) {
      onSave(variables);
      return true;
    }
    return false;
  }, [variables, validateVariables, onSave]);

  // Handle save button click
  const handleSave = useCallback(() => {
    saveVariables(true);
  }, [saveVariables]);

  return {
    variables,
    autoSave,
    errors,
    setAutoSave,
    addVariable,
    removeVariable,
    updateVariable,
    handleSave,
    saveVariables,
    prepopulateCompanyInfo,
  };
};
