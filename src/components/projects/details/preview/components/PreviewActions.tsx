
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PreviewActionsProps {
  generatedDocument: string;
}

const PreviewActions: React.FC<PreviewActionsProps> = ({ generatedDocument }) => {
  const { toast } = useToast();

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
  );
};

export default PreviewActions;
