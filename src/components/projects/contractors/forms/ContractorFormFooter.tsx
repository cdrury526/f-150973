
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, ArchiveIcon } from 'lucide-react';

interface ContractorFormFooterProps {
  onCancel: () => void;
  onArchive: () => void;
  isSubmitting: boolean;
  isArchiving: boolean;
}

export function ContractorFormFooter({ 
  onCancel, 
  onArchive, 
  isSubmitting, 
  isArchiving 
}: ContractorFormFooterProps) {
  return (
    <DialogFooter className="flex justify-between items-center pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onArchive}
        disabled={isSubmitting || isArchiving}
        className="flex items-center gap-1"
      >
        {isArchiving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArchiveIcon className="h-4 w-4" />
        )}
        Archive Contractor
      </Button>
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isArchiving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isArchiving}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Changes'}
        </Button>
      </div>
    </DialogFooter>
  );
}
