
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ContractorCreateFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ContractorCreateFooter({ 
  onCancel, 
  isSubmitting 
}: ContractorCreateFooterProps) {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : 'Create Contractor'}
      </Button>
    </DialogFooter>
  );
}
