
import React, { useState, useEffect } from 'react';
import DOWForm, { DOWVariable } from './DOWForm';
import DOWPreview from './DOWPreview';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface DOWContentProps {
  projectId: string;
}

// Function to fetch the template content
const fetchTemplateContent = async (): Promise<string> => {
  const response = await fetch('/REFERENCE DOCS/construction-scope-of-work.md');
  if (!response.ok) {
    throw new Error('Failed to load template document');
  }
  return response.text();
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

const DOWContent: React.FC<DOWContentProps> = ({ projectId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the template content
  const templateQuery = useQuery({
    queryKey: ['dowTemplate'],
    queryFn: fetchTemplateContent
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

  // Loading state
  if (templateQuery.isLoading || variablesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (templateQuery.error || variablesQuery.error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive rounded-md text-destructive">
        <h3 className="text-lg font-medium mb-2">Error Loading DOW Content</h3>
        <p>{templateQuery.error instanceof Error ? templateQuery.error.message : 
            variablesQuery.error instanceof Error ? variablesQuery.error.message : 
            "An unknown error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
