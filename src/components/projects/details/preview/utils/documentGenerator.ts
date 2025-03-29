
import { marked } from 'marked';
import { DOWVariable } from '../../types';

interface GenerateDocumentResult {
  document: string;
  missingVariables: string[];
}

/**
 * Generates the document by replacing variable placeholders with values
 */
export const generateDocument = (
  templateContent: string, 
  variables: DOWVariable[]
): GenerateDocumentResult => {
  if (!templateContent) {
    return {
      document: 'No template content available.',
      missingVariables: []
    };
  }

  let result = templateContent;
  
  // Find all variable placeholders in the template in order of appearance
  const allPlaceholders = result.match(/{{([A-Z0-9_]+)}}/g) || [];
  const allVarNames = allPlaceholders.map(p => p.replace(/{{|}}/g, ''));
  
  // Maintain the order of first appearance while removing duplicates
  const uniqueVarNames: string[] = [];
  allVarNames.forEach(varName => {
    if (!uniqueVarNames.includes(varName)) {
      uniqueVarNames.push(varName);
    }
  });
  
  // Create a map of variable names to values for quick lookup
  const varMap = new Map(variables.map(v => [v.name, v.value || `[${v.name}]`]));
  
  // Track missing variables
  const missing: string[] = [];
  
  // Replace all variable placeholders
  uniqueVarNames.forEach(varName => {
    const regex = new RegExp(`{{${varName}}}`, 'g');
    const value = varMap.get(varName);
    
    if (value) {
      result = result.replace(regex, value);
    } else {
      // This is a missing variable
      missing.push(varName);
      result = result.replace(regex, `[${varName}]`);
    }
  });
  
  // Remove markdown formatting symbols (# and **)
  result = result.replace(/#+\s*/g, ''); // Remove headings (# followed by space)
  result = result.replace(/\*\*/g, '');  // Remove bold formatting (**)
  
  return {
    document: result,
    missingVariables: missing
  };
};
