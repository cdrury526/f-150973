
import React, { useEffect, useState } from 'react';
import DOWPreview from '../preview/DOWPreview';
import { DOWVariable } from '../types';

interface DOWPreviewPanelProps {
  variables: DOWVariable[];
  templateContent: string;
  onVariableClick: (variableName: string) => void;
}

const DOWPreviewPanel: React.FC<DOWPreviewPanelProps> = ({
  variables,
  templateContent,
  onVariableClick
}) => {
  // Use state to force re-render when variables change
  const [key, setKey] = useState(0);
  
  // Force a re-render when variables change to ensure preview updates
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [variables]);

  return (
    <div className="p-4 h-full overflow-hidden">
      <h3 className="text-base font-medium mb-3">Document Preview</h3>
      <DOWPreview 
        key={key}
        variables={variables}
        templateContent={templateContent}
        onVariableClick={onVariableClick}
      />
    </div>
  );
};

export default DOWPreviewPanel;
