
/**
 * DOW (Description of Work) Content component
 */

import React, { useState, useEffect, useRef } from 'react';
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
  const [activeVariableName, setActiveVariableName] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

  // Handle variable click in preview
  const handleVariableClick = (variableName: string) => {
    setActiveVariableName(variableName);
    
    // Find and scroll to the variable input
    if (formRef.current) {
      // Look for an input with the variable name
      const input = formRef.current.querySelector(`[data-variable-name="${variableName}"]`);
      if (input) {
        // Scroll the input into view with smooth behavior
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a visual highlight effect that fades out
        (input as HTMLElement).classList.add('variable-highlight-pulse');
        setTimeout(() => {
          (input as HTMLElement).classList.remove('variable-highlight-pulse');
        }, 1500);
        
        // Focus the input
        (input as HTMLElement).focus();
      }
    }
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
      
      <style jsx global>{`
        .variable-highlight-pulse {
          animation: pulse-highlight 1.5s ease-in-out;
        }

        @keyframes pulse-highlight {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); 
            border-color: var(--border);
          }
          25% { 
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); 
            border-color: rgb(59, 130, 246);
          }
          75% { 
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); 
            border-color: rgb(59, 130, 246);
          }
        }
      `}</style>
      
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[600px] rounded-lg border"
      >
        {/* Left panel for the variables form */}
        <ResizablePanel defaultSize={50} minSize={40}>
          <div className="p-4 h-full overflow-auto" ref={formRef}>
            <h3 className="text-base font-medium mb-3">Document Variables</h3>
            <DOWForm 
              projectId={projectId} 
              variables={variablesQuery.data || []}
              onSave={handleSave}
              getSortedVariables={getSortedVariables}
              activeVariableName={activeVariableName}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right panel for the document preview */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="p-4 h-full overflow-auto">
            <h3 className="text-base font-medium mb-3">Document Preview</h3>
            <DOWPreview 
              variables={getSortedVariables()}
              templateContent={templateQuery.data || ''}
              onVariableClick={handleVariableClick}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DOWContent;
