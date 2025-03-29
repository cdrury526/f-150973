
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RemoveButtonProps {
  onClick: () => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="h-9 w-9"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Remove</span>
    </Button>
  );
};

export default RemoveButton;
