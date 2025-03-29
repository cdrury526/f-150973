
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Save } from "lucide-react";

interface FormHeaderProps {
  autoSave: boolean;
  onAutoSaveChange: (checked: boolean) => void;
  onAddVariable: () => void;
  onSave: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  autoSave,
  onAutoSaveChange,
  onAddVariable,
  onSave
}) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Autosave</span>
        <Switch
          checked={autoSave}
          onCheckedChange={onAutoSaveChange}
        />
      </div>
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onAddVariable}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Variable
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default FormHeader;
