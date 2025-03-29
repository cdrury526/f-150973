
/**
 * Template upload component
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { uploadTemplate } from '../api/dowApi';

interface TemplateUploadProps {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  authError: string | null;
  setUploadError: (value: string | null) => void;
  setAutoPopulated: (value: boolean) => void;
}

const TemplateUpload: React.FC<TemplateUploadProps> = ({ 
  isUploading, 
  setIsUploading, 
  authError, 
  setUploadError,
  setAutoPopulated
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) return;
    
    // Check if it's a markdown file
    if (!file.name.endsWith('.md')) {
      setUploadError('Please upload a Markdown (.md) file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadTemplate(file);
      toast({
        title: "Template uploaded",
        description: "Document template has been uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['dowTemplate'] });
      
      // Reset auto-populated to allow new variables extraction
      setAutoPopulated(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during upload";
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 relative overflow-hidden"
      onClick={() => document.getElementById('template-upload')?.click()}
      disabled={!!authError || isUploading}
    >
      <Upload className="h-4 w-4" />
      {isUploading ? 'Uploading...' : 'Update Template'}
      <input
        id="template-upload"
        type="file"
        accept=".md"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleTemplateUpload}
        disabled={isUploading || !!authError}
      />
    </Button>
  );
};

export default TemplateUpload;
