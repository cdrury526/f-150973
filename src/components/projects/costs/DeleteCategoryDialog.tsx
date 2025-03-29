
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CostCategory } from './types';

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToDelete: CostCategory | null;
  onDelete: () => Promise<void>;
}

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({ 
  open, 
  onOpenChange, 
  categoryToDelete, 
  onDelete 
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Cost Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the "{categoryToDelete?.name}" category from this project? 
            This will remove any cost data associated with this category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
