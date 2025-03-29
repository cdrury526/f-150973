
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import VariableItem from './VariableItem';
import { DOWVariable } from '../types';

interface VariableListProps {
  variables: DOWVariable[];
  activeVariableName: string | null;
  onUpdateVariable: (id: string, field: 'name' | 'value', newValue: string) => void;
  onRemoveVariable: (id: string) => void;
}

const VariableList: React.FC<VariableListProps> = ({
  variables,
  activeVariableName,
  onUpdateVariable,
  onRemoveVariable
}) => {
  if (variables.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="text-center py-6 text-muted-foreground">
            No variables added yet. Click "Add Variable" to start customizing your document.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
          {variables.map((variable) => (
            <VariableItem
              key={variable.id}
              variable={variable}
              activeVariableName={activeVariableName}
              onUpdate={onUpdateVariable}
              onRemove={onRemoveVariable}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableList;
