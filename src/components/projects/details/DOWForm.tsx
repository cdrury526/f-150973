
import React from 'react';
import { DOWVariable } from './types';
import FormHeader from './dow-form/FormHeader';
import ValidationErrors from './dow-form/ValidationErrors';
import VariableList from './dow-form/VariableList';
import { useDOWForm } from './dow-form/useDOWForm';

interface DOWFormProps {
  projectId: string;
  variables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
  getSortedVariables?: () => DOWVariable[]; // Prop for getting variables in order
  activeVariableName?: string | null; // New prop for highlighting active variable
}

const DOWForm: React.FC<DOWFormProps> = ({ 
  projectId, 
  variables: initialVariables, 
  onSave,
  getSortedVariables,
  activeVariableName 
}) => {
  const {
    variables,
    autoSave,
    errors,
    setAutoSave,
    addVariable,
    removeVariable,
    updateVariable,
    handleSave
  } = useDOWForm({
    initialVariables,
    onSave
  });

  // Get variables in the proper order for display
  const displayVariables = getSortedVariables ? getSortedVariables() : variables;

  return (
    <div className="space-y-4">
      <FormHeader
        autoSave={autoSave}
        onAutoSaveChange={setAutoSave}
        onAddVariable={addVariable}
        onSave={handleSave}
      />
      
      <ValidationErrors errors={errors} />
      
      <VariableList
        variables={displayVariables}
        activeVariableName={activeVariableName || null}
        onUpdateVariable={updateVariable}
        onRemoveVariable={removeVariable}
        onSaveRequested={handleSave} // Pass the save handler
      />
    </div>
  );
};

export default DOWForm;
