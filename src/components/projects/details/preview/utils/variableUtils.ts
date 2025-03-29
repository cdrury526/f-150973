import { DOWVariable } from '../../types';

/**
 * Interface for variable position tracking in document
 */
export interface VariablePosition {
  varName: string;
  value: string;
  starts: number[];
  isMissing: boolean;
}

/**
 * Finds all occurrences of variables in the document
 * and tracks their positions for interactive highlighting
 */
export const findVariablesInDocument = (
  generatedDocument: string,
  templateContent: string,
  variables: DOWVariable[]
): VariablePosition[] => {
  if (!generatedDocument || !templateContent) {
    return [];
  }

  // Create a map of variable names to values for quick lookup
  const varMap = new Map(variables.map(v => [v.name, v.value || `[${v.name}]`]));
  
  // Extract all variable names from the template
  const variablePlaceholders = templateContent.match(/{{([A-Z0-9_]+)}}/g) || [];
  const variableNames = [...new Set(variablePlaceholders.map(p => p.replace(/{{|}}/g, '')))];
  
  // Find positions of all variable values in the generated document
  return variableNames.map(varName => {
    const value = varMap.get(varName) || `[${varName}]`;
    // A variable is missing if it doesn't exist or has an empty value
    // or if it just shows the default placeholder
    const isMissing = !varMap.get(varName) || 
                     varMap.get(varName) === '' || 
                     varMap.get(varName) === `[${varName}]`;
    
    // Find all occurrences of this variable's value in the document
    const starts: number[] = [];
    let pos = generatedDocument.indexOf(value);
    
    while (pos !== -1) {
      starts.push(pos);
      pos = generatedDocument.indexOf(value, pos + 1);
    }
    
    return {
      varName,
      value,
      starts,
      isMissing
    };
  });
};
