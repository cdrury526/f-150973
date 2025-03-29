
/**
 * DOW (Description of Work) Content component
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Components
import DOWForm from './DOWForm';
import DOWPreview from './DOWPreview';
import AuthWarning from './components/AuthWarning';
import TemplateUpload from './components/TemplateUpload';
import { TemplateNotFound, AuthError, GeneralError } from './components/ErrorStates';

// Custom hooks
import { useTemplateVariables } from './hooks/useTemplateVariables';

interface DOWContentProps {
  projectId: string;
}

const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Use our custom hook for template variables management
  const {
    templateQuery,
    variablesQuery,
    handleSave,
    setAutoPopulated,
    getSortedVariables
  } = useTemplateVariables(projectId);

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
      
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[600px] rounded-lg border"
      >
        {/* Left panel for the variables form */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="p-6 h-full overflow-auto">
            <h3 className="text-lg font-medium mb-4">Document Variables</h3>
            <DOWForm 
              projectId={projectId} 
              variables={variablesQuery.data || []}
              onSave={handleSave}
              getSortedVariables={getSortedVariables}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right panel for the document preview */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="p-6 h-full overflow-auto">
            <h3 className="text-lg font-medium mb-4">Document Preview</h3>
            <DOWPreview 
              variables={getSortedVariables()}
              templateContent={templateQuery.data || ''}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DOWContent;
