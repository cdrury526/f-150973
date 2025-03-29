
import React from 'react';
import { DOWVariable } from './types';
import FormHeader from './dow-form/FormHeader';
import ValidationErrors from './dow-form/ValidationErrors';
import VariableList from './dow-form/VariableList';
import { useDOWForm } from './dow-form/useDOWForm';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface BuilderProfile {
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
}

interface DOWFormProps {
  projectId: string;
  variables: DOWVariable[];
  onSave: (variables: DOWVariable[]) => void;
  getSortedVariables?: () => DOWVariable[]; // Prop for getting variables in order
  activeVariableName?: string | null; // New prop for highlighting active variable
}

const DOWForm: React.FC<DOWFormProps> = ({ 
  projectId, 
  variables: initialVariables, 
  onSave,
  getSortedVariables,
  activeVariableName 
}) => {
  const { user, userRole } = useAuth();
  const [builderProfile, setBuilderProfile] = useState<BuilderProfile | null>(null);

  const {
    variables,
    autoSave,
    errors,
    setAutoSave,
    addVariable,
    removeVariable,
    updateVariable,
    handleSave,
    saveVariables,
    prepopulateCompanyInfo,
  } = useDOWForm({
    initialVariables,
    onSave
  });

  // Fetch builder profile when component mounts
  useEffect(() => {
    if (user && (userRole === 'builder' || userRole === 'admin')) {
      const fetchBuilderProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('builder_profiles')
            .select('company_name, address, city, state, zip_code, phone, website')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching builder profile:', error);
            return;
          }
          
          if (data) {
            setBuilderProfile(data);
            
            // Check if any variables match company info fields and offer to prepopulate
            const companyInfoVars = variables.filter(v => 
              v.name.toLowerCase().includes('company') || 
              v.name.toLowerCase().includes('address') ||
              v.name.toLowerCase().includes('phone') ||
              v.name.toLowerCase().includes('website') ||
              v.name.toLowerCase().includes('city') ||
              v.name.toLowerCase().includes('state') ||
              v.name.toLowerCase().includes('zip')
            );
            
            if (companyInfoVars.length > 0 && data.company_name) {
              prepopulateCompanyInfo(data);
            }
          }
        } catch (err) {
          console.error('Error:', err);
        }
      };
      
      fetchBuilderProfile();
    }
  }, [user, userRole]);

  // Get variables in the proper order for display
  const displayVariables = getSortedVariables ? getSortedVariables() : variables;

  return (
    <div className="space-y-4">
      <FormHeader
        autoSave={autoSave}
        onAutoSaveChange={setAutoSave}
        onAddVariable={addVariable}
        onSave={handleSave}
        builderProfile={builderProfile}
        onPrepopulate={() => builderProfile && prepopulateCompanyInfo(builderProfile)}
      />
      
      <ValidationErrors errors={errors} />
      
      <VariableList
        variables={displayVariables}
        activeVariableName={activeVariableName || null}
        onUpdateVariable={updateVariable}
        onRemoveVariable={removeVariable}
        onSaveRequested={() => saveVariables(true)} 
      />
    </div>
  );
};

export default DOWForm;
