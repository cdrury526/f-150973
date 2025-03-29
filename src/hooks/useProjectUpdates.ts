
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectUpdate {
  id: string;
  project_id: string;
  update_text: string;
  created_at: string;
  update_type: string;
}

export const fetchProjectUpdates = async (projectId: string): Promise<ProjectUpdate[]> => {
  const { data, error } = await supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Error fetching project updates:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const useProjectUpdates = (projectId: string) => {
  return useQuery({
    queryKey: ['projectUpdates', projectId],
    queryFn: () => fetchProjectUpdates(projectId),
    enabled: !!projectId,
  });
};
