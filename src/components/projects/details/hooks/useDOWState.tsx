
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
  const previewScrollPosition = useRef<number>(0);

  // Use our custom hook for template variables management
  const {
    templateQuery,
    variablesQuery,
    handleSave,
    setAutoPopulated,
    getSortedVariables
  } = useTemplateVariables(projectId);

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
    
    // First, capture the current scroll position
    const previewElement = document.querySelector('.preview-container');
    if (previewElement) {
      previewScrollPosition.current = previewElement.scrollTop;
      console.log(`Saved scroll position: ${previewScrollPosition.current}`);
    }
    
    // Set the active variable name for highlighting
    setActiveVariableName(variableName);
    
    // Find and scroll to the variable input after a short delay
    setTimeout(() => {
      if (formRef.current) {
        console.log("formRef is available, looking for variable item");
        
        // Look for the card with the variable name data attribute
        const variableCard = formRef.current.querySelector(`.variable-item[data-variable-name="${variableName}"]`);
        
        if (variableCard) {
          console.log(`Found variable card for ${variableName}, scrolling into view`);
          
          // Use scrollIntoView with behavior: 'smooth' for better UX
          variableCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
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
          
          // Restore the preview's scroll position
          if (previewElement) {
            console.log(`Restoring scroll position to: ${previewScrollPosition.current}`);
            setTimeout(() => {
              previewElement.scrollTop = previewScrollPosition.current;
            }, 50);
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
