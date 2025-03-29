
import React from 'react';
import { DOWVariable } from '../types';
import PreviewActions from './components/PreviewActions';
import ErrorDisplay from './ErrorDisplay';
import PreviewTabs from './components/PreviewTabs';
import { useDocumentGenerator } from './hooks/useDocumentGenerator';
import { useVariableHighlighting } from './hooks/useVariableHighlighting';

interface DOWPreviewProps {
  variables: DOWVariable[];
  templateContent: string;
  onVariableClick?: (variableName: string) => void;
}

const DOWPreview: React.FC<DOWPreviewProps> = ({ 
  variables, 
  templateContent, 
  onVariableClick 
}) => {
  // Use our new hooks
  const { 
    generatedDocument, 
    error, 
    missingVariables 
  } = useDocumentGenerator({ variables, templateContent });
  
  const { 
    highlightedVariables, 
    handleVariableClick 
  } = useVariableHighlighting();

  // Handle variable selection and pass it to parent if needed
  const handleVariableSelection = (variableName: string) => {
    handleVariableClick(variableName, onVariableClick);
  };

  return (
    <div className="space-y-4">
      <PreviewActions 
        generatedDocument={generatedDocument} 
      />

      <ErrorDisplay 
        error={error} 
        missingVariables={missingVariables} 
      />
      
      <PreviewTabs
        generatedDocument={generatedDocument}
        templateContent={templateContent}
        variables={variables}
        highlightedVariables={highlightedVariables}
        onVariableClick={handleVariableSelection}
      />
    </div>
  );
};

export default DOWPreview;
