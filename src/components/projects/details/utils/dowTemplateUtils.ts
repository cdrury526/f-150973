/**
 * Utility functions for DOW template handling
 */

import { v4 as uuidv4 } from 'uuid';
import { DOWVariable } from '../types';

/**
 * Extracts variable names from a template content
 * @param content The template content to extract variables from
 * @param preserveOrder If true, returns variables in the order they appear in the template
 */
export const extractVariablesFromTemplate = (content: string, preserveOrder: boolean = false): string[] => {
  const regex = /{{([A-Z0-9_]+)}}/g;
  let match;
  const matches: string[] = [];
  const uniqueMatches = new Set<string>();
  
  // Extract all variable matches in order of appearance
  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    if (preserveOrder) {
      // For preserving order, add all occurrences
      matches.push(varName);
    } else if (!uniqueMatches.has(varName)) {
      // For unique list, only add first occurrence
      matches.push(varName);
      uniqueMatches.add(varName);
    }
  }
  
  // If preserveOrder is false, remove duplicates while maintaining order
  if (!preserveOrder) {
    return [...new Set(matches)];
  }
  
  return matches;
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

/**
 * Gets variables in the order they first appear in the template
 */
export const getVariablesInTemplateOrder = (
  variables: DOWVariable[],
  originalOrder: string[]
): DOWVariable[] => {
  if (!variables?.length || !originalOrder?.length) {
    return variables || [];
  }

  // Create a map for quick lookup
  const variableMap = new Map(variables.map(v => [v.name, v]));
  
  // First add variables in the order they appear in the template
  const result: DOWVariable[] = [];
  
  // Add variables in the order they appear in the template, without duplicates
  const processed = new Set<string>();
  originalOrder.forEach(name => {
    if (variableMap.has(name) && !processed.has(name)) {
      result.push(variableMap.get(name)!);
      processed.add(name);
      variableMap.delete(name);
    }
  });
  
  // Add any remaining variables that might not be in the template
  const remainingVars = Array.from(variableMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  result.push(...remainingVars);
  
  return result;
};
