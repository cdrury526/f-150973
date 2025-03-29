
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import DOWEditPanel from './DOWEditPanel';
import DOWPreviewPanel from './DOWPreviewPanel';
import { DOWVariable } from '../types';

interface DocumentEditorProps {
  projectId: string;
  variables: DOWVariable[];
  templateContent: string;
  activeVariableName: string | null;
  formRef: React.RefObject<HTMLDivElement>;
  onVariableClick: (variableName: string) => void;
  onSave: (variables: DOWVariable[]) => void;
  getSortedVariables: () => DOWVariable[];
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  projectId,
  variables,
  templateContent,
  activeVariableName,
  formRef,
  onVariableClick,
  onSave,
  getSortedVariables
}) => {
  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="min-h-[600px] rounded-lg border"
    >
      {/* Left panel for the variables form */}
      <ResizablePanel defaultSize={50} minSize={40}>
        <DOWEditPanel 
          projectId={projectId}
          variables={variables}
          onSave={onSave}
          getSortedVariables={getSortedVariables}
          activeVariableName={activeVariableName}
          formRef={formRef}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Right panel for the document preview */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <DOWPreviewPanel
          variables={getSortedVariables()}
          templateContent={templateContent}
          onVariableClick={onVariableClick}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DocumentEditor;
