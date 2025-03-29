
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formSchema, FormValues, validateProjectType, formatDate } from './schema';
import { Project } from './types';

export const useProjectEdit = (
  project: Project,
  onOpenChange: (open: boolean) => void,
  onProjectUpdated: () => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the date for the form
  const formattedDate = formatDate(project.dueDate);

  // Initialize form with project data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: project.title,
      client: project.client,
      location: project.location,
      due_date: formattedDate,
      project_type: validateProjectType(project.projectType),
      status: project.status,
      progress: project.progress,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          project_name: values.project_name,
          client: values.client,
          location: values.location,
          due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
          project_type: values.project_type,
          status: values.status,
          progress: values.progress,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: 'Project updated',
        description: 'Project details have been updated successfully.',
      });
      
      onOpenChange(false);
      onProjectUpdated();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project details.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting
  };
};
