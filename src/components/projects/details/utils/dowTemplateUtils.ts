
/**
 * Utility functions for the DOW template management
 */

import { DOWVariable } from '../DOWForm';

/**
 * Extracts variable names from a template content
 */
export const extractVariablesFromTemplate = (content: string): string[] => {
  const regex = /{{([A-Z0-9_]+)}}/g;
  const matches = content.match(regex) || [];
  
  // Extract variable names and remove duplicates
  return [...new Set(matches.map(match => match.replace(/{{|}}/g, '')))];
};

/**
 * Merges existing variables with extracted ones
 */
export const mergeVariables = (
  existingVariables: DOWVariable[], 
  extractedVarNames: string[]
): DOWVariable[] => {
  // Create a map of existing variables for quick lookup
  const existingVarMap = new Map(
    existingVariables.map(v => [v.name, v])
  );
  
  // Start with existing variables
  const result = [...existingVariables];
  
  // Add any extracted variables that don't exist yet
  extractedVarNames.forEach(name => {
    if (!existingVarMap.has(name)) {
      result.push({
        id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        value: ''
      });
    }
  });
  
  return result;
};
