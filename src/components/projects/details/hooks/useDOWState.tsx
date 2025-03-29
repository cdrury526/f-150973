
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTemplateVariables } from './useTemplateVariables';
import { DOWVariable } from '../types';

export function useDOWState(projectId: string) {
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

  return {
    // State
    uploadError,
    setUploadError,
    isUploading,
    setIsUploading,
    authError,
    activeVariableName,
    formRef,
    
    // Queries and functions from useTemplateVariables
    templateQuery,
    variablesQuery,
    handleSave,
    setAutoPopulated,
    getSortedVariables,
    
    // Handlers
    handleVariableClick,
    handleUploadClick
  };
}
