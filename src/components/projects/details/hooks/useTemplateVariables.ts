import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DOWVariable } from '../types';
import { 
  fetchTemplateContent, 
  fetchProjectVariables, 
  saveProjectVariables 
} from '../api/dowApi';
import { 
  extractVariablesFromTemplate, 
  mergeVariables,
  getVariablesInTemplateOrder
} from '../utils/dowTemplateUtils';

/**
 * Custom hook to manage template variables extraction and handling
 */
export function useTemplateVariables(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [autoPopulated, setAutoPopulated] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [localVariables, setLocalVariables] = useState<DOWVariable[]>([]);

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
  } as UseQueryOptions<DOWVariable[], Error>);

  // Update local variables when query data changes
  useEffect(() => {
    if (variablesQuery.data) {
      setLocalVariables(variablesQuery.data);
    }
  }, [variablesQuery.data]);

  // Save the original order of variables from the template when it loads
  useEffect(() => {
    if (templateQuery.data && !templateQuery.isLoading) {
      // Extract variables preserving order but removing duplicates
      const extractedVarOrder = extractVariablesFromTemplate(templateQuery.data);
      setOriginalOrder(extractedVarOrder);
    }
  }, [templateQuery.data, templateQuery.isLoading]);

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

  // Effect to auto-extract and update variables when template and project variables are loaded
  useEffect(() => {
    // Only proceed if we have the template content, variables are loaded, and we haven't auto-populated yet
    if (
      templateQuery.data && 
      variablesQuery.data && 
      !autoPopulated && 
      !templateQuery.isLoading && 
      !variablesQuery.isLoading
    ) {
      const extractedVarNames = extractVariablesFromTemplate(templateQuery.data);
      
      // Skip if no variables to extract
      if (extractedVarNames.length === 0) return;
      
      // Check if we need to add new variables
      const existingVarMap = new Map(variablesQuery.data.map(v => [v.name, true]));
      const newVarsNeeded = extractedVarNames.some(name => !existingVarMap.has(name));
      
      if (newVarsNeeded) {
        // Add extracted variables to existing ones
        const mergedVariables = mergeVariables(variablesQuery.data, extractedVarNames);
        
        // Save the merged variables back to the database
        saveVariablesMutation.mutate(mergedVariables);
        setLocalVariables(mergedVariables);
        toast({
          title: "Variables extracted",
          description: `${extractedVarNames.length - existingVarMap.size} new variables were automatically extracted from the template`,
        });
      }
      
      // Mark as auto-populated to prevent repeated processing
      setAutoPopulated(true);
    }
  }, [templateQuery.data, variablesQuery.data, autoPopulated, templateQuery.isLoading, variablesQuery.isLoading]);

  // Reset auto-populated flag if template changes
  useEffect(() => {
    if (templateQuery.isFetching) {
      setAutoPopulated(false);
    }
  }, [templateQuery.isFetching]);

  const handleSave = (variables: DOWVariable[]) => {
    setLocalVariables(variables);
    saveVariablesMutation.mutate(variables);
  };

  // Sort variables according to their appearance in the template
  const getSortedVariables = (): DOWVariable[] => {
    if (!localVariables.length) {
      return variablesQuery.data || [];
    }
    
    return getVariablesInTemplateOrder(localVariables, originalOrder);
  };

  return {
    templateQuery,
    variablesQuery,
    saveVariablesMutation,
    autoPopulated,
    setAutoPopulated,
    handleSave,
    getSortedVariables
  };
}
