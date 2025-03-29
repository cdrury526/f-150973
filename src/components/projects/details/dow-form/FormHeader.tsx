
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Building, Save, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

interface FormHeaderProps {
  autoSave: boolean;
  onAutoSaveChange: (value: boolean) => void;
  onAddVariable: () => void;
  onSave: () => void;
  builderProfile?: {
    company_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone: string | null;
    website: string | null;
  } | null;
  isLoadingProfile?: boolean;
  onPrepopulate: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  autoSave,
  onAutoSaveChange,
  onAddVariable,
  onSave,
  builderProfile,
  isLoadingProfile = false,
  onPrepopulate
}) => {
  const hasCompanyInfo = builderProfile && builderProfile.company_name;

  return (
    <div className="flex items-center justify-between bg-card p-3 rounded-md border">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onAddVariable}>
          <Plus className="h-4 w-4 mr-1" />
          Add Variable
        </Button>
        
        {hasCompanyInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Building className="h-4 w-4 mr-1" />
                      Company Info
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium leading-none">Pre-fill Company Information</h4>
                      <p className="text-sm text-muted-foreground">
                        This will pre-populate the form with your company information from your account settings.
                      </p>
                      <div className="border-t pt-4">
                        <Button onClick={onPrepopulate} className="w-full">
                          <Check className="h-4 w-4 mr-2" />
                          Pre-fill Company Variables
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pre-fill with your company information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={onAutoSaveChange}
          />
          <Label htmlFor="auto-save">Auto-save</Label>
        </div>
        
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          Save Variables
        </Button>
      </div>
    </div>
  );
};

export default FormHeader;
