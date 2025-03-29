import React, { useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DOWVariable } from '../../types';

interface VariableEditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  variable: DOWVariable | null;
  onSave: (variable: DOWVariable) => void;
}

const VariableEditPopup: React.FC<VariableEditPopupProps> = ({
  isOpen,
  onClose,
  variable,
  onSave
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState('');

  // Update the value when the variable changes
  useEffect(() => {
    if (variable) {
      setValue(variable.value);
    }
  }, [variable]);

  // Focus the input when the popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (variable) {
      onSave({
        ...variable,
        value
      });
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    // Close on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!variable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Variable: {variable.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] font-mono"
            placeholder="Enter value for this variable"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Press Ctrl+Enter to save or Escape to cancel
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariableEditPopup; 