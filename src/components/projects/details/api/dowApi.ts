
/**
 * API functions for DOW template management
 */

import { DOWVariable } from '../DOWForm';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the template content from Supabase storage
 */
export const fetchTemplateContent = async (): Promise<string> => {
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

/**
 * Fetches project variables from Supabase
 */
export const fetchProjectVariables = async (projectId: string): Promise<DOWVariable[]> => {
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

/**
 * Saves project variables to Supabase
 */
export const saveProjectVariables = async (
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

/**
 * Uploads a template file to Supabase storage
 */
export const uploadTemplate = async (file: File): Promise<void> => {
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
