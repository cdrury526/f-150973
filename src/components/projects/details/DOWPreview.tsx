
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DOWVariable } from './DOWForm';
import { Download, Copy, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface DOWPreviewProps {
  variables: DOWVariable[];
  templateContent: string;
  onVariableClick?: (variableName: string) => void;
}

const DOWPreview: React.FC<DOWPreviewProps> = ({ variables, templateContent, onVariableClick }) => {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [highlightedVariables, setHighlightedVariables] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    generateDocument();
  }, [variables, templateContent]);

  const generateDocument = () => {
    try {
      setError(null);
      if (!templateContent) {
        setGeneratedDocument('No template content available.');
        return;
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
      
      // Update missing variables state (in order of appearance in the document)
      setMissingVariables(missing);
      
      // Remove markdown formatting symbols (# and **)
      result = result.replace(/#+\s*/g, ''); // Remove headings (# followed by space)
      result = result.replace(/\*\*/g, '');  // Remove bold formatting (**)
      
      setGeneratedDocument(result);
    } catch (err) {
      console.error('Document generation error:', err);
      setError('Failed to generate document. Please check your variables and try again.');
      setGeneratedDocument('');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Document content has been copied to clipboard",
        });
      },
      (err) => {
        console.error('Copy failed:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scope-of-work.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // For the interactive preview with highlighted variables
  const renderDocumentWithInteractiveVariables = () => {
    if (!templateContent) return <p>No template content available.</p>;
    
    // Get all variables that appear in the template
    const allPlaceholders = templateContent.match(/{{([A-Z0-9_]+)}}/g) || [];
    const uniqueVarNames = [...new Set(allPlaceholders.map(p => p.replace(/{{|}}/g, '')))];
    
    // Create a map of variable names to values
    const varMap = new Map(variables.map(v => [v.name, v.value || `[${v.name}]`]));
    
    // Split the document by lines to maintain formatting
    const lines = generatedDocument.split('\n');
    
    return lines.map((line, lineIdx) => {
      // For each unique variable, check if it appears in the line
      const lineElements: React.ReactNode[] = [line];
      
      uniqueVarNames.forEach(varName => {
        // Check if this variable's value appears in the line
        const value = varMap.get(varName);
        if (!value || value === `[${varName}]`) return;
        
        // If the value is in this line, create interactive elements
        if (line.includes(value)) {
          // Split the line by this value to maintain surrounding text
          const parts = line.split(value);
          
          // Rebuild the line with interactive spans
          const newLineElements: React.ReactNode[] = [];
          
          parts.forEach((part, partIdx) => {
            // Add the text part
            if (part) newLineElements.push(part);
            
            // Add the interactive variable (except after the last part)
            if (partIdx < parts.length - 1) {
              newLineElements.push(
                <span 
                  key={`${lineIdx}-${varName}-${partIdx}`}
                  className={`cursor-pointer px-1 rounded-md ${highlightedVariables[varName] ? 'bg-yellow-200 dark:bg-yellow-800 ring-2 ring-yellow-400 dark:ring-yellow-600' : 'hover:bg-yellow-100 dark:hover:bg-yellow-900'}`}
                  onClick={() => {
                    // Toggle highlight
                    setHighlightedVariables(prev => ({
                      ...prev,
                      [varName]: !prev[varName]
                    }));
                    // Notify parent component
                    if (onVariableClick) {
                      onVariableClick(varName);
                    }
                  }}
                  title={`Click to edit ${varName}`}
                >
                  {value}
                </span>
              );
            }
          });
          
          lineElements.splice(0, 1, ...newLineElements);
        }
      });
      
      return (
        <React.Fragment key={lineIdx}>
          {lineElements}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center space-x-2">
        <Button variant="outline" onClick={handleCopyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {missingVariables.length > 0 && (
        <Alert variant="default" className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">The following variables are missing values:</p>
            <ul className="list-disc pl-5 mt-2">
              {missingVariables.map((varName) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-4 max-h-[500px] overflow-y-auto">
              <div className="prose max-w-none break-words whitespace-pre-wrap">
                {renderDocumentWithInteractiveVariables()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="raw">
          <Card>
            <CardContent className="p-4">
              <Textarea
                value={generatedDocument}
                readOnly
                className="font-mono text-sm min-h-[400px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DOWPreview;
