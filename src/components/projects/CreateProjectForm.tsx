
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Create form schema with validation
const formSchema = z.object({
  project_name: z.string().min(3, 'Project name must be at least 3 characters'),
  project_type: z.enum(['New Build', 'Remodel', 'Other']),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: '',
      project_type: 'New Build',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert the project into Supabase
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          project_name: data.project_name,
          project_type: data.project_type,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        toast({
          title: "Failed to create project",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Project created",
        description: `${data.project_name} has been created successfully`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter project name" 
                  {...field}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="New Build">New Build</SelectItem>
                  <SelectItem value="Remodel">Remodel</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
