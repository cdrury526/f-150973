import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DOWVariable } from '../types';

interface UseDOWFormProps {
  initialVariables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
}

export const useDOWForm = ({ initialVariables, onSave }: UseDOWFormProps) => {
  const [variables, setVariables] = useState<DOWVariable[]>(initialVariables || []);
  const [autoSave, setAutoSave] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const [lastManualSave, setLastManualSave] = useState<number>(0);

  // Update local state when the initial variables change (like after auto-extraction)
  useEffect(() => {
    console.log('useDOWForm initialVariables updated:', initialVariables);
    setVariables(initialVariables);
  }, [initialVariables]);

  // Handle autosave functionality
  useEffect(() => {
    if (autoSave && variables.length > 0) {
      const timer = setTimeout(() => {
        saveVariables(false); // Don't show notifications for auto-save
      }, 1000); // Autosave after 1 second of inactivity (reduced from 3s for better UX)
      
      return () => clearTimeout(timer);
    }
  }, [variables, autoSave]);

  const addVariable = useCallback(() => {
    const newId = `var-${Date.now()}`;
    const newVariable: DOWVariable = { id: newId, name: '', value: '', type: 'string' };
    console.log('Adding new variable:', newVariable);
    setVariables(prev => [...prev, newVariable]);
  }, []);

  const removeVariable = useCallback((id: string) => {
    console.log('Removing variable:', id);
    setVariables(prev => prev.filter(v => v.id !== id));
  }, []);

  const updateVariable = useCallback((id: string, field: 'name' | 'value' | 'type', newValue: string) => {
    console.log(`Updating variable ${id}, field: ${field}, value: ${newValue}`);
    setVariables(prevVariables => 
      prevVariables.map(v => {
        if (v.id === id) {
          const updated = { ...v, [field]: newValue };
          console.log('Variable updated:', updated);
          return updated;
        }
        return v;
      })
    );
  }, []);

  const validateVariables = useCallback((): boolean => {
    const newErrors: string[] = [];
    
    // Check for empty names
    const emptyNames = variables.filter(v => !v.name.trim());
    if (emptyNames.length > 0) {
      newErrors.push("All variables must have a name");
    }
    
    // Check for duplicate names
    const names = variables.map(v => v.name.trim());
    const duplicates = names.filter((name, index) => name && names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      newErrors.push(`Duplicate variable names: ${[...new Set(duplicates)].join(', ')}`);
    }
    
    // Validate variable names format (alphanumeric and underscores only)
    const invalidNames = variables.filter(v => v.name.trim() && !/^[A-Z0-9_]+$/.test(v.name.trim()));
    if (invalidNames.length > 0) {
      newErrors.push("Variable names must contain only uppercase letters, numbers, and underscores");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [variables]);

  const saveVariables = useCallback((showNotification = true) => {
    if (validateVariables()) {
      console.log('Saving variables:', variables);
      onSave(variables);
      
      // Only show notification for manual saves, not auto-saves
      if (showNotification) {
        // Prevent multiple toast notifications within 1 second
        const now = Date.now();
        if (now - lastManualSave > 1000) {
          toast({
            title: "Variables saved",
            description: "Your document variables have been saved successfully",
          });
          setLastManualSave(now);
        }
      }
      return true;
    } else {
      if (showNotification) {
        toast({
          title: "Validation failed",
          description: "Please fix the errors before saving",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [variables, validateVariables, onSave, toast, lastManualSave]);

  // For backward compatibility
  const handleSave = useCallback(() => {
    return saveVariables(true);
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
    saveVariables
  };
};
