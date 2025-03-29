
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectUpdate {
  id: string;
  project_id: string;
  update_text: string;
  created_at: string;
  update_type: string;
}

export const fetchProjectUpdates = async (projectId: string): Promise<ProjectUpdate[]> => {
  console.log('Fetching project updates for project:', projectId);
  
  const { data, error } = await supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching project updates:", error);
    throw new Error(error.message);
  }
  
  console.log('Project updates fetched:', data);
  return data || [];
};

// Helper function to log project updates - exported so it can be used by other hooks
export const logProjectUpdate = async (projectId: string, updateText: string, updateType: string) => {
  try {
    console.log("Logging project update:", { projectId, updateText, updateType });
    const { data, error } = await supabase
      .from('project_updates')
      .insert({
        project_id: projectId,
        update_text: updateText,
        update_type: updateType
      });
    
    if (error) {
      console.error("Error logging project update:", error);
      throw new Error(error.message);
    }
    
    console.log("Project update logged successfully:", data);
    return data;
  } catch (error) {
    console.error("Error logging project update:", error);
    throw error;
  }
};

export const useProjectUpdates = (projectId: string) => {
  const queryClient = useQueryClient();
  
  const result = useQuery({
    queryKey: ['projectUpdates', projectId],
    queryFn: () => fetchProjectUpdates(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  const addUpdate = async (updateText: string, updateType: string) => {
    try {
      await logProjectUpdate(projectId, updateText, updateType);
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['projectUpdates', projectId] });
    } catch (error) {
      console.error("Error adding update:", error);
      throw error;
    }
  };
  
  return {
    ...result,
    addUpdate
  };
};
