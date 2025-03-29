
import React, { useEffect, useState, useCallback } from 'react';
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

  // Enhanced version of the interactive preview renderer
  const renderDocumentWithInteractiveVariables = useCallback(() => {
    if (!templateContent) return <p>No template content available.</p>;
    
    // Get all variables that appear in the template
    const allPlaceholders = templateContent.match(/{{([A-Z0-9_]+)}}/g) || [];
    const uniqueVarNames = [...new Set(allPlaceholders.map(p => p.replace(/{{|}}/g, '')))];
    
    // Create a map of variable names to values and tracking info
    const varMap = new Map(variables.map(v => [
      v.name, 
      { 
        value: v.value || `[${v.name}]`, 
        isHighlighted: highlightedVariables[v.name] || false,
        isMissing: !v.value
      }
    ]));
    
    // Split the document by lines to maintain formatting
    const lines = generatedDocument.split('\n');
    
    // Find all variables with their positions in the generated document
    // This is critical for making variables clickable in the preview
    const variablePositions: Array<{
      varName: string,
      value: string,
      starts: number[],
      isMissing: boolean
    }> = [];
    
    // For each variable, find all occurrences in the document
    variables.forEach(variable => {
      const value = variable.value || `[${variable.name}]`;
      const isMissing = !variable.value;
      
      // Skip empty values or placeholder values
      if (value === `[${variable.name}]`) return;
      
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
    
    return (
      <div className="space-y-1">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <br key={`line-${lineIdx}`} />;
          
          // Calculate the start and end positions of this line in the document
          const prevLinesLength = lines.slice(0, lineIdx).join('\n').length + (lineIdx > 0 ? 1 : 0); // +1 for each newline
          const lineStartPos = prevLinesLength;
          const lineEndPos = lineStartPos + line.length;
          
          // Find variables that appear in this line
          const varsInLine = variablePositions.filter(vp => 
            vp.starts.some(start => 
              start >= lineStartPos && start < lineEndPos
            )
          );
          
          // If no variables in this line, just render the line as is
          if (varsInLine.length === 0) {
            return <div key={`line-${lineIdx}`} className="py-1">{line}</div>;
          }
          
          // Create segments of text and interactive spans
          const segments: React.ReactNode[] = [];
          let currentPos = 0; // Position within the line
          
          // Sort all variable occurrences in this line by their start position
          const allOccurrences: Array<{
            varName: string,
            value: string,
            startInLine: number,
            endInLine: number,
            isMissing: boolean,
            isHighlighted: boolean
          }> = [];
          
          varsInLine.forEach(vp => {
            vp.starts.forEach(start => {
              const startInLine = start - lineStartPos;
              
              // Only include if it starts within this line
              if (startInLine >= 0 && startInLine < line.length) {
                allOccurrences.push({
                  varName: vp.varName,
                  value: vp.value,
                  startInLine,
                  endInLine: startInLine + vp.value.length,
                  isMissing: vp.isMissing,
                  isHighlighted: highlightedVariables[vp.varName] || false
                });
              }
            });
          });
          
          // Sort by start position
          allOccurrences.sort((a, b) => a.startInLine - b.startInLine);
          
          // Handle overlapping occurrences (should be rare, but possible)
          const filteredOccurrences = allOccurrences.filter((occ, idx, arr) => {
            if (idx === 0) return true;
            
            // Skip if this occurrence overlaps with the previous one
            const prevOcc = arr[idx - 1];
            return occ.startInLine >= prevOcc.endInLine;
          });
          
          // Create segments
          let lastEnd = 0;
          filteredOccurrences.forEach((occ, idx) => {
            // Add text before this variable
            if (occ.startInLine > lastEnd) {
              segments.push(
                <span key={`text-${lineIdx}-${idx}`}>
                  {line.substring(lastEnd, occ.startInLine)}
                </span>
              );
            }
            
            // Add the clickable variable span
            segments.push(
              <span 
                key={`var-${occ.varName}-${idx}`}
                className={`
                  cursor-pointer px-1 rounded-md border 
                  ${occ.isHighlighted ? 
                    'bg-yellow-100 dark:bg-yellow-900 ring-2 ring-yellow-400 dark:ring-yellow-600' : 
                    'hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:border-yellow-200'
                  }
                  transition-all duration-150
                `}
                onClick={() => {
                  // Toggle highlight
                  setHighlightedVariables(prev => {
                    const newState = {...prev};
                    // Clear other highlights
                    Object.keys(newState).forEach(key => newState[key] = false);
                    // Set this one
                    newState[occ.varName] = true;
                    return newState;
                  });
                  
                  // Notify parent component
                  if (onVariableClick) {
                    onVariableClick(occ.varName);
                  }
                }}
                title={`Click to edit ${occ.varName}`}
              >
                {occ.value}
              </span>
            );
            
            lastEnd = occ.endInLine;
          });
          
          // Add any remaining text after the last variable
          if (lastEnd < line.length) {
            segments.push(
              <span key={`text-${lineIdx}-end`}>
                {line.substring(lastEnd)}
              </span>
            );
          }
          
          // Show a highlight for lines with active variables
          const hasHighlightedVars = filteredOccurrences.some(occ => occ.isHighlighted);
          
          return (
            <div 
              key={`line-${lineIdx}`} 
              className={`py-1 ${hasHighlightedVars ? 'pl-2 border-l-2 border-yellow-300' : ''}`}
            >
              {segments}
            </div>
          );
        })}
      </div>
    );
  }, [generatedDocument, templateContent, variables, highlightedVariables, onVariableClick]);

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
