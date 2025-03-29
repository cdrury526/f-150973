import React from 'react';
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import DOWPreviewPanel from './DOWPreviewPanel';
import { DOWVariable } from '../types';

interface DocumentEditorProps {
  projectId: string;
  variables: DOWVariable[];
  templateContent: string;
  onSaveVariable: (variable: DOWVariable) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  projectId,
  variables,
  templateContent,
  onSaveVariable
}) => {
  const handleSaveVariable = (updatedVariable: DOWVariable) => {
    console.log('Saving variable:', updatedVariable);
    onSaveVariable(updatedVariable);
  };

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="min-h-[600px] rounded-lg border"
    >
      {/* Single panel for the preview */}
      <ResizablePanel defaultSize={100} minSize={60}>
        <DOWPreviewPanel
          variables={variables}
          templateContent={templateContent}
          onSaveVariable={handleSaveVariable}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DocumentEditor;
