
import React, { useState, useEffect } from 'react';
import DOWForm, { DOWVariable } from './DOWForm';
import DOWPreview from './DOWPreview';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DOWContentProps {
  projectId: string;
}

// Function to fetch the template content from Supabase storage
const fetchTemplateContent = async (): Promise<string> => {
  try {
    console.log('Fetching template from Supabase storage');
    const { data, error } = await supabase
      .storage
      .from('document_templates')
      .download('construction-scope-of-work.md');
    
    if (error) {
      console.error('Supabase storage fetch error:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Template not found in storage bucket');
    }
    
    return await data.text();
  } catch (error) {
    console.error('Template fetch error:', error);
    
    // Check for RLS or auth-related errors
    if (error instanceof Error && 
       (error.message.includes('Permission denied') || 
        error.message.includes('not authorized'))) {
      throw new Error('You do not have permission to access this template. Please check your authentication status.');
    }
    
    throw new Error('Failed to load template from storage. The template may not be uploaded yet.');
  }
};

// Function to fetch project variables
const fetchProjectVariables = async (projectId: string): Promise<DOWVariable[]> => {
  const { data, error } = await supabase
    .from('project_variables')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value
  }));
};

// Function to save project variables
const saveProjectVariables = async (
  projectId: string, 
  variables: DOWVariable[]
): Promise<void> => {
  // First delete existing variables for this project
  const { error: deleteError } = await supabase
    .from('project_variables')
    .delete()
    .eq('project_id', projectId);

  if (deleteError) {
    throw new Error(`Failed to update variables: ${deleteError.message}`);
  }

  // Skip if no variables to insert
  if (variables.length === 0) return;

  // Then insert the new variables
  const { error: insertError } = await supabase
    .from('project_variables')
    .insert(
      variables.map(v => ({
        project_id: projectId,
        name: v.name,
        value: v.value
      }))
    );

  if (insertError) {
    throw new Error(`Failed to save variables: ${insertError.message}`);
  }
};

// Function to upload a template file to Supabase storage
const uploadTemplate = async (file: File): Promise<void> => {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    throw new Error('You must be logged in to upload templates');
  }
  
  const { error } = await supabase
    .storage
    .from('document_templates')
    .upload('construction-scope-of-work.md', file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Upload error details:', error);
    if (error.message.includes('Permission denied')) {
      throw new Error('You do not have permission to upload templates. Please check your authentication status.');
    }
    throw new Error(`Failed to upload template: ${error.message}`);
  }
};

const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAuthError('You are not logged in. Some features may be limited.');
      } else {
        setAuthError(null);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAuthError('You are not logged in. Some features may be limited.');
        } else {
          setAuthError(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Query to fetch the template content
  const templateQuery = useQuery({
    queryKey: ['dowTemplate'],
    queryFn: fetchTemplateContent,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000)
  });

  // Query to fetch project variables
  const variablesQuery = useQuery({
    queryKey: ['projectVariables', projectId],
    queryFn: () => fetchProjectVariables(projectId),
    enabled: !!projectId
  });

  // Mutation to save project variables
  const saveVariablesMutation = useMutation({
    mutationFn: (variables: DOWVariable[]) => saveProjectVariables(projectId, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectVariables', projectId] });
      toast({
        title: "Variables saved",
        description: "Project variables have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save variables",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const handleSave = (variables: DOWVariable[]) => {
    saveVariablesMutation.mutate(variables);
  };

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
      // Check authentication first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setUploadError('You must be logged in to upload templates');
        return;
      }
      
      await uploadTemplate(file);
      toast({
        title: "Template uploaded",
        description: "Document template has been uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['dowTemplate'] });
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

  // Loading state
  if (templateQuery.isLoading || variablesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Authentication warning banner
  const AuthWarning = () => authError ? (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <User className="h-4 w-4" />
      <AlertTitle>Authentication Notice</AlertTitle>
      <AlertDescription>{authError}</AlertDescription>
    </Alert>
  ) : null;

  // Template not found error state (specific case for first-time setup)
  if (templateQuery.error && templateQuery.error instanceof Error && 
      templateQuery.error.message.includes('Template not found')) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-md text-amber-800 space-y-4">
        <AuthWarning />
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 text-amber-600" />
          <div>
            <h3 className="text-lg font-medium mb-2">Template Not Found</h3>
            <p className="mb-4">No document template has been uploaded yet. Please upload a markdown template to continue.</p>
          </div>
        </div>
        
        {uploadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center gap-4">
          <Button 
            disabled={isUploading || !!authError}
            className="relative overflow-hidden" 
            onClick={() => document.getElementById('template-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Template'}
            <input
              id="template-upload"
              type="file"
              accept=".md"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleTemplateUpload}
              disabled={isUploading || !!authError}
            />
          </Button>
        </div>
      </div>
    );
  }

  // Authentication specific error state
  if (templateQuery.error && templateQuery.error instanceof Error && 
      (templateQuery.error.message.includes('Permission denied') || 
       templateQuery.error.message.includes('not authorized') ||
       templateQuery.error.message.includes('authentication'))) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-md text-destructive">
        <h3 className="text-lg font-medium mb-2">Authentication Error</h3>
        <p className="mb-4">You don't have permission to access this template.</p>
        <p>{templateQuery.error.message}</p>
        <div className="mt-4">
          <Button 
            variant="default" 
            onClick={() => window.location.href = '/auth/login'}
          >
            <User className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </div>
      </div>
    );
  }

  // General error state
  if (templateQuery.error || variablesQuery.error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-md text-destructive">
        <AuthWarning />
        <h3 className="text-lg font-medium mb-2">Error Loading DOW Content</h3>
        <p>{templateQuery.error instanceof Error ? templateQuery.error.message : 
            variablesQuery.error instanceof Error ? variablesQuery.error.message : 
            "An unknown error occurred"}</p>
        <div className="mt-4 flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              templateQuery.refetch();
              variablesQuery.refetch();
            }}
          >
            Retry
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => document.getElementById('template-upload')?.click()}
            disabled={!!authError}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Template
            <input
              id="template-upload"
              type="file"
              accept=".md"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleTemplateUpload}
              disabled={isUploading || !!authError}
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AuthWarning />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scope of Work Document</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => document.getElementById('template-upload')?.click()}
          disabled={!!authError}
        >
          <Upload className="h-4 w-4" />
          Update Template
          <input
            id="template-upload"
            type="file"
            accept=".md"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleTemplateUpload}
            disabled={isUploading || !!authError}
          />
        </Button>
      </div>
      
      <DOWForm 
        projectId={projectId} 
        variables={variablesQuery.data || []}
        onSave={handleSave}
      />
      
      <Separator />
      
      <DOWPreview 
        variables={variablesQuery.data || []}
        templateContent={templateQuery.data || ''}
      />
    </div>
  );
};

export default DOWContent;
