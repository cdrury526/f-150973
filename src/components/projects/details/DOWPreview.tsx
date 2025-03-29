
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
}

const DOWPreview: React.FC<DOWPreviewProps> = ({ variables, templateContent }) => {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
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
                {generatedDocument.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
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
