
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({ 
  onCancel,
  isSubmitting = false
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Save Changes
      </Button>
    </DialogFooter>
  );
};

export default DialogFooterButtons;
