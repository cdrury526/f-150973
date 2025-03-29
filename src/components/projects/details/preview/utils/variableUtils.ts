
import { DOWVariable } from '../../DOWForm';

interface VariablePosition {
  varName: string;
  value: string;
  starts: number[];
  isMissing: boolean;
}

/**
 * Finds all variables with their positions in the document
 */
export const findVariablesInDocument = (
  generatedDocument: string,
  templateContent: string,
  variables: DOWVariable[]
): VariablePosition[] => {
  const variablePositions: VariablePosition[] = [];
  
  // For each variable, find all occurrences in the document
  variables.forEach(variable => {
    const value = variable.value || `[${variable.name}]`;
    const isMissing = !variable.value;
    
    // Find all occurrences of this value in the document
    let index = generatedDocument.indexOf(value);
    const starts: number[] = [];
    
    while (index !== -1) {
      starts.push(index);
      index = generatedDocument.indexOf(value, index + 1);
    }
    
    if (starts.length > 0) {
      variablePositions.push({
        varName: variable.name,
        value,
        starts,
        isMissing
      });
    }
  });
  
  return variablePositions;
};
