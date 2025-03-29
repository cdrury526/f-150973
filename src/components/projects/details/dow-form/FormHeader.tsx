
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircle, Save, Building } from 'lucide-react';

interface BuilderProfile {
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
}

interface FormHeaderProps {
  autoSave: boolean;
  onAutoSaveChange: (value: boolean) => void;
  onAddVariable: () => void;
  onSave: () => void;
  builderProfile?: BuilderProfile | null;
  onPrepopulate?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  autoSave, 
  onAutoSaveChange, 
  onAddVariable, 
  onSave,
  builderProfile,
  onPrepopulate
}) => {
  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
      <div className="flex space-x-2">
        <Button
          type="button"
          onClick={onAddVariable}
          size="sm"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Variable
        </Button>
        
        {builderProfile && builderProfile.company_name && onPrepopulate && (
          <Button
            type="button"
            onClick={onPrepopulate}
            size="sm"
            variant="outline"
          >
            <Building className="h-4 w-4 mr-1" />
            Use Company Info
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={onAutoSaveChange}
          />
          <Label htmlFor="auto-save" className="cursor-pointer">Auto save</Label>
        </div>
        
        <Button
          type="button"
          onClick={onSave}
          size="sm"
          variant="default"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default FormHeader;
