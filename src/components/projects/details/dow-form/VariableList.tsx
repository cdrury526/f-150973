
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import VariableItem from './VariableItem';
import { DOWVariable } from '../types';

interface VariableListProps {
  variables: DOWVariable[];
  activeVariableName: string | null;
  onUpdateVariable: (id: string, field: 'name' | 'value' | 'type', newValue: string) => void;
  onRemoveVariable: (id: string) => void;
  onSaveRequested?: () => void; // New prop for saving
}

const VariableList: React.FC<VariableListProps> = ({
  variables,
  activeVariableName,
  onUpdateVariable,
  onRemoveVariable,
  onSaveRequested
}) => {
  // If no variables, show a message
  if (variables.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No variables found. Add a variable to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-2 pr-4">
        {variables.map((variable) => (
          <VariableItem
            key={variable.id}
            variable={variable}
            activeVariableName={activeVariableName}
            onUpdate={onUpdateVariable}
            onRemove={onRemoveVariable}
            onSaveRequested={onSaveRequested}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default VariableList;
