import { useState, useCallback } from 'react';

/**
 * Hook to manage variable highlighting state
 */
export const useVariableHighlighting = () => {
  const [highlightedVariables, setHighlightedVariables] = useState<Record<string, boolean>>({});
  const [lastClickedTime, setLastClickedTime] = useState<number>(0);

  const handleVariableClick = useCallback((varName: string, onVariableClick?: (name: string) => void) => {
    // Prevent double-clicks by checking the time since last click
    const now = Date.now();
    if (now - lastClickedTime < 300) { // 300ms threshold
      return;
    }
    setLastClickedTime(now);

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
  }, [lastClickedTime]);

  return {
    highlightedVariables,
    handleVariableClick
  };
};
