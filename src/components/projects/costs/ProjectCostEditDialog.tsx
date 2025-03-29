import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { ProjectCost } from './types';
import { Contractor } from '@/components/projects/contractors/types';
import { fetchContractors } from '@/components/projects/contractors/api/contractorsApi';

interface ProjectCostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCost: ProjectCost | null;
  onSave: (values: {
    quote_price: number;
    actual_price: number;
    notes: string;
    contractor_id?: string;
  }) => Promise<void>;
}

const ProjectCostEditDialog: React.FC<ProjectCostEditDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingCost, 
  onSave 
}) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(false);

  const costForm = useForm({
    defaultValues: {
      quote_price: editingCost?.quote_price || 0,
      actual_price: editingCost?.actual_price || 0,
      notes: editingCost?.notes || '',
      contractor_id: editingCost?.contractor_id || ''
    }
  });

  // Fetch contractors when the dialog opens
  useEffect(() => {
    const getContractors = async () => {
      setIsLoadingContractors(true);
      try {
        const contractorsData = await fetchContractors();
        setContractors(contractorsData);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setIsLoadingContractors(false);
      }
    };

    if (open) {
      getContractors();
    }
  }, [open]);

  const formatNumberWithCommas = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  React.useEffect(() => {
    if (editingCost) {
      costForm.reset({
        quote_price: editingCost.quote_price,
        actual_price: editingCost.actual_price || 0,
        notes: editingCost.notes || '',
        contractor_id: editingCost.contractor_id || ''
      });
    }
  }, [editingCost, costForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {editingCost?.category_name} Costs</DialogTitle>
        </DialogHeader>
        <Form {...costForm}>
          <form onSubmit={costForm.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={costForm.control}
              name="quote_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-0 flex h-10 items-center pl-3 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <Input 
                        type="text"
                        value={formatNumberWithCommas(field.value)}
                        onChange={(e) => {
                          const rawValue = parseFormattedNumber(e.target.value);
                          field.onChange(rawValue);
                        }}
                        className="pl-8 text-right font-medium"
                        placeholder="0.00"
                        inputMode="numeric"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The estimated price quoted to the client
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={costForm.control}
              name="actual_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-0 flex h-10 items-center pl-3 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <Input 
                        type="text"
                        value={formatNumberWithCommas(field.value)}
                        onChange={(e) => {
                          const rawValue = parseFormattedNumber(e.target.value);
                          field.onChange(rawValue);
                        }}
                        className="pl-8 text-right font-medium"
                        placeholder="0.00"
                        inputMode="numeric"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The actual amount paid
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={costForm.control}
              name="contractor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractor</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contractor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {contractors.map((contractor) => (
                          <SelectItem key={contractor.id} value={contractor.id}>
                            {contractor.companyName} - {contractor.contractorType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The contractor assigned to this work
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={costForm.control}
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
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCostEditDialog;
