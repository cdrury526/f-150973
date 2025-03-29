import { useState, useEffect } from 'react';
import { DOWVariable } from '../../types';
import { generateDocument } from '../utils/documentGenerator';

interface UseDocumentGeneratorProps {
  variables: DOWVariable[];
  templateContent: string;
}

interface DocumentGeneratorResult {
  generatedDocument: string;
  error: string | null;
  missingVariables: string[];
  generateDocumentContent: () => void;
}

/**
 * Hook to handle document generation logic
 */
export const useDocumentGenerator = ({ 
  variables, 
  templateContent 
}: UseDocumentGeneratorProps): DocumentGeneratorResult => {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);

  // Generate document whenever variables or template changes
  useEffect(() => {
    generateDocumentContent();
  }, [variables, templateContent]);

  const generateDocumentContent = () => {
    try {
      // Skip generation if there's no template content
      if (!templateContent) {
        setGeneratedDocument('');
        setMissingVariables([]);
        return;
      }
      
      const result = generateDocument(templateContent, variables);
      setGeneratedDocument(result.document);
      setMissingVariables(result.missingVariables);
      setError(null);
    } catch (err) {
      console.error('Document generation error:', err);
      setError('Failed to generate document. Please check your variables and try again.');
      setGeneratedDocument('');
    }
  };

  return {
    generatedDocument,
    error,
    missingVariables,
    generateDocumentContent
  };
};
