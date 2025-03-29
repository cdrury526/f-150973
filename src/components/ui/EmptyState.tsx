
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText = "Add New",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed h-64">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mt-1 mb-4">{description}</p>
      {onAction && (
        <Button onClick={onAction}>
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
