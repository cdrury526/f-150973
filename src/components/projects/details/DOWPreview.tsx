
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
      
      // Replace all variable placeholders
      variables.forEach(variable => {
        if (variable.name) {
          const regex = new RegExp(`{{${variable.name}}}`, 'g');
          result = result.replace(regex, variable.value || `[${variable.name}]`);
        }
      });
      
      // Find any remaining unmatched variables
      const remainingVars = result.match(/{{[A-Z0-9_]+}}/g);
      if (remainingVars && remainingVars.length > 0) {
        // Just highlight them in the output, don't set an error
        remainingVars.forEach(match => {
          result = result.replace(match, `[${match}]`);
        });
      }
      
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Preview</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6 max-h-[600px] overflow-y-auto">
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
            <CardContent className="p-6">
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
