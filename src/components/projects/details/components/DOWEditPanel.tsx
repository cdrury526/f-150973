import React from 'react';
import DOWForm from '../DOWForm';
import { DOWVariable } from '../types';
interface DOWEditPanelProps {
  projectId: string;
  variables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
  getSortedVariables: () => DOWVariable[];
  activeVariableName: string | null;
  formRef: React.RefObject<HTMLDivElement>;
}
const DOWEditPanel: React.FC<DOWEditPanelProps> = ({
  projectId,
  variables,
  onSave,
  getSortedVariables,
  activeVariableName,
  formRef
}) => {
  return <div ref={formRef} className="p-4 h-full overflow-auto px-[22px]">
      <h3 className="text-base font-medium mb-3">Document Variables</h3>
      <DOWForm projectId={projectId} variables={variables} onSave={onSave} getSortedVariables={getSortedVariables} activeVariableName={activeVariableName} />
    </div>;
};
export default DOWEditPanel;