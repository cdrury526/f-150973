
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './schema';

interface FormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const ProjectNameField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const ClientField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const LocationField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const DueDateField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const ProjectTypeField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const StatusField: React.FC<FormFieldsProps> = ({ form }) => (
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
);

export const ProgressField: React.FC<FormFieldsProps> = ({ form }) => (
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
);
