
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from 'react-hook-form';

interface NotesInputProps {
  control: Control<any>;
}

const NotesInput: React.FC<NotesInputProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              placeholder="Add any relevant details about this cost"
              className="resize-none min-h-[80px]"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default NotesInput;
