import React from 'react';
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
  return (
    <div className="p-4 h-full overflow-auto">
      <h3 className="text-base font-medium mb-3">Document Preview</h3>
      <DOWPreview 
        variables={variables}
        templateContent={templateContent}
        onVariableClick={onVariableClick}
      />
    </div>
  );
};

export default DOWPreviewPanel;
