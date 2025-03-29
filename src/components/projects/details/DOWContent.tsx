
/**
 * DOW (Description of Work) Content component
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Upload } from 'lucide-react';

// Components
import DOWForm from './DOWForm';
import DOWPreview from './DOWPreview';
import AuthWarning from './components/AuthWarning';
import TemplateUpload from './components/TemplateUpload';
import { TemplateNotFound, AuthError, GeneralError } from './components/ErrorStates';

// API functions
import { 
  fetchTemplateContent, 
  fetchProjectVariables, 
  saveProjectVariables
} from './api/dowApi';

// Utility functions
import { extractVariablesFromTemplate, mergeVariables } from './utils/dowTemplateUtils';

interface DOWContentProps {
  projectId: string;
}

const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [autoPopulated, setAutoPopulated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAuthError('You are not logged in. Some features may be limited.');
      } else {
        setAuthError(null);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAuthError('You are not logged in. Some features may be limited.');
        } else {
          setAuthError(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Query to fetch the template content
  const templateQuery = useQuery({
    queryKey: ['dowTemplate'],
    queryFn: fetchTemplateContent,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000)
  });

  // Query to fetch project variables
  const variablesQuery = useQuery({
    queryKey: ['projectVariables', projectId],
    queryFn: () => fetchProjectVariables(projectId),
    enabled: !!projectId
  });

  // Mutation to save project variables
  const saveVariablesMutation = useMutation({
    mutationFn: (variables: DOWVariable[]) => saveProjectVariables(projectId, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectVariables', projectId] });
      toast({
        title: "Variables saved",
        description: "Project variables have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save variables",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Effect to auto-extract and update variables when template and project variables are loaded
  useEffect(() => {
    // Only proceed if we have the template content, variables are loaded, and we haven't auto-populated yet
    if (
      templateQuery.data && 
      variablesQuery.data && 
      !autoPopulated && 
      !templateQuery.isLoading && 
      !variablesQuery.isLoading
    ) {
      const extractedVarNames = extractVariablesFromTemplate(templateQuery.data);
      
      // Skip if no variables to extract
      if (extractedVarNames.length === 0) return;
      
      // Check if we need to add new variables
      const existingVarMap = new Map(variablesQuery.data.map(v => [v.name, true]));
      const newVarsNeeded = extractedVarNames.some(name => !existingVarMap.has(name));
      
      if (newVarsNeeded) {
        // Add extracted variables to existing ones
        const mergedVariables = mergeVariables(variablesQuery.data, extractedVarNames);
        
        // Save the merged variables back to the database
        saveVariablesMutation.mutate(mergedVariables);
        toast({
          title: "Variables extracted",
          description: `${extractedVarNames.length - existingVarMap.size} new variables were automatically extracted from the template`,
        });
      }
      
      // Mark as auto-populated to prevent repeated processing
      setAutoPopulated(true);
    }
  }, [templateQuery.data, variablesQuery.data, templateQuery.isLoading, variablesQuery.isLoading, autoPopulated]);

  // Reset auto-populated flag if template changes
  useEffect(() => {
    if (templateQuery.isFetching) {
      setAutoPopulated(false);
    }
  }, [templateQuery.isFetching]);

  const handleSave = (variables: DOWVariable[]) => {
    saveVariablesMutation.mutate(variables);
  };
  
  const handleUploadClick = () => {
    document.getElementById('template-upload')?.click();
  };

  // Loading state
  if (templateQuery.isLoading || variablesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Template not found error state (specific case for first-time setup)
  if (templateQuery.error && templateQuery.error instanceof Error && 
      templateQuery.error.message.includes('Template not found')) {
    return (
      <TemplateNotFound 
        authError={authError}
        uploadError={uploadError}
        isUploading={isUploading}
        onUploadClick={handleUploadClick}
      />
    );
  }

  // Authentication specific error state
  if (templateQuery.error && templateQuery.error instanceof Error && 
      (templateQuery.error.message.includes('Permission denied') || 
       templateQuery.error.message.includes('not authorized') ||
       templateQuery.error.message.includes('authentication'))) {
    return <AuthError error={templateQuery.error} />;
  }

  // General error state
  if (templateQuery.error || variablesQuery.error) {
    return (
      <GeneralError 
        error={templateQuery.error || variablesQuery.error}
        onRetry={() => {
          templateQuery.refetch();
          variablesQuery.refetch();
        }}
        onUploadClick={handleUploadClick}
        authError={authError}
      />
    );
  }

  return (
    <div className="space-y-8">
      <AuthWarning authError={authError} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scope of Work Document</h2>
        <TemplateUpload 
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          authError={authError}
          setUploadError={setUploadError}
          setAutoPopulated={setAutoPopulated}
        />
        <input
          id="template-upload"
          type="file"
          accept=".md"
          className="hidden"
          onChange={(e) => {
            if (e.target) {
              const templateUploadInput = e.target as HTMLInputElement;
              if (templateUploadInput.files && templateUploadInput.files.length > 0) {
                const customEvent = {
                  target: templateUploadInput
                } as React.ChangeEvent<HTMLInputElement>;
                
                const templateUploadComponent = document.querySelector('[id^="template-upload"]');
                if (templateUploadComponent) {
                  const changeHandler = (templateUploadComponent as any).onchange;
                  if (changeHandler) {
                    changeHandler(customEvent);
                  }
                }
              }
            }
          }}
          disabled={isUploading || !!authError}
        />
      </div>
      
      <DOWForm 
        projectId={projectId} 
        variables={variablesQuery.data || []}
        onSave={handleSave}
      />
      
      <Separator />
      
      <DOWPreview 
        variables={variablesQuery.data || []}
        templateContent={templateQuery.data || ''}
      />
    </div>
  );
};

export default DOWContent;
