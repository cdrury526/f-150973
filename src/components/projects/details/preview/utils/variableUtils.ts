import React from 'react';
import { DOWVariable } from '../../types';

/**
 * Highlights variables in the document content
 * @param {string} content - The document content
 * @param {DOWVariable[]} variables - The variables to highlight
 * @returns {string} - The content with variables highlighted
 */
export const highlightVariables = (content: string, variables: DOWVariable[]): string => {
  let highlightedContent = content;
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    highlightedContent = highlightedContent.replace(regex, `<span class="variable-highlight">${variable.name}</span>`);
  });
  return highlightedContent;
};

/**
 * Replaces variables in the document content with their values
 * @param {string} content - The document content
 * @param {DOWVariable[]} variables - The variables to replace
 * @returns {string} - The content with variables replaced
 */
export const replaceVariables = (content: string, variables: DOWVariable[]): string => {
  let replacedContent = content;
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    replacedContent = replacedContent.replace(regex, variable.value);
  });
  return replacedContent;
};

/**
 * Wraps a variable name in a span for interactive highlighting
 * @param {string} variableName - The name of the variable
 * @param {boolean} highlighted - Whether the variable is highlighted
 * @param {Function} onClick - The function to call when the variable is clicked
 * @returns {React.ReactNode} - A React span element
 */
export const createInteractiveSpan = (
  variableName: string,
  highlighted: boolean,
  onClick: (variableName: string) => void
): React.ReactNode => {
  return (
    <span
      key={variableName}
      className={`variable-interactive ${highlighted ? 'variable-highlighted' : ''}`}
      onClick={() => onClick(variableName)}
    >
      {variableName}
    </span>
  );
};
