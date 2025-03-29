
import { useState, useEffect } from 'react';
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

  const addVariable = () => {
    const newId = `var-${Date.now()}`;
    setVariables([...variables, { id: newId, name: '', value: '', type: 'string' }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: 'name' | 'value' | 'type', newValue: string) => {
    setVariables(prevVariables => 
      prevVariables.map(v => {
        if (v.id === id) {
          return { ...v, [field]: newValue };
        }
        return v;
      })
    );
  };

  const validateVariables = (): boolean => {
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
  };

  const saveVariables = (showNotification = true) => {
    if (validateVariables()) {
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
  };

  // For backward compatibility
  const handleSave = () => {
    return saveVariables(true);
  };

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
