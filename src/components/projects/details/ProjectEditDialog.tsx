
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define project type as an enum to match database expectations
const ProjectType = {
  NewBuild: "New Build",
  Remodel: "Remodel",
  Other: "Other"
} as const;

// Create a schema for form validation
const formSchema = z.object({
  project_name: z.string().min(1, { message: 'Project name is required' }),
  client: z.string().optional(),
  location: z.string().optional(),
  due_date: z.string().optional(),
  project_type: z.enum(["New Build", "Remodel", "Other"]),
  status: z.string(),
  progress: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).max(100)
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    client: string;
    location: string;
    status: string;
    progress: number;
    dueDate: string;
    projectType: string;
  };
  onProjectUpdated: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  open,
  onOpenChange,
  project,
  onProjectUpdated,
}) => {
  const { toast } = useToast();
  
  // Parse the date string to a proper ISO format for the date input
  let formattedDate = '';
  if (project.dueDate && project.dueDate !== 'No due date') {
    try {
      const dateObj = new Date(project.dueDate);
      formattedDate = dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error parsing date:', error);
    }
  }

  // Ensure project type matches one of the allowed values
  const validateProjectType = (type: string): "New Build" | "Remodel" | "Other" => {
    if (type === "New Build" || type === "Remodel" || type === "Other") {
      return type;
    }
    // Default to "Other" if not a valid type
    return "Other";
  };

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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Project location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Project status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="Project progress" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
