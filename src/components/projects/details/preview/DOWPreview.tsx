import React, { useState } from 'react';
import { DOWVariable } from '../types';
import PreviewActions from './components/PreviewActions';
import ErrorDisplay from './ErrorDisplay';
import PreviewTabs from './components/PreviewTabs';
import VariableEditPopup from './components/VariableEditPopup';
import { useDocumentGenerator } from './hooks/useDocumentGenerator';
import { useVariableHighlighting } from './hooks/useVariableHighlighting';

interface DOWPreviewProps {
  variables: DOWVariable[];
  templateContent: string;
  onSaveVariable: (variable: DOWVariable) => void;
}

const DOWPreview: React.FC<DOWPreviewProps> = ({ 
  variables, 
  templateContent, 
  onSaveVariable 
}) => {
  const [editingVariable, setEditingVariable] = useState<DOWVariable | null>(null);
  
  // Use our hooks
  const { 
    generatedDocument, 
    error, 
    missingVariables 
  } = useDocumentGenerator({ variables, templateContent });
  
  const { 
    highlightedVariables, 
    handleVariableClick 
  } = useVariableHighlighting();

  // Handle variable selection and show the edit popup
  const handleVariableSelection = (variableName: string) => {
    // First highlight the variable in the preview
    handleVariableClick(variableName);
    
    // Find the variable to edit
    const variable = variables.find(v => v.name === variableName);
    if (variable) {
      setEditingVariable(variable);
    } else {
      console.error(`Variable not found: ${variableName}`);
    }
  };

  // Handle saving the edited variable
  const handleSaveVariable = (updatedVariable: DOWVariable) => {
    onSaveVariable(updatedVariable);
    setEditingVariable(null);
  };

  const VariableLegend = () => {
    return (
      <div className="text-xs flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-orange-50 border border-orange-200"></span>
          <span>Needs filling</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-50 border border-green-200"></span>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-yellow-100 ring-1 ring-yellow-400"></span>
          <span>Selected</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <PreviewActions 
        generatedDocument={generatedDocument} 
        variables={variables}
      />

      <ErrorDisplay 
        error={error} 
        missingVariables={missingVariables} 
      />
      
      <VariableLegend />
      
      <PreviewTabs
        generatedDocument={generatedDocument}
        templateContent={templateContent}
        variables={variables}
        highlightedVariables={highlightedVariables}
        onVariableClick={handleVariableSelection}
      />

      {/* Variable edit popup */}
      <VariableEditPopup
        isOpen={editingVariable !== null}
        onClose={() => setEditingVariable(null)}
        variable={editingVariable}
        onSave={handleSaveVariable}
      />
    </div>
  );
};

export default DOWPreview;
