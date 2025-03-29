
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
    console.log(`Variable clicked: ${variableName}`);
    
    // Set the active variable name for highlighting
    setActiveVariableName(variableName);
    
    // Use setTimeout to ensure state has updated before trying to find the element
    setTimeout(() => {
      // Find and scroll to the variable input
      if (formRef.current) {
        console.log("formRef is available, looking for variable item");
        
        // Look for the card with the variable name
        const variableCard = Array.from(formRef.current.querySelectorAll('.variable-item'))
          .find(card => {
            const nameElement = card.querySelector('.variable-name');
            return nameElement && nameElement.textContent?.includes(variableName);
          });
        
        if (variableCard) {
          console.log(`Found variable card for ${variableName}, scrolling into view`);
          
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
            console.log("Found textarea, focusing");
            input.focus();
          } else {
            console.log("Could not find textarea to focus");
          }
        } else {
          console.log(`Could not find variable card for ${variableName}`);
        }
      } else {
        console.log("formRef is not available");
      }
    }, 100);
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
