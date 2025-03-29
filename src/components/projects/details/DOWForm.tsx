
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface DOWVariable {
  id: string;
  name: string;
  value: string;
}

interface DOWFormProps {
  projectId: string;
  variables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
  getSortedVariables?: () => DOWVariable[]; // Prop for getting variables in order
}

const DOWForm: React.FC<DOWFormProps> = ({ 
  projectId, 
  variables: initialVariables, 
  onSave,
  getSortedVariables 
}) => {
  const [variables, setVariables] = useState<DOWVariable[]>(initialVariables || []);
  const [autoSave, setAutoSave] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Update local state when the initial variables change (like after auto-extraction)
  useEffect(() => {
    setVariables(initialVariables);
  }, [initialVariables]);

  useEffect(() => {
    if (autoSave && variables.length > 0) {
      const timer = setTimeout(() => {
        handleSave();
      }, 3000); // Autosave after 3 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [variables, autoSave]);

  const addVariable = () => {
    const newId = `var-${Date.now()}`;
    setVariables([...variables, { id: newId, name: '', value: '' }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: 'name' | 'value', newValue: string) => {
    setVariables(
      variables.map(v => (v.id === id ? { ...v, [field]: newValue } : v))
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

  const handleSave = () => {
    if (validateVariables()) {
      onSave(variables);
      toast({
        title: "Variables saved",
        description: "Your document variables have been saved successfully",
      });
    } else {
      toast({
        title: "Validation failed",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
    }
  };

  // Get variables in the proper order for display
  const displayVariables = getSortedVariables ? getSortedVariables() : variables;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Autosave</span>
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={addVariable}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Variable
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {variables.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No variables added yet. Click "Add Variable" to start customizing your document.
            </div>
          ) : (
            <div className="space-y-0 divide-y">
              {displayVariables.map((variable) => (
                <div key={variable.id} className="flex items-center gap-3 p-2 hover:bg-muted/50">
                  <div className="w-2/5">
                    <Input
                      placeholder="VARIABLE_NAME"
                      value={variable.name}
                      onChange={(e) => updateVariable(variable.id, 'name', e.target.value.toUpperCase())}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Variable value"
                      value={variable.value}
                      onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                      className="text-sm h-8"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariable(variable.id)}
                    className="text-destructive hover:text-destructive/90 h-8 w-8 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DOWForm;
