
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
      // Look for the card with the variable name
      const variableCard = Array.from(formRef.current.querySelectorAll('.variable-item'))
        .find(card => {
          const nameElement = card.querySelector('.variable-name');
          return nameElement && nameElement.textContent?.includes(variableName);
        });
      
      if (variableCard) {
        // Scroll the card into view with smooth behavior
        variableCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a visual highlight effect that fades out
        variableCard.classList.add('variable-highlight-pulse');
        setTimeout(() => {
          variableCard.classList.remove('variable-highlight-pulse');
        }, 1500);
        
        // Find and focus the input within this card
        const input = variableCard.querySelector('textarea');
        if (input) {
          input.focus();
        }
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
