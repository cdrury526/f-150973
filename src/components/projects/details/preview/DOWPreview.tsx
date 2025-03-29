
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DOWVariable } from '../DOWForm';
import { useToast } from "@/hooks/use-toast";
import PreviewActions from './PreviewActions';
import ErrorDisplay from './ErrorDisplay';
import InteractivePreview from './InteractivePreview';
import RawPreview from './RawPreview';
import { generateDocument } from './utils/documentGenerator';

interface DOWPreviewProps {
  variables: DOWVariable[];
  templateContent: string;
  onVariableClick?: (variableName: string) => void;
}

const DOWPreview: React.FC<DOWPreviewProps> = ({ 
  variables, 
  templateContent, 
  onVariableClick 
}) => {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [highlightedVariables, setHighlightedVariables] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    generateDocumentContent();
  }, [variables, templateContent]);

  const generateDocumentContent = () => {
    try {
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

  const handleVariableClick = useCallback((varName: string) => {
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
  }, [onVariableClick]);

  return (
    <div className="space-y-4">
      <PreviewActions 
        generatedDocument={generatedDocument} 
      />

      <ErrorDisplay 
        error={error} 
        missingVariables={missingVariables} 
      />
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-4 max-h-[500px] overflow-y-auto">
              <div className="prose max-w-none break-words whitespace-pre-wrap">
                <InteractivePreview 
                  generatedDocument={generatedDocument}
                  templateContent={templateContent}
                  variables={variables}
                  highlightedVariables={highlightedVariables}
                  onVariableClick={handleVariableClick}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="raw">
          <RawPreview 
            generatedDocument={generatedDocument} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DOWPreview;
