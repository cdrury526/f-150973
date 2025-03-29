
import { useState, useCallback } from 'react';
import { DOWVariable } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

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

export function useDOWForm({ initialVariables, onSave }: UseDOWFormProps) {
  const [variables, setVariables] = useState<DOWVariable[]>(initialVariables);
  const [autoSave, setAutoSave] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const validateVariables = useCallback(() => {
    const newErrors: string[] = [];
    const variableNames = new Set<string>();
    
    variables.forEach(variable => {
      if (!variable.name.trim()) {
        newErrors.push(`Variable ${variable.id} has an empty name`);
      } else if (variableNames.has(variable.name)) {
        newErrors.push(`Duplicate variable name: ${variable.name}`);
      } else {
        variableNames.add(variable.name);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [variables]);

  const saveVariables = useCallback((showToast: boolean = false) => {
    if (validateVariables()) {
      onSave(variables);
      if (showToast) {
        toast({
          title: "Variables saved",
          description: "Your variables have been saved successfully",
        });
      }
      return true;
    }
    return false;
  }, [variables, validateVariables, onSave, toast]);

  const handleSave = useCallback(() => {
    const success = saveVariables(true);
    if (!success) {
      toast({
        title: "Validation failed",
        description: "Please fix the validation errors and try again",
        variant: "destructive",
      });
    }
  }, [saveVariables, toast]);

  const addVariable = useCallback(() => {
    const newVariable: DOWVariable = {
      id: uuidv4(),
      name: '',
      value: '',
      type: 'text'
    };
    
    setVariables(prev => [...prev, newVariable]);
  }, []);

  const updateVariable = useCallback((id: string, field: 'name' | 'value' | 'type', newValue: string) => {
    setVariables(prev => {
      const newVariables = prev.map(variable => {
        if (variable.id === id) {
          return { ...variable, [field]: newValue };
        }
        return variable;
      });
      
      return newVariables;
    });
    
    if (autoSave) {
      // Use a timeout to avoid too many saves while typing
      setTimeout(() => saveVariables(false), 500);
    }
  }, [autoSave, saveVariables]);

  const removeVariable = useCallback((id: string) => {
    setVariables(prev => prev.filter(variable => variable.id !== id));
    
    if (autoSave) {
      setTimeout(() => saveVariables(false), 100);
    }
  }, [autoSave, saveVariables]);

  // Helper function to prepopulate variables from company info
  const prepopulateCompanyInfo = useCallback((profile: BuilderProfile) => {
    setVariables(prev => {
      const newVariables = [...prev];
      
      // Map of variable name patterns to company profile fields
      const mappings: Record<string, string | null> = {
        // Full address with components
        'company': profile.company_name,
        'companyname': profile.company_name,
        'address': profile.address,
        'city': profile.city,
        'state': profile.state,
        'zip': profile.zip_code,
        'zipcode': profile.zip_code,
        'phone': profile.phone,
        'website': profile.website,
        
        // Common combined patterns
        'fulladdress': profile.address && profile.city && profile.state && profile.zip_code 
          ? `${profile.address}, ${profile.city}, ${profile.state} ${profile.zip_code}`
          : null,
        'citystate': profile.city && profile.state 
          ? `${profile.city}, ${profile.state}`
          : null,
        'citystatezip': profile.city && profile.state && profile.zip_code
          ? `${profile.city}, ${profile.state} ${profile.zip_code}`
          : null
      };
      
      // Update matching variables
      return newVariables.map(variable => {
        const lowerName = variable.name.toLowerCase();
        
        // Find a match in our mappings
        for (const [pattern, value] of Object.entries(mappings)) {
          if (lowerName.includes(pattern) && value) {
            return { ...variable, value };
          }
        }
        
        return variable;
      });
    });
    
    toast({
      title: "Information applied",
      description: "Company information has been applied to relevant variables",
    });
    
    // Save the updated variables
    setTimeout(() => saveVariables(false), 100);
  }, [saveVariables, toast]);

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
    prepopulateCompanyInfo
  };
}

