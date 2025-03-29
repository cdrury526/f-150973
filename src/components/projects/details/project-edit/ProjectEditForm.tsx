
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader } from 'lucide-react';
import {
  ProjectNameField,
  ClientField,
  LocationField,
  DueDateField,
  ProjectTypeField,
  StatusField,
  ProgressField
} from './FormFields';
import { useProjectEdit } from './useProjectEdit';
import { ProjectEditDialogProps } from './types';

const ProjectEditForm: React.FC<ProjectEditDialogProps> = ({
  project,
  onOpenChange,
  onProjectUpdated
}) => {
  const { form, onSubmit, isSubmitting } = useProjectEdit(
    project,
    onOpenChange,
    onProjectUpdated
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ProjectNameField form={form} />
        <ClientField form={form} />
        <LocationField form={form} />
        <DueDateField form={form} />
        <ProjectTypeField form={form} />
        <StatusField form={form} />
        <ProgressField form={form} />
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProjectEditForm;
