
import { useState, useCallback } from 'react';

/**
 * Hook to manage variable highlighting state
 */
export const useVariableHighlighting = () => {
  const [highlightedVariables, setHighlightedVariables] = useState<Record<string, boolean>>({});

  const handleVariableClick = useCallback((varName: string, onVariableClick?: (name: string) => void) => {
    // Toggle highlight
    setHighlightedVariables(prev => {
      const newState = {...prev};
      // Clear other highlights
      Object.keys(newState).forEach(key => newState[key] = false);
      // Set this one
      newState[varName] = true;
      return newState;
    });
    
    // Notify parent component
    if (onVariableClick) {
      onVariableClick(varName);
    }
  }, []);

  return {
    highlightedVariables,
    handleVariableClick
  };
};
